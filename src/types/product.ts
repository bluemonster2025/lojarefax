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

/** ✅ Mini-card para acessórios (agora com categorias e subtítulo) */
export type AccessoryProductNode = {
  id: string;
  slug: string;
  name: string;
  price?: string;
  image?: ImageNode;
  tags?: string[];

  /** 🔥 categorias completas do acessório (vem do GraphQL) */
  productCategories?: { nodes: CategoryNode[] };

  /** 🔥 conveniência para render: nome da categoria principal (parentId === null) */
  mainCategoryName?: string | null;

  /** 🔥 subtítulo do acessório (ACF: produto.personalizacaoProduto.subtitulo) */
  subtitulo?: string | null;

  tituloItensRelacionados?: string | null;
  subtituloItensRelacionados?: string | null;
};

// RelatedProductNode é o produto “relacionado” já pronto pra card no front
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

  /** acessórios do relacionado (normalizado) */
  acessoriosMontagem?: AccessoryProductNode[];

  /** título/subtítulo do grupo de acessórios no relacionado */
  acessoriosMontagemTitle?: string | null;
  acessoriosMontagemSubtitle?: string | null;

  /** 🆕 avisos normalizados (apenas textos) */
  acessoriosMontagemAvisos?: string[];

  productCategories?: { nodes: CategoryNode[] };
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

  /** acessórios do produto principal (normalizado) */
  acessoriosMontagem?: AccessoryProductNode[];

  /** título/subtítulo do grupo de acessórios (ACF) */
  acessoriosMontagemTitle?: string | null;
  acessoriosMontagemSubtitle?: string | null;

  /** 🆕 avisos normalizados (apenas textos) */
  acessoriosMontagemAvisos?: string[];

  tituloItensRelacionados?: string | null;
  subtituloItensRelacionados?: string | null;
}

export type ProductCardProps = {
  produto: Product;
};

// --- Tipos crus (da API) ---

export interface RawTag {
  name: string;
}

export interface RawImagemPrincipal {
  imagemOuPrototipoA?: { node?: { mediaItemUrl?: string } };
  imagemOuPrototipoB?: { node?: { mediaItemUrl?: string } };
  modeloProdutoA?: string;
  modeloProdutoB?: string;
}

/** 🆕 Item cru de aviso (repetidor) */
export interface RawAviso {
  texto?: string | null;
}

/** ✅ Nó cru dos acessórios agora com categorias e subtítulo ACF */
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
  image?: ImageNode;
  price?: string;
  productTags?: { nodes?: RawTag[] };

  /** 🔥 categorias cruas do acessório */
  productCategories?: { nodes?: CategoryNode[] };

  /** 🔥 ACF do acessório (apenas subtítulo é necessário) */
  produto?: {
    personalizacaoProduto?: {
      subtitulo?: string | null;
      tituloItensRelacionados?: string | null;
      subtituloItensRelacionados?: string | null;
    };
  };
}

export interface RawRelatedProduct {
  id: string;
  name: string;
  price: string;
  image?: ImageNode;
  type: "simple" | "variable" | "external" | "group";
  slug: string;
  tag?: string;
  productCategories?: { nodes?: CategoryNode[] };
  produto?: {
    personalizacaoProduto?: {
      bannerProdutoDesktop?: { node?: ImageNode };
      bannerProdutoMobile?: { node?: ImageNode };
      imagemPrincipal?: RawImagemPrincipal;
      subtitulo?: string | null;
      tituloItensRelacionados?: string | null;
      subtituloItensRelacionados?: string | null;

      /** 🆕 grupo de acessórios com avisos */
      acessoriosMontagem?: {
        title?: string | null;
        subtitle?: string | null;
        produtos?: { nodes?: RawAccessoryProduct[] };
        avisos?: RawAviso[]; // <- novo
      };
    };
  };
}

export interface RawProduct {
  id: string;
  name: string;
  description?: string;
  shortDescription?: string;
  purchaseNote?: string;
  slug?: string;
  price?: string;
  image?: ImageNode;
  galleryImages?: { nodes: ImageNode[] };
  variations?: { nodes: VariationNode[] };
  productCategories?: { nodes: CategoryNode[] };
  crossSell?: { nodes: RawRelatedProduct[] };
  upsell?: { nodes: RawRelatedProduct[] };
  related?: { nodes: RawRelatedProduct[] };
  productTags?: { nodes: RawTag[] };

  status?: "publish" | "draft" | "pending" | "private" | "any" | string;

  produto?: {
    personalizacaoProduto?: {
      bannerProdutoDesktop?: { node?: ImageNode };
      bannerProdutoMobile?: { node?: ImageNode };
      imagemPrincipal?: RawImagemPrincipal;
      subtitulo?: string | null;
      tituloItensRelacionados?: string | null;
      subtituloItensRelacionados?: string | null;

      /** 🆕 grupo de acessórios com avisos */
      acessoriosMontagem?: {
        title?: string | null;
        subtitle?: string | null;
        produtos?: { nodes?: RawAccessoryProduct[] };
        avisos?: RawAviso[]; // <- novo
      };
    };
  };
}

// --- Botão comprar ---
export type BuyButtonProps = {
  produto?: Product;
  title: string;
  icon?: string;
  variant?: "primary" | "secondary";
  fontWeight?: string;
  href?: string;
};
