import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });

  // 🔒 Remove cookies httpOnly
  response.cookies.set("token", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0), // expira imediatamente
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  response.cookies.set("refreshToken", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0), // expira imediatamente
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return response;
}
