"use client";

import { AuthProvider } from "@/context/AuthContext";
import { ReactNode } from "react";
import Header from "../Header";
import Footer from "../Footer";
import { AuthInterceptor } from "@/hooks/AuthInterceptor";
import { RawImage } from "@/types/siteConfig";

interface Props {
  children: ReactNode;
  logo?: RawImage;
}

export default function EcommerceAdminLayoutClient({ children, logo }: Props) {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <AuthInterceptor />
        <Header logo={logo ?? undefined} />
        <main className="bg-grayscale-150">{children}</main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
