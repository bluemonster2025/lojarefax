"use client";

import { useAuth } from "@/context/AuthContext";
import Logo from "@/components/layouts/EcommerceLayout/ui/Logo";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Section } from "@/components/elements/Section";

interface Props {
  logo?: { sourceUrl: string; altText?: string };
}

export default function Header({ logo }: Props) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { label: "Home", path: "/admin/home" },
    { label: "Meus Produtos", path: "/admin/produtos" },
    { label: "Configurações", path: "/admin/configuracoes" },
    { label: "Usuários", path: "/admin/usuarios" },
  ];

  const handleLogout = () => {
    logout();
    router.replace("/admin/login");
  };

  return (
    <header className="w-full">
      <Section className="flex items-center max-h-[70px]">
        {user ? (
          <div className="flex justify-between w-full items-center">
            <Logo logo={logo} />
            <button
              onClick={handleLogout}
              className="cursor-pointer px-6 py-2 bg-white border border-grayscale-100 text-grayscale-450 rounded text-sm font-semibold hover:bg-black hover:text-white"
            >
              Sair
            </button>
          </div>
        ) : (
          <div className="flex justify-center w-full">
            <Logo logo={logo} />
          </div>
        )}
      </Section>

      {user && (
        <Section className="border-t border-grayscale-200">
          <nav>
            <ul className="flex gap-6 py-3 text-sm font-medium text-grayscale-500">
              {menuItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      className={`text-grayscale-450 hover:text-black transition-colors ${
                        isActive ? "font-semibold" : ""
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </Section>
      )}
    </header>
  );
}
