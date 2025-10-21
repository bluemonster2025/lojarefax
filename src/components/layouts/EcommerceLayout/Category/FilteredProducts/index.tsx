"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { ButtonSecondary } from "@/components/elements/Button";
import ProductCard from "../ProductCard";

type FilteredProductsProps = {
  produtos: Product[];
  loading?: boolean;
};

export default function FilteredProducts({ produtos }: FilteredProductsProps) {
  const [visibleCount, setVisibleCount] = useState(4);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const visibleProducts = isMobile ? produtos.slice(0, visibleCount) : produtos;

  const allLoaded = visibleCount >= produtos.length;

  const handleLoadMore = () => setVisibleCount((prev) => prev + 4);

  if (produtos.length === 0)
    return <p>Nenhum produto encontrado para esta categoria.</p>;

  return (
    <>
      <div className="pb-12 grid gap-y-12 gap-x-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 items-stretch">
        {visibleProducts.map((p) => (
          <ProductCard key={p.id} produto={p} />
        ))}
      </div>

      {isMobile && (
        <div className="w-[146px] mx-auto mb-12 text-sm font-semibold">
          <ButtonSecondary onClick={handleLoadMore} disabled={allLoaded}>
            {allLoaded ? "Todos carregados" : "Carregar mais"}
          </ButtonSecondary>
        </div>
      )}
    </>
  );
}
