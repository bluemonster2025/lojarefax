import { UIProduct } from "@/types/uIProduct";
import { SessaoProduct } from "@/types/home";

export function mapSessionProductToUIProduct(p: SessaoProduct): UIProduct {
  return {
    id: p.id,
    name: p.title,
    uri: p.uri,
    image: {
      sourceUrl: p.featuredImage?.node?.sourceUrl || "/images/placeholder.png",
      altText: p.featuredImage?.node?.altText || p.title,
    },
    price: p.price ?? "0,00",

    // 🔹 primeira tag (opcional)
    tag: p.productTags?.nodes?.[0]?.name || undefined,

    // 🔹 todas as tags
    productsTag: p.productTags?.nodes?.map((t) => t.name) || [],

    // 🔹 categorias do produto (vem de { nodes: [] })
    productCategories:
      p.productCategories?.nodes?.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
      })) || [],
  };
}
