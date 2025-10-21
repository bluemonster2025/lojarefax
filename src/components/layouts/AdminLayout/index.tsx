import { ReactNode } from "react";
import { SiteSettings } from "@/types/siteSettings";
import { getSiteSettings } from "@/lib/siteSettings";
import EcommerceAdminLayoutClient from "./ui/EcommerceAdminLayoutClient";

interface Props {
  children: ReactNode;
}

export default async function AdminLayout({ children }: Props) {
  const settings: SiteSettings | null = await getSiteSettings();

  return (
    <EcommerceAdminLayoutClient logo={settings?.logo}>
      {children}
    </EcommerceAdminLayoutClient>
  );
}
