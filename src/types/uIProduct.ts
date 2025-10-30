export type UIProduct = {
  id: string;
  name: string;
  uri?: string;
  image: {
    sourceUrl: string;
    altText: string;
  };
  price: string;
  tag?: string;
  productsTag?: string[]; // todas as tags
  productCategories?: {
    id: string;
    name: string;
    slug: string;
    parentId: string;
  }[]; // ✅ categorias do produto

  /** 🔥 NOVO: subtítulo normalizado do ACF */
  subtitulo?: string | null;
};
