"use client";

import HeroEditor from "@/components/layouts/AdminLayout/HeroEditor";
import { ButtonPrimary } from "@/components/elements/Button";
import { Section } from "@/components/elements/Section";
import { PageHome } from "@/types/home";
import { useHomeEditor } from "@/hooks/useHomeEditor";
import { SaveModal } from "@/components/layouts/AdminLayout/ui/SaveModal";
import HomeBannerEditor from "@/components/layouts/AdminLayout/HomeBannerEditor";
import { Title } from "@/components/elements/Texts";
import { RelatedProductNode } from "@/types/product";
import SectionProductsEdit from "@/components/layouts/AdminLayout/SectionProductsEdit";

interface Props {
  page: PageHome;
}

type SessaoKeys = "sessao3" | "sessao5" | "sessao6" | "sessao7";

export default function HomeEditorTemplate({ page }: Props) {
  const { pageState, isSaving, saved, error, handleSessaoChange, handleSave } =
    useHomeEditor(page);

  if (!pageState) return <p>Página não definida</p>;

  // 🔹 Renderiza sessões 3, 5, 6 e 7
  const renderSessaoProdutos = (key: SessaoKeys) => {
    const sessao = pageState[key];
    if (!sessao) return null;

    const displayProducts: RelatedProductNode[] =
      sessao.featuredProducts?.map((p) => ({
        id: p.id,
        name: p.title || "",
        price: p.price || "",
        image: p.featuredImage?.node
          ? {
              sourceUrl: p.featuredImage.node.sourceUrl,
              altText: p.featuredImage.node.altText || "",
            }
          : undefined,
      })) || [];

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
      />

      {renderSessaoProdutos("sessao3")}

      <HomeBannerEditor
        desktop={pageState.banner?.desktop}
        mobile={pageState.banner?.mobile}
      />

      {renderSessaoProdutos("sessao5")}

      {renderSessaoProdutos("sessao6")}

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
