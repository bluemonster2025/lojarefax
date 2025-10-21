"use client";

import { useState } from "react";
import SearchBar from "@/components/layouts/EcommerceLayout/Search/SearchBar";
import Filters from "@/components/layouts/AdminLayout/Filters";

type ProductFilterProps = {
  search: string;
  setSearch: (value: string) => void;
  onApplyFilter?: (filters: {
    search: string;
    categoryId?: string;
    status?: string; // ✅ inclui status no tipo
  }) => void;
};

export default function ProductFilter({
  search,
  setSearch,
  onApplyFilter,
}: ProductFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // 🔹 Recebe filtros de categoria + status do componente Filters
  const handleApply = (filters: { categoryId?: string; status?: string }) => {
    if (onApplyFilter) {
      onApplyFilter({
        search,
        categoryId: filters.categoryId || undefined,
        status: filters.status || "publish",
      });
    }
  };

  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      {/* 🔍 Campo de busca */}
      <SearchBar
        placeholder="Buscar..."
        search={search}
        setSearch={setSearch}
        inputClassName="p-[0.8rem] text-base pr-8"
        sizeIcon={16}
      />

      {/* 🔽 Filtros (categoria + status) */}
      <Filters
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onApply={handleApply}
      />
    </div>
  );
}
