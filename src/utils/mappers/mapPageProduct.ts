import { PageProducts, RawPage } from "@/types/pageProducts";

export function mapPageProduct(raw: RawPage): PageProducts {
  const desktop = raw.produtoSectionBanner?.productBannerImage?.node;
  const mobile = raw.produtoSectionBanner?.productBannerImageMobile?.node;

  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title,
    banner:
      desktop || mobile
        ? {
            desktop: desktop
              ? {
                  src: desktop.sourceUrl,
                  alt: desktop.altText || "",
                }
              : undefined,
            mobile: mobile
              ? {
                  src: mobile.sourceUrl,
                  alt: mobile.altText || "",
                }
              : undefined,
          }
        : undefined,
  };
}
