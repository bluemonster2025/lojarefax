import {
  PageHome,
  RawHome,
  Banner,
  SessaoProduct,
  ProductSession,
} from "@/types/home";

// 🔹 Função genérica para mapear qualquer sessão com tags e visible
function mapSession(rawSession?: {
  title?: string | null;
  featuredProducts?: { nodes: SessaoProduct[] } | null;
}): ProductSession | undefined {
  if (!rawSession) return undefined;

  const featuredProducts: SessaoProduct[] =
    rawSession.featuredProducts?.nodes.map((p) => ({
      ...p,
    })) || [];

  return {
    title: rawSession.title || undefined,
    featuredProducts,
  };
}

// 🔹 Tipagem segura para sessões
type RawSessionKeys =
  | "homeSessao3"
  | "homeSessao5"
  | "homeSessao6"
  | "homeSessao7";

type RawSessionMap = {
  homeSessao3?: {
    titleSessao3?: string | null;
    featuredProducts3?: { nodes: SessaoProduct[] } | null;
  };
  homeSessao5?: {
    featuredProducts5?: { nodes: SessaoProduct[] } | null;
  };
  homeSessao6?: {
    titleSessao6?: string | null;
    featuredProducts6?: { nodes: SessaoProduct[] } | null;
  };
  homeSessao7?: {
    titleSessao7?: string | null;
    featuredProducts7?: { nodes: SessaoProduct[] } | null;
  };
};

export function mapHome(raw: RawHome): PageHome {
  const mapNodeToBanner = (
    desktopNode?: {
      databaseId?: number;
      sourceUrl: string;
      mediaItemUrl?: string;
      altText: string | null;
    },
    mobileNode?: {
      databaseId?: number;
      sourceUrl: string;
      mediaItemUrl?: string;
      altText: string | null;
    }
  ): Banner => ({
    desktop: desktopNode
      ? {
          databaseId: desktopNode.databaseId,
          src: desktopNode.sourceUrl,
          alt: desktopNode.altText || "",
          mediaItemUrl: desktopNode.mediaItemUrl || "",
        }
      : { src: "", alt: "", mediaItemUrl: "" },
    mobile: mobileNode
      ? {
          databaseId: mobileNode.databaseId,
          src: mobileNode.sourceUrl,
          alt: mobileNode.altText || "",
          mediaItemUrl: mobileNode.mediaItemUrl || "",
        }
      : { src: "", alt: "", mediaItemUrl: "" },
  });

  const heroDesktop = raw.homeHero?.heroImage?.node;
  const heroMobile = raw.homeHero?.heroImageMobile?.node;
  const bannerDesktop = raw.homeBanner?.homeBannerDesktop?.node;
  const bannerMobile = raw.homeBanner?.homeBannerMobile?.node;

  // 🔹 Configuração das sessões dinâmicas
  const sessaoConfig = [
    {
      key: "sessao3",
      rawKey: "homeSessao3",
      titleKey: "titleSessao3",
      productsKey: "featuredProducts3",
    },
    {
      key: "sessao5",
      rawKey: "homeSessao5",
      titleKey: "titleSessao5",
      productsKey: "featuredProducts5",
    },
    {
      key: "sessao6",
      rawKey: "homeSessao6",
      titleKey: "titleSessao6",
      productsKey: "featuredProducts6",
    },
    {
      key: "sessao7",
      rawKey: "homeSessao7",
      titleKey: "titleSessao7",
      productsKey: "featuredProducts7",
    },
  ] as const;

  const sessions: Partial<PageHome> = {};

  for (const cfg of sessaoConfig) {
    const rawKey = cfg.rawKey as RawSessionKeys;
    const rawSession = (raw as RawSessionMap)[rawKey];
    if (!rawSession) continue;

    sessions[cfg.key] = mapSession({
      title: cfg.titleKey
        ? (rawSession[cfg.titleKey as keyof typeof rawSession] as
            | string
            | null
            | undefined)
        : undefined,
      featuredProducts: rawSession[
        cfg.productsKey as keyof typeof rawSession
      ] as { nodes: SessaoProduct[] } | null,
    });
  }

  return {
    databaseId: raw.databaseId,
    slug: raw.slug || "home",
    title: raw.title || "home",
    hero: mapNodeToBanner(heroDesktop, heroMobile),
    banner: mapNodeToBanner(bannerDesktop, bannerMobile),
    ...sessions, // adiciona sessao2,3,5,7 dinamicamente
  };
}
