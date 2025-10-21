"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import BuyButton from "@/components/elements/BuyButton";
import { Title, Text } from "@/components/elements/Texts";
import { Skeleton } from "@/components/elements/Skeleton";
import { Section } from "@/components/elements/Section";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { RelatedProductNode } from "@/types/product";
import { parsePrice } from "@/utils/parsePrice";

type RelatedProductsProps = {
  products: RelatedProductNode[];
  title: string;
  pBottom?: string;
};

export default function RelatedProducts({
  products,
  title,
  pBottom,
}: RelatedProductsProps) {
  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    slides: { perView: 1.5, spacing: 16 },
    mode: "snap",
    breakpoints: {
      "(min-width: 768px)": { slides: { perView: 2.5, spacing: 16 } },
    },
  });

  useEffect(() => {
    slider.current?.update();
  }, [products, slider]);

  const skeletonCount = 4;

  return (
    <div className={`${pBottom}`}>
      <Section>
        <Title
          as="h3"
          className="text-lg md:text-[22px] font-semibold mb-10 lg:mb-4"
        >
          {title}
        </Title>

        {/* Desktop → Grid */}
        <div className="hidden lg:grid grid-cols-4 gap-6 items-stretch">
          {products.length === 0
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
            : products.map((item) => {
                const productImage =
                  item.image?.sourceUrl || "/images/placeholder.png";

                return (
                  <div key={item.id} className="flex flex-col h-full">
                    <div className="relative w-full aspect-[2/1] rounded-lg overflow-hidden">
                      {item.tags && item.tags.length > 0 && (
                        <div className="absolute top-0 right-0 flex gap-1 z-10">
                          <span
                            key={item.id}
                            className="bg-redscale-100 text-white text-xs px-2 py-1 rounded-full font-bold w-10"
                          >
                            {item.tags}
                          </span>
                        </div>
                      )}

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

                    <div className="p-4 flex-1 flex flex-col">
                      <Title
                        as="h2"
                        className="font-semibold text-sm text-grayscale-400 line-clamp-2"
                      >
                        {item.name}
                      </Title>

                      <Text className="text-grayscale-400 mt-2 flex gap-1 items-center">
                        {item.price !== undefined
                          ? (() => {
                              const formatted = new Intl.NumberFormat("pt-BR", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }).format(parsePrice(item.price)); // ex: "1234,50"

                              const [inteiro, centavos] = formatted.split(","); // separa "1234" e "50"

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

                    <div className="mt-auto flex gap-2 pt-3 text-center">
                      <BuyButton produto={item} title="Comprar" />
                    </div>
                  </div>
                );
              })}
        </div>
      </Section>

      {/* Mobile & Tablet → Slider */}
      {products.length > 0 && (
        <div className="block lg:hidden pb-16 items-stretch">
          <div ref={sliderRef} className="keen-slider">
            {products.map((item) => {
              const productImage =
                item.image?.sourceUrl || "/images/placeholder.png";

              return (
                <div
                  key={item.id}
                  className="keen-slider__slide flex flex-col h-full pl-1"
                >
                  <div className="relative w-full aspect-[2/1] rounded-lg overflow-hidden">
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

                  <div className="p-4 flex-1 flex flex-col">
                    <Title
                      as="h2"
                      className="font-semibold text-sm text-grayscale-400 line-clamp-2"
                    >
                      {item.name}
                    </Title>

                    <Text className="text-grayscale-400 mt-2 flex items-baseline gap-1">
                      {item.price !== undefined ? (
                        <>
                          <span className="text-xs font-medium">R$</span>
                          <span className="text-[32px] font-bold">
                            {new Intl.NumberFormat("pt-BR", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }).format(parsePrice(item.price))}
                          </span>
                        </>
                      ) : (
                        "-"
                      )}
                    </Text>
                  </div>

                  <div className="mt-auto flex gap-2 pt-3 text-center">
                    <BuyButton produto={item} title="Comprar" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
