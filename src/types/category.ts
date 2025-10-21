export type CategoryImage = {
  altText: string | null;
  sourceUrl: string;
};

export type CategoryVideo = {
  mediaItemUrl: string;
};

export type CategoryBanner = {
  categoryCoverDesktop?: CategoryImage;
  categoryCoverMobile?: CategoryImage;
  categoryCoverVideo?: CategoryVideo;
};

// Tipo bruto do GraphQL
export interface CategoryNode {
  id: string;
  name: string;
  slug: string;
  uri: string;
  description?: string | null;
  count?: number;
  image?: CategoryImage;
  categoriaBanner?: {
    categoryCoverDesktop?: { node: CategoryImage | null };
    categoryCoverMobile?: { node: CategoryImage | null };
    categoryCoverVideo?: { node: CategoryVideo | null };
  };
}

// Tipo final para o frontend
export interface Category {
  id: string;
  name: string;
  slug: string;
  uri: string;
  description?: string | null;
  count?: number;
  image?: CategoryImage;
  categoriaBanner?: {
    categoryCoverDesktop?: CategoryImage;
    categoryCoverMobile?: CategoryImage;
    categoryCoverVideo?: CategoryVideo;
  };
}
