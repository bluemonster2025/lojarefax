"use server";

import { NextResponse } from "next/server";
import { getGraphQLClient } from "@/lib/graphql";

const LOGIN_MUTATION = `
mutation Login($username: String!, $password: String!) {
  login(input: { username: $username, password: $password }) {
    authToken
    refreshToken
    user {
      id
      name
      email
    }
  }
}
`;

interface LoginResponse {
  login: {
    authToken: string;
    refreshToken: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
}

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (!username || !password)
    return NextResponse.json(
      { error: "Usuário e senha são obrigatórios" },
      { status: 400 }
    );

  try {
    const client = getGraphQLClient();
    const { login } = await client.request<LoginResponse>(LOGIN_MUTATION, {
      username,
      password,
    });

    const res = NextResponse.json({ success: true, user: login.user });

    // 🔐 Token curto — expira em 5 minutos
    res.cookies.set("token", login.authToken, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 5 * 60 * 1000),
    });

    // 🔄 Refresh token — expira em 7 dias
    res.cookies.set("refreshToken", login.refreshToken, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Usuário ou senha inválidos" },
      { status: 401 }
    );
  }
}
