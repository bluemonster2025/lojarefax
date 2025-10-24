import { ReactNode } from "react";
import EcommerceAdminLayoutClient from "./ui/EcommerceAdminLayoutClient";
import { getSiteConfig } from "@/lib/getSiteConfig.client";

interface Props {
  children: ReactNode;
}

export default async function AdminLayout({ children }: Props) {
  const siteConfig = await getSiteConfig();

  return (
    <EcommerceAdminLayoutClient logo={siteConfig?.logo}>
      {children}
    </EcommerceAdminLayoutClient>
  );
}
