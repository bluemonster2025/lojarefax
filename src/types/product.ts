// src/types/product.ts
// --- Tipos finais usados no frontend ---

export interface ImageNode {
  sourceUrl: string;
  altText: string | null;
}

export interface ProductBannerImages {
  bannerProdutoDesktop?: ImageNode;
  bannerProdutoMobile?: ImageNode;
}

export interface ImagemPrincipal {
  imagemOuPrototipoA?: { mediaItemUrl: string };
  imagemOuPrototipoB?: { mediaItemUrl: string };
  modeloProdutoA?: string;
  modeloProdutoB?: string;
}

export interface CategoryNode {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  parent?: { node: CategoryNode };
}

export interface VariationAttributeNode {
  attributeId: string;
  name: string;
  value: string;
}

export type VariationNode = {
  id: string;
  name: string;
  price: string;
  purchaseNote?: string;
  image?: ImageNode;
  attributes?: { nodes: VariationAttributeNode[] };
};

/** Especificações técnicas (normalizado p/ o front) */
export interface TechnicalSpecItem {
  titulo: string;
  descricao: string;
}
export interface TechnicalSpecs {
  tituloPrincipal?: string | null;
  subtituloPrincipal?: string | null;
  especificacoes?: TechnicalSpecItem[];
}

/** Banner das especificações (normalizado p/ o front) */
export interface SpecsBanner {
  produto?: string | null;
  titulo?: string | null;
  descricao?: string | null;
  imagem?: ImageNode | null; // no GraphQL vem só sourceUrl; altText = null no mapper
}

/** Mini-card para acessórios (agora com categorias e subtítulo) */
export type AccessoryProductNode = {
  id: string;
  slug: string;
  name: string;
  price?: string;
  image?: ImageNode;
  tags?: string[];
  productCategories?: { nodes: CategoryNode[] };
  mainCategoryName?: string | null;
  subtitulo?: string | null;
  tituloItensRelacionados?: string | null;
  subtituloItensRelacionados?: string | null;
};

/** ✅ Novo bloco: Mais Especificações (normalizado p/ o front) */
export interface MoreSpecsLine {
  tituloLinha: string;
  itensLinha: string[];
}

export interface MoreSpecsTab {
  titulo?: string | null;

  descricao1?: string | null;
  imagem1?: ImageNode | null;
  imagem2?: ImageNode | null;

  avisos?: string[] | null;

  linhas?: MoreSpecsLine[] | null;

  tituloDescricao2?: string | null;
  descricao2?: string | null;
  tituloDescricao3?: string | null;
  descricao3?: string | null;

  linkVideo?: string | null;
}

export interface MoreSpecs {
  titulo?: string | null;
  produto?: string | null;
  tab?: MoreSpecsTab[] | null;
}

// Produto relacionado pronto para card
export type RelatedProductNode = {
  id: string;
  name: string;
  price: string | null;
  image?: ImageNode;
  slug?: string;
  tags?: string[];
  customTag?: string;
  visible?: boolean;

  bannerProdutoDesktop?: ImageNode;
  bannerProdutoMobile?: ImageNode;
  imagemPrincipal?: ImagemPrincipal;
  subtitulo?: string | null;
  tituloItensRelacionados?: string | null;
  subtituloItensRelacionados?: string | null;

  acessoriosMontagem?: AccessoryProductNode[];
  acessoriosMontagemTitle?: string | null;
  acessoriosMontagemSubtitle?: string | null;
  acessoriosMontagemAvisos?: string[];
  productCategories?: { nodes: CategoryNode[] };

  especificacoesTecnicas?: TechnicalSpecs;
  bannerEspecificacoes?: SpecsBanner | null;

  maisEspecificacoes?: MoreSpecs | null;
};

export interface Product {
  id: string;
  name: string;
  description?: string;
  shortDescription?: string;
  price: string;
  purchaseNote?: string;
  slug?: string;
  uri?: string;
  image?: ImageNode;
  galleryImages?: { nodes: ImageNode[] };
  productCategories?: { nodes: CategoryNode[] };
  variations?: { nodes: VariationNode[] };
  attributes?: VariationAttributeNode[];
  crossSell?: { nodes: RelatedProductNode[] };
  upsell?: { nodes: RelatedProductNode[] };
  tag?: string;
  tags?: string[];

  status?: "publish" | "draft" | "pending" | "private" | "any" | string;

  bannerProdutoDesktop?: ImageNode;
  bannerProdutoMobile?: ImageNode;
  imagemPrincipal?: ImagemPrincipal;
  subtitulo?: string | null;

  acessoriosMontagem?: AccessoryProductNode[];
  acessoriosMontagemTitle?: string | null;
  acessoriosMontagemSubtitle?: string | null;
  acessoriosMontagemAvisos?: string[];

  tituloItensRelacionados?: string | null;
  subtituloItensRelacionados?: string | null;

  especificacoesTecnicas?: TechnicalSpecs;
  bannerEspecificacoes?: SpecsBanner | null;

  maisEspecificacoes?: MoreSpecs | null;
}

export type ProductCardProps = { produto: Product };

// --- Botão comprar ---
export type BuyButtonProps = {
  produto?: Product;
  title: string;
  icon?: string;
  variant?: "primary" | "secondary";
  fontWeight?: string;
  href?: string;
};

/* =====================================================================
   TIPOS "RAW" (GraphQL) — exportados para uso no mapper e nos routes
   ===================================================================== */

export interface RawImage {
  sourceUrl: string;
  altText?: string | null;
}

export interface RawCategory {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  parent?: { node: { id: string; name: string; slug: string } };
}

export interface RawVariationAttribute {
  attributeId: string;
  name: string;
  value: string;
}

