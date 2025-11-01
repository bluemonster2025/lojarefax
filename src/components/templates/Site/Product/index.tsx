"use client";

import { useState, useEffect } from "react";
import ProductImages from "@/components/layouts/EcommerceLayout/Product/ProductImages";
import ProductInfo from "@/components/layouts/EcommerceLayout/Product/ProductInfo";
import RelatedProducts from "@/components/layouts/EcommerceLayout/Product/RelatedProducts";
import ProductBannerSession from "@/components/layouts/EcommerceLayout/Product/ProductBannerSession";
import { Section } from "@/components/elements/Section";
import { Product, VariationNode, ImageNode } from "@/types/product";
import { Skeleton } from "@/components/elements/Skeleton";
import ProductSpecs from "@/components/layouts/EcommerceLayout/Product/ProductSpecs";
import ProductSpecsBlock from "@/components/layouts/EcommerceLayout/Product/ProductSpecsBlock";
import MoreSpecsTabs from "@/components/layouts/EcommerceLayout/Product/MoreSpecsTabs"; // agora versão empilhada

interface ProductTemplateProps {
  product: Product;
}

export default function ProductTemplate({ product }: ProductTemplateProps) {
  // variações
  const variacoes: VariationNode[] = product.variations?.nodes || [];
  const initialVar: VariationNode | null =
    variacoes.length > 0 ? variacoes[0] : null;

  // imagem inicial
  const initialImage: ImageNode | undefined =
    initialVar?.image || product.image || undefined;

  // hidratação
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  // estado client
  const [selectedVar, setSelectedVar] = useState<VariationNode | null>(
    initialVar
  );
  const [mainImage, setMainImage] = useState<ImageNode | undefined>(
    initialImage
  );

  // banners
  const hasBannerDesktop = !!product.bannerProdutoDesktop?.sourceUrl;
  const hasBannerMobile = !!product.bannerProdutoMobile?.sourceUrl;
  const hasAnyBanner = hasBannerDesktop || hasBannerMobile;

  // Deixe o componente empilhado decidir se tem conteúdo; aqui só checamos existência do objeto
  const shouldRenderMoreSpecs = !!product?.maisEspecificacoes;

  // SSR skeleton (antes da hidratação)
  if (!isClient) {
    return (
      <>
        <Section className="md:py-10 bg-default-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-15 pb-8">
            <div className="flex flex-col gap-4">
              {/* Lado das imagens skeleton */}
              <div>
                <Skeleton className="h-full w-full aspect-[0.97/1] md:aspect-[1.52/1] rounded-2xl mt-auto" />
              </div>
              <div className="flex gap-4">
                <Skeleton className="h-full w-full aspect-square rounded-lg mt-auto" />
                <Skeleton className="h-full w-full aspect-square rounded-lg mt-auto" />
                <Skeleton className="h-full w-full aspect-square rounded-lg mt-auto" />
                <Skeleton className="h-full w-full aspect-square rounded-lg mt-auto" />
                <Skeleton className="h-full w-full aspect-square rounded-lg mt-auto" />
                <Skeleton className="h-full w-full aspect-square rounded-lg mt-auto" />
                <Skeleton className="h-full w-full aspect-square rounded-lg mt-auto" />
              </div>
            </div>

            {/* Lado das infos skeleton */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <Skeleton className="h-6 w-full rounded" />
                <Skeleton className="h-9 w-full rounded" />
                <Skeleton className="h-6 w-full rounded" />
              </div>
              <div className="flex flex-col gap-4">
                <Skeleton className="h-8 w-full rounded" />
                <Skeleton className="h-32 w-full rounded" />
                <Skeleton className="h-12 w-full rounded" />
              </div>
            </div>
          </div>
        </Section>

        <ProductSpecs product={product} />
        <ProductSpecsBlock product={product} className="lg:mt-6" />

        {shouldRenderMoreSpecs && (
          <MoreSpecsTabs
            data={product.maisEspecificacoes!}
            title={product.maisEspecificacoes!.titulo ?? "Mais especificações"}
            subtitle={product.maisEspecificacoes!.produto ?? product.name}
            className="mt-10"
          />
        )}

        {hasAnyBanner && (
          <ProductBannerSession
            bannerProdutoDesktop={product.bannerProdutoDesktop}
            bannerProdutoMobile={product.bannerProdutoMobile}
          />
        )}

        {product.upsell?.nodes && product.upsell.nodes.length > 0 && (
          <RelatedProducts
            products={product.upsell.nodes}
            pBottom="lg:pb-16"
            titulo={product.tituloItensRelacionados}
            subtitulo={product.subtituloItensRelacionados}
          />
        )}
      </>
    );
  }

  // versão client
  return (
    <>
      <Section className="md:py-10 bg-default-white">
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

      <ProductSpecs product={product} />
      <ProductSpecsBlock product={product} className="lg:mt-6" />

      {shouldRenderMoreSpecs && (
        <MoreSpecsTabs
          data={product.maisEspecificacoes!}
          title={product.maisEspecificacoes!.titulo ?? "Mais especificações"}
          subtitle={product.maisEspecificacoes!.produto ?? product.name}
          className="mt-10"
        />
      )}

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
          pBottom="lg:pb-16"
          titulo={product.tituloItensRelacionados}
          subtitulo={product.subtituloItensRelacionados}
        />
      )}
    </>
  );
}
