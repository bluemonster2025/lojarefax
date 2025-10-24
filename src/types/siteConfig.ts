// Tipos base (reutilizáveis)
export interface RawImage {
  sourceUrl: string;
  altText?: string;
}

// --- Estrutura vinda da API (igual ao GraphQL atual) ---
export interface RawNotificationBar {
  notificationOnoff: boolean;
  notificationMesssage: string;
}

export interface RawConfiguracoesInternas {
  logoDoSite?: {
    node: RawImage;
  };
  notificationBar?: RawNotificationBar;
}

export interface RawConfiguracoesDoSite {
  configuracoes?: RawConfiguracoesInternas;
}

// --- Tipo final mapeado (simplificado para uso no front) ---
export interface SiteConfig {
  /** Indica se a barra de notificação está ativa */
  notificationEnabled: boolean;
  /** Mensagem exibida na barra */
  notificationMessage?: string;
  /** Dados do logo principal do site */
  logo?: RawImage;
}
