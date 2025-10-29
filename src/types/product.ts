// --- Tipos finais usados no frontend ---

export interface ImageNode {
  sourceUrl: string;
  altText: string;
}

// 🔥 Estrutura de personalização de banner ACF já "normalizada" para o front
export interface ProductBannerImages {
  bannerProdutoDesktop?: ImageNode;
  bannerProdutoMobile?: ImageNode;
}

// 🔥 Bloco normalizado de imagemPrincipal pronto pro frontend
export interface ImagemPrincipal {
  imagemOuPrototipoA?: {
    mediaItemUrl: string;
  };
  imagemOuPrototipoB?: {
    mediaItemUrl: string;
  };
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

// RelatedProductNode é o produto “relacionado” já pronto pra card no front
export type RelatedProductNode = {
  id: string;
  name: string;
  price: string;
  image?: ImageNode;
  slug?: string;
  tags?: string[]; // múltiplas tags
  customTag?: string; // tag editável pelo front
  visible?: boolean; // checkbox de visibilidade

  // 🔥 novos banners vindos do ACF
  bannerProdutoDesktop?: ImageNode;
  bannerProdutoMobile?: ImageNode;

  // 🔥 novo bloco imagemPrincipal já mapeado/normalizado
  imagemPrincipal?: ImagemPrincipal;
};

// ✅ Adicionamos `status` aqui (para uso geral)
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

  /** 🔥 status do produto */
  status?: "publish" | "draft" | "pending" | "private" | "any" | string;

  /** 🔥 novos banners vindos do ACF */
  bannerProdutoDesktop?: ImageNode;
  bannerProdutoMobile?: ImageNode;

  /** 🔥 novo bloco imagemPrincipal já normalizado */
  imagemPrincipal?: ImagemPrincipal;
}

export type ProductCardProps = {
  produto: Product;
};

// --- Tipos crus (da API) ---
// Esses refletem o shape que vem direto do GraphQL, ANTES do mapeamento

export interface RawTag {
  name: string;
}

// 🔄 Versão CRUA de imagemPrincipal exatamente como vem do WPGraphQL/ACF
export interface RawImagemPrincipal {
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

// item de crossSell/upsell bruto
export interface RawRelatedProduct {
  id: string;
  name: string;
  price: string;
  image?: ImageNode;
  type: "simple" | "variable" | "external" | "group";
  slug: string;
  tag?: string;

  // 🔥 Campos crus exatamente como vêm do GraphQL ACF
  produto?: {
    personalizacaoProduto?: {
      bannerProdutoDesktop?: {
        node?: ImageNode;
      };
      bannerProdutoMobile?: {
        node?: ImageNode;
      };

      // 🔥 novo bloco imagemPrincipal bruto
      imagemPrincipal?: RawImagemPrincipal;
    };
  };
}

// produto bruto retornado na query ProductBySlug
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

  /** 🔥 status vindo do GraphQL */
  status?: "publish" | "draft" | "pending" | "private" | "any" | string;

  // 🔥 Campos crus de ACF direto do GraphQL para o produto principal
  produto?: {
    personalizacaoProduto?: {
      bannerProdutoDesktop?: {
        node?: ImageNode;
      };
      bannerProdutoMobile?: {
        node?: ImageNode;
      };

      // 🔥 novo bloco imagemPrincipal bruto
      imagemPrincipal?: RawImagemPrincipal;
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
