import {
  Product,
  ImageNode,
  VariationNode,
  RelatedProductNode,
  AccessoryProductNode,
  CategoryNode,
  // RAW imports vindos do types:
  RawProduct,
  RawImage,
  RawCategory,
  RawVariation,
  RawVariationAttribute,
  RawImagemPrincipal,
  RawTag,
  RawAviso,
  RawTechnicalSpecs,
  RawAccessoryProduct,
  RawRelatedProduct,
  // ✅ novo raw p/ o banner de especificações
  RawSpecsBanner,
} from "@/types/product";

/* =========================
   Helpers
   ========================= */

function normalizeCategoriesArray(
  input?: { nodes?: RawCategory[] } | RawCategory[] | null
): CategoryNode[] {
  const arr = Array.isArray(input) ? input : input?.nodes ?? [];
  const mapped = arr.map<CategoryNode>((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
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
  mapped.sort((a, b) => {
    if (!a.parentId && b.parentId) return -1;
    if (a.parentId && !b.parentId) return 1;
    return 0;
  });
  return mapped;
}

function mapImagemPrincipal(
  raw?: RawImagemPrincipal | null
): Product["imagemPrincipal"] {
  if (!raw) return undefined;
  const imgAUrl = raw.imagemOuPrototipoA?.node?.mediaItemUrl ?? undefined;
  const imgBUrl = raw.imagemOuPrototipoB?.node?.mediaItemUrl ?? undefined;
  if (!imgAUrl && !imgBUrl && !raw.modeloProdutoA && !raw.modeloProdutoB)
    return undefined;
  return {
    imagemOuPrototipoA: imgAUrl ? { mediaItemUrl: imgAUrl } : undefined,
    imagemOuPrototipoB: imgBUrl ? { mediaItemUrl: imgBUrl } : undefined,
    modeloProdutoA: raw.modeloProdutoA ?? undefined,
    modeloProdutoB: raw.modeloProdutoB ?? undefined,
  };
}

function mapAccessoryNode(
  n?: RawAccessoryProduct
): AccessoryProductNode | undefined {
  if (!n) return undefined;

  const tagsArr = Array.isArray(n.productTags)
    ? (n.productTags as RawTag[]).map((t) => t.name)
    : n.productTags?.nodes?.map((t) => t.name) || [];

  const normalizedCats = normalizeCategoriesArray(n.productCategories);
  const mainCat =
    normalizedCats.find((c) => !c.parentId) ?? normalizedCats[0] ?? null;

  const subtitulo = n.produto?.personalizacaoProduto?.subtitulo ?? null;
  const tituloItensRelacionados =
    n.produto?.personalizacaoProduto?.tituloItensRelacionados ?? null;
  const subtituloItensRelacionados =
    n.produto?.personalizacaoProduto?.subtituloItensRelacionados ?? null;

  return {
    id: n.id,
    slug: n.slug,
    name: n.name,
    price: n.price ?? undefined,
    image: n.image
      ? { sourceUrl: n.image.sourceUrl, altText: n.image.altText || n.name }
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

function mapAvisosToStrings(input?: RawAviso[] | null): string[] {
  if (!input || !Array.isArray(input)) return [];
  return input
    .map((a) => (typeof a === "string" ? a : a?.texto ?? ""))
    .map((s) => s.trim())
    .filter(Boolean);
}

function mapTechnicalSpecs(
  raw?: RawTechnicalSpecs | null
): Product["especificacoesTecnicas"] {
  if (!raw) return undefined;
  const tituloPrincipal = (raw.tituloPrincipal ?? "").trim();
  const subtituloPrincipal = (raw.subtituloPrincipal ?? "").trim();
  const especificacoes =
    raw.especificacoes
      ?.map((i) => ({
        titulo: (i?.titulo ?? "").trim(),
        descricao: (i?.descricao ?? "").trim(),
      }))
      .filter((i) => i.titulo || i.descricao) ?? [];
  if (!tituloPrincipal && !subtituloPrincipal && especificacoes.length === 0)
    return undefined;
  return {
    tituloPrincipal: tituloPrincipal || null,
    subtituloPrincipal: subtituloPrincipal || null,
    especificacoes,
  };
}

/** ✅ Atualizado: normaliza o bloco bannerEspecificacoes incluindo `produto` */
function mapSpecsBanner(
  raw?: RawSpecsBanner | null
): Product["bannerEspecificacoes"] {
  if (!raw) return undefined;
  const produto = (raw.produto ?? "").trim();
  const titulo = (raw.titulo ?? "").trim();
  const descricao = (raw.descricao ?? "").trim();
  const imgUrl = raw.imagem?.node?.sourceUrl ?? "";

  // agora considera `produto` na checagem de vazio
  if (!produto && !titulo && !descricao && !imgUrl) return undefined;

  return {
    produto: produto || null,
    titulo: titulo || null,
    descricao: descricao || null,
    imagem: imgUrl ? { sourceUrl: imgUrl, altText: null } : null,
  };
}

/* =========================
   Mapper principal
   ========================= */

export function mapProduct(raw: RawProduct): Product {
  const image: ImageNode | undefined = raw.image
    ? { sourceUrl: raw.image.sourceUrl, altText: raw.image.altText || raw.name }
    : undefined;

  const galleryNodes: RawImage[] = (
    Array.isArray(raw.galleryImages) ? [] : raw.galleryImages?.nodes ?? []
  ) as RawImage[];

  const galleryImages = galleryNodes.map((img) => ({
    sourceUrl: img.sourceUrl,
    altText: img.altText || raw.name,
  }));

  const productCategories = normalizeCategoriesArray(raw.productCategories);

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

  const acessoriosPrincipal: AccessoryProductNode[] =
    (raw.produto?.personalizacaoProduto?.acessoriosMontagem?.produtos?.nodes
      ?.map(mapAccessoryNode)
      .filter(Boolean) as AccessoryProductNode[]) || [];

  const acessoriosTitlePrincipal =
    raw.produto?.personalizacaoProduto?.acessoriosMontagem?.title ?? null;

  const acessoriosSubtitlePrincipal =
    raw.produto?.personalizacaoProduto?.acessoriosMontagem?.subtitle ?? null;

  const acessoriosAvisosPrincipal = mapAvisosToStrings(
    raw.produto?.personalizacaoProduto?.acessoriosMontagem?.avisos
  );

  const especificacoesTecnicasPrincipal = mapTechnicalSpecs(
    raw.produto?.personalizacaoProduto?.especificacoesTecnicas ?? null
  );

  // ✅ novo bloco
  const bannerEspecificacoesPrincipal = mapSpecsBanner(
    raw.produto?.personalizacaoProduto?.bannerEspecificacoes ?? null
  );

  const mapRelated = (
    input?: { nodes?: RawRelatedProduct[] | null } | RawRelatedProduct[] | null
  ): RelatedProductNode[] => {
    const nodesArray = Array.isArray(input) ? input : input?.nodes ?? [];
    return nodesArray.map((p) => {
      const bannerDesktopNode =
        p.produto?.personalizacaoProduto?.bannerProdutoDesktop?.node;
      const bannerMobileNode =
        p.produto?.personalizacaoProduto?.bannerProdutoMobile?.node;
      const imagemPrincipalRel = mapImagemPrincipal(
        p.produto?.personalizacaoProduto?.imagemPrincipal ?? null
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

      const acessoriosTitleRel =
        p.produto?.personalizacaoProduto?.acessoriosMontagem?.title ?? null;
      const acessoriosSubtitleRel =
        p.produto?.personalizacaoProduto?.acessoriosMontagem?.subtitle ?? null;
      const acessoriosAvisosRel = mapAvisosToStrings(
        p.produto?.personalizacaoProduto?.acessoriosMontagem?.avisos
      );

      const especificacoesTecnicasRel = mapTechnicalSpecs(
        p.produto?.personalizacaoProduto?.especificacoesTecnicas ?? null
      );

      // ✅ inclui também nos relacionados
      const bannerEspecificacoesRel = mapSpecsBanner(
        p.produto?.personalizacaoProduto?.bannerEspecificacoes ?? null
      );

      const relatedCategories = normalizeCategoriesArray(p.productCategories);

      return {
        id: p.id,
        name: p.name,
        price: p.price ?? "0",
        slug: p.slug,
        image: p.image
          ? { sourceUrl: p.image.sourceUrl, altText: p.image.altText || p.name }
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
        acessoriosMontagemSubtitle: acessoriosSubtitleRel,
        acessoriosMontagemAvisos: acessoriosAvisosRel,
        productCategories: relatedCategories.length
          ? { nodes: relatedCategories }
          : undefined,
        especificacoesTecnicas: especificacoesTecnicasRel,
        // ✅ incluído
        bannerEspecificacoes: bannerEspecificacoesRel ?? undefined,
      };
    });
  };

  const productTagsArray: RawTag[] = Array.isArray(raw.productTags)
    ? (raw.productTags as RawTag[])
    : raw.productTags?.nodes ?? [];

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

  const imagemPrincipal = mapImagemPrincipal(
    raw.produto?.personalizacaoProduto?.imagemPrincipal ?? null
  );
  const subtituloPrincipal =
    raw.produto?.personalizacaoProduto?.subtitulo ?? null;
  const tituloItensRelacionadosPrincipal =
    raw.produto?.personalizacaoProduto?.tituloItensRelacionados ?? null;
  const subtituloItensRelacionadosPrincipal =
    raw.produto?.personalizacaoProduto?.subtituloItensRelacionados ?? null;

  return {
    id: raw.id,
    name: raw.name,
    description: raw.description ?? "",
    shortDescription: raw.shortDescription ?? "",
    price: raw.price ?? "0",
    purchaseNote: raw.purchaseNote ?? "",
    slug: raw.slug || raw.id,
    image,
    galleryImages: { nodes: galleryImages },

    productCategories: productCategories.length
      ? { nodes: productCategories }
      : undefined,
    variations: variations ? { nodes: variations } : undefined,

    crossSell: { nodes: mapRelated(raw.crossSell) },
    upsell: { nodes: mapRelated(raw.upsell) },

    tags: productTagsArray.map((t) => t.name),
    tag: productTagsArray[0]?.name || "",

    status: (raw.status as Product["status"]) || "publish",

    bannerProdutoDesktop,
    bannerProdutoMobile,

    imagemPrincipal,
    subtitulo: subtituloPrincipal,

    acessoriosMontagem: acessoriosPrincipal,
    acessoriosMontagemTitle: acessoriosTitlePrincipal,
    acessoriosMontagemSubtitle: acessoriosSubtitlePrincipal,
    acessoriosMontagemAvisos: acessoriosAvisosPrincipal,

    tituloItensRelacionados: tituloItensRelacionadosPrincipal,
    subtituloItensRelacionados: subtituloItensRelacionadosPrincipal,

    especificacoesTecnicas: especificacoesTecnicasPrincipal,

    // ✅ incluído no produto (agora com `produto`)
    bannerEspecificacoes: bannerEspecificacoesPrincipal,
  };
}
