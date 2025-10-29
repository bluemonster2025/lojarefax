"use client";

import { useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";

type ColorItem = {
  name: string;
  code: string;
  hex?: string;
  textureUrl?: string;
  hasStripe?: boolean;
  stripeHex?: string;
};

interface ColorCatalogModalProps {
  open: boolean;
  onClose: () => void;
}

// Seus dados (exemplo)
const COLORS: ColorItem[] = [
  { name: "BRANCO", code: "RAL 9003", hex: "#eeeee6" },
  { name: "BRANCO ALPINO", code: "RAL 7044", hex: "#bdbdae" },
  { name: "BEGE DUNA", code: "RAL 7034", hex: "#847d5c" },
  { name: "CHAMPAGNE", code: "RAL 1035", hex: "#7a705d" },
  { name: "MARROM BASE", code: "REF 0017", hex: "#6a5c31" },

  { name: "COBRE", code: "REF 0093", hex: "#8c552d" },
  { name: "BRONZE", code: "REF 0097", hex: "#3c3a33" },
  { name: "OURO VELHO", code: "REF 0098", hex: "#4b472e" },
  { name: "AMARELO CANÁRIO", code: "REF 1012", hex: "#d4b43a" },
  { name: "AMARELO OURO", code: "REF 1032", hex: "#d7a138" },

  {
    name: "LARANJA CALIFÓRNIA",
    code: "RAL 2000",
    hex: "#cc5a2d",
    hasStripe: true,
    stripeHex: "#008c8c",
  },
  {
    name: "VERMELHO",
    code: "RAL 3000",
    hex: "#8c2a28",
    hasStripe: true,
    stripeHex: "#008c8c",
  },
  {
    name: "VERDE LIMÃO",
    code: "RAL 6018",
    hex: "#558e42",
    hasStripe: true,
    stripeHex: "#1b2943",
  },
  {
    name: "VERDE SELVA",
    code: "RAL 6029",
    hex: "#005c32",
    hasStripe: true,
    stripeHex: "#000000",
  },
  {
    name: "VERDE MUSGO",
    code: "RAL 6005",
    hex: "#00221a",
    hasStripe: true,
    stripeHex: "#3a0000",
  },

  {
    name: "PRETO FOSCO",
    code: "RAL9005",
    textureUrl:
      "https://cms.lojarefax.com.br/wp-content/uploads/.../preto-fosco.jpg",
  },
  {
    name: "CORTEN",
    code: "REF0060",
    textureUrl:
      "https://cms.lojarefax.com.br/wp-content/uploads/.../corten.jpg",
  },
  {
    name: "CONCRETO",
    code: "REF0070",
    textureUrl:
      "https://cms.lojarefax.com.br/wp-content/uploads/.../concreto.jpg",
  },
  {
    name: "LINHEIRO ESCURO",
    code: "REF0050",
    textureUrl:
      "https://cms.lojarefax.com.br/wp-content/uploads/.../linheiro-escuro.jpg",
  },
  {
    name: "LINHEIRO CLARO",
    code: "REF0051",
    textureUrl:
      "https://cms.lojarefax.com.br/wp-content/uploads/.../linheiro-claro.jpg",
  },
  {
    name: "CARVALHO ESCURO",
    code: "REF0052",
    textureUrl:
      "https://cms.lojarefax.com.br/wp-content/uploads/.../carvalho-escuro.jpg",
  },
  {
    name: "CARVALHO CLARO",
    code: "REF0053",
    textureUrl:
      "https://cms.lojarefax.com.br/wp-content/uploads/.../carvalho-claro.jpg",
  },
];

export default function ColorCatalogModal({
  open,
  onClose,
}: ColorCatalogModalProps) {
  // Hook sempre roda
  useEffect(() => {
    if (!open) return;

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose]);

  // Render condicional só depois dos hooks
  if (!open) return null;

  return (
    <>
      {/* camada escura no fundo */}
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[1px]" />

      {/* wrapper que fecha ao clicar fora */}
      <div
        className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 py-8 md:py-12"
        onClick={onClose}
      >
        {/* cartão do modal */}
        <div
          className="relative w-full max-w-[1080px] rounded-2xl bg-white shadow-xl"
          onClick={(e) => e.stopPropagation()} // não fecha se clicar dentro
        >
          {/* header */}
          <div className="flex items-start justify-between p-6 md:p-8">
            <div>
              <p className="text-[11px] font-normal uppercase tracking-[0.08em] text-neutral-600">
                Somente por encomenda
              </p>

              <h2 className="mt-1 text-xl font-semibold uppercase text-neutral-900">
                Catálogo de Cores
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-neutral-500 hover:text-neutral-800"
              aria-label="Fechar catálogo de cores"
            >
              <AiOutlineClose className="h-4 w-4" />
            </button>
          </div>

          {/* linha fina */}
          <div className="h-px w-full bg-neutral-200" />

          {/* conteúdo */}
          <div className="p-6 md:p-8">
            {/* grid responsiva */}
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {COLORS.map((item, idx) => {
                const previewStyle: React.CSSProperties = item.textureUrl
                  ? {
                      backgroundImage: `url(${item.textureUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }
                  : {
                      backgroundColor: item.hex || "#ccc",
                    };

                return (
                  <div key={idx} className="flex flex-col">
                    {/* bloco de cor / textura */}
                    <div
                      className="h-[90px] w-full border border-neutral-300"
                      style={previewStyle}
                    />

                    {/* legenda */}
                    <p className="mt-2 text-[11px] font-medium uppercase leading-snug tracking-[0.04em] text-neutral-800">
                      {item.name}{" "}
                      <span className="font-normal text-neutral-700">
                        {item.code ? " " + item.code : ""}
                      </span>
                    </p>

                    {/* faixinha opcional */}
                    {item.hasStripe && (
                      <div
                        className="mt-3 h-[3px] w-full"
                        style={{ backgroundColor: item.stripeHex }}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* aviso */}
            <div className="mt-10 rounded-md border border-neutral-200 bg-neutral-50 p-4 text-[12px] text-neutral-700">
              Cores aproximadas da amostra original
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
