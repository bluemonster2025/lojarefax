import {
  Product,
  ImageNode,
  VariationNode,
  RelatedProductNode,
  RawTag,
} from "@/types/product";

// Tipos intermediários do GraphQL
interface RawImage {
  sourceUrl: string;
  altText?: string;
}

interface RawCategory {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  parent?: { node: { id: string; name: string; slug: string } };
}

interface RawVariationAttribute {
  attributeId: string;
  name: string;
  value: string;
}

interface RawVariation {
  id: string;
  name: string;
  price?: string;
  purchaseNote?: string;
  image?: RawImage;
  attributes?: { nodes: RawVariationAttribute[] };
}

interface RawRelatedProduct {
  id: string;
  name: string;
  price?: string;
  image?: RawImage;
  type?: "simple" | "variable" | "external" | "group";
  slug: string;
  productTags?: { nodes?: RawTag[] } | RawTag[];
}

interface RawProduct {
  id: string;
  name: string;
  description?: string;
  shortDescription?: string;
  purchaseNote?: string;
  slug?: string;
  price?: string;
  image?: RawImage;
  galleryImages?: { nodes?: RawImage[] };
  variations?: { nodes?: RawVariation[] };
  productCategories?: { nodes?: RawCategory[] } | RawCategory[];
  productTags?: { nodes?: RawTag[] } | RawTag[];
  crossSell?: { nodes?: RawRelatedProduct[] } | RawRelatedProduct[];
  upsell?: { nodes?: RawRelatedProduct[] } | RawRelatedProduct[];
  related?: { nodes?: RawRelatedProduct[] } | RawRelatedProduct[];
  status?: "publish" | "draft" | "pending" | "private" | string;
}

// Função que mapeia o produto do GraphQL para nosso tipo Product
export function mapProduct(raw: RawProduct): Product {
  const image: ImageNode | undefined = raw.image
    ? { sourceUrl: raw.image.sourceUrl, altText: raw.image.altText || raw.name }
    : undefined;

  const galleryImages = raw.galleryImages
    ? (Array.isArray(raw.galleryImages)
        ? raw.galleryImages
        : raw.galleryImages.nodes || []
      ).map((img) => ({
        sourceUrl: img.sourceUrl,
        altText: img.altText || raw.name,
      }))
    : [];

  const productCategoriesArray = Array.isArray(raw.productCategories)
    ? raw.productCategories
    : raw.productCategories?.nodes ?? [];

  // 🔹 Mapeia e ordena categorias (sem parentId primeiro)
  const productCategories = productCategoriesArray
    .map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      parentId: cat.parentId ?? cat.parent?.node?.id ?? null, // tenta inferir se só o parent.node existe
      parent: cat.parent
        ? {
            node: {
              id: cat.parent.node.id,
              name: cat.parent.node.name,
              slug: cat.parent.node.slug,
            },
          }
        : undefined,
    }))
    .sort((a, b) => {
      if (!a.parentId && b.parentId) return -1;
      if (a.parentId && !b.parentId) return 1;
      return 0;
    });

  const variations: VariationNode[] | undefined = raw.variations?.nodes?.map(
    (v) => ({
      id: v.id,
      name: v.name,
      price: v.price ?? "0",
      purchaseNote: v.purchaseNote ?? "",
      image: v.image
        ? { sourceUrl: v.image.sourceUrl, altText: v.image.altText || v.name }
        : undefined,
      attributes: v.attributes
        ? {
            nodes: v.attributes.nodes.map((attr) => ({
              attributeId: attr.attributeId,
              name: attr.name,
              value: attr.value,
            })),
          }
        : undefined,
    })
  );

  // 🔹 Função segura para mapear produtos relacionados (crossSell, upsell)
  const mapRelated = (
    input?: { nodes?: RawRelatedProduct[] } | RawRelatedProduct[]
  ): RelatedProductNode[] => {
    const nodesArray = Array.isArray(input) ? input : input?.nodes ?? [];

    return nodesArray.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price ?? "0",
      slug: p.slug,
      image: p.image
        ? { sourceUrl: p.image.sourceUrl, altText: p.image.altText || p.name }
        : undefined,
      type: p.type ?? "simple",
      tags: Array.isArray(p.productTags)
        ? (p.productTags as RawTag[]).map((t) => t.name)
        : p.productTags?.nodes?.map((t) => t.name) || [],
      customTag: "",
      visible: true,
    }));
  };

  // 🔹 Corrige suporte às duas estruturas possíveis de tags
  const productTagsArray = Array.isArray(raw.productTags)
    ? raw.productTags
    : raw.productTags?.nodes ?? [];

  return {
    id: raw.id,
    name: raw.name,
    description: raw.description ?? "",
    shortDescription: raw.shortDescription ?? "",
    price: raw.price ?? "0",
    purchaseNote: raw.purchaseNote ?? "",
    slug: raw.slug || raw.id,
    image,
    galleryImages: galleryImages ? { nodes: galleryImages } : undefined,
    productCategories: productCategories.length
      ? { nodes: productCategories }
      : undefined,
    variations: variations ? { nodes: variations } : undefined,
    crossSell: { nodes: mapRelated(raw.crossSell) },
    upsell: { nodes: mapRelated(raw.upsell) },
    tags: productTagsArray.map((t) => t.name),
    tag: productTagsArray[0]?.name || "",
    status: raw.status || "publish",
  };
}
