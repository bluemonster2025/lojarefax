export interface RawImage {
  sourceUrl: string;
  altText?: string;
}

export interface RawProdutoSectionBanner {
  productBannerImage?: { node?: RawImage };
  productBannerImageMobile?: { node?: RawImage };
}

export interface RawPage {
  id: string;
  slug: string;
  title: string;
  produtoSectionBanner?: RawProdutoSectionBanner;
}

export interface PageProducts {
  id: string;
  slug: string;
  title: string;
  banner?: {
    desktop?: {
      src: string;
      alt?: string;
    };
    mobile?: {
      src: string;
      alt?: string;
    };
  };
}
