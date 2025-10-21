// Tipos crus vindos da API
export interface RawImage {
  sourceUrl: string;
  altText?: string;
}

export interface RawConfiguracoesSite {
  logoSite?: { node?: RawImage };
}

export interface RawPage {
  id: string;
  title: string;
  content?: string;
  configuracoesDoSite?: RawConfiguracoesSite;
}

// Tipo final (mapeado)
export interface SiteSettings {
  id: string;
  title: string;
  content?: string;
  logo?: RawImage;
}
