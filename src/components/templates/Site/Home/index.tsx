import AlertModal from "@/components/layouts/EcommerceLayout/Home/AlertModal";
import HeroComponent from "@/components/layouts/EcommerceLayout/Home/Hero";
import HomeBanner from "@/components/layouts/EcommerceLayout/Home/HomeBanner";
import SectionProductsWrapper from "@/components/layouts/EcommerceLayout/Home/SectionProducts/SectionProductsWrapper";
import SectionProductsReadyToDeliverWrapper from "@/components/layouts/EcommerceLayout/Home/SectionProductsReadyToDeliver/SectionProductsReadyToDeliverWrapper";
import StoreFeatures from "@/components/layouts/EcommerceLayout/Home/StoreFeatures";
import { PageHome } from "@/types/home";
import { UIProduct } from "@/types/uIProduct";
import { mapSessionProductToUIProduct } from "@/utils/mappers/mapProductUI";

interface HomeTemplateProps {
  page: PageHome;
}

export default async function Home({ page }: HomeTemplateProps) {
  const produtosSessao3: UIProduct[] =
    page.sessao3?.featuredProducts?.map(mapSessionProductToUIProduct) || [];

  const bgBannerDesktop = page.banner?.desktop?.src;
  const bgBannerDesktopMobile = page.banner?.mobile?.src;

  const produtosSessao5: UIProduct[] =
    page.sessao5?.featuredProducts?.map(mapSessionProductToUIProduct) || [];

  const produtosSessao6: UIProduct[] =
    page.sessao6?.featuredProducts?.map(mapSessionProductToUIProduct) || [];

  const produtosSessao7: UIProduct[] =
    page.sessao7?.featuredProducts?.map(mapSessionProductToUIProduct) || [];

  return (
    <main className="min-h-screen">
      <AlertModal />

      <HeroComponent />

      <StoreFeatures />

      <SectionProductsReadyToDeliverWrapper
        title={page.sessao3?.title}
        products={produtosSessao3}
        loading={!produtosSessao3.length}
      />

      <HomeBanner
        imgUrlDesktop={bgBannerDesktop}
        imgUrlMobile={bgBannerDesktopMobile}
      />

      <SectionProductsWrapper
        title={page.sessao5?.title}
        products={produtosSessao5}
        loading={!produtosSessao5.length}
      />

      <SectionProductsWrapper
        title={page.sessao6?.title || "teste"}
        products={produtosSessao6}
        loading={!produtosSessao6.length}
      />

      <SectionProductsWrapper
        title={page.sessao7?.title}
        products={produtosSessao7}
        loading={!produtosSessao7.length}
      />
    </main>
  );
}
