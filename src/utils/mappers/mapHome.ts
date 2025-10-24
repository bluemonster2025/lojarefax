import {
  PageHome,
  RawHome,
  Banner,
  Sessao4,
  SessaoProduct,
  ProductSession,
} from "@/types/home";

// 🔹 Parse genérico de tags JSON
function parseFeaturedTags(tagsJson?: string | null): Record<string, string> {
  if (!tagsJson) return {};
  try {
    return JSON.parse(tagsJson);
  } catch {
    return {};
  }
}

// 🔹 Parse genérico de visible JSON → retorna boolean
// 🔹 Parse genérico de visible JSON → retorna boolean
function parseVisibleTags(
  visibleJson?: string | null
): Record<string, boolean> {
  if (!visibleJson) return {};
  try {
    const parsed = JSON.parse(visibleJson);
    return Object.fromEntries(
      Object.entries(parsed).map(([k, v]) => [k, v === true || v === "true"])
    );
  } catch {
    return {};
  }
}

// 🔹 Função genérica para mapear qualquer sessão com tags e visible
function mapSession(
  rawSession?: {
    title?: string | null;
    featuredProducts?: { nodes: SessaoProduct[] } | null;
  },
  tagsJson?: string | null,
  visibleJson?: string | null
): ProductSession | undefined {
  if (!rawSession) return undefined;

  const tags = parseFeaturedTags(tagsJson);
  const visibleTags = parseVisibleTags(visibleJson);

  const featuredProducts: SessaoProduct[] =
    rawSession.featuredProducts?.nodes.map((p) => ({
      ...p,
      customTag: tags[p.id] || "",
      // 🔹 Se não tiver entry no JSON, assume false
      visible: visibleTags[p.id] ?? false,
    })) || [];

  return {
    title: rawSession.title || undefined,
    featuredProducts,
  };
}

// 🔹 Tipagem segura para sessões
type RawSessionKeys =
  | "homeSessao2"
  | "homeSessao3"
  | "homeSessao5"
  | "homeSessao7";

type RawSessionMap = {
  homeSessao2?: {
    titleSessao2?: string | null;
    featuredProducts2?: { nodes: SessaoProduct[] } | null;
    featuredTags2?: string | null;
    visibleTag2?: string | null;
  };
  homeSessao3?: {
    titleSessao3?: string | null;
    featuredProducts3?: { nodes: SessaoProduct[] } | null;
    featuredTags3?: string | null;
    visibleTag3?: string | null;
  };
  homeSessao5?: {
    featuredProducts5?: { nodes: SessaoProduct[] } | null;
    featuredTags5?: string | null;
    visibleTag5?: string | null;
  };
  homeSessao7?: {
    titleSessao7?: string | null;
    featuredProducts7?: { nodes: SessaoProduct[] } | null;
    featuredTags7?: string | null;
    visibleTag7?: string | null;
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
      key: "sessao2",
      rawKey: "homeSessao2",
      titleKey: "titleSessao2",
      productsKey: "featuredProducts2",
      tagsKey: "featuredTags2",
      visibleKey: "visibleTag2",
    },
    {
      key: "sessao3",
      rawKey: "homeSessao3",
      titleKey: "titleSessao3",
      productsKey: "featuredProducts3",
      tagsKey: "featuredTags3",
      visibleKey: "visibleTag3",
    },
    {
      key: "sessao5",
      rawKey: "homeSessao5",
      titleKey: undefined,
      productsKey: "featuredProducts5",
      tagsKey: "featuredTags5",
      visibleKey: "visibleTag5",
    },
    {
      key: "sessao7",
      rawKey: "homeSessao7",
      titleKey: "titleSessao7",
      productsKey: "featuredProducts7",
      tagsKey: "featuredTags7",
      visibleKey: "visibleTag7",
    },
  ] as const;

  const sessions: Partial<PageHome> = {};

  for (const cfg of sessaoConfig) {
    const rawKey = cfg.rawKey as RawSessionKeys;
    const rawSession = (raw as RawSessionMap)[rawKey];
    if (!rawSession) continue;

    sessions[cfg.key] = mapSession(
      {
        title: cfg.titleKey
          ? (rawSession[cfg.titleKey as keyof typeof rawSession] as
              | string
              | null
              | undefined)
          : undefined,
        featuredProducts: rawSession[
          cfg.productsKey as keyof typeof rawSession
        ] as { nodes: SessaoProduct[] } | null,
      },
      rawSession[cfg.tagsKey as keyof typeof rawSession] as
        | string
        | null
        | undefined,
      rawSession[cfg.visibleKey as keyof typeof rawSession] as
        | string
        | null
        | undefined
    );
  }

  const sessao4Node = raw.homeSessao4?.imageSessao4?.node;
  const sessao4: Sessao4 | undefined = sessao4Node
    ? {
        image: { src: sessao4Node.sourceUrl, alt: sessao4Node.altText || "" },
        title: raw.homeSessao4?.titleSessao4 || undefined,
        text: raw.homeSessao4?.textSessao4 || undefined,
        linkButton: raw.homeSessao4?.linkButtonSessao4 || undefined,
      }
    : undefined;

  return {
    databaseId: raw.databaseId,
    slug: raw.slug || "home",
    title: raw.title || "home",
    hero: mapNodeToBanner(heroDesktop, heroMobile),
    banner: mapNodeToBanner(bannerDesktop, bannerMobile),
    sessao4,
    ...sessions, // adiciona sessao2,3,5,7 dinamicamente
  };
}
