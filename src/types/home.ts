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
  productCategories?: {
    nodes: { id: string; name: string; slug: string; parentId: string }[];
  };
  produto?: {
    personalizacaoProduto?: {
      subtitulo?: string | null;
    };
  };
};

export type ProductSession = {
  title?: string;
  featuredProducts?: SessaoProduct[];
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
  homeSessao3?: {
    titleSessao3?: string | null;
    featuredProducts3?: { nodes: SessaoProduct[] } | null;
  } | null;
  homeBanner?: {
    homeBannerDesktop?: {
      node: { id: number; sourceUrl: string; altText: string | null };
    } | null;
    homeBannerMobile?: {
      node: { id: number; sourceUrl: string; altText: string | null };
    } | null;
  } | null;
  homeSessao5?: {
    titleSessao5?: string | null;
    featuredProducts5?: { nodes: SessaoProduct[] } | null;
  } | null;
  homeSessao6?: {
    titleSessao6?: string | null;
    featuredProducts6?: { nodes: SessaoProduct[] } | null;
  } | null;
  homeSessao7?: {
    titleSessao7?: string | null;
    featuredProducts7?: { nodes: SessaoProduct[] } | null;
  } | null;
};

export type PageHome = {
  databaseId: number;
  slug: string;
  title: string;
  hero?: Banner;
  sessao3?: ProductSession;
  banner?: Banner;
  sessao5?: ProductSession;
  sessao6?: ProductSession;
  sessao7?: ProductSession;
};
