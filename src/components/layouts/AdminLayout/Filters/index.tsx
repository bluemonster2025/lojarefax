"use client";

import { useCategories } from "@/hooks/useCategories";
import { ButtonPrimary } from "@/components/elements/Button";
import InputField from "@/components/elements/InputField";
import { Text } from "@/components/elements/Texts";
import { useState } from "react";

type FiltersProps = {
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  onApply: (filters: { categoryId?: string; status?: string }) => void;
};

export default function Filters({
  selectedCategory,
  setSelectedCategory,
  onApply,
}: FiltersProps) {
  const { categories, loading: loadingCategories } = useCategories();

  // 🔥 Novo estado para o filtro de status
  const [selectedStatus, setSelectedStatus] = useState<string>("publish");

  const handleApply = () => {
    onApply({
      categoryId: selectedCategory,
      status: selectedStatus,
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Text className="text-grayscale-550 font-medium">Filtros</Text>

      {/* 🔹 Filtro de Categoria */}
      <div className="flex-1 min-w-[200px]">
        <InputField
          select
          className="p-[0.8rem] text-sm text-grayscale-550"
          value={selectedCategory}
          onChange={(value) => setSelectedCategory(value)}
          disabled={loadingCategories}
          options={[
            { value: "", label: "Todas as categorias" },
            ...(categories?.map((cat) => ({
              value: String(cat.id),
              label: cat.name,
            })) ?? []),
          ]}
        />
      </div>

      {/* 🔹 Filtro de Status */}
      <div className="min-w-[200px]">
        <InputField
          select
          className="p-[0.8rem] text-sm text-grayscale-550"
          value={selectedStatus}
          onChange={(value) => setSelectedStatus(value)}
          options={[
            { value: "publish", label: "Publicados" },
            { value: "draft", label: "Rascunhos" },
            { value: "pending", label: "Revisão pendente" }, // ✅ novo
            { value: "any", label: "Todos" },
          ]}
        />
      </div>

      {/* 🔹 Botão Aplicar */}
      <div className="w-fit">
        <ButtonPrimary
          className="h-12 rounded font-semibold"
          onClick={handleApply}
        >
          Aplicar filtro
        </ButtonPrimary>
      </div>
    </div>
  );
}
