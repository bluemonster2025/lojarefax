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
  RawSpecsBanner,
  // ✅ novos tipos
  MoreSpecs,
  RawMoreSpecs,
  // ⬇️ necessários para tipar as abas/linhas sem null
  MoreSpecsTab,
  MoreSpecsLine,
} from "@/types/product";

/* =========================
   Helpers
   ========================= */

function isDefined<T>(v: T | null | undefined): v is T {
  return v != null;
}

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
  // categorias raiz primeiro
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

  if (!produto && !titulo && !descricao && !imgUrl) return undefined;

  return {
    produto: produto || null,
    titulo: titulo || null,
    descricao: descricao || null,
    imagem: imgUrl ? { sourceUrl: imgUrl, altText: null } : null,
  };
}

/** ✅ NOVO: normaliza o bloco maisEspecificacoes sem nulls nos arrays */
function mapMoreSpecs(raw?: RawMoreSpecs | null): MoreSpecs | undefined {
  if (!raw) return undefined;

  const titulo = (raw.titulo ?? "").trim();
  const produto = (raw.produto ?? "").trim();

  const tabs: MoreSpecsTab[] = (raw.tab ?? [])
    .map<MoreSpecsTab | null>((t) => {
      const tituloTab = (t?.titulo ?? "").trim();
      const descricao1 = (t?.descricao1 ?? "").trim();

      const img1Url = t?.imagem1?.node?.sourceUrl ?? "";
      const img2Url = t?.imagem2?.node?.sourceUrl ?? "";

      const avisos = mapAvisosToStrings(t?.avisos);

      const linhas: MoreSpecsLine[] | null =
        t?.linhas
          ?.map<MoreSpecsLine | null>((l) => {
            const tituloLinha = (l?.tituloLinha ?? "").trim();
            const itensLinha =
              l?.itensLinha
                ?.map((i) => (i?.item ?? "").trim())
                .filter(Boolean) ?? [];
            if (!tituloLinha && itensLinha.length === 0) return null;
            return {
              tituloLinha,
              itensLinha,
            };
          })
          .filter(isDefined) ?? null;

      const tituloDescricao2 = (t?.tituloDescricao2 ?? "").trim();
      const descricao2 = (t?.descricao2 ?? "").trim();
      const tituloDescricao3 = (t?.tituloDescricao3 ?? "").trim();
      const descricao3 = (t?.descricao3 ?? "").trim();
      const linkVideo = (t?.linkVideo ?? "").trim();

      const hasContent =
        tituloTab ||
        descricao1 ||
        img1Url ||
        img2Url ||
        (avisos && avisos.length > 0) ||
        (linhas && linhas.length > 0) ||
        tituloDescricao2 ||
        descricao2 ||
        tituloDescricao3 ||
        descricao3 ||
        linkVideo;

      if (!hasContent) return null;

      return {
        titulo: tituloTab || null,
        descricao1: descricao1 || null,
        imagem1: img1Url ? { sourceUrl: img1Url, altText: null } : null,
        imagem2: img2Url ? { sourceUrl: img2Url, altText: null } : null,
        avisos: avisos && avisos.length ? avisos : null,
        linhas,
        tituloDescricao2: tituloDescricao2 || null,
        descricao2: descricao2 || null,
        tituloDescricao3: tituloDescricao3 || null,
        descricao3: descricao3 || null,
        linkVideo: linkVideo || null,
      };
    })
    .filter(isDefined);

  if (!titulo && !produto && tabs.length === 0) return undefined;

  return {
    titulo: titulo || null,
    produto: produto || null,
    tab: tabs,
  };
}

/* =========================
   Mapper principal
   ========================= */

export function mapProduct(raw: RawProduct): Product {
  const image: ImageNode | undefined = raw.image
    ? { sourceUrl: raw.image.sourceUrl, altText: raw.image.altText || raw.name }
    : undefined;

  const galleryNodes: RawImage[] = raw.galleryImages?.nodes ?? [];
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
      .filter(isDefined) as AccessoryProductNode[]) || [];

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

  // ✅ banner especificações
  const bannerEspecificacoesPrincipal = mapSpecsBanner(
    raw.produto?.personalizacaoProduto?.bannerEspecificacoes ?? null
  );

  // ✅ mais especificações
  const maisEspecificacoesPrincipal = mapMoreSpecs(
    raw.produto?.personalizacaoProduto?.maisEspecificacoes ?? null
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
          .filter(isDefined) as AccessoryProductNode[]) || [];

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

      const bannerEspecificacoesRel = mapSpecsBanner(
        p.produto?.personalizacaoProduto?.bannerEspecificacoes ?? null
      );

      // ✅ mais especificações nos relacionados (opcional)
      const maisEspecificacoesRel = mapMoreSpecs(
        p.produto?.personalizacaoProduto?.maisEspecificacoes ?? null
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
        bannerEspecificacoes: bannerEspecificacoesRel ?? undefined,
        maisEspecificacoes: maisEspecificacoesRel ?? undefined,
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

    // ✅ incluído no produto
    bannerEspecificacoes: bannerEspecificacoesPrincipal,

    // ✅ novo bloco no produto
    maisEspecificacoes: maisEspecificacoesPrincipal,
  };
}
