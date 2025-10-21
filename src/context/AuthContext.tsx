"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: (redirect?: boolean) => void;
  fetchUser: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  // 🔹 Busca usuário logado (só em páginas que não são de login)
  async function fetchUser() {
    try {
      const res = await fetch("/api/auth/me", {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Evita buscar usuário em /admin/login
    if (pathname === "/admin/login") {
      setLoading(false);
      return;
    }

    fetchUser();
  }, [pathname]);

  // 🔹 Logout centralizado
  function logout(redirect = true) {
    fetch("/api/auth/logout", { method: "POST" }).finally(() => {
      setUser(null);
      if (redirect) window.location.href = "/admin/login";
    });
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout, fetchUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
