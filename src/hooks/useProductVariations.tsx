"use client";

import { useState, useEffect } from "react";
import { Product, VariationNode, ImageNode } from "@/types/product";

export function useProductVariations(product: Product | undefined) {
  const [variacoes, setVariacoes] = useState<VariationNode[]>([]);
  const [selectedVar, setSelectedVar] = useState<VariationNode | null>(null);
  const [mainImage, setMainImage] = useState<ImageNode | undefined>(
    product?.image
  );

  useEffect(() => {
    if (!product) return;

    // define variações
    const vars = product.variations?.nodes || [];
    setVariacoes(vars);

    // define variação padrão
    const defaultVar = vars[0] || null;
    setSelectedVar(defaultVar);

    // define imagem principal: variação com imagem > imagem do produto
    const defaultImage = defaultVar?.image || product.image;
    setMainImage(defaultImage);
  }, [product]);

  return { variacoes, selectedVar, setSelectedVar, mainImage, setMainImage };
}
