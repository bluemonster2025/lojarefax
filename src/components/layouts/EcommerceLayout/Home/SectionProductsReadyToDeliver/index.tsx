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

export default function SectionProductsReadyToDeliver({
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
          <div className="hidden lg:grid gap-6 grid-cols-3 items-stretch pb-16">
            {loading
              ? [...Array(skeletonCount)].map((_, i) => (
                  <div key={i} className="flex h-full">
                    <Skeleton className="w-full h-48 rounded-lg" />
                    <div className="p-4 flex-1 flex flex-col gap-2">
                      <Skeleton className="h-5 w-3/4 rounded" />
                      <Skeleton className="h-8 w-1/2 rounded" />
                      <Skeleton className="h-10 w-full rounded mt-auto" />
                    </div>
                  </div>
                ))
              : products.map((p) => (
                  <div
                    key={p.id}
                    className="flex h-full border border-default-border rounded-2xl p-5 gap-8"
                  >
                    <div className="flex flex-col items-start w-full max-w-[133px]">
                      {/* Imagem */}
                      <div className="relative aspect-[133/118] w-full rounded-lg overflow-hidden mb-2">
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

                      {/* 🏷 Categoria 1 — AGORA está abaixo da imagem */}
                      {p.productCategories?.[0] && (
                        <Title
                          as={"h5"}
                          variant="h5"
                          className="border border-default-border px-2"
                        >
                          {p.productCategories[0].name}
                        </Title>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col">
                      {/* Nome do produto */}
                      <Title as={"h3"} variant="h3">
                        {p.name}
                      </Title>

                      {/* 🏷 Categoria 2 — abaixo do nome */}
                      {p.productCategories?.[1] && (
                        <Title as={"h5"} variant="h5">
                          {p.productCategories[1].name}
                        </Title>
                      )}

                      {/* Tags */}
                      {p.productsTag && p.productsTag.length > 0 && (
                        <div className="flex gap-1 z-10 flex-wrap mt-2">
                          {p.productsTag.map((tag, index) => (
                            <Title
                              as={"h5"}
                              variant="h5"
                              key={index}
                              className="border border-default-border rounded-sm px-2"
                            >
                              {tag}
                            </Title>
                          ))}
                        </div>
                      )}

                      {/* Preço */}
                      <Text className="text-grayscale-400 mt-4 flex gap-1 items-center">
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
                                  <Text
                                    variant="body-upper"
                                    className="text-[40px] leading-[48px]"
                                  >
                                    {inteiro}
                                  </Text>
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
                  {p.productsTag && (
                    <div className="absolute top-0 right-0 flex gap-1 z-10">
                      <span className="bg-redscale-100 text-red-600 text-xs px-2 py-1 rounded-full font-bold w-10">
                        {p.productsTag}
                      </span>
                    </div>
                  )}
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
