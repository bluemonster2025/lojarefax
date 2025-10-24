import { ReactNode } from "react";
import EcommerceLayoutClient from "./ui/EcommerceLayoutClient";
import { getSiteConfig } from "@/lib/getSiteConfig.client";

interface Props {
  children: ReactNode;
}

export default async function EcommerceLayout({ children }: Props) {
  // Busca no servidor
  const siteConfig = await getSiteConfig();

  return (
    <EcommerceLayoutClient logo={siteConfig?.logo}>
      {children}
    </EcommerceLayoutClient>
  );
}
