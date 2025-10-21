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
  const isSimpleProduct = !product.variations?.nodes?.length;

  const capitalizeFirstLetter = (text: string) =>
    text.charAt(0).toUpperCase() + text.slice(1);

  // Atributos da variação para o BuyButton
  const attrsParaComprar: VariationAttributeNode[] =
    selectedVar?.attributes?.nodes || [];

  // Produto combinado para BuyButton
  const produtoParaComprar = {
    ...product,
    price: selectedVar?.price || product.price || "0",
    image: selectedVar?.image || product.image,
    attributes: attrsParaComprar,
  };

  const precoNumerico = parsePrice(produtoParaComprar.price);

  return (
    <div>
      {/* Categorias */}
      <div className="text-sm text-grayscale-350 font-semibold mb-5">
        {categories.map((c, i) => (
          <span key={c.id}>
            {i > 0 && <span className="mx-2">{">"}</span>}
            {i === 0 ? (
              <Link href={`/categoria/${c.slug}`}>{c.name}</Link>
            ) : (
              <span>{c.name}</span>
            )}
          </span>
        ))}
      </div>

      {/* Nome e descrição curta */}
      <Title as="h3" className="text-2xl font-semibold mb-6">
        {product.name}
      </Title>
      <div
        className="mb-4 text-grayscale-350 text-sm/[24px]"
        dangerouslySetInnerHTML={{ __html: product.shortDescription || "" }}
      />

      {/* Produto variável */}
      {/* Produto variável */}
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
                          .map((a) => a.value)
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
                      .map((a) => capitalizeFirstLetter(a.value))
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
                              .map((a) => a.value)
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
                          .map((a) => capitalizeFirstLetter(a.value))
                          .join(" / ")}
                      </Text>
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Preço */}
      <div className="mb-3 text-5xl font-semibold text-grayscale-400">
        R${" "}
        {new Intl.NumberFormat("pt-BR", {
          style: "decimal",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(precoNumerico)}
      </div>

      {/* Observação de compra */}
      <div
        className="mb-7 text-grayscale-400 text-xs/[16px]"
        dangerouslySetInnerHTML={{ __html: product.purchaseNote || "" }}
      />

      {/* Botão de compra */}
      <div className="w-full md:w-[270px] mb-6">
        <BuyButton
          produto={produtoParaComprar}
          variant="secondary"
          title="Reserve o seu agora mesmo"
          icon="BsWhatsapp"
        />
      </div>

      {/* Formas de pagamento somente para produtos simples */}
      {isSimpleProduct && (
        <div className="hidden md:block">
          <Title
            as="h3"
            className="text-grayscale-350 font-bold text-sm uppercase"
          >
            Formas de pagamento
          </Title>
          <div className="flex-1 relative w-full max-w-[185px] h-[38px] md:h-[38px]">
            <Image
              src="https://cms.bluemonstercase.com/wp-content/uploads/2025/09/pagamento.webp"
              alt="Formas de pagamento"
              fill
              sizes="(max-width: 768px) 100vw, 185px"
              className="object-contain"
              loading="lazy"
              fetchPriority="low"
            />
          </div>
        </div>
      )}
    </div>
  );
}
