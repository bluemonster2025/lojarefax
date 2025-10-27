"use client";

import Image from "next/image";
import Link from "next/link";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { Section } from "@/components/elements/Section";
import { Title } from "@/components/elements/Texts";
import { Skeleton } from "@/components/elements/Skeleton";
import { UIProduct } from "@/types/uIProduct";
import { useRef } from "react";

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
  const skeletonCount = 5;
  const sliderContainerRef = useRef<HTMLDivElement>(null);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    slides: { perView: 1.5, spacing: 16 },
    mode: "snap",
    breakpoints: {
      "(min-width: 768px)": {
        slides: { perView: 2.5, spacing: 16 },
      },
      "(min-width: 1024px)": {
        slides: { perView: 5, spacing: 24 },
      },
    },
  });

  const showDesktopButtons =
    typeof window !== "undefined" &&
    window.innerWidth >= 1024 &&
    products.length > 5;

  return (
    <Section className="pb-20">
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <Title as="h2" className="text-2xl">
            {title}
          </Title>

          {/* Botões de navegação → apenas desktop e quando há mais de 5 produtos */}
          {showDesktopButtons && (
            <div className="hidden lg:flex gap-2">
              <button
                onClick={() => instanceRef.current?.prev()}
                className="bg-default-text text-default-white w-8 h-8 rounded-full cursor-pointer flex items-center justify-center"
                aria-label="Anterior"
              >
                ‹
              </button>
              <button
                onClick={() => instanceRef.current?.next()}
                className="bg-default-text text-default-white w-8 h-8 rounded-full cursor-pointer flex items-center justify-center"
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
                  className="keen-slider__slide flex flex-col h-full"
                >
                  <Skeleton className="w-full h-48 rounded-lg" />
                  <div className="p-4 flex-1 flex flex-col gap-2">
                    <Skeleton className="h-5 w-3/4 rounded" />
                    <Skeleton className="h-8 w-1/2 rounded" />
                    <Skeleton className="h-10 w-full rounded mt-auto" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div ref={sliderRef} className="keen-slider">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="keen-slider__slide flex flex-col gap-4 border border-default-border rounded-2xl py-6"
                >
                  {/* Categoria principal */}
                  {p.productCategories?.[0] && (
                    <Title
                      as="h5"
                      variant="h5"
                      className="border border-default-border px-2 w-fit mx-auto"
                    >
                      {p.productCategories[0].name}
                    </Title>
                  )}

                  <div className="relative mx-auto w-full max-w-[182px] aspect-[182/182] rounded-lg overflow-hidden">
                    <Image
                      src={p.image.sourceUrl}
                      alt={p.image.altText}
                      fill
                      sizes="(max-width: 768px) 100vw, 600px"
                      className="object-contain"
                      loading="lazy"
                    />
                    <Link
                      href={p.uri || "#"}
                      className="absolute inset-0 z-0"
                      aria-label={`Ver detalhes do produto ${p.name}`}
                    />
                  </div>

                  <div className="flex-1 flex flex-col">
                    {p.productCategories?.[1] && (
                      <Title as="h5" variant="h5" className="mx-auto">
                        {p.productCategories[1].name}
                      </Title>
                    )}
                    <Title as="h2" variant="h3" className="mx-auto">
                      {p.name}
                    </Title>
                  </div>

                  <Link
                    href={p.uri || "#"}
                    className="uppercase underline mx-auto"
                  >
                    <Title as="h5" variant="h5" className="text-sm">
                      Saiba mais
                    </Title>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
