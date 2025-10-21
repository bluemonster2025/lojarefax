// src/hooks/useFilters.ts
import { useState } from "react";

export type SortType = "" | "asc" | "desc";

export type FilterValues = {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: SortType;
  categoryId?: number;
};

export function useFilters(initial?: FilterValues) {
  const [filters, setFilters] = useState<FilterValues>(initial || {});

  const updateFilters = (newFilters: Partial<FilterValues>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return { filters, updateFilters };
}
