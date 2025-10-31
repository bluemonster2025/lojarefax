"use client";

import { Section } from "@/components/elements/Section";
import { Title } from "@/components/elements/Texts";
import ProductFilter from "@/components/layouts/AdminLayout/ProductFilter";
import ProductsEditAll from "@/components/layouts/AdminLayout/ProductsEditAll";
import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";

export default function ProductsAllEditorTemplate() {
  // ✅ Um único hook de produtos
  const { products, loading, setFilters } = useProducts();

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [status, setStatus] = useState<string>("publish");

  // 🔍 Atualiza filtros globais
  const handleApplyFilter = (filters: {
    search: string;
    categoryId?: string;
    status?: string;
  }) => {
    setSearch(filters.search);
    setCategoryId(filters.categoryId);
    setStatus(filters.status || "publish");

    setFilters({
      search: filters.search,
      categoryId: filters.categoryId,
      status: filters.status || "publish",
    });
  };

  return (
    <Section className="py-8">
      <Title className="text-grayscale-550 text-2xl font-semibold mb-12">
        Meus produtos
      </Title>

      <ProductFilter
        search={search}
        setSearch={setSearch}
        onApplyFilter={handleApplyFilter}
      />

      {/* ✅ Agora ProductsEditAll recebe produtos e loading corretos */}
      <ProductsEditAll
        products={products}
        loading={loading}
        search={search}
        categoryId={categoryId}
        status={status}
      />
    </Section>
  );
}