export interface RawVariation {
  id: string;
  name: string;
  price?: string | null;
  purchaseNote?: string | null;
  image?: RawImage | null;
  attributes?: { nodes: RawVariationAttribute[] } | null;
}

export interface RawImagemPrincipal {
  imagemOuPrototipoA?: {
    node?: { mediaItemUrl?: string | null } | null;
  } | null;
  imagemOuPrototipoB?: {
    node?: { mediaItemUrl?: string | null } | null;
  } | null;
  modeloProdutoA?: string | null;
  modeloProdutoB?: string | null;
}

export interface RawTag {
  name: string;
}

export interface RawAviso {
  texto?: string | null;
}

export interface RawTechnicalSpecItem {
  titulo?: string | null;
  descricao?: string | null;
}
export interface RawTechnicalSpecs {
  tituloPrincipal?: string | null;
  subtituloPrincipal?: string | null;
  especificacoes?: RawTechnicalSpecItem[] | null;
}

export interface RawSpecsBanner {
  produto?: string | null;
  titulo?: string | null;
  descricao?: string | null;
  imagem?: { node?: { sourceUrl?: string | null } | null } | null;
}

/** ✅ Novo bloco: Mais Especificações (RAW do GraphQL) */
export interface RawMoreSpecsLineItem {
  item?: string | null;
}
export interface RawMoreSpecsLine {
  tituloLinha?: string | null;
  itensLinha?: RawMoreSpecsLineItem[] | null;
}
export interface RawMoreSpecsTab {
  titulo?: string | null;

  descricao1?: string | null;
  imagem1?: { node?: { sourceUrl?: string | null } | null } | null;
  imagem2?: { node?: { sourceUrl?: string | null } | null } | null;

  avisos?: RawAviso[] | null;
  linhas?: RawMoreSpecsLine[] | null;

  tituloDescricao2?: string | null;
  descricao2?: string | null;
  tituloDescricao3?: string | null;
  descricao3?: string | null;

  linkVideo?: string | null;
}
export interface RawMoreSpecs {
  titulo?: string | null;
  produto?: string | null;
  tab?: RawMoreSpecsTab[] | null;
}

export interface RawAccessoryProduct {
  __typename?:
    | "SimpleProduct"
    | "VariableProduct"
    | "ExternalProduct"
    | "GroupProduct"
    | string;
  id: string;
  slug: string;
  name: string;
  image?: RawImage | null;
  price?: string | null;
  productTags?: { nodes?: RawTag[] } | RawTag[] | null;
  productCategories?: { nodes?: RawCategory[] } | RawCategory[] | null;
  produto?: {
    personalizacaoProduto?: {
      subtitulo?: string | null;
      tituloItensRelacionados?: string | null;
      subtituloItensRelacionados?: string | null;
    } | null;
  } | null;
}

export interface RawRelatedProduct {
  id: string;
  slug: string;
  name: string;
  price?: string | null;
  image?: RawImage | null;
  productTags?: { nodes?: RawTag[] } | RawTag[] | null;
  productCategories?: { nodes?: RawCategory[] } | RawCategory[] | null;
  produto?: {
    personalizacaoProduto?: {
      bannerProdutoDesktop?: { node?: RawImage | null } | null;
      bannerProdutoMobile?: { node?: RawImage | null } | null;
      imagemPrincipal?: RawImagemPrincipal | null;
      subtitulo?: string | null;
      tituloItensRelacionados?: string | null;
      subtituloItensRelacionados?: string | null;
      acessoriosMontagem?: {
        title?: string | null;
        subtitle?: string | null;
        produtos?: { nodes?: RawAccessoryProduct[] | null } | null;
        avisos?: RawAviso[] | null;
      } | null;
      especificacoesTecnicas?: RawTechnicalSpecs | null;
      bannerEspecificacoes?: RawSpecsBanner | null;
      maisEspecificacoes?: RawMoreSpecs | null;
    } | null;
  } | null;
}

export interface RawProduct {
  id: string;
  name: string;
  description?: string | null;
  shortDescription?: string | null;
  purchaseNote?: string | null;
  slug?: string | null;
  price?: string | null;
  image?: RawImage | null;
  galleryImages?: { nodes?: RawImage[] | null } | null;
  variations?: { nodes?: RawVariation[] | null } | null;
  productCategories?: { nodes?: RawCategory[] } | RawCategory[] | null;
  productTags?: { nodes?: RawTag[] } | RawTag[] | null;

  crossSell?:
    | { nodes?: RawRelatedProduct[] | null }
    | RawRelatedProduct[]
    | null;
  upsell?: { nodes?: RawRelatedProduct[] | null } | RawRelatedProduct[] | null;
  related?: { nodes?: RawRelatedProduct[] | null } | RawRelatedProduct[] | null;

  status?: "publish" | "draft" | "pending" | "private" | string | null;

  produto?: {
    personalizacaoProduto?: {
      bannerProdutoDesktop?: { node?: RawImage | null } | null;
      bannerProdutoMobile?: { node?: RawImage | null } | null;
      imagemPrincipal?: RawImagemPrincipal | null;
      subtitulo?: string | null;
      tituloItensRelacionados?: string | null;
      subtituloItensRelacionados?: string | null;
      acessoriosMontagem?: {
        title?: string | null;
        subtitle?: string | null;
        produtos?: { nodes?: RawAccessoryProduct[] | null } | null;
        avisos?: RawAviso[] | null;
      } | null;
      especificacoesTecnicas?: RawTechnicalSpecs | null;
      bannerEspecificacoes?: RawSpecsBanner | null;
      maisEspecificacoes?: RawMoreSpecs | null;
    } | null;
  } | null;
}
