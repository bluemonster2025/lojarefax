// utils/mappers/mapSessionProductToUIProduct.ts
import { UIProduct } from "@/types/uIProduct";
import { SessaoProduct } from "@/types/home";

export function mapSessionProductToUIProduct(p: SessaoProduct): UIProduct {
  // Ordena as categorias: principal (sem parentId) primeiro
  const sortedCategories =
    p.productCategories?.nodes
      ?.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        parentId: c.parentId,
      }))
      .sort((a, b) => {
        // Categorias sem parentId vêm primeiro
        if (!a.parentId && b.parentId) return -1;
        if (a.parentId && !b.parentId) return 1;
        return 0;
      }) || [];

  return {
    id: p.id,
    name: p.title,
    uri: p.uri,
    image: {
      sourceUrl: p.featuredImage?.node?.sourceUrl || "/images/placeholder.png",
      altText: p.featuredImage?.node?.altText || p.title,
    },
    price: p.price ?? "0,00",

    tag: p.productTags?.nodes?.[0]?.name || undefined,
    productsTag: p.productTags?.nodes?.map((t) => t.name) || [],
    productCategories: sortedCategories,
  };
}
