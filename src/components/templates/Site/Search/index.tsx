"use client";

import { useState, useMemo } from "react";
import { Section } from "@/components/elements/Section";
import { Title } from "@/components/elements/Texts";
import CategoriesList from "@/components/layouts/EcommerceLayout/Search/CategoriesList";
import Filters from "@/components/layouts/EcommerceLayout/Search/Filters";
import SearchBar from "@/components/layouts/EcommerceLayout/Search/SearchBar";
import SearchResults from "@/components/layouts/EcommerceLayout/Search/SearchResults";
import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";
import { useRouter } from "next/navigation";
import { parsePrice } from "@/utils/parsePrice";

export default function SearchTemplate() {
  const { categories, loading: loadingCategories } = useCategories();
  const { products, loading: loadingProducts, setFilters } = useProducts();
  const router = useRouter();

  // ✅ Filtros locais (só usados para filtragem client-side)
  const [filters, setLocalFilters] = useState({
    search: "",
    minPrice: 0,
    maxPrice: 0,
    sort: "",
  });

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  // ✅ Quando a busca muda, avisa o hook
  const handleSearch = (value: string) => {
    setLocalFilters((prev) => ({ ...prev, search: value }));
    setFilters({ search: value }); // ainda busca os produtos via API
  };

  // ✅ Filtro e ordenação local (client-side)
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (filters.minPrice > 0) {
      filtered = filtered.filter(
        (p) => parsePrice(p.price) >= filters.minPrice
      );
    }

    if (filters.maxPrice > 0) {
      filtered = filtered.filter(
        (p) => parsePrice(p.price) <= filters.maxPrice
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
    <Section className="py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Title className="uppercase text-2xl font-semibold">Buscar</Title>

        <button
          type="button"
          aria-label="Voltar"
          onClick={handleBack}
          className="transition cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 30 30"
            fill="none"
          >
            <path
              d="M23.2349 8.10552C23.479 7.86144 23.479 7.46571 23.2349 7.22163C22.9908 6.97755 22.5951 6.97755 22.351 7.22163L15.293 14.2797L8.23491 7.22163C7.99083 6.97755 7.5951 6.97755 7.35103 7.22163C7.10695 7.46571 7.10695 7.86144 7.35103 8.10552L14.4091 15.1636L7.35103 22.2216C7.10695 22.4657 7.10695 22.8614 7.35103 23.1055C7.5951 23.3496 7.99083 23.3496 8.23491 23.1055L15.293 16.0475L22.351 23.1055C22.5951 23.3496 22.9908 23.3496 23.2349 23.1055C23.479 22.8614 23.479 22.4657 23.2349 22.2216L16.1769 15.1636L23.2349 8.10552Z"
              fill="#40434B"
            />
          </svg>
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <SearchBar
          search={filters.search}
          placeholder="O que você está buscando?"
          setSearch={handleSearch}
          inputClassName="p-4 text-sm pr-10"
          sizeIcon={18}
        />
      </div>

      {/* Filtros */}
      {filters.search && (
        <Filters
          minPrice={filters.minPrice || undefined}
          maxPrice={filters.maxPrice || undefined}
          sort={filters.sort as "asc" | "desc" | ""}
          onChange={(newFilters) =>
            setLocalFilters((prev) => ({
              ...prev,
              ...newFilters,
            }))
          }
        />
      )}

      {/* Categorias */}
      {!filters.search && (
        <CategoriesList categories={categories} loading={loadingCategories} />
      )}

      {/* Resultados da busca */}
      {filters.search && (
        <SearchResults
          products={filteredProducts}
          loadingProducts={loadingProducts}
          search={filters.search}
        />
      )}
    </Section>
  );
}
