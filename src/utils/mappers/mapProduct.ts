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

// 🔥 ATUALIZADO: agora RawRelatedProduct também carrega os banners ACF
interface RawRelatedProduct {
  id: string;
  name: string;
  price?: string;
  image?: RawImage;
  type?: "simple" | "variable" | "external" | "group";
  slug: string;
  productTags?: { nodes?: RawTag[] } | RawTag[];

  // Campos ACF conforme sua query ProductBySlug
  produto?: {
    personalizacaoProduto?: {
      bannerProdutoDesktop?: {
        node?: RawImage;
      };
      bannerProdutoMobile?: {
        node?: RawImage;
      };
    };
  };
}

// 🔥 ATUALIZADO: RawProduct agora também tem os banners ACF
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

  // Campos ACF conforme sua query ProductBySlug
  produto?: {
    personalizacaoProduto?: {
      bannerProdutoDesktop?: {
        node?: RawImage;
      };
      bannerProdutoMobile?: {
        node?: RawImage;
      };
    };
  };
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
  //    Agora também traz os banners desktop/mobile.
  const mapRelated = (
    input?: { nodes?: RawRelatedProduct[] } | RawRelatedProduct[]
  ): RelatedProductNode[] => {
    const nodesArray = Array.isArray(input) ? input : input?.nodes ?? [];

    return nodesArray.map((p) => {
      // Extrai banners do ACF, se existirem
      const bannerDesktopNode =
        p.produto?.personalizacaoProduto?.bannerProdutoDesktop?.node;
      const bannerMobileNode =
        p.produto?.personalizacaoProduto?.bannerProdutoMobile?.node;

      return {
        id: p.id,
        name: p.name,
        price: p.price ?? "0",
        slug: p.slug,
        image: p.image
          ? {
              sourceUrl: p.image.sourceUrl,
              altText: p.image.altText || p.name,
            }
          : undefined,
        type: p.type ?? "simple",
        tags: Array.isArray(p.productTags)
          ? (p.productTags as RawTag[]).map((t) => t.name)
          : p.productTags?.nodes?.map((t) => t.name) || [],
        customTag: "",
        visible: true,

        // 🔥 novos campos normalizados pro front
        bannerProdutoDesktop: bannerDesktopNode
          ? {
              sourceUrl: bannerDesktopNode.sourceUrl,
              altText: bannerDesktopNode.altText || p.name,
            }
          : undefined,
        bannerProdutoMobile: bannerMobileNode
          ? {
              sourceUrl: bannerMobileNode.sourceUrl,
              altText: bannerMobileNode.altText || p.name,
            }
          : undefined,
      };
    });
  };

  // 🔹 Corrige suporte às duas estruturas possíveis de tags
  const productTagsArray = Array.isArray(raw.productTags)
    ? raw.productTags
    : raw.productTags?.nodes ?? [];

  // 🔥 Extrai banners do produto principal
  const rawBannerDesktop =
    raw.produto?.personalizacaoProduto?.bannerProdutoDesktop?.node;
  const rawBannerMobile =
    raw.produto?.personalizacaoProduto?.bannerProdutoMobile?.node;

  const bannerProdutoDesktop: ImageNode | undefined = rawBannerDesktop
    ? {
        sourceUrl: rawBannerDesktop.sourceUrl,
        altText: rawBannerDesktop.altText || raw.name,
      }
    : undefined;

  const bannerProdutoMobile: ImageNode | undefined = rawBannerMobile
    ? {
        sourceUrl: rawBannerMobile.sourceUrl,
        altText: rawBannerMobile.altText || raw.name,
      }
    : undefined;

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

    // 🔥 Agora seu Product final também já carrega os banners normalizados
    bannerProdutoDesktop,
    bannerProdutoMobile,
  };
}
