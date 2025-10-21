"use client";

import { Section } from "@/components/elements/Section";
import { Text } from "@/components/elements/Texts";
import Link from "next/link";

export default function Footer() {
  return (
    <>
      {/* Bloco de suporte */}
      <Section className="bg-white py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="1.03448"
                  y="1.03448"
                  width="45.931"
                  height="45.931"
                  rx="22.9655"
                  stroke="#687AF6"
                  strokeWidth="2.06897"
                />
                <path
                  d="M23.3828 19.3297C23.3828 19.3297 31.892 17.9668 33.6063 25.3921C35.3206 32.8175 27.0751 35.3228 27.0751 35.3228L23.3828 19.3297Z"
                  fill="#687AF6"
                />
                <path
                  d="M20.6133 12.7496C20.6133 12.7496 12.7379 15.4273 15.1869 26.0349C17.6359 36.6426 25.888 35.5969 25.888 35.5969L20.6133 12.7496Z"
                  fill="#687AF6"
                />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-base text-grayscale-500">
                Está com algum problema?
              </p>
              <Text className="text-grayscale-500">
                Você pode solicitar suporte agora mesmo. Clique no botão ao
                lado.
              </Text>
            </div>
          </div>
          <button className="bg-bluescale-100 text-white font-semibold px-6 py-4 cursor-pointer">
            <Text>Solicitar Suporte</Text>
          </button>
        </div>
      </Section>

      <div className="bg-bluescale-100 text-center py-6">
        <Text className="text-white">
          ©2025 Todos os direitos reservados{" "}
          <Link
            href="https://bluemonster.com.br"
            className="text-sm cursor-pointer"
          >
            bluemonster.com.br
          </Link>
        </Text>
      </div>
    </>
  );
}
