"use client";

import { useState } from "react";
import ProductImages from "@/components/layouts/EcommerceLayout/Product/ProductImages";
import ProductInfo from "@/components/layouts/EcommerceLayout/Product/ProductInfo";
import RelatedProducts from "@/components/layouts/EcommerceLayout/Product/RelatedProducts";
import ProductBannerSession from "@/components/layouts/EcommerceLayout/Product/ProductBannerSession";
import { Section } from "@/components/elements/Section";
import { Product, VariationNode, ImageNode } from "@/types/product";
import ProductDetails from "@/components/layouts/EcommerceLayout/Product/ProductDetails";
import { PageProducts } from "@/types/pageProducts";

interface ProductTemplateProps {
  product: Product;
  page: PageProducts;
}

export default function ProductTemplate({
  product,
  page,
}: ProductTemplateProps) {
  const variacoes: VariationNode[] = product.variations?.nodes || [];

  // Variação selecionada
  const [selectedVar, setSelectedVar] = useState<VariationNode | null>(
    variacoes[0] || null
  );

  // Imagem principal
  const [mainImage, setMainImage] = useState<ImageNode | undefined>(
    selectedVar?.image || product.image
  );

  // Há banner vindo do produto?
  const hasBannerDesktop = !!product.bannerProdutoDesktop?.sourceUrl;
  const hasBannerMobile = !!product.bannerProdutoMobile?.sourceUrl;
  const hasAnyBanner = hasBannerDesktop || hasBannerMobile;

  return (
    <>
      <Section className="md:p-10">
        {/* Conteúdo principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-15 pb-8">
          <ProductImages
            product={product}
            mainImage={mainImage}
            setMainImage={setMainImage}
            selectedVar={selectedVar}
            variacoes={variacoes}
            setSelectedVar={setSelectedVar}
          />

          <ProductInfo
            product={product}
            mainImage={mainImage}
            setMainImage={setMainImage}
            selectedVar={selectedVar}
            setSelectedVar={setSelectedVar}
            variacoes={variacoes}
          />
        </div>
      </Section>

      {/* Cross Sell */}
      {product.crossSell?.nodes && product.crossSell.nodes.length > 0 && (
        <RelatedProducts
          products={product.crossSell.nodes}
          title="Compre também"
          pBottom="lg:pb-16"
        />
      )}

      <Section className="md:pb-10">
        <ProductDetails product={product} />
      </Section>

      {/* Banner do produto (custom ACF) */}
      {hasAnyBanner && (
        <ProductBannerSession
          bannerProdutoDesktop={product.bannerProdutoDesktop}
          bannerProdutoMobile={product.bannerProdutoMobile}
        />
      )}

      {/* Upsell */}
      {product.upsell?.nodes && product.upsell.nodes.length > 0 && (
        <RelatedProducts
          products={product.upsell.nodes}
          title="Itens Relacionados"
          pBottom="lg:pb-16"
        />
      )}
    </>
  );
}
