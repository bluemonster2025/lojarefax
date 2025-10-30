"use client";

import { UIProduct } from "@/types/uIProduct";
import Accessories from "..";

interface Props {
  title?: string;
  products?: UIProduct[];
  loading?: boolean;
}

export default function AccessoriesWrapper({
  title,
  products,
  loading,
}: Props) {
  return (
    <Accessories title={title || ""} products={products} loading={loading} />
  );
}
