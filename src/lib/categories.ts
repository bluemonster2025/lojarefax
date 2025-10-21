import { Category } from "@/types/category";
import { Product } from "@/types/product";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

interface CategoryAPIResponse {
  category: Category;
  products: Product[];
}

// Pega categoria + produtos chamando o endpoint server-side já existente
export async function getCategoryBySlug(
  slug: string
): Promise<CategoryAPIResponse | null> {
  const res = await fetch(
    `${BASE_URL}/api/categories/${encodeURIComponent(slug)}`,
    {
      cache: "no-store", // sempre buscar dados atualizados
    }
  );

  if (!res.ok) return null;

  const data: CategoryAPIResponse = await res.json();
  if (!data?.category) return null;

  return data;
}
