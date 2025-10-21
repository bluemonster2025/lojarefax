"use client";

import { useState } from "react";
import { PageHome, Banner, ProductSession, Sessao4 } from "@/types/home";

export function useHomeEditor(initialPage: PageHome) {
  const [pageState, setPageState] = useState<PageHome>({
    ...initialPage,
    hero: initialPage.hero || {
      desktop: { src: "", alt: "", databaseId: undefined },
      mobile: { src: "", alt: "", databaseId: undefined },
    },
    banner: initialPage.banner || {
      desktop: { src: "", alt: "", databaseId: undefined },
      mobile: { src: "", alt: "", databaseId: undefined },
    },
    sessao2: initialPage.sessao2 || { title: "", featuredProducts: [] },
    sessao3: initialPage.sessao3 || { title: "", featuredProducts: [] },
    sessao4: initialPage.sessao4 || {
      image: { src: "", alt: "", databaseId: undefined },
      title: "",
      text: "",
      linkButton: "",
    },
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
    key: "sessao2" | "sessao3" | "sessao5" | "sessao7",
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

  const handleSessao4Change = (sessao4: Partial<Sessao4>) => {
    setPageState((prev) => ({
      ...prev,
      sessao4: {
        image: {
          src: sessao4.image?.src ?? prev.sessao4?.image?.src ?? "",
          alt: sessao4.image?.alt ?? prev.sessao4?.image?.alt ?? "",
          databaseId:
            sessao4.image?.databaseId ?? prev.sessao4?.image?.databaseId,
        },
        title: sessao4.title ?? prev.sessao4?.title ?? "",
        text: sessao4.text ?? prev.sessao4?.text ?? "",
        linkButton: sessao4.linkButton ?? prev.sessao4?.linkButton ?? "",
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
          customTag: p.customTag || "",
          visible: p.visible ?? false,
        };
      });

  // 🔹 Constrói JSON de tags (corrigido com normalização de ID)
  const buildFeaturedTags = (products?: ProductSession["featuredProducts"]) => {
    const tags: Record<string, string> = {};
    products?.forEach((p) => {
      // Normaliza ID da mesma forma que no sanitizeProducts
      const normalizedId =
        p.id.startsWith("product:") || p.id.startsWith("cHJvZHVjdD")
          ? p.id
          : btoa(`product:${p.id}`);

      // Sempre cria chave (mesmo se tag vazia)
      tags[normalizedId] = p.customTag ?? "";
    });
    return JSON.stringify(tags);
  };

  // 🔹 Constrói JSON de visibilidade (corrigido com normalização de ID)
  const buildVisibleTags = (products?: ProductSession["featuredProducts"]) => {
    const visibles: Record<string, boolean> = {};
    products?.forEach((p) => {
      const normalizedId =
        p.id.startsWith("product:") || p.id.startsWith("cHJvZHVjdD")
          ? p.id
          : btoa(`product:${p.id}`);

      visibles[normalizedId] = p.visible ?? false;
    });
    return JSON.stringify(visibles);
  };

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
        homeSessao2: {
          title_sessao2: pageState.sessao2?.title || "",
          featured_products_2: sanitizeProducts(
            pageState.sessao2?.featuredProducts
          ),
          featured_tags_2: buildFeaturedTags(
            pageState.sessao2?.featuredProducts
          ),
          visible_tag2: buildVisibleTags(pageState.sessao2?.featuredProducts),
        },
        homeSessao3: {
          title_sessao3: pageState.sessao3?.title || "",
          featured_products_3: sanitizeProducts(
            pageState.sessao3?.featuredProducts
          ),
          featured_tags_3: buildFeaturedTags(
            pageState.sessao3?.featuredProducts
          ),
          visible_tag3: buildVisibleTags(pageState.sessao3?.featuredProducts),
        },
        homeSessao4: {
          image_sessao4: pageState.sessao4?.image?.databaseId,
          title_sessao4: pageState.sessao4?.title || "",
          text_sessao4: pageState.sessao4?.text || "",
          link_button_sessao4: pageState.sessao4?.linkButton || "",
        },
        homeSessao5: {
          title_sessao5: pageState.sessao5?.title || "",
          featured_products_5: sanitizeProducts(
            pageState.sessao5?.featuredProducts
          ),
          featured_tags_5: buildFeaturedTags(
            pageState.sessao5?.featuredProducts
          ),
          visible_tag5: buildVisibleTags(pageState.sessao5?.featuredProducts),
        },
        homeSessao7: {
          title_sessao7: pageState.sessao7?.title || "",
          featured_products_7: sanitizeProducts(
            pageState.sessao7?.featuredProducts
          ),
          featured_tags_7: buildFeaturedTags(
            pageState.sessao7?.featuredProducts
          ),
          visible_tag7: buildVisibleTags(pageState.sessao7?.featuredProducts),
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
    handleSessao4Change,
    handleSave,
  };
}
