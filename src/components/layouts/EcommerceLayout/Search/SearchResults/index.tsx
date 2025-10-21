"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import { Skeleton } from "@/components/elements/Skeleton";
import BuyButton from "@/components/elements/BuyButton";
import { Title, Text } from "@/components/elements/Texts";
import { parsePrice } from "@/utils/parsePrice";

type SearchResultsProps = {
  products: Product[];
  loadingProducts: boolean;
  search: string;
};

export default function SearchResults({
  products,
  loadingProducts,
  search,
}: SearchResultsProps) {
  const skeletonCount = 4;

  // guarda o último termo de busca
  const lastSearch = useRef<string | null>(null);
  // flag de controle para permitir skeleton
  const allowSkeleton = useRef(true);

  // sempre que o termo de busca mudar, libera o skeleton de novo
  useEffect(() => {
    if (lastSearch.current !== search) {
      allowSkeleton.current = true;
      lastSearch.current = search;
    }
  }, [search]);

  const shouldShowSkeleton =
    loadingProducts && allowSkeleton.current && products.length === 0;

  if (shouldShowSkeleton) {
    // após mostrar uma vez, bloqueia até mudar o search de novo
    allowSkeleton.current = false;
  }

  // 🧠 Log de depuração — veja no console do navegador
  console.log("🔍 Produtos recebidos no SearchResults:", products);

  return (
    <div>
      <Title as="h3" className="text-[16px] font-semibold mb-8">
        Resultados da busca por &quot;{search}&quot;
      </Title>

      {shouldShowSkeleton ? (
        <div className="grid gap-12 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mb-8">
          {[...Array(skeletonCount)].map((_, i) => (
            <div key={i} className="flex flex-col h-full">
              <Skeleton className="w-full h-48 rounded-lg" />
              <div className="p-4 flex-1 flex flex-col gap-2">
                <Skeleton className="h-5 w-3/4 rounded" />
                <Skeleton className="h-8 w-1/2 rounded" />
                <Skeleton className="h-10 w-full rounded mt-auto" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-gray-500">Nenhum produto encontrado.</p>
      ) : (
        <div className="grid gap-12 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mb-8 items-stretch">
          {products.map((product) => {
            return (
              <div key={product.id} className="flex flex-col">
                <Link href={product.slug ? `/produto/${product.slug}` : "#"}>
                  <div className="relative w-full aspect-2/1 rounded-lg overflow-hidden">
                    {/* 🔹 Renderiza múltiplas tags ou apenas a principal */}
                    {/* Tags */}
                    {product.tags && (
                      <div className="absolute top-0 right-0 flex gap-1 z-10">
                        <span className="bg-redscale-100 text-white text-xs px-2 py-1 rounded-full font-bold w-10">
                          {product.tags}
                        </span>
                      </div>
                    )}

                    {product.image?.sourceUrl ? (
                      <Image
                        src={product.image.sourceUrl}
                        alt={product.image.altText || product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 600px"
                        className="object-contain"
                        loading="lazy"
                        fetchPriority="low"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        Sem imagem
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex-1 flex flex-col">
                    <Title
                      as="h2"
                      className="font-semibold text-sm text-grayscale-400"
                    >
                      {product.name}
                    </Title>

                    <Text className="text-grayscale-400 mt-2 flex gap-1 items-center">
                      {product.price !== undefined
                        ? (() => {
                            const formatted = new Intl.NumberFormat("pt-BR", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }).format(parsePrice(product.price));

                            const [inteiro, centavos] = formatted.split(",");

                            return (
                              <>
                                <span className="text-xs font-medium">R$</span>
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
                </Link>
                <div className="mt-auto flex gap-2 pt-3 text-center">
                  <BuyButton produto={product} title="Comprar" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
