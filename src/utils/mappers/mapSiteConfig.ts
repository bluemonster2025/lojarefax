import { RawConfiguracoesDoSite, SiteConfig } from "@/types/siteConfig";

export function mapSiteConfig(raw?: RawConfiguracoesDoSite): SiteConfig {
  const config = raw?.configuracoes;
  const bar = config?.notificationBar;
  const logo = config?.logoDoSite?.node;

  return {
    notificationEnabled: !!bar?.notificationOnoff,
    notificationMessage: bar?.notificationMesssage || "",
    logo: logo
      ? {
          sourceUrl: logo.sourceUrl,
          altText: logo.altText || "",
        }
      : undefined,
  };
}
