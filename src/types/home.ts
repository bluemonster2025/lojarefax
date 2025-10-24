export type Banner = {
  desktop?: {
    databaseId?: number;
    src: string;
    mediaItemUrl: string;
    alt: string;
  };
  mobile?: {
    databaseId?: number;
    src: string;
    mediaItemUrl: string;
    alt: string;
  };
};

export type SessaoProduct = {
  id: string;
  title: string;
  uri?: string;
  price?: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText: string | null;
    } | null;
  };
  productTags?: { nodes: { name: string }[] };
  customTag?: string; // ✨ campo que você pode editar
  visible?: boolean; // ✨ se o produto está visível ou não
};

export type ProductSession = {
  title?: string;
  featuredProducts?: SessaoProduct[];
};

export type Sessao4 = {
  image?: { src: string; alt?: string; databaseId?: number };
  title?: string;
  text?: string;
  linkButton?: string;
};

export type RawHome = {
  databaseId: number;
  slug: string;
  title: string;
  homeHero?: {
    heroImage?: {
      node: {
        id: number;
        sourceUrl: string;
        mediaItemUrl: string;
        altText: string | null;
      };
    } | null;
    heroImageMobile?: {
      node: {
        id: number;
        sourceUrl: string;
        mediaItemUrl: string;
        altText: string | null;
      };
    } | null;
  } | null;
  homeSessao2?: {
    titleSessao2?: string | null;
    featuredProducts2?: { nodes: SessaoProduct[] } | null;
    featuredTags2?: string | null;
    visibleTag2?: string | null; // 🔹 atualizado
  } | null;
  homeSessao3?: {
    titleSessao3?: string | null;
    featuredProducts3?: { nodes: SessaoProduct[] } | null;
    featuredTags3?: string | null;
    visibleTag3?: string | null; // 🔹 atualizado
  } | null;
  homeSessao4?: {
    imageSessao4?: {
      node: { sourceUrl: string; altText: string | null };
    } | null;
    titleSessao4?: string | null;
    textSessao4?: string | null;
    linkButtonSessao4?: string | null;
  } | null;
  homeSessao5?: {
    featuredProducts5?: { nodes: SessaoProduct[] } | null;
    featuredTags5?: string | null;
    visibleTag5?: string | null; // 🔹 atualizado
  } | null;
  homeBanner?: {
    homeBannerDesktop?: {
      node: { id: number; sourceUrl: string; altText: string | null };
    } | null;
    homeBannerMobile?: {
      node: { id: number; sourceUrl: string; altText: string | null };
    } | null;
  } | null;
  homeSessao7?: {
    titleSessao7?: string | null;
    featuredProducts7?: { nodes: SessaoProduct[] } | null;
    featuredTags7?: string | null;
    visibleTag7?: string | null; // 🔹 atualizado
  } | null;
};

export type PageHome = {
  databaseId: number;
  slug: string;
  title: string;
  hero?: Banner;
  sessao2?: ProductSession;
  sessao3?: ProductSession;
  sessao4?: Sessao4;
  sessao5?: ProductSession;
  banner?: Banner;
  sessao7?: ProductSession;
};
