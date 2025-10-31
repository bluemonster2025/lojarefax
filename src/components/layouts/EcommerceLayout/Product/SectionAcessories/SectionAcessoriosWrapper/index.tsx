"use client";

import { Product, AccessoryProductNode } from "@/types/product";
import SectionAcessories from "..";

interface Props {
  /** Se você passar o product, ele resolve title + accessories dele */
  product?: Product;

  /** Ou você pode passar os dados já resolvidos manualmente */
  title?: string;
  accessories?: AccessoryProductNode[];

  loading?: boolean;
  maxAccessoriesPreview?: number;
}

export default function SectionAcessoriosWrapper({
  product,
  title,
  accessories,
  loading = false,
  maxAccessoriesPreview = 12,
}: Props) {
  const resolvedTitle =
    title ?? product?.acessoriosMontagemTitle ?? "Acessórios";

  const resolvedAccessories = accessories ?? product?.acessoriosMontagem ?? [];

  return (
    <SectionAcessories
      title={resolvedTitle}
      accessories={resolvedAccessories}
      loading={loading}
      maxAccessoriesPreview={maxAccessoriesPreview}
    />
  );
}
