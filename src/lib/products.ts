import { Product } from "@/types/product";
import { PageProducts } from "@/types/pageProducts";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const res = await fetch(
    `${BASE_URL}/api/product/${encodeURIComponent(slug)}`,
    {
      cache: "no-store",
    }
  );
  if (!res.ok) return null;
  return (await res.json()) ?? null;
}

export async function getPageProduto(): Promise<PageProducts | null> {
  const res = await fetch(`${BASE_URL}/api/pageProduct`, { cache: "no-store" });
  if (!res.ok) return null;
  const json = await res.json();
  return json ?? null;
}
