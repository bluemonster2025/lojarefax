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
  }[]; // ✅ categorias do produto
};
