import {
  Product,
  ImageNode,
  VariationNode,
  RelatedProductNode,
  RawTag,
} from "@/types/product";

// ----------------------
// Tipos intermediários crus vindos do GraphQL
// (espelham o shape que chega na query)
// ----------------------

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

// 🔥 Novo: bloco cru de imagemPrincipal exatamente como vem do WPGraphQL/ACF
interface RawImagemPrincipal {
  imagemOuPrototipoA?: {
    node?: {
      mediaItemUrl?: string;
    };
  };
  imagemOuPrototipoB?: {
    node?: {
      mediaItemUrl?: string;
    };
  };
  modeloProdutoA?: string;
  modeloProdutoB?: string;
}

// 🔥 ATUALIZADO: agora RawRelatedProduct também carrega banners ACF, imagemPrincipal e subtitulo
interface RawRelatedProduct {
  id: string;
  name: string;
  price?: string;
  image?: RawImage;
  type?: "simple" | "variable" | "external" | "group";
  slug: string;
  productTags?: { nodes?: RawTag[] } | RawTag[];

  produto?: {
    personalizacaoProduto?: {
      bannerProdutoDesktop?: {
        node?: RawImage;
      };
      bannerProdutoMobile?: {
        node?: RawImage;
      };
      imagemPrincipal?: RawImagemPrincipal;
      subtitulo?: string | null; // 👈 novo
    };
  };
}

// 🔥 ATUALIZADO: RawProduct agora também tem banners ACF, imagemPrincipal e subtitulo
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

  produto?: {
    personalizacaoProduto?: {
      bannerProdutoDesktop?: {
        node?: RawImage;
      };
      bannerProdutoMobile?: {
        node?: RawImage;
      };
      imagemPrincipal?: RawImagemPrincipal;
      subtitulo?: string | null; // 👈 novo
    };
  };
}

// ----------------------
// Helpers internos
// ----------------------

// normaliza imagemPrincipal cru -> objeto pronto pro front
function mapImagemPrincipal(
  rawImagem?: RawImagemPrincipal
): Product["imagemPrincipal"] {
  if (!rawImagem) return undefined;

  const imgAUrl = rawImagem.imagemOuPrototipoA?.node?.mediaItemUrl ?? undefined;
  const imgBUrl = rawImagem.imagemOuPrototipoB?.node?.mediaItemUrl ?? undefined;

  // se absolutamente nada veio, não retorna objeto vazio
  if (
    !imgAUrl &&
    !imgBUrl &&
    !rawImagem.modeloProdutoA &&
    !rawImagem.modeloProdutoB
  ) {
    return undefined;
  }

  return {
    imagemOuPrototipoA: imgAUrl ? { mediaItemUrl: imgAUrl } : undefined,
    imagemOuPrototipoB: imgBUrl ? { mediaItemUrl: imgBUrl } : undefined,
    modeloProdutoA: rawImagem.modeloProdutoA,
    modeloProdutoB: rawImagem.modeloProdutoB,
  };
}

// ----------------------
// Função principal
// ----------------------

export function mapProduct(raw: RawProduct): Product {
  // imagem principal do produto
  const image: ImageNode | undefined = raw.image
    ? { sourceUrl: raw.image.sourceUrl, altText: raw.image.altText || raw.name }
    : undefined;

  // galeria
  const galleryImages = raw.galleryImages
    ? (Array.isArray(raw.galleryImages)
        ? raw.galleryImages
        : raw.galleryImages.nodes || []
      ).map((img) => ({
        sourceUrl: img.sourceUrl,
        altText: img.altText || raw.name,
      }))
    : [];

  // categorias
  const productCategoriesArray = Array.isArray(raw.productCategories)
    ? raw.productCategories
    : raw.productCategories?.nodes ?? [];

  // 🔹 Mapeia e ordena categorias (categoria sem parentId primeiro)
  const productCategories = productCategoriesArray
    .map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      parentId: cat.parentId ?? cat.parent?.node?.id ?? null, // tenta inferir mesmo se só existir parent.node
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

  // variações
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
  //    Agora também traz:
  //    - banners desktop/mobile
  //    - imagemPrincipal normalizada
  //    - subtitulo
  const mapRelated = (
    input?: { nodes?: RawRelatedProduct[] } | RawRelatedProduct[]
  ): RelatedProductNode[] => {
    const nodesArray = Array.isArray(input) ? input : input?.nodes ?? [];

    return nodesArray.map((p) => {
      // Extrai banners crus
      const bannerDesktopNode =
        p.produto?.personalizacaoProduto?.bannerProdutoDesktop?.node;
      const bannerMobileNode =
        p.produto?.personalizacaoProduto?.bannerProdutoMobile?.node;

      // Extrai imagemPrincipal cru e normaliza
      const rawImagemPrincipalRel =
        p.produto?.personalizacaoProduto?.imagemPrincipal;
      const imagemPrincipal = mapImagemPrincipal(rawImagemPrincipalRel);

      // Extrai subtítulo
      const subtituloRel = p.produto?.personalizacaoProduto?.subtitulo ?? null;

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

        imagemPrincipal, // <-- normalizado

        // 🔥 NOVO: subtítulo normalizado
        subtitulo: subtituloRel,
      };
    });
  };

  // 🔹 Corrige suporte às duas estruturas possíveis de tags no produto principal
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

  // 🔥 Extrai e normaliza imagemPrincipal do produto principal
  const rawImagemPrincipal =
    raw.produto?.personalizacaoProduto?.imagemPrincipal;
  const imagemPrincipal = mapImagemPrincipal(rawImagemPrincipal);

  // 🔥 Extrai subtítulo do produto principal
  const subtituloPrincipal =
    raw.produto?.personalizacaoProduto?.subtitulo ?? null;

  // ----------------------
  // retorna o Product final já no formato do front
  // ----------------------
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

    // 🔥 banners normalizados
    bannerProdutoDesktop,
    bannerProdutoMobile,

    // 🔥 imagemPrincipal normalizada
    imagemPrincipal,

    // 🔥 NOVO: subtítulo normalizado
    subtitulo: subtituloPrincipal,
  };
}
