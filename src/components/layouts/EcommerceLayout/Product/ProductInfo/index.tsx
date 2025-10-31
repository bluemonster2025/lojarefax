"use client";

import Image from "next/image";
import Link from "next/link";
import { Text, Title } from "@/components/elements/Texts";
import BuyButton from "@/components/elements/BuyButton";
import Icon from "@/components/elements/Icon";
import { Skeleton } from "@/components/elements/Skeleton";
import {
  Product,
  VariationNode,
  VariationAttributeNode,
  CategoryNode,
  ImageNode,
} from "@/types/product";
import { useState } from "react";
import { parsePrice } from "@/utils/parsePrice";
import ColorPreviewRow from "../ColorPreviewRow";
import SectionAcessoriesWrapper from "@/components/layouts/EcommerceLayout/Product/SectionAcessories/SectionAcessoriosWrapper";

interface Props {
  product: Product;
  mainImage?: ImageNode;
  setMainImage: (img: ImageNode) => void;
  selectedVar: VariationNode | null;
  variacoes: VariationNode[];
  setSelectedVar: (v: VariationNode) => void;
}

export default function ProductInfo({
  product,
  setMainImage,
  selectedVar,
  variacoes,
  setSelectedVar,
}: Props) {
  const [openDropdown, setOpenDropdown] = useState(false);

  const categories: CategoryNode[] = product.productCategories?.nodes || [];

  // Se NÃO tem variations => produto simples
  const isSimpleProduct = !product.variations?.nodes?.length;

  // 🔹 Ordena: principal (sem parentId) primeiro
  const orderedCategories = [...categories].sort((a, b) => {
    if (!a.parentId && b.parentId) return -1;
    if (a.parentId && !b.parentId) return 1;
    return 0;
  });

  const capitalizeFirstLetter = (text: string) =>
    text.charAt(0).toUpperCase() + text.slice(1);

  const attrsParaComprar: VariationAttributeNode[] =
    selectedVar?.attributes?.nodes || [];

  // pega preço da variação ativa ou fallback do produto
  const precoStr = selectedVar?.price || product.price || "0";
  const precoNumerico = parsePrice(precoStr);

  // imagem da variação ou imagem padrão
  const imagemProduto = selectedVar?.image || product.image || undefined;

  // payload pro botão de compra
  const produtoParaComprar = {
    ...product,
    price: precoStr,
    image: imagemProduto,
    attributes: attrsParaComprar,
  };

  return (
    <div>
      {/* 🔹 Categorias (principal > secundária > etc.) */}
      {orderedCategories.length > 0 && (
        <div className="flex flex-wrap items-center gap-1 mb-3 text-sm text-grayscale-350">
          {orderedCategories.map((cat, index) => (
            <span key={cat.id} className="flex items-center gap-1">
              <Link
                href={`/categoria/${cat.slug}`}
                className={`${
                  index === 0
                    ? "font-semibold uppercase"
                    : "font-medium capitalize"
                } hover:text-grayscale-400`}
              >
                {cat.name}
              </Link>
              {index < orderedCategories.length - 1 && (
                <span className="text-grayscale-300">›</span>
              )}
            </span>
          ))}
        </div>
      )}

      {/* 🔹 Nome */}
      <Title as="h2" variant="h1" className="mb-3">
        {product.name}
      </Title>

      {/* 🔹 Tags do produto (simple) */}
      {isSimpleProduct &&
        (() => {
          // product.tags pode ser string, string[] ou undefined
          type TagsInput = string | string[] | null | undefined;

          const toTags = (input: TagsInput): string[] => {
            if (Array.isArray(input)) {
              // filtra valores vazios e normaliza
              return input
                .map((t: string) => t.trim())
                .filter((t: string) => !!t);
            }
            if (typeof input === "string") {
              return input
                .split(",")
                .map((t: string) => t.trim())
                .filter((t: string) => !!t);
            }
            return [];
          };

          // Lê de forma segura sem mudar seu tipo global de Product
          const rawTags = (product as { tags?: TagsInput }).tags;
          const tags = toTags(rawTags);

          if (!tags.length) return null;

          return (
            <ul className="flex flex-wrap gap-3 mb-4">
              {tags.map((tag: string, i: number) => (
                <li key={`${tag}-${i}`}>
                  <Title
                    as="h5"
                    variant="h5"
                    className="border border-default-border rounded px-2"
                  >
                    {tag}
                  </Title>
                </li>
              ))}
            </ul>
          );
        })()}

      {/* 🔹 Anchor especificações */}
      {isSimpleProduct && (
        <div>
          <Link
            href={`${product.slug}/#especificacoes-tecnicas`}
            className="flex gap-2 mb-4"
          >
            <Title as="h5" variant="h5" className="underline">
              veja todas especificações
            </Title>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M6.35331 8.25L5.25 9.36544L11.2631 15.441C11.3594 15.5389 11.474 15.6166 11.6002 15.6697C11.7264 15.7227 11.8617 15.75 11.9984 15.75C12.1351 15.75 12.2705 15.7227 12.3967 15.6697C12.5229 15.6166 12.6375 15.5389 12.7338 15.441L18.75 9.36544L17.6467 8.25105L12 13.9534L6.35331 8.25Z"
                fill="#282828"
              />
            </svg>
          </Link>
        </div>
      )}

      {/* 🔹 Descrição curta */}
      <div
        id="especificacoes-tecnicas"
        className="mb-4 text-default-text text-sm font-roboto-flex font-light leading-[23px]"
        dangerouslySetInnerHTML={{ __html: product.shortDescription || "" }}
      />

      {/* 🔹 Catálogo de cores */}
      {isSimpleProduct && <ColorPreviewRow />}

      {/* 🔹 Se for produto variável, mostra seletor de variação */}
      {!isSimpleProduct && (
        <div className="flex flex-col gap-2 py-4 relative">
          <Text className="mb-2 text-sm text-grayscale-350">
            Escolha a cor:
          </Text>

          <div className="border border-grayscale-100 rounded cursor-pointer w-full md:w-[300px] mb-4 md:mb-0">
            <button
              type="button"
              className="w-full flex items-center justify-between p-2 cursor-pointer"
              onClick={() => setOpenDropdown(!openDropdown)}
            >
              {selectedVar ? (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 relative rounded overflow-hidden">
                    <Image
                      src={
                        selectedVar.image?.sourceUrl ||
                        "/images/placeholder.png"
                      }
                      alt={
                        selectedVar.attributes?.nodes
                          ?.map((a) => a.value)
                          .join(" / ") || ""
                      }
                      fill
                      sizes="32px"
                      className="object-cover"
                      loading="lazy"
                      fetchPriority="low"
                    />
                  </div>

                  <Text className="text-grayscale-450 text-sm">
                    {selectedVar.attributes?.nodes
                      ?.map((a) => capitalizeFirstLetter(a.value))
                      .join(" / ")}
                  </Text>
                </div>
              ) : (
                <Skeleton className="h-6 w-65 rounded" />
              )}

              <Icon name="IoIosArrowDown" color="#272934" size={16} />
            </button>

            {openDropdown && (
              <div className="absolute z-10 w-full md:w-[300px] bg-white border border-grayscale-100 rounded mt-1 max-h-60 overflow-auto cursor-pointer">
                {variacoes
                  .filter((v) => v.id !== selectedVar?.id)
                  .map((v) => (
                    <button
                      key={v.id}
                      onClick={() => {
                        setSelectedVar(v);
                        if (v.image) setMainImage(v.image);
                        setOpenDropdown(false);
                      }}
                      className="w-full flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <div className="w-8 h-8 relative rounded overflow-hidden">
                        <Image
                          src={v.image?.sourceUrl || "/images/placeholder.png"}
                          alt={
                            v.attributes?.nodes
                              ?.map((a) => a.value)
                              .join(" / ") || ""
                          }
                          fill
                          sizes="32px"
                          className="object-cover"
                          loading="lazy"
                          fetchPriority="low"
                        />
                      </div>

                      <Text className="text-grayscale-450 text-sm">
                        {v.attributes?.nodes
                          ?.map((a) => capitalizeFirstLetter(a.value))
                          .join(" / ")}
                      </Text>
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 🔹 Preço (só aparece se NÃO for simples, ou seja, se for variável) */}
      {!isSimpleProduct && (
        <div className="mb-3 text-5xl font-semibold text-grayscale-400">
          R{"$ "}
          {new Intl.NumberFormat("pt-BR", {
            style: "decimal",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(precoNumerico)}
        </div>
      )}

      {/* 🔹 Observação de compra */}
      <div
        className="mb-7 text-grayscale-400 text-xs/[16px]"
        dangerouslySetInnerHTML={{ __html: product.purchaseNote || "" }}
      />
      <div className="flex items-center justify-between">
        {/* 🔹 Botão de compra */}
        <div className="w-full">
          <BuyButton
            produto={produtoParaComprar}
            variant="secondary"
            title="Compre direto da fábrica"
            icon="BsWhatsapp"
          />
        </div>
        <div className="w-full">
          <SectionAcessoriesWrapper
            title={product.acessoriosMontagemTitle || ""}
            subtitle={product.acessoriosMontagemSubtitle || ""}
            accessories={product.acessoriosMontagem} // 👈 veio da sua query/map
            product={product}
          />
        </div>
      </div>
    </div>
  );
}
