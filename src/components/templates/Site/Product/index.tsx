"use client";

import { useState, useEffect } from "react";
import ProductImages from "@/components/layouts/EcommerceLayout/Product/ProductImages";
import ProductInfo from "@/components/layouts/EcommerceLayout/Product/ProductInfo";
import RelatedProducts from "@/components/layouts/EcommerceLayout/Product/RelatedProducts";
import ProductBannerSession from "@/components/layouts/EcommerceLayout/Product/ProductBannerSession";
import { Section } from "@/components/elements/Section";
import { Product, VariationNode, ImageNode } from "@/types/product";
import ProductDetails from "@/components/layouts/EcommerceLayout/Product/ProductDetails";
import { Skeleton } from "@/components/elements/Skeleton";

interface ProductTemplateProps {
  product: Product;
}

export default function ProductTemplate({ product }: ProductTemplateProps) {
  // todas as variações
  const variacoes: VariationNode[] = product.variations?.nodes || [];

  // pega uma variação "inicial" (se existir)
  const initialVar: VariationNode | null =
    variacoes.length > 0 ? variacoes[0] : null;

  // pega uma imagem inicial estável
  // prioridade:
  // - imagem da primeira variação
  // - imagem principal do produto
  // - nada
  const initialImage: ImageNode | undefined =
    initialVar?.image || product.image || undefined;

  // controla se já montou no client
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  // estado reativo controlado no client
  const [selectedVar, setSelectedVar] = useState<VariationNode | null>(
    initialVar
  );
  const [mainImage, setMainImage] = useState<ImageNode | undefined>(
    initialImage
  );

  // Há banner vindo do produto?
  const hasBannerDesktop = !!product.bannerProdutoDesktop?.sourceUrl;
  const hasBannerMobile = !!product.bannerProdutoMobile?.sourceUrl;
  const hasAnyBanner = hasBannerDesktop || hasBannerMobile;

  // ⚠️ Antes da hidratação completa, devolve um esqueleto estável.
  // Isso impede mismatch de DOM entre SSR e client.
  if (!isClient) {
    return (
      <>
        <Section className="md:py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-15 pb-8">
            {/* Lado das imagens skeleton */}
            <Skeleton className="h-full w-full aspect-[0.97/1] md:aspect-[1.52/1] rounded-2xl mt-auto" />

            {/* Lado das infos skeleton */}
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
              <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
              <div className="h-10 bg-gray-200 rounded w-[270px] animate-pulse" />
            </div>
          </div>
        </Section>

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

        {hasAnyBanner && (
          <ProductBannerSession
            bannerProdutoDesktop={product.bannerProdutoDesktop}
            bannerProdutoMobile={product.bannerProdutoMobile}
          />
        )}

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

  // ✅ versão real depois que já estamos no client
  return (
    <>
      <Section className="md:py-10">
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
