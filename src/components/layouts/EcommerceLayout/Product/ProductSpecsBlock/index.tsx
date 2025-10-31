// components/product/ProductSpecsBlock.tsx
"use client";

import Image from "next/image";
import { Section } from "@/components/elements/Section";
import { Title, Text } from "@/components/elements/Texts";
import type { Product, TechnicalSpecs } from "@/types/product";

/* =========================================================
   Tipos de props
   ========================================================= */
type Props =
  | {
      product: Product;
      specs?: never;
      className?: string;
      title?: string;
      subtitle?: string;
    }
  | {
      product?: never;
      specs: {
        bannerEspecificacoes?: Product["bannerEspecificacoes"];
        especificacoesTecnicas?: TechnicalSpecs;
      };
      className?: string;
      title?: string;
      subtitle?: string;
    };

/* =========================================================
   Helpers
   ========================================================= */
function hasBanner(b?: Product["bannerEspecificacoes"]) {
  return Boolean(
    (b?.produto && b.produto.trim()) ||
      (b?.titulo && b.titulo.trim()) ||
      (b?.descricao && b.descricao.trim()) ||
      b?.imagem?.sourceUrl
  );
}

function hasSpecs(s?: TechnicalSpecs | null | undefined) {
  return Boolean(
    (s?.tituloPrincipal && s.tituloPrincipal.trim()) ||
      (s?.subtituloPrincipal && s.subtituloPrincipal.trim()) ||
      (s?.especificacoes && s.especificacoes.length > 0)
  );
}

/* =========================================================
   Componente
   ========================================================= */
export default function ProductSpecsBlock(props: Props) {
  const baseSection = "pb-12 md:pb-16";
  const sectionClass =
    baseSection + (props.className ? ` ${props.className}` : "");

  const banner =
    (props as { product?: Product }).product?.bannerEspecificacoes ??
    (
      props as {
        specs?: { bannerEspecificacoes?: Product["bannerEspecificacoes"] };
      }
    ).specs?.bannerEspecificacoes;

  const specs =
    (props as { product?: Product }).product?.especificacoesTecnicas ??
    (props as { specs?: { especificacoesTecnicas?: TechnicalSpecs } }).specs
      ?.especificacoesTecnicas;

  if (!hasBanner(banner) && !hasSpecs(specs)) {
    return null;
  }

  return (
    <Section className={sectionClass}>
      <div className="mx-auto max-w-[1296px] px-4 md:px-6">
        {/* Banner de Especificações */}
        {hasBanner(banner) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center mb-10 md:mb-14">
            {/* Texto */}
            <div className="flex flex-col gap-3 md:gap-4">
              {banner?.produto ? (
                <span className="inline-block w-max rounded-full border px-3 py-1 text-xs tracking-wide uppercase opacity-80">
                  {banner.produto}
                </span>
              ) : null}

              {banner?.titulo ? (
                <Title as="h2" variant="h2" className="uppercase">
                  {banner.titulo}
                </Title>
              ) : null}

              {banner?.descricao ? (
                <Text className="text-balance">{banner.descricao}</Text>
              ) : null}
            </div>

            {/* Imagem */}
            {banner?.imagem?.sourceUrl ? (
              <div className="relative w-full aspect-[4/3] md:aspect-[16/10] overflow-hidden rounded-3xl">
                <Image
                  src={banner.imagem.sourceUrl}
                  alt={
                    banner?.imagem?.altText ||
                    banner?.titulo ||
                    "Banner de especificações"
                  }
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority={false}
                />
              </div>
            ) : (
              <div className="rounded-3xl bg-neutral-100 dark:bg-neutral-800 aspect-[4/3] md:aspect-[16/10]" />
            )}
          </div>
        )}
      </div>
    </Section>
  );
}
