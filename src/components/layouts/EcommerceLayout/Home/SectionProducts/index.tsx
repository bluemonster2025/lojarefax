"use client";

import Image from "next/image";
import Link from "next/link";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { Section } from "@/components/elements/Section";
import { Title } from "@/components/elements/Texts";
import { Skeleton } from "@/components/elements/Skeleton";
import { UIProduct } from "@/types/uIProduct";

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
      <Section className="pb-20">
        <div className="flex flex-col gap-12">
          <Title as="h2" className="text-2xl">
            {title}
          </Title>

          {/* Desktop → Grid */}
          <div className="hidden lg:grid gap-6 grid-cols-5 items-stretch">
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
                  <div
                    key={p.id}
                    className="flex flex-col h-full gap-4 border border-default-border rounded-2xl py-6"
                  >
                    {/* 🏷 Categoria 1 */}
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

                    <div className="flex-1 flex flex-col">
                      {/* 🏷 Categoria 2 */}
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
                      <Title as={"h5"} variant="h5" className="text-sm">
                        Saiba mais
                      </Title>
                    </Link>
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
                <div className="relative w-full aspect-square rounded-lg overflow-hidden">
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
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
