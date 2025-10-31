"use client";

import { useMemo } from "react";
import Image from "next/image";
import { Section } from "@/components/elements/Section";
import { Skeleton } from "@/components/elements/Skeleton";
import { Title, Text } from "@/components/elements/Texts";
import { parsePrice } from "@/utils/parsePrice";
import { ButtonPrimary } from "@/components/elements/Button";
import type { Product } from "@/types/product";

type CategoryNode = {
  id: string;
  name: string;
  slug?: string;
};

type ProductsEditAllProps = {
  products: Product[];
  loading: boolean;
  search: string;
  categoryId?: string;
  status?: string;
};

export default function ProductsEditAll({
  products,
  loading,
  search,
  categoryId,
  status = "publish",
}: ProductsEditAllProps) {
  const skeletonCount = 4;

  // 🧠 Função segura de decodificação Base64 → texto
  const decodeBase64Safe = (str: string) => {
    try {
      return atob(str);
    } catch {
      return str;
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 🔍 Filtro por busca
      const matchesSearch =
        !search ||
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.tag?.toLowerCase().includes(search.toLowerCase());

      // 🏷️ Categoria — compatível com GraphQL padrão e com allProducts
      const decodedCategoryId = categoryId
        ? decodeBase64Safe(categoryId)
        : null;

      let productCats: CategoryNode[] = [];

      // ✅ Detecta formato: { nodes: [...] } ou [...]
      if (Array.isArray(p.productCategories)) {
        productCats = p.productCategories;
      } else if (
        p.productCategories &&
        Array.isArray(p.productCategories.nodes)
      ) {
        productCats = p.productCategories.nodes;
      }

      const matchesCategory =
        !categoryId ||
        productCats.some((cat) => {
          const catIdDecoded = decodeBase64Safe(cat.id);
          return (
            cat.id === categoryId ||
            cat.id === decodedCategoryId ||
            catIdDecoded === categoryId ||
            catIdDecoded === decodedCategoryId
          );
        });

      // ⚙️ Lógica de status
      if (status === "any") {
        if (categoryId) return matchesSearch && matchesCategory;
        return matchesSearch;
      }

      const matchesStatus = p.status === status;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, search, categoryId, status]);

  // 💅 Render
  return (
    <Section>
      <Title as="h3" className="text-sm text-grayscale-550 mb-8">
        {filteredProducts.length}{" "}
        {filteredProducts.length === 1
          ? "Produto encontrado"
          : "Produtos encontrados"}
      </Title>

      {loading && products.length === 0 ? (
        // 🔄 Skeletons enquanto carrega
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(skeletonCount)].map((_, i) => (
            <div key={i} className="flex flex-col h-full bg-white">
              <Skeleton className="w-full h-48 rounded-lg" />
              <div className="p-4 flex-1 flex flex-col gap-2">
                <Skeleton className="h-5 w-3/4 rounded" />
                <Skeleton className="h-8 w-1/2 rounded" />
                <Skeleton className="h-10 w-full rounded mt-auto" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <p className="text-gray-500">Nenhum produto encontrado.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="relative flex flex-col h-full bg-white p-4 rounded-2xl shadow-sm border border-grayscale-200"
            >
              {/* 🏷️ Tag de status */}
              {p.status && (
                <div className="absolute top-3 left-3 z-10">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full text-white ${
                      p.status === "publish"
                        ? "bg-green-500"
                        : p.status === "pending"
                        ? "bg-yellow-500"
                        : "bg-gray-500"
                    }`}
                  >
                    {p.status === "publish"
                      ? "Publicado"
                      : p.status === "pending"
                      ? "Pendente"
                      : "Rascunho"}
                  </span>
                </div>
              )}

              {/* 📸 Imagem */}
              <div className="relative w-full aspect-[2/1] rounded-lg overflow-hidden">
                <Image
                  src={
                    p.image?.sourceUrl ||
                    "https://cms.bluemonstercase.com/wp-content/uploads/2025/09/imagem-indisponivel.webp"
                  }
                  alt={p.image?.altText || "Produto"}
                  fill
                  className="object-contain"
                  loading="lazy"
                />
              </div>

              {/* 🧾 Conteúdo */}
              <div className="flex-1 flex flex-col gap-2 mt-2">
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

              <ButtonPrimary
                target="_blank"
                href={p.slug ? `/editar-produto/${p.slug}` : "#"}
                className="mt-auto text-sm h-10 text-grayscale-550"
              >
                Editar produto
              </ButtonPrimary>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}
