// --- Tipos finais usados no frontend ---
export interface ImageNode {
  sourceUrl: string;
  altText: string;
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

export type RelatedProductNode = {
  id: string;
  name: string;
  price: string;
  image?: ImageNode;
  slug?: string;
  tags?: string[]; // múltiplas tags
  customTag?: string; // tag editável pelo front
  visible?: boolean; // checkbox de visibilidade
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
}

export type ProductCardProps = {
  produto: Product;
};

// --- Tipos crus (da API) ---
export interface RawRelatedProduct {
  id: string;
  name: string;
  price: string;
  image?: ImageNode;
  type: "simple" | "variable" | "external" | "group";
  slug: string;
  tag?: string;
}

export interface RawTag {
  name: string;
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
  /** 🔥 status vindo do GraphQL */
  status?: "publish" | "draft" | "pending" | "private" | "any" | string;
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
