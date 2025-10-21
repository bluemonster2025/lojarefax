import {
  Category,
  CategoryNode,
  CategoryImage,
  CategoryVideo,
} from "@/types/category";

// Mapeia banner de imagem
function mapImageBanner(
  banner?: { node: CategoryImage | null } | null
): CategoryImage | undefined {
  if (!banner?.node) return undefined;
  return banner.node;
}

// Mapeia banner de vídeo
function mapVideoBanner(
  banner?: { node: CategoryVideo | null } | null
): CategoryVideo | undefined {
  if (!banner?.node) return undefined;
  return banner.node;
}

// Converte CategoryNode (bruto do GraphQL) para Category final
export function mapCategory(node: CategoryNode): Category {
  return {
    id: node.id,
    name: node.name,
    slug: node.slug,
    uri: node.uri,
    description: node.description ?? null,
    count: node.count,
    image: node.image ?? undefined,
    categoriaBanner: node.categoriaBanner
      ? {
          categoryCoverDesktop: mapImageBanner(
            node.categoriaBanner.categoryCoverDesktop
          ),
          categoryCoverMobile: mapImageBanner(
            node.categoriaBanner.categoryCoverMobile
          ),
          categoryCoverVideo: mapVideoBanner(
            node.categoriaBanner.categoryCoverVideo
          ),
        }
      : undefined,
  };
}
