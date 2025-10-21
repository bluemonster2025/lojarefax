"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function AuthInterceptor() {
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // ⚡ Ignora páginas de login
    if (pathname.startsWith("/admin/login")) return;

    // 🔁 Atualiza token a cada 10 minutos (antes de expirar em 15min)
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/auth/refresh", { method: "POST" });

        if (res.status === 401) {
          console.warn("🔒 Refresh token expirou — limpando user...");
          await logout(); // sem argumentos
          router.push("/admin/login");
        }
      } catch (err) {
        console.error("Erro ao tentar atualizar token:", err);
      }
    }, 3 * 60 * 1000);

    // 🔹 Intercepta fetch global para qualquer 401
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const res = await originalFetch(...args);

      if (res.status === 401) {
        console.warn(
          "🔒 Sessão expirada durante requisição — limpando user..."
        );

        try {
          // chama logout no servidor
          await fetch("/api/auth/logout", { method: "POST" });
        } catch (e) {
          console.error("Erro ao deslogar:", e);
        }

        // atualiza estado do user
        await logout(); // sem argumentos

        // redireciona para login
        router.push("/admin/login");
      }

      return res;
    };

    return () => {
      clearInterval(interval);
      window.fetch = originalFetch; // restaura fetch original
    };
  }, [logout, router, pathname]);

  return null;
}
