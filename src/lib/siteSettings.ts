// lib/siteSettings.ts
import { SiteSettings } from "@/types/siteSettings";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const res = await fetch(`${BASE_URL}/api/siteSettings`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return (await res.json()) ?? null;
}
