import { useState, useEffect } from "react";
import { CategoryNode, Category } from "@/types/category";
import { mapCategory } from "@/utils/mappers/mapCategory";

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) throw new Error("Erro ao buscar categorias");

        const data: CategoryNode[] = await res.json();
        const mappedCategories = data.map(mapCategory); // já inclui image e banners
        setCategories(mappedCategories);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("Erro ao buscar categorias");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};
