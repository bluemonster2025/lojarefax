// components/layouts/EcommerceLayout.tsx
import { ReactNode } from "react";
import { SiteSettings } from "@/types/siteSettings";
import { getSiteSettings } from "@/lib/siteSettings";
import EcommerceLayoutClient from "./ui/EcommerceLayoutClient";

interface Props {
  children: ReactNode;
}

export default async function EcommerceLayout({ children }: Props) {
  // Server-side fetch
  const settings: SiteSettings | null = await getSiteSettings();

  return (
    <EcommerceLayoutClient logo={settings?.logo}>
      {children}
    </EcommerceLayoutClient>
  );
}
