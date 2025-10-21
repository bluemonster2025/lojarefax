"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin/home", label: "Home" },
  { href: "/admin/produtos", label: "Meus Produtos" },
  { href: "/admin/configuracoes", label: "Configurações" },
  { href: "/admin/usuarios", label: "Usuários" },
];

export default function AdminMenu() {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-100 border-b border-gray-200 px-6">
      <ul className="flex gap-6 py-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`pb-1 border-b-2 transition ${
                pathname === link.href
                  ? "border-indigo-600 text-indigo-600 font-semibold"
                  : "border-transparent text-gray-600 hover:text-indigo-600"
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
