import {
  Product,
  ImageNode,
  VariationNode,
  RelatedProductNode,
  RawTag,
  AccessoryProductNode,
  CategoryNode,
} from "@/types/product";

/* =========================
   Tipos crus (locais)
   ========================= */

interface RawImage {
  sourceUrl: string;
  altText?: string | null;
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

interface RawImagemPrincipal {
  imagemOuPrototipoA?: { node?: { mediaItemUrl?: string } };
  imagemOuPrototipoB?: { node?: { mediaItemUrl?: string } };
  modeloProdutoA?: string;
  modeloProdutoB?: string;
}

interface RawAccessoryProduct {
  __typename?:
    | "SimpleProduct"
    | "VariableProduct"
    | "ExternalProduct"
    | "GroupProduct"
    | string;
  id: string;
  slug: string;
  name: string;
  image?: RawImage;
  price?: string;
  productTags?: { nodes?: RawTag[] } | RawTag[];
}

/** Estende acessório com campos que vêm da query mas não estão no tipo global */
type LocalRawAccessoryProduct = RawAccessoryProduct & {
  productCategories?: { nodes?: RawCategory[] };
  produto?: {
    personalizacaoProduto?: {
      subtitulo?: string | null;
      tituloItensRelacionados?: string | null;
      subtituloItensRelacionados?: string | null;
    };
  };
};

interface RawRelatedProduct {
  id: string;
  name: string;
  price?: string;
  image?: RawImage;
  type?: "simple" | "variable" | "external" | "group";
  slug: string;
  productTags?: { nodes?: RawTag[] } | RawTag[];

  /** 🔥 categorias cruas do relacionado (precisávamos disso) */
  productCategories?: { nodes?: RawCategory[] } | RawCategory[];

  produto?: {
    personalizacaoProduto?: {
      bannerProdutoDesktop?: { node?: RawImage };
      bannerProdutoMobile?: { node?: RawImage };
      imagemPrincipal?: RawImagemPrincipal;
      subtitulo?: string | null;

      tituloItensRelacionados?: string | null;
      subtituloItensRelacionados?: string | null;

      acessoriosMontagem?: {
        title?: string | null;
        subtitle?: string | null; // ✅ NOVO
        produtos?: { nodes?: RawAccessoryProduct[] };
      };
    };
  };
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

  produto?: {
    personalizacaoProduto?: {
      bannerProdutoDesktop?: { node?: RawImage };
      bannerProdutoMobile?: { node?: RawImage };
      imagemPrincipal?: RawImagemPrincipal;
      subtitulo?: string | null;

      tituloItensRelacionados?: string | null;
      subtituloItensRelacionados?: string | null;

      acessoriosMontagem?: {
        title?: string | null;
        subtitle?: string | null; // ✅ NOVO
        produtos?: { nodes?: RawAccessoryProduct[] };
      };
    };
  };
}

/* =========================
   Helpers
   ========================= */

function normalizeCategoriesArray(
  input?: { nodes?: RawCategory[] } | RawCategory[]
): CategoryNode[] {
  const arr = Array.isArray(input) ? input : input?.nodes ?? [];

  const mapped = arr.map<CategoryNode>((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    // preserva parentId; se não vier, tenta parent.node.id
    parentId: cat.parentId ?? cat.parent?.node?.id ?? null,
    parent: cat.parent
      ? {
          node: {
            id: cat.parent.node.id,
            name: cat.parent.node.name,
            slug: cat.parent.node.slug,
          },
        }
      : undefined,
  }));

  // raiz primeiro
  mapped.sort((a, b) => {
    if (!a.parentId && b.parentId) return -1;
    if (a.parentId && !b.parentId) return 1;
    return 0;
  });

  return mapped;
}

