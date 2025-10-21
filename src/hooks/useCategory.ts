import { useState, useEffect } from "react";
import { Category } from "@/types/category";
import { Product } from "@/types/product";
import { mapCategory } from "@/utils/mappers/mapCategory";
import { mapProduct } from "@/utils/mappers/mapProduct";

interface UseCategoryResult {
  category: Category | null;
  products: Product[];
  loading: boolean;
  error?: string;
}

export const useCategory = (slug: string): UseCategoryResult => {
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!slug) return;

    const fetchCategory = async () => {
      setLoading(true);
      setError(undefined);

      try {
        const res = await fetch(`/api/categories/${slug}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Erro ao buscar categoria");
          setCategory(null);
          setProducts([]);
        } else {
          setCategory(mapCategory(data.category));
          setProducts(data.products.map(mapProduct));
        }
      } catch (err) {
        console.error(err);
        setError("Erro interno");
        setCategory(null);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [slug]);

  return { category, products, loading, error };
};
