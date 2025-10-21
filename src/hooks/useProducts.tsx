import { Product } from "@/types/product";
import { useState, useEffect, useRef, useCallback } from "react";

type Filters = {
  search?: string;
  per_page?: number;
  categoryId?: string;
  status?: string;
};

const defaultFilters: Filters = {
  search: "",
  per_page: 20,
  status: "publish",
};

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFiltersState] = useState<Filters>(defaultFilters);
  const [error, setError] = useState<string | null>(null);

  const abortController = useRef<AbortController | null>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const firstRender = useRef(true);

  /** 🔧 Atualiza filtros parcialmente (merge automático) */
  const setFilters = (patch: Partial<Filters>) => {
    setFiltersState((prev) => ({ ...prev, ...patch }));
  };

  /** 🌐 Busca principal (única fonte da verdade) */
  const fetchProducts = useCallback(
    async (activeFilters?: Filters) => {
      const f = activeFilters || filters;

      if (abortController.current) abortController.current.abort();
      abortController.current = new AbortController();
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        params.set("per_page", String(f.per_page ?? 20));
        params.set("page", "1");

        if (f.search?.trim()) params.set("search", f.search.trim());
        if (f.categoryId) params.set("categoryId", f.categoryId);
        if (f.status) params.set("status", f.status);

        const finalUrl = `/api/products?${params.toString()}`;
        console.log("🌐 Fetch:", finalUrl);

        const res = await fetch(finalUrl, {
          cache: "no-store",
          signal: abortController.current.signal,
        });

        if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);

        const data: Product[] = await res.json();
        console.log(`✅ ${data.length} produtos recebidos`);
        setProducts(data);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          console.error("💥 Erro ao buscar produtos:", err.message);
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  /** ⏳ Debounce apenas para `search` */
  useEffect(() => {
    const term = filters.search?.trim();
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    if (term) {
      debounceTimeout.current = setTimeout(() => {
        console.log("⌛ Debounce concluído (search):", term);
        fetchProducts();
      }, 400);
    } else if (!firstRender.current) {
      console.log("🔄 Filtros alterados (sem search) → fetch direto");
      fetchProducts();
    }

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [filters.search, filters.categoryId, filters.status, fetchProducts]);

  /** 🚀 Busca inicial */
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      fetchProducts();
    }
  }, [fetchProducts]);

  return { products, loading, filters, setFilters, fetchProducts, error };
};
