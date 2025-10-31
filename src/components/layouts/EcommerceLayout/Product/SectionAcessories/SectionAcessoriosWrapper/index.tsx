"use client";

import { Product, AccessoryProductNode } from "@/types/product";
import SectionAcessories from "..";

interface Props {
  /** Se você passar o product, ele resolve tudo a partir dele */
  product?: Product;

  /** Ou você pode passar os dados manualmente */
  title?: string;
  subtitle?: string;
  accessories?: AccessoryProductNode[];

  /** 🆕 avisos (podem vir do mapper do product) */
  notices?: string[];
  /** 🆕 título da caixa de avisos */
  noticesTitle?: string;

  loading?: boolean;
  maxAccessoriesPreview?: number;
}

export default function SectionAcessoriosWrapper({
  product,
  title,
  subtitle,
  accessories,
  notices, // 🆕
  noticesTitle, // 🆕
  loading = false,
  maxAccessoriesPreview = 12,
}: Props) {
  const resolvedTitle =
    title ?? product?.acessoriosMontagemTitle ?? "Acessórios";

  const resolvedSubTitle =
    subtitle ?? product?.acessoriosMontagemSubtitle ?? "";

  const resolvedAccessories = accessories ?? product?.acessoriosMontagem ?? [];

  // 🆕 puxa do product se não veio por prop
  const resolvedNotices = notices ?? product?.acessoriosMontagemAvisos ?? [];

  const resolvedNoticesTitle = noticesTitle ?? "";

  return (
    <SectionAcessories
      title={resolvedTitle}
      subtitle={resolvedSubTitle}
      accessories={resolvedAccessories}
      loading={loading}
      maxAccessoriesPreview={maxAccessoriesPreview}
      /** 🆕 passa para o modal renderizar a NoticeList */
      notices={resolvedNotices}
      noticesTitle={resolvedNoticesTitle}
    />
  );
}
