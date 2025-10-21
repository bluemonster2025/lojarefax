"use server";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const WP_URL = process.env.WOO_SITE_URL!;

const REFRESH_MUTATION = `
mutation RefreshAuthToken($refreshToken: String!) {
  refreshJwtAuthToken(input: { jwtRefreshToken: $refreshToken }) {
    authToken
  }
}
`;

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: "Sem refresh token" }, { status: 401 });
  }

  try {
    const res = await fetch(`${WP_URL}/graphql`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: REFRESH_MUTATION,
        variables: { refreshToken },
      }),
    });

    const data = await res.json();
    const newToken = data?.data?.refreshJwtAuthToken?.authToken;

    if (!newToken) {
      const resp = NextResponse.json(
        { error: "Refresh falhou" },
        { status: 401 }
      );
      resp.cookies.set("token", "", { expires: new Date(0), path: "/" });
      resp.cookies.set("refreshToken", "", { expires: new Date(0), path: "/" });
      return resp;
    }

    const resp = NextResponse.json({ success: true });

    // 🔐 Novo token curto (5 min)
    resp.cookies.set("token", newToken, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 5 * 60 * 1000),
    });

    return resp;
  } catch {
    return NextResponse.json(
      { error: "Erro ao atualizar token" },
      { status: 500 }
    );
  }
}
