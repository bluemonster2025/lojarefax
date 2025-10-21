"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Title, Text } from "@/components/elements/Texts";
import { Skeleton } from "@/components/elements/Skeleton";
import { Section } from "@/components/elements/Section";
import { ButtonPrimary } from "@/components/elements/Button";
import { useProducts } from "@/hooks/useProducts";
import { Dialog, DialogHeader, DialogTitle, DialogContent } from "./Dialog";
import { RelatedProductNode } from "@/types/product";
import { parsePrice } from "@/utils/parsePrice";
import InputField from "@/components/elements/InputField";

type SectionProductsEditProps = {
  products: RelatedProductNode[];
  title: string;
  onUpdate: (index: number, newProduct: RelatedProductNode) => void;
  onTitleChange?: (newTitle: string) => void;
};

export default function SectionProductsEdit({
  products,
  title,
  onUpdate,
  onTitleChange,
}: SectionProductsEditProps) {
  const { products: allProducts, loading } = useProducts();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [localTitle, setLocalTitle] = useState(title);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  // Estado local dos produtos
  const [localProducts, setLocalProducts] = useState<RelatedProductNode[]>(
    products.map((p) => ({
      ...p,
      customTag: p.customTag || "",
      visible: !!p.visible,
    }))
  );

  // Atualiza produtos locais se mudar do pai
  useEffect(() => {
    setLocalProducts(
      products.map((p) => ({
        ...p,
        customTag: p.customTag || "",
        visible: !!p.visible,
      }))
    );
  }, [products]);

  // Filtra produtos para o modal
  const filteredProducts = useMemo(() => {
    if (!searchQuery) return allProducts;
    return allProducts.filter((prod) =>
      prod.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allProducts, searchQuery]);

  // Atualiza estado local + avisa pai
  const handleLocalChange = (
    index: number,
    updated: Partial<RelatedProductNode>
  ) => {
    const newProducts = [...localProducts];
    newProducts[index] = { ...newProducts[index], ...updated };
    setLocalProducts(newProducts);
    onUpdate(index, newProducts[index]);
  };

  return (
    <Section className="flex flex-col gap-4 pb-12">
      <div className="w-fit">
        <ButtonPrimary
          className="h-6 rounded font-bold"
          onClick={() => setIsEditingTitle((prev) => !prev)}
        >
          {isEditingTitle ? "Concluir edição" : "Editar título"}
        </ButtonPrimary>
      </div>

      <InputField
        className={`text-lg md:text-[22px] font-semibold w-full p-1 ${
          isEditingTitle ? "bg-white mt-2" : "border-none bg-transparent"
        } focus:outline-none ${
          !isEditingTitle ? "cursor-not-allowed text-grayscale-300" : ""
        }`}
        placeholder="Título da sessão"
        value={localTitle}
        disabled={!isEditingTitle}
        onChange={(val) => {
          setLocalTitle(val);
          onTitleChange?.(val);
        }}
      />

      <Text className="mb-8">
        Altere os produtos que vão aparecer nessa sessão da página inicial do
        seu site.
      </Text>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {localProducts.length === 0
          ? [...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col h-full">
                <Skeleton className="w-full h-48 rounded-lg" />
                <div className="p-4 flex-1 flex flex-col gap-2">
                  <Skeleton className="h-5 w-3/4 rounded" />
                  <Skeleton className="h-8 w-1/2 rounded" />
                  <Skeleton className="h-10 w-full rounded mt-auto" />
                </div>
              </div>
            ))
          : localProducts.map((item, index) => {
              const productImage =
                item?.image?.sourceUrl || "/images/placeholder.png";

              return (
                <div
                  key={item.id || index}
                  className="flex flex-col h-full rounded-2xl overflow-hidden bg-white py-8"
                >
                  <div className="relative w-full aspect-[2/1]">
                    <Image
                      src={productImage}
                      alt={item?.image?.altText || item?.name || "Produto"}
                      fill
                      className="object-contain bg-white"
                      loading="lazy"
                      fetchPriority="low"
                    />
                  </div>

                  <div className="p-4 flex-1 flex flex-col gap-4">
                    <Title
                      as="h2"
                      className="font-semibold text-sm text-grayscale-400"
                    >
                      {item?.name || "Produto sem nome"}
                    </Title>

                    <Text className="text-grayscale-400 flex items-baseline gap-1">
                      {item?.price ? (
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

                    <Text className="text-xs text-grayscale-550">Tag:</Text>

                    <div className="flex items-center gap-4">
                      {/* ✨ Checkbox Visível */}
                      <label className="custom-checkbox">
                        <input
                          type="checkbox"
                          checked={item.visible}
                          onChange={() =>
                            handleLocalChange(index, { visible: !item.visible })
                          }
                        />
                        <span className="checkmark"></span>
                      </label>

                      {/* ✨ TAG */}
                      <input
                        type="text"
                        value={item.customTag || ""}
                        onChange={(e) =>
                          handleLocalChange(index, {
                            customTag: e.target.value,
                          })
                        }
                        className="border border-grayscale-100 p-1 rounded text-sm text-grayscale-550 outline-none"
                        placeholder="Tag personalizada"
                      />
                    </div>

                    <ButtonPrimary
                      className="mt-auto text-sm h-10 text-grayscale-550"
                      onClick={() => setSelectedIndex(index)}
                    >
                      Trocar produto
                    </ButtonPrimary>

                    {/* Dialog para trocar produto */}
                    <Dialog
                      open={selectedIndex === index}
                      onClose={() => setSelectedIndex(null)}
                    >
                      <DialogHeader className="flex justify-between items-center">
                        <DialogTitle>Escolher novo produto</DialogTitle>
                        <button
                          onClick={() => setSelectedIndex(null)}
                          className="text-grayscale-400 hover:text-grayscale-600 transition text-2xl font-bold cursor-pointer"
                          aria-label="Fechar"
                        >
                          ×
                        </button>
                      </DialogHeader>

                      <DialogContent>
                        <input
                          type="text"
                          placeholder="Buscar produtos..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full p-2 border rounded mb-4 focus:outline-none"
                        />

                        {loading ? (
                          <p>Carregando produtos...</p>
                        ) : filteredProducts.length === 0 ? (
                          <p>Nenhum produto encontrado.</p>
                        ) : (
                          <ul className="flex flex-col gap-2 max-h-96 overflow-y-auto">
                            {filteredProducts.map((prod) => (
                              <li key={prod.id}>
                                <button
                                  className="w-full text-left p-2 hover:bg-gray-50 transition cursor-pointer"
                                  onClick={() => {
                                    if (selectedIndex !== null) {
                                      handleLocalChange(index, {
                                        ...prod,
                                        customTag: "",
                                        visible: false,
                                      });

                                      setSelectedIndex(null);
                                      setSearchQuery("");
                                    }
                                  }}
                                >
                                  {prod.name}
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              );
            })}
      </div>
    </Section>
  );
}
