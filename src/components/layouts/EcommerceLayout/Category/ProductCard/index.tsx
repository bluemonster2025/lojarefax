"use client";

import { ProductCardProps } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import BuyButton from "@/components/elements/BuyButton";
import { Title, Text } from "@/components/elements/Texts";
import { Skeleton } from "@/components/elements/Skeleton";
import { parsePrice } from "@/utils/parsePrice";

interface ProductCardWithLoadingProps extends ProductCardProps {
  loading?: boolean; // prop opcional para controlar carregamento
}

export default function ProductCard({
  produto,
  loading = false,
}: ProductCardWithLoadingProps) {
  if (loading) {
    // Skeleton de carregamento
    return (
      <div className="flex flex-col h-full">
        <Skeleton className="w-full h-48 rounded-lg" />
        <div className="p-4 flex-1 flex flex-col gap-2">
          <Skeleton className="h-5 w-3/4 rounded" />
          <Skeleton className="h-8 w-1/2 rounded" />
          <Skeleton className="h-10 w-full rounded mt-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-lg overflow-hidden">
      <Link href={`/produto/${produto.slug}`}>
        <div className="relative w-full aspect-[2/1] overflow-hidden">
          {/* Tags */}
          {produto.tag && (
            <div className="absolute top-0 right-0 flex gap-1 z-10">
              <span className="bg-redscale-100 text-white text-xs px-2 py-1 rounded-full font-bold w-10">
                {produto.tag}
              </span>
            </div>
          )}
          {/* Imagem */}
          {produto.image ? (
            <Image
              src={produto.image.sourceUrl}
              alt={produto.image.altText || ""}
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-contain"
              loading="lazy"
              fetchPriority="low"
            />
          ) : (
            <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 flex items-center justify-center rounded-lg">
              Sem imagem
            </div>
          )}
        </div>

        {/* Conteúdo */}
        <div className="p-4 flex flex-col flex-1">
          <Title as="h3" className="font-semibold text-sm text-grayscale-400">
            {produto.name}
          </Title>

          <Text className="text-grayscale-400 mt-2 flex gap-1 items-center">
            {produto.price !== undefined
              ? (() => {
                  const formatted = new Intl.NumberFormat("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(parsePrice(produto.price));

                  const [inteiro, centavos] = formatted.split(",");

                  return (
                    <>
                      <span className="text-xs font-medium">R$</span>
                      <span className="text-[32px] font-bold">{inteiro}</span>
                      <span className="text-xs font-medium">,{centavos}</span>
                    </>
                  );
                })()
              : "-"}
          </Text>
        </div>
      </Link>

      <div className="mt-auto flex gap-2 pt-3">
        <BuyButton produto={produto} title="Comprar" />
      </div>
    </div>
  );
}
