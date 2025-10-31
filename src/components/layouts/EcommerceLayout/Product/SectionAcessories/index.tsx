"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

import { Section } from "@/components/elements/Section";
import { Title } from "@/components/elements/Texts";
import { Skeleton } from "@/components/elements/Skeleton";
import { AccessoryProductNode } from "@/types/product";

interface Props {
  /** Título do bloco — ex.: product.acessoriosMontagemTitle */
  title: string;
  /** Somente acessórios (já normalizados pelo mapper) */
  accessories?: AccessoryProductNode[];
  loading?: boolean;
  /** Máximo a exibir no carrossel */
  maxAccessoriesPreview?: number;
}

export default function SectionAcessories({
  title,
  accessories = [],
  loading = false,
  maxAccessoriesPreview = 12,
}: Props) {
  const skeletonCount = 6;
  const sliderContainerRef = useRef<HTMLDivElement>(null);

  const showDesktopButtons = accessories.length > 6;

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    slides: { perView: 2.2, spacing: 16 },
    mode: "snap",
    breakpoints: {
      "(min-width: 768px)": { slides: { perView: 4, spacing: 16 } },
      "(min-width: 1024px)": { slides: { perView: 6, spacing: 20 } },
    },
  });

  return (
    <Section className="pb-20">
      <div className="flex flex-col gap-8">
        {/* Título do bloco */}
        <div className="flex justify-between items-center">
          <Title as="h2" className="text-2xl">
            {title}
          </Title>

          {showDesktopButtons && (
            <div className="hidden lg:flex gap-2">
              <button
                onClick={() => instanceRef.current?.prev()}
                className="bg-default-text text-default-white w-8 h-8 rounded-full flex items-center justify-center"
                aria-label="Anterior"
              >
                ‹
              </button>
              <button
                onClick={() => instanceRef.current?.next()}
                className="bg-default-text text-default-white w-8 h-8 rounded-full flex items-center justify-center"
                aria-label="Próximo"
              >
                ›
              </button>
            </div>
          )}
        </div>

        <div ref={sliderContainerRef} className="relative">
          {loading ? (
            <div ref={sliderRef} className="keen-slider">
              {[...Array(skeletonCount)].map((_, i) => (
                <div
                  key={i}
                  className="keen-slider__slide border border-default-border rounded-2xl p-4"
                >
                  <div className="flex items-center justify-center mb-2">
                    <Skeleton className="h-5 w-32 rounded" />
                  </div>
                  <div className="relative mx-auto w-full max-w-[182px] aspect-[182/182] rounded-lg overflow-hidden">
                    <Skeleton className="w-full h-full rounded-lg" />
                  </div>
                  <div className="mt-3 flex flex-col items-center gap-2">
                    <Skeleton className="h-5 w-40 rounded" />
                    <Skeleton className="h-4 w-48 rounded" />
                    <Skeleton className="h-5 w-24 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div ref={sliderRef} className="keen-slider">
              {accessories
                .slice(0, Math.max(0, maxAccessoriesPreview))
                .map((a) => {
                  // Categoria principal: usa o campo normalizado; se não vier, procura onde parentId === null
                  const mainCategoryName =
                    a.mainCategoryName ??
                    a.productCategories?.nodes?.find((c) => !c.parentId)
                      ?.name ??
                    undefined;

                  return (
                    <div
                      key={a.id}
                      className="keen-slider__slide border border-default-border rounded-2xl p-4 flex flex-col"
                    >
                      {/* Categoria principal */}
                      {mainCategoryName && (
                        <span className="text-xs px-2 py-0.5 border border-default-border rounded w-fit mx-auto mb-2">
                          {mainCategoryName}
                        </span>
                      )}

                      {/* Imagem */}
                      <div className="relative mx-auto w-full max-w-[182px] aspect-[182/182] rounded-lg overflow-hidden">
                        {a.image?.sourceUrl ? (
                          <Image
                            src={a.image.sourceUrl}
                            alt={a.image.altText || a.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 600px"
                            className="object-contain"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-skeleton" />
                        )}
                        <Link
                          href={a.slug ? `/produto/${a.slug}` : "#"}
                          className="absolute inset-0"
                          aria-label={`Abrir acessório ${a.name}`}
                        />
                      </div>

                      {/* Nome + Subtítulo + Preço */}
                      <div className="mt-3 text-center px-2">
                        <Title as="h3" variant="h5" className="mb-1">
                          {a.name}
                        </Title>

                        {a.subtitulo && (
                          <p className="text-xs text-default-text/80 line-clamp-2">
                            {a.subtitulo}
                          </p>
                        )}

                        {a.price && (
                          <p className="mt-2 text-sm font-semibold">
                            {a.price}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