function mapImagemPrincipal(
  rawImagem?: RawImagemPrincipal
): Product["imagemPrincipal"] {
  if (!rawImagem) return undefined;

  const imgAUrl = rawImagem.imagemOuPrototipoA?.node?.mediaItemUrl ?? undefined;
  const imgBUrl = rawImagem.imagemOuPrototipoB?.node?.mediaItemUrl ?? undefined;

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

/** Acessório: normaliza tags, categorias, mainCategoryName e ACF */
function mapAccessoryNode(
  n?: RawAccessoryProduct
): AccessoryProductNode | undefined {
  if (!n) return undefined;

  const nx = n as LocalRawAccessoryProduct;

  // tags
  const tagsArr = Array.isArray(nx.productTags)
    ? (nx.productTags as RawTag[]).map((t) => t.name)
    : nx.productTags?.nodes?.map((t) => t.name) || [];

  // categorias
  const normalizedCats = normalizeCategoriesArray(nx.productCategories);

  // categoria principal (sem parentId) ou primeira
  const mainCat =
    normalizedCats.find((c) => !c.parentId) ?? normalizedCats[0] ?? null;

  // ACFs
  const subtitulo = nx.produto?.personalizacaoProduto?.subtitulo ?? null;
  const tituloItensRelacionados =
    nx.produto?.personalizacaoProduto?.tituloItensRelacionados ?? null;
  const subtituloItensRelacionados =
    nx.produto?.personalizacaoProduto?.subtituloItensRelacionados ?? null;

  return {
    id: nx.id,
    slug: nx.slug,
    name: nx.name,
    price: nx.price,
    image: nx.image
      ? { sourceUrl: nx.image.sourceUrl, altText: nx.image.altText || nx.name }
      : undefined,
    tags: tagsArr,
    productCategories: normalizedCats.length
      ? { nodes: normalizedCats }
      : undefined,
    mainCategoryName: mainCat ? mainCat.name : null,
    subtitulo,
    tituloItensRelacionados,
    subtituloItensRelacionados,
  };
}

/* =========================
   Mapper principal
   ========================= */

export function mapProduct(raw: RawProduct): Product {
  // imagem principal
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

  // categorias (produto principal)
  const productCategories = normalizeCategoriesArray(raw.productCategories);

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

  // acessórios do produto principal
  const acessoriosPrincipal: AccessoryProductNode[] =
    (raw.produto?.personalizacaoProduto?.acessoriosMontagem?.produtos?.nodes
      ?.map(mapAccessoryNode)
      .filter(Boolean) as AccessoryProductNode[]) || [];

  const acessoriosTitlePrincipal: string | null =
    raw.produto?.personalizacaoProduto?.acessoriosMontagem?.title ?? null;

  const acessoriosSubtitlePrincipal: string | null =
    raw.produto?.personalizacaoProduto?.acessoriosMontagem?.subtitle ?? null; // ✅ NOVO

  // relacionados (crossSell/upsell)
  const mapRelated = (
    input?: { nodes?: RawRelatedProduct[] } | RawRelatedProduct[]
  ): RelatedProductNode[] => {
    const nodesArray = Array.isArray(input) ? input : input?.nodes ?? [];

    return nodesArray.map((p) => {
      const bannerDesktopNode =
        p.produto?.personalizacaoProduto?.bannerProdutoDesktop?.node;
      const bannerMobileNode =
        p.produto?.personalizacaoProduto?.bannerProdutoMobile?.node;

      const imagemPrincipalRel = mapImagemPrincipal(
        p.produto?.personalizacaoProduto?.imagemPrincipal
      );

      const subtituloRel = p.produto?.personalizacaoProduto?.subtitulo ?? null;
      const tituloItensRel =
        p.produto?.personalizacaoProduto?.tituloItensRelacionados ?? null;
      const subtituloItensRel =
        p.produto?.personalizacaoProduto?.subtituloItensRelacionados ?? null;

      const acessoriosRel: AccessoryProductNode[] =
        (p.produto?.personalizacaoProduto?.acessoriosMontagem?.produtos?.nodes
          ?.map(mapAccessoryNode)
          .filter(Boolean) as AccessoryProductNode[]) || [];

      const acessoriosTitleRel: string | null =
        p.produto?.personalizacaoProduto?.acessoriosMontagem?.title ?? null;

      const acessoriosSubtitleRel: string | null =
        p.produto?.personalizacaoProduto?.acessoriosMontagem?.subtitle ?? null; // ✅ NOVO

      // 🔥 categorias do relacionado
      const relatedCategories: CategoryNode[] = normalizeCategoriesArray(
        p.productCategories
      );

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

        imagemPrincipal: imagemPrincipalRel,
        subtitulo: subtituloRel,

        tituloItensRelacionados: tituloItensRel,
        subtituloItensRelacionados: subtituloItensRel,

        acessoriosMontagem: acessoriosRel,
        acessoriosMontagemTitle: acessoriosTitleRel,
        acessoriosMontagemSubtitle: acessoriosSubtitleRel, // ✅ NOVO

        /** ✅ agora o card de relacionado tem categorias */
        productCategories: relatedCategories.length
          ? { nodes: relatedCategories }
          : undefined,
      };
    });
  };

  // tags do produto principal
  const productTagsArray = Array.isArray(raw.productTags)
    ? raw.productTags
    : raw.productTags?.nodes ?? [];

  // banners principal
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

  // imagemPrincipal + subtítulo do produto principal
  const imagemPrincipal = mapImagemPrincipal(
    raw.produto?.personalizacaoProduto?.imagemPrincipal
  );
  const subtituloPrincipal =
    raw.produto?.personalizacaoProduto?.subtitulo ?? null;

  const tituloItensRelacionadosPrincipal =
    raw.produto?.personalizacaoProduto?.tituloItensRelacionados ?? null;
  const subtituloItensRelacionadosPrincipal =
    raw.produto?.personalizacaoProduto?.subtituloItensRelacionados ?? null;

  /* =========================
     Retorno final
     ========================= */
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

    bannerProdutoDesktop,
    bannerProdutoMobile,

    imagemPrincipal,
    subtitulo: subtituloPrincipal,

    acessoriosMontagem: acessoriosPrincipal,
    acessoriosMontagemTitle: acessoriosTitlePrincipal,
    acessoriosMontagemSubtitle: acessoriosSubtitlePrincipal, // ✅ NOVO

    tituloItensRelacionados: tituloItensRelacionadosPrincipal,
    subtituloItensRelacionados: subtituloItensRelacionadosPrincipal,
  };
}
