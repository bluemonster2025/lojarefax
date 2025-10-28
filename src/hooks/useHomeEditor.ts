"use client";

import { useState } from "react";
import { PageHome, Banner, ProductSession } from "@/types/home";

export function useHomeEditor(initialPage: PageHome) {
  const [pageState, setPageState] = useState<PageHome>({
    ...initialPage,

    sessao3: initialPage.sessao3 || { title: "", featuredProducts: [] },
    sessao6: initialPage.sessao6 || { title: "", featuredProducts: [] },
    sessao5: initialPage.sessao5 || { title: "", featuredProducts: [] },
    sessao7: initialPage.sessao7 || { title: "", featuredProducts: [] },
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Handlers básicos
  const handleHeroChange = (hero: Banner) =>
    setPageState((prev) => ({ ...prev, hero: { ...prev.hero, ...hero } }));

  const handleBannerChange = (banner: Banner) =>
    setPageState((prev) => ({
      ...prev,
      banner: { ...prev.banner, ...banner },
    }));

  const handleSessaoChange = (
    key: "sessao3" | "sessao5" | "sessao6" | "sessao7",
    data: Partial<ProductSession>
  ) => {
    setPageState((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        title: data.title ?? prev[key]?.title ?? "",
        featuredProducts:
          data.featuredProducts ?? prev[key]?.featuredProducts ?? [],
      },
    }));
  };

  // 🔹 Normaliza produtos para salvar
  const sanitizeProducts = (
    products: ProductSession["featuredProducts"] = []
  ) =>
    products
      .filter((p) => p?.id) // evita produtos sem ID
      .map((p) => {
        // 🔹 Normaliza o ID:
        // se já vier no formato base64 (cHJvZHVjdD...) mantém;
        // se for número simples (ex: "166"), converte para base64 padrão do GraphQL.
        const normalizedId =
          p.id.startsWith("product:") || p.id.startsWith("cHJvZHVjdD")
            ? p.id
            : btoa(`product:${p.id}`);

        return {
          id: normalizedId,
          title: p.title || "",
          price: p.price || "",
          featuredImage: p.featuredImage || undefined,
        };
      });

  // 🔹 Salvar
  const handleSave = async () => {
    if (!pageState.databaseId) {
      setError("Database ID não definido!");
      return;
    }

    setIsSaving(true);
    setError(null);

    const bodyData = {
      pageId: pageState.databaseId,
      acfFields: {
        homeHero: {
          hero_image: pageState.hero?.desktop?.databaseId,
          hero_image_mobile: pageState.hero?.mobile?.databaseId,
        },
        homeBanner: {
          image_sessao6: pageState.banner?.desktop?.databaseId,
          image_sessao6_mobile: pageState.banner?.mobile?.databaseId,
        },

        homeSessao3: {
          title_sessao3: pageState.sessao3?.title || "",
          featured_products_3: sanitizeProducts(
            pageState.sessao3?.featuredProducts
          ),
        },
        homeSessao5: {
          title_sessao5: pageState.sessao5?.title || "",
          featured_products_5: sanitizeProducts(
            pageState.sessao5?.featuredProducts
          ),
        },
        homeSessao6: {
          title_sessao6: pageState.sessao6?.title || "",
          featured_products_6: sanitizeProducts(
            pageState.sessao6?.featuredProducts
          ),
        },
        homeSessao7: {
          title_sessao7: pageState.sessao7?.title || "",
          featured_products_7: sanitizeProducts(
            pageState.sessao7?.featuredProducts
          ),
        },
      },
    };

    try {
      const res = await fetch("/api/pageHome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || "Erro desconhecido ao salvar.");
        return;
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Erro ao salvar:", err);
      setError("Erro ao salvar. Verifique o console.");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    pageState,
    isSaving,
    saved,
    error,
    handleHeroChange,
    handleBannerChange,
    handleSessaoChange,
    handleSave,
  };
}
