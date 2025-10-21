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
  customTag?: string; // ← tag editável pelo front
  visible?: boolean; // ← checkbox de visibilidade
};
