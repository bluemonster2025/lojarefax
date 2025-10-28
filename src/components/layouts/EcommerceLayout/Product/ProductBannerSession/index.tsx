"use client";

import { Section } from "@/components/elements/Section";
import { ImageNode } from "@/types/product";

interface ProductBannerProps {
  bannerProdutoMobile?: ImageNode;
  bannerProdutoDesktop?: ImageNode;
}

export default function ProductBannerSession({
  bannerProdutoMobile,
  bannerProdutoDesktop,
}: ProductBannerProps) {
  const hasDesktop = !!bannerProdutoDesktop?.sourceUrl;
  const hasMobile = !!bannerProdutoMobile?.sourceUrl;

  if (!hasDesktop && !hasMobile) {
    return <p>Nenhum banner cadastrado</p>;
  }

  return (
    <>
      {/* Desktop */}
      {hasDesktop && (
        <Section className="hidden md:block pb-12 md:pb-2">
          <div
            className="relative w-full md:aspect-[3.51/1] bg-cover bg-no-repeat bg-center md:rounded-3xl"
            style={{
              backgroundImage: `url(${bannerProdutoDesktop.sourceUrl})`,
            }}
            role="img"
            aria-label={
              bannerProdutoDesktop.altText || "Banner do produto desktop"
            }
          ></div>
        </Section>
      )}

      {/* Mobile */}
      {hasMobile && (
        <div className="pb-10 md:pb-8">
          <div
            className="block md:hidden relative w-full aspect-square bg-cover bg-no-repeat bg-center"
            style={{
              backgroundImage: `url(${bannerProdutoMobile.sourceUrl})`,
            }}
            role="img"
            aria-label={
              bannerProdutoMobile.altText || "Banner do produto mobile"
            }
          ></div>
        </div>
      )}
    </>
  );
}
