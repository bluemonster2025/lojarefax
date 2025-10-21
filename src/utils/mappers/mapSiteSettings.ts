import { RawPage, SiteSettings } from "@/types/siteSettings";

// Função de mapeamento
export function mapSiteSettings(raw: RawPage): SiteSettings {
  return {
    id: raw.id,
    title: raw.title,
    content: raw.content,
    logo: raw.configuracoesDoSite?.logoSite?.node,
  };
}
