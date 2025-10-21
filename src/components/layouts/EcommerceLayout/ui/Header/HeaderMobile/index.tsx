"use client";

import { useState } from "react";
import Link from "next/link";
import Icon from "@/components/elements/Icon";
import HeaderCategories from "../HeaderCategories";
import Logo from "../../Logo";

interface Props {
  logo?: { sourceUrl: string; altText?: string };
}

export default function HeaderMobile({ logo }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full flex items-center justify-between p-4 lg:hidden">
      {/* Logo */}
      <Logo logo={logo} />

      {/* Botão de menu */}
      <button
        onClick={() => setIsOpen(true)}
        className="h-10 w-10 flex items-center justify-center"
        aria-label="Abrir menu"
      >
        <Icon name="IoMdMenu" size={24} color="#000" />
      </button>

      {/* Overlay Menu */}
      {isOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          {/* Header do menu */}
          <div className="flex items-center justify-between p-4">
            <Logo logo={logo} />

            <button
              onClick={() => setIsOpen(false)}
              className="h-10 w-10 flex items-center justify-center"
              aria-label="Fechar menu"
            >
              <Icon name="IoMdClose" size={24} color="#272934" />
            </button>
          </div>

          {/* Conteúdo scrollável */}
          <div className="flex-1 flex flex-col items-center justify-center gap-6 bg-grayscale-150">
            {/* passa o setIsOpen para as categorias */}
            <HeaderCategories onCategoryClick={() => setIsOpen(false)} />
          </div>

          {/* Rodapé com botão + redes sociais */}
          <div className="p-8 flex flex-col items-center gap-6">
            <div className="flex justify-center gap-6">
              <Link href="/" aria-label="Instagram">
                <Icon name="FaInstagram" size={18} />
              </Link>
              <Link href="/" aria-label="Linkedin">
                <Icon name="FaLinkedinIn" size={18} />
              </Link>
              <Link href="/" aria-label="Facebook">
                <Icon name="FaFacebookF" size={18} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
