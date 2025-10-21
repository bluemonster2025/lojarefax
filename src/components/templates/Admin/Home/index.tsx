"use client";

import HeroEditor from "@/components/layouts/AdminLayout/HeroEditor";
import { ButtonPrimary } from "@/components/elements/Button";
import { Section } from "@/components/elements/Section";
import { PageHome } from "@/types/home";
import { useHomeEditor } from "@/hooks/useHomeEditor";
import { SaveModal } from "@/components/layouts/AdminLayout/ui/SaveModal";
import HomeBannerEditor from "@/components/layouts/AdminLayout/HomeBannerEditor";
import FeaturedFrameEditor from "@/components/layouts/AdminLayout/FeaturedFrameEditor";
import { Title } from "@/components/elements/Texts";
import { RelatedProductNode } from "@/types/product";
import SectionProductsEdit from "@/components/layouts/AdminLayout/SectionProductsEdit";

interface Props {
  page: PageHome;
}

type SessaoKeys = "sessao2" | "sessao3" | "sessao5" | "sessao7";
type VisibleTagKeys =
  | "visibleTag2"
  | "visibleTag3"
  | "visibleTag5"
  | "visibleTag7";

// 🔹 Função robusta para interpretar qualquer formato vindo do ACF
function readVisibleMapFromAny(value: unknown): Record<string, boolean> {
  if (!value) return {};

  if (typeof value === "object" && !Array.isArray(value)) {
    try {
      return Object.fromEntries(
        Object.entries(value as Record<string, unknown>).map(([k, v]) => [
          k,
          v === true || v === "true",
        ])
      );
    } catch {
      return {};
    }
  }

  if (typeof value === "string") {
    try {
      const first = JSON.parse(value);
      const parsed = typeof first === "string" ? JSON.parse(first) : first;

      if (typeof parsed === "object" && parsed !== null) {
        return Object.fromEntries(
          Object.entries(parsed as Record<string, unknown>).map(([k, v]) => [
            k,
            v === true || v === "true",
          ])
        );
      }

      return {};
    } catch {
      if (value === "true") return { _: true };
      if (value === "false") return {};
      return {};
    }
  }

  return {};
}

export default function HomeEditorTemplate({ page }: Props) {
  const {
    pageState,
    isSaving,
    saved,
    error,
    handleHeroChange,
    handleSessaoChange,
    handleBannerChange,
    handleSessao4Change,
    handleSave,
  } = useHomeEditor(page);

  if (!pageState) return <p>Página não definida</p>;

  // 🔹 Atualiza o campo visibleTagX corretamente
  const handleVisibleTagUpdate = (
    key: VisibleTagKeys,
    newMap: Record<string, boolean>
  ) => {
    const jsonValue = JSON.stringify(
      Object.fromEntries(
        Object.entries(newMap).map(([id, val]) => [id, String(val)])
      )
    );

    const sessaoKeyMap: Record<VisibleTagKeys, SessaoKeys> = {
      visibleTag2: "sessao2",
      visibleTag3: "sessao3",
      visibleTag5: "sessao5",
      visibleTag7: "sessao7",
    };

    const sessaoKey = sessaoKeyMap[key];

    handleSessaoChange(sessaoKey, {
      [key]: jsonValue,
    } as Partial<PageHome>);
  };

  // 🔹 Renderiza sessões 2, 3, 5 e 7
  const renderSessaoProdutos = (key: SessaoKeys) => {
    const sessao = pageState[key];
    if (!sessao) return null;

    const visibleFieldCandidates = [
      (pageState as Record<string, unknown>)[
        `visibleTag${key.replace("sessao", "")}`
      ],
      (pageState as Record<string, unknown>)[
        `visible_tag_${key.replace("sessao", "")}`
      ],
      (sessao as Record<string, unknown>)["visibleTag"],
      (sessao as Record<string, unknown>)["visible_tag"],
    ];

    let visibleMap: Record<string, boolean> = {};
    for (const cand of visibleFieldCandidates) {
      if (cand == null) continue;
      const parsed = readVisibleMapFromAny(cand);
      if (Object.keys(parsed).length > 0) {
        visibleMap = parsed;
        break;
      }
    }

    const displayProducts: RelatedProductNode[] =
      sessao.featuredProducts?.map((p) => ({
        id: p.id,
        name: p.title || "",
        price: p.price || "",
        customTag: p.customTag || "",
        visible:
          typeof visibleMap[p.id] !== "undefined"
            ? visibleMap[p.id]
            : p.visible ?? true,
        image: p.featuredImage?.node
          ? {
              sourceUrl: p.featuredImage.node.sourceUrl,
              altText: p.featuredImage.node.altText || "",
            }
          : undefined,
      })) || [];

    const visibleTagFieldKey = `visibleTag${key.replace(
      "sessao",
      ""
    )}` as VisibleTagKeys;

    return (
      <SectionProductsEdit
        key={key}
        title={sessao.title || ""}
        products={displayProducts}
        onUpdate={(index, newProduct) => {
          const sessaoProducts = pageState[key]?.featuredProducts ?? [];
          const updatedProducts = [...sessaoProducts];
          updatedProducts[index] = {
            ...updatedProducts[index],
            id: newProduct.id || updatedProducts[index]?.id || "",
            title: newProduct.name,
            price: newProduct.price,
            customTag: newProduct.customTag || "",
            visible: newProduct.visible ?? true,
            featuredImage: newProduct.image
              ? {
                  node: {
                    sourceUrl: newProduct.image.sourceUrl,
                    altText: newProduct.image.altText || null,
                  },
                }
              : updatedProducts[index]?.featuredImage,
          };

          handleSessaoChange(key, { featuredProducts: updatedProducts });

          const updatedVisibleMap = Object.fromEntries(
            updatedProducts.map((p) => [p.id, p.visible ?? true])
          );
          handleVisibleTagUpdate(visibleTagFieldKey, updatedVisibleMap);
        }}
        onTitleChange={(newTitle) =>
          handleSessaoChange(key, { title: newTitle })
        }
      />
    );
  };

  return (
    <Section className="py-8">
      <Title className="text-grayscale-550 text-2xl font-semibold mb-12">
        Sistema de gerenciamento do site
      </Title>

      <HeroEditor
        desktop={pageState.hero?.desktop}
        mobile={pageState.hero?.mobile}
        onChange={handleHeroChange}
      />

      {renderSessaoProdutos("sessao2")}
      {renderSessaoProdutos("sessao3")}

      {pageState.sessao4 && (
        <FeaturedFrameEditor
          image={pageState.sessao4.image}
          title={pageState.sessao4.title}
          text={pageState.sessao4.text}
          linkButton={pageState.sessao4.linkButton}
          onChange={handleSessao4Change}
        />
      )}

      {renderSessaoProdutos("sessao5")}

      <HomeBannerEditor
        desktop={pageState.banner?.desktop}
        mobile={pageState.banner?.mobile}
        onChange={handleBannerChange}
      />

      {renderSessaoProdutos("sessao7")}

      <div className="w-fit mt-8">
        <ButtonPrimary disabled={isSaving} onClick={handleSave}>
          {isSaving ? "Salvando..." : saved ? "Salvo" : "Salvar alterações"}
        </ButtonPrimary>
        <SaveModal saved={saved} error={error} />
      </div>
    </Section>
  );
}
