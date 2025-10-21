// components/layouts/EcommerceLayoutClient.tsx (Client Component)
"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Header from "../Header";
import { RawImage } from "@/types/siteSettings";
import Footer from "../Footer";
import TopFooter from "../../Home/TopFooter";

interface Props {
  children: ReactNode;
  logo?: RawImage;
}

export default function EcommerceLayoutClient({ children, logo }: Props) {
  const pathname = usePathname();
  const hideHeaderFooter = pathname.startsWith("/buscar");

  return (
    <div className="relative overflow-x-hidden">
      {!hideHeaderFooter && <Header logo={logo ?? undefined} />}
      <main>{children}</main>

      <TopFooter />
      <Footer logo={logo ?? undefined} />
    </div>
  );
}
