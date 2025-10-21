"use client";

import { UIProduct } from "@/types/uIProduct";
import SectionProducts from "..";

interface Props {
  title?: string;
  products?: UIProduct[];
  loading?: boolean;
}

export default function SectionProductsWrapper({
  title,
  products,
  loading,
}: Props) {
  return (
    <SectionProducts
      title={title || ""}
      products={products}
      loading={loading}
    />
  );
}
