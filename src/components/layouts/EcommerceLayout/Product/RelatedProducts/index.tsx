"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

import { Section } from "@/components/elements/Section";
import { Title } from "@/components/elements/Texts";
import { Skeleton } from "@/components/elements/Skeleton";
import { RelatedProductNode } from "@/types/product";

/** Lê até 2 categorias (principal e secundária) do RelatedProductNode */
function getCategories(item: RelatedProductNode): string[] {
  const nodes = item?.productCategories?.nodes ?? [];
  return nodes
    .map((n) => n?.name)
    .filter(Boolean)
    .slice(0, 2) as string[];
}

type RelatedProductsProps = {
  products: RelatedProductNode[];
  pBottom?: string;
  titulo?: string | null;
  subtitulo?: string | null;
};

export default function RelatedProducts({
  products = [],
  pBottom,
  titulo,
  subtitulo,
}: RelatedProductsProps) {
  const skeletonCount = 5;
  const sliderContainerRef = useRef<HTMLDivElement>(null);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    slides: { perView: 1.5, spacing: 16 },
    mode: "snap",
    breakpoints: {
      "(min-width: 768px)": { slides: { perView: 2.5, spacing: 16 } },
      "(min-width: 1024px)": { slides: { perView: 5, spacing: 24 } },
    },
  });

  // Evita hydration mismatch: calculamos "é desktop?" após montar
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mql.matches);
    update();
    mql.addEventListener?.("change", update);
    return () => mql.removeEventListener?.("change", update);
  }, []);

  // Recalcula slider quando a lista muda
  useEffect(() => {
    instanceRef.current?.update();
  }, [products, instanceRef]);

  const hasHeader = Boolean((titulo ?? "").trim() || (subtitulo ?? "").trim());
  const canShowDesktopButtons = isDesktop && products.length > 5;

  const content = useMemo(() => {
    if (products.length === 0) {
      return (
        <div ref={sliderRef} className="keen-slider">
          {[...Array(skeletonCount)].map((_, i) => (
            <div
              key={i}
              className="keen-slider__slide flex flex-col gap-4 border border-default-border rounded-2xl py-6"
            >
              <Skeleton className="h-6 w-24 mx-auto rounded" />
              <Skeleton className="w-full max-w-[182px] mx-auto aspect-[182/182] rounded-lg" />
              <div className="flex-1 flex flex-col gap-2 px-6">
                <Skeleton className="h-5 w-40 mx-auto rounded" />
                <Skeleton className="h-6 w-56 mx-auto rounded" />
              </div>
              <Skeleton className="h-5 w-24 mx-auto rounded" />
            </div>
          ))}
        </div>
      );
    }

    return (
      <div ref={sliderRef} className="keen-slider">
        {products.map((item) => {
          const productImage =
            item.image?.sourceUrl || "/images/placeholder.png";
          const [cat0, cat1] = getCategories(item);

          return (
            <div
              key={item.id}
              className="keen-slider__slide flex flex-col gap-4 border bg-default-white border-default-border rounded-2xl py-6"
            >
              {cat0 && (
                <Title
                  as="h5"
                  variant="h5"
                  className="border border-default-border px-2 w-fit mx-auto"
                >
                  {cat0}
                </Title>
              )}

              <div className="relative mx-auto w-full max-w-[182px] aspect-[182/182] rounded-lg overflow-hidden">
                <Image
                  src={productImage}
                  alt={item.image?.altText || item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="object-contain"
                  loading="lazy"
                  fetchPriority="low"
                />
                <Link
                  href={`/produto/${item.slug}`}
                  className="absolute inset-0 z-0"
                  aria-label={`Ver detalhes do produto ${item.name}`}
                />
              </div>

              <div className="flex-1 flex flex-col">
                {cat1 && (
                  <Title as="h5" variant="h5" className="mx-auto">
                    {cat1}
                  </Title>
                )}
                <Title as="h2" variant="h3" className="mx-auto text-center">
                  {item.name}
                </Title>
              </div>

              <Link
                href={`/produto/${item.slug}`}
                className="uppercase underline mx-auto"
              >
                <Title as="h5" variant="h5" className="text-sm">
                  Saiba mais
                </Title>
              </Link>
            </div>
          );
        })}
      </div>
    );
  }, [products, sliderRef]);

  return (
    <Section className={`${pBottom || ""} pb-20`}>
      <div className="flex flex-col gap-8">
        {/* Header (titulo/subtitulo) */}
        {hasHeader && (
          <div className="flex justify-between items-start gap-4">
            <div>
              {(titulo ?? "").trim() && (
                <Title as="h2" className="text-2xl">
                  {(titulo ?? "").trim()}
                </Title>
              )}
              {(subtitulo ?? "").trim() && (
                <Title as="h5" variant="h5">
                  {(subtitulo ?? "").trim()}
                </Title>
              )}
            </div>

            {/* Botões de navegação (desktop + mais de 5 produtos) */}
            {canShowDesktopButtons && (
              <div className="hidden lg:flex gap-2">
                <button
                  onClick={() => instanceRef.current?.prev()}
                  className={`bg-default-text text-default-white w-8 h-8 rounded-full cursor-pointer flex items-center justify-center ${
                    canShowDesktopButtons
                      ? ""
                      : "opacity-40 pointer-events-none"
                  }`}
                  aria-label="Anterior"
                  aria-disabled={!canShowDesktopButtons}
                >
                  ‹
                </button>
                <button
                  onClick={() => instanceRef.current?.next()}
                  className={`bg-default-text text-default-white w-8 h-8 rounded-full cursor-pointer flex items-center justify-center ${
                    canShowDesktopButtons
                      ? ""
                      : "opacity-40 pointer-events-none"
                  }`}
                  aria-label="Próximo"
                  aria-disabled={!canShowDesktopButtons}
                >
                  ›
                </button>
              </div>
            )}
          </div>
        )}

        {/* Slider */}
        <div ref={sliderContainerRef} className="relative">
          {content}
        </div>
      </div>
    </Section>
  );
}
