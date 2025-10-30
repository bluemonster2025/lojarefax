"use client";

import { Title } from "@/components/elements/Texts";
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
  { name: "BRANCO", code: "RAL9003", hex: "#EDEDE4" },
  { name: "BRANCO ALPINO", code: "RAL7044", hex: "#ADAB9C" },
  { name: "BEGE DUNA", code: "RAL7034", hex: "#857D64" },
  { name: "CHAMPAGNE", code: "RAL1035", hex: "#847865" },
  { name: "MARROM BASE", code: "REF0017", hex: "#625536" },

  { name: "COBRE", code: "REF0093", hex: "#8B5B33" },
  { name: "BRONZE", code: "REF0097", hex: "#424038" },
  { name: "OURO VELHO", code: "REF0098", hex: "#585139" },
  { name: "AMARELO CANÁRIO", code: "REF1012", hex: "#D1A63F" },
  { name: "AMARELO OURO", code: "REF1032", hex: "#D49A3D" },

  { name: "LARANJA CALIFÓRNIA", code: "RAL2000", hex: "#C86334" },
  { name: "VERMELHO", code: "RAL3000", hex: "#962A28" },
  { name: "VERDE LIMÃO", code: "RAL6018", hex: "#568D46" },
  { name: "VERDE SELVA", code: "RAL6029", hex: "#005E37" },
  { name: "VERDE MUSGO", code: "RAL6005", hex: "#08291E" },

  { name: "AZUL TURQUESA", code: "RAL5018", hex: "#007E7B" },
  { name: "AZUL CELESTE", code: "RAL5012", hex: "#007B9F" },
  { name: "AZUL REAL", code: "RAL5002", hex: "#1B2F52" },
  { name: "AZUL COBALTO", code: "RAL5011", hex: "#091318" },
  { name: "BORDEALIX", code: "RAL3005", hex: "#2D1416" },

  { name: "TERRACOTA", code: "RAL8004", hex: "#763825" },
  { name: "MARROM CARAVELA", code: "RAL8019", hex: "#221C1A" },
  { name: "ALUMINIO", code: "RAL9006", hex: "#969792" },
  { name: "CINZA CLARO", code: "RAL7011", hex: "#42494A" },
  { name: "CINZA GRAFITE", code: "RAL7024", hex: "#323739" },

  { name: "PRETO FOSCO", code: "RAL9005", hex: "#0A0B09" },

  {
    name: "CORTEN",
    code: "REF0060",
    textureUrl: "/images/pictures/Rectangle-1866.webp",
  },
  {
    name: "CONCRETO",
    code: "REF0070",
    textureUrl: "/images/pictures/Rectangle-1867.webp",
  },
  {
    name: "LINHEIRO ESCURO",
    code: "REF0050",
    textureUrl: "/images/pictures/Rectangle-1868.webp",
  },
  {
    name: "LINHEIRO CLARO",
    code: "REF0051",
    textureUrl: "/images/pictures/Rectangle-1869.webp",
  },
  {
    name: "CARVALHO ESCURO",
    code: "REF0052",
    textureUrl: "/images/pictures/Rectangle-1870.webp",
  },
  {
    name: "CARVALHO CLARO",
    code: "REF0053",
    textureUrl: "/images/pictures/Rectangle-1871.webp",
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
            <div className="w-full border-b border-b-default-border">
              <Title as="h5" variant="h5">
                Somente por encomenda
              </Title>

              <Title as="h2" variant="h2" className="mb-6">
                Catálogo de Cores
              </Title>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-neutral-500 hover:text-neutral-800"
              aria-label="Fechar catálogo de cores"
            >
              <AiOutlineClose className="h-4 w-4" />
            </button>
          </div>

          {/* conteúdo */}
          <div className="p-6 md:p-8">
            {/* grid responsiva */}
            <div className="mb-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
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
                    <div className="h-[90px] w-full" style={previewStyle} />

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
            <div className="bg-default-background font-body-default p-4">
              Cores aproximadas da amostra original
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
