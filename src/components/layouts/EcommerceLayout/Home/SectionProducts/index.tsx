"use client";

import Image from "next/image";
import Link from "next/link";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { Section } from "@/components/elements/Section";
import { Title, Text } from "@/components/elements/Texts";
import { Skeleton } from "@/components/elements/Skeleton";
import { UIProduct } from "@/types/uIProduct";
import { parsePrice } from "@/utils/parsePrice";

interface SectionProductsProps {
  title: string;
  products?: UIProduct[];
  loading?: boolean;
}

export default function SectionProducts({
  title,
  products = [],
  loading = false,
}: SectionProductsProps) {
  const skeletonCount = 4;

  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    slides: { perView: 1.5, spacing: 16 },
    mode: "snap",
    breakpoints: {
      "(min-width: 768px)": {
        slides: { perView: 2.5, spacing: 16 },
      },
    },
  });

  return (
    <>
      <Section>
        <div className="flex flex-col gap-10">
          <Title
            as="h2"
            className="text-lg md:text-[22px] font-semibold text-black mb-7 lg:mb-4"
          >
            {title}
          </Title>

          {/* Desktop → Grid */}
          <div className="hidden lg:grid gap-6 grid-cols-4 items-stretch pb-16">
            {loading
              ? [...Array(skeletonCount)].map((_, i) => (
                  <div key={i} className="flex flex-col h-full">
                    <Skeleton className="w-full h-48 rounded-lg" />
                    <div className="p-4 flex-1 flex flex-col gap-2">
                      <Skeleton className="h-5 w-3/4 rounded" />
                      <Skeleton className="h-8 w-1/2 rounded" />
                      <Skeleton className="h-10 w-full rounded mt-auto" />
                    </div>
                  </div>
                ))
              : products.map((p) => (
                  <div key={p.id} className="flex flex-col h-full">
                    <div className="relative w-full aspect-[2/1] rounded-lg overflow-hidden">
                      {/* Imagem */}
                      <Image
                        src={p.image.sourceUrl}
                        alt={p.image.altText}
                        fill
                        sizes="(max-width: 768px) 100vw, 600px"
                        className="object-contain"
                        loading="lazy"
                        fetchPriority="low"
                      />
                      <Link
                        href={p.uri || "#"}
                        className="absolute inset-0 z-0"
                        aria-label={`Ver detalhes do produto ${p.name}`}
                      />
                    </div>

                    <div className="p-4 flex-1 flex flex-col">
                      <Title
                        as="h2"
                        className="font-semibold text-sm text-grayscale-400"
                      >
                        {p.name}
                      </Title>

                      <Text className="text-grayscale-400 mt-2 flex gap-1 items-center">
                        {p.price !== undefined
                          ? (() => {
                              const formatted = new Intl.NumberFormat("pt-BR", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }).format(parsePrice(p.price));

                              const [inteiro, centavos] = formatted.split(",");

                              return (
                                <>
                                  <span className="text-xs font-medium">
                                    R$
                                  </span>
                                  <span className="text-[32px] font-bold">
                                    {inteiro}
                                  </span>
                                  <span className="text-xs font-medium">
                                    ,{centavos}
                                  </span>
                                </>
                              );
                            })()
                          : "-"}
                      </Text>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </Section>

      {/* Mobile & Tablet → Slider */}
      {!loading && (
        <div className="block lg:hidden pb-16">
          <div ref={sliderRef} className="keen-slider">
            {products.map((p) => (
              <div
                key={p.id}
                className="keen-slider__slide flex flex-col h-full pl-1"
              >
                <div className="relative w-full aspect-[2/1] rounded-lg overflow-hidden">
                  <Image
                    src={p.image.sourceUrl}
                    alt={p.image.altText}
                    fill
                    sizes="(max-width: 768px) 100vw, 600px"
                    className="object-contain"
                    loading="lazy"
                    fetchPriority="low"
                  />
                  <Link
                    href={p.uri || "#"}
                    className="absolute inset-0 z-0"
                    aria-label={`Ver detalhes do produto ${p.name}`}
                  />
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <Title
                    as="h2"
                    className="font-semibold text-sm text-grayscale-400"
                  >
                    {p.name}
                  </Title>

                  <Text className="text-grayscale-400 mt-2 flex items-baseline gap-1">
                    {p.price !== undefined ? (
                      <>
                        <span className="text-xs font-medium">R$</span>
                        <span className="text-[32px] font-bold">
                          {new Intl.NumberFormat("pt-BR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(parsePrice(p.price))}
                        </span>
                      </>
                    ) : (
                      "-"
                    )}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
