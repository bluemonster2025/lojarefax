"use client";

import { UIProduct } from "@/types/uIProduct";
import SectionProductsReadyToDeliver from "..";

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
    <SectionProductsReadyToDeliver
      title={title || ""}
      products={products}
      loading={loading}
    />
  );
}
