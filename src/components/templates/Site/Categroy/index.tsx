"use client";

import { useState, useMemo } from "react";
import { Section } from "@/components/elements/Section";
import CategoryCover from "@/components/layouts/EcommerceLayout/Category/CategoryCover";
import FilteredProducts from "@/components/layouts/EcommerceLayout/Category/FilteredProducts";
import Filters from "@/components/layouts/EcommerceLayout/Search/Filters";
import { Category } from "@/types/category";
import { Product } from "@/types/product";
import { parsePrice } from "@/utils/parsePrice";

interface CategoriaTemplateProps {
  category: Category;
  products: Product[];
}

export default function CategoriaTemplate({
  category,
  products,
}: CategoriaTemplateProps) {
  const [filters, setFilters] = useState<{
    minPrice?: number;
    maxPrice?: number;
    sort?: "" | "asc" | "desc";
  }>({ minPrice: 0, maxPrice: 0, sort: "" });

  // Produtos filtrados e ordenados
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (filters.minPrice && filters.minPrice > 0) {
      filtered = filtered.filter(
        (p) => parsePrice(p.price) >= filters.minPrice!
      );
    }
    if (filters.maxPrice && filters.maxPrice > 0) {
      filtered = filtered.filter(
        (p) => parsePrice(p.price) <= filters.maxPrice!
      );
    }

    if (filters.sort === "asc") {
      filtered.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    } else if (filters.sort === "desc") {
      filtered.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    }

    return filtered;
  }, [products, filters]);

  return (
    <>
      <CategoryCover category={category} />

      <Section>
        {/* Filtros */}
        <Filters
          minPrice={filters.minPrice! > 0 ? filters.minPrice : undefined}
          maxPrice={filters.maxPrice! > 0 ? filters.maxPrice : undefined}
          sort={filters.sort}
          onChange={(newFilters) =>
            setFilters({
              minPrice: newFilters.minPrice ?? 0,
              maxPrice: newFilters.maxPrice ?? 0,
              sort: newFilters.sort ?? "",
            })
          }
        />

        {/* Lista de produtos */}
        <FilteredProducts produtos={filteredProducts} />
      </Section>
    </>
  );
}
