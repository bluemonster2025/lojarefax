import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = [
  "/admin/home",
  "/admin/produtos",
  "/admin/configuracoes",
  "/admin/usuarios",
];

// ----------------------
// 🔍 Decodifica JWT
// ----------------------
function parseJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = Buffer.from(base64, "base64").toString("utf8");
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

// ----------------------
// 🧹 Limpa cookies
// ----------------------
function clearAuthCookies(res: NextResponse) {
  const opts = {
    httpOnly: true,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };

  res.cookies.set("token", "", { ...opts, expires: new Date(0) });
  res.cookies.set("refreshToken", "", { ...opts, expires: new Date(0) });
}

// ----------------------
// 🚧 Middleware principal
// ----------------------
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const now = Math.floor(Date.now() / 1000);

  const isAdminRoute =
    protectedPaths.some((path) => pathname.startsWith(path)) ||
    (pathname.startsWith("/admin") && pathname !== "/admin/login");

  const isAdminApi = pathname.startsWith("/api/admin");

  // 🔒 Protege rotas admin (páginas) e APIs internas
  if (isAdminRoute || isAdminApi) {
    if (!token) {
      if (isAdminApi) {
        // 🚫 Se for API → retorna 401
        return NextResponse.json(
          { error: "Unauthorized: missing token" },
          { status: 401 }
        );
      } else {
        // 🚪 Se for página → redireciona pro login
        const res = NextResponse.redirect(new URL("/admin/login", req.url));
        clearAuthCookies(res);
        return res;
      }
    }

    const decoded = parseJwt(token);
    const isExpired = decoded?.exp && decoded.exp < now;

    if (!decoded || isExpired) {
      // Token expirado → tenta refresh
      if (refreshToken) {
        try {
          const refreshRes = await fetch(
            `${req.nextUrl.origin}/api/auth/refresh`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Cookie: `refreshToken=${refreshToken}`,
              },
            }
          );

          if (refreshRes.ok) {
            // ✅ Refresh bem-sucedido
            return NextResponse.next();
          }
        } catch (err) {
          console.error("Erro ao tentar refresh via middleware:", err);
        }
      }

      // ❌ Falhou → limpa e bloqueia
      if (isAdminApi) {
        return NextResponse.json(
          { error: "Unauthorized: token expired" },
          { status: 401 }
        );
      } else {
        const res = NextResponse.redirect(new URL("/admin/login", req.url));
        clearAuthCookies(res);
        return res;
      }
    }
  }

  // 🚫 Impede usuários logados de acessar /admin/login
  if (pathname === "/admin/login" && token) {
    const decoded = parseJwt(token);
    if (decoded && (!decoded.exp || decoded.exp > now)) {
      return NextResponse.redirect(new URL("/admin/home", req.url));
    }
  }

  // 🔐 Basic Auth para páginas públicas (fora de /admin e /api)
  const authHeader = req.headers.get("authorization");
  const username = process.env.BASIC_AUTH_USER || "admin";
  const password = process.env.BASIC_AUTH_PASSWORD || "123456";

  if (!pathname.startsWith("/admin") && !pathname.startsWith("/api")) {
    if (authHeader) {
      const [scheme, encoded] = authHeader.split(" ");
      if (scheme === "Basic" && encoded) {
        const decodedAuth = Buffer.from(encoded, "base64").toString("utf8");
        const [user, pass] = decodedAuth.split(":");
        if (user === username && pass === password) {
          return NextResponse.next();
        }
      }
    }

    return new NextResponse("Authentication required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Secure Area", charset="UTF-8"',
      },
    });
  }

  // ✅ Libera o restante
  return NextResponse.next();
}

// ----------------------
// ⚙️ Matcher global
// ----------------------
export const config = {
  // Intercepta tudo (páginas e APIs), exceto assets estáticos e favicon
  matcher: ["/((?!_next|favicon.ico|.*\\..*).*)"],
};
