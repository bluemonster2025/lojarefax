import { mapSiteConfig } from "@/utils/mappers/mapSiteConfig";
import type { SiteConfig } from "@/types/siteConfig";

export async function getSiteConfig(): Promise<SiteConfig | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/siteConfig`,
      {
        next: { revalidate: 60 }, // Cache incremental (ISR)
      }
    );

    if (!res.ok) return null;

    const raw = await res.json();
    return mapSiteConfig(raw);
  } catch (err) {
    console.error("❌ Erro ao buscar siteConfig no servidor:", err);
    return null;
  }
}
