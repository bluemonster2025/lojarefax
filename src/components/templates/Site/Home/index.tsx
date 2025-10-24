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
  const bgHeroDesktop = page.hero?.desktop?.mediaItemUrl;
  const bgHeroDesktopMobile = page.hero?.mobile?.mediaItemUrl;

  const produtosSessao2: UIProduct[] =
    page.sessao2?.featuredProducts?.map(mapSessionProductToUIProduct) || [];

  const produtosSessao3: UIProduct[] =
    page.sessao3?.featuredProducts?.map(mapSessionProductToUIProduct) || [];

  const produtosSessao5: UIProduct[] =
    page.sessao5?.featuredProducts?.map(mapSessionProductToUIProduct) || [];

  const bgBannerDesktop = page.banner?.desktop?.src;
  const bgBannerDesktopMobile = page.banner?.mobile?.src;

  const produtosSessao7: UIProduct[] =
    page.sessao7?.featuredProducts?.map(mapSessionProductToUIProduct) || [];

  return (
    <main className="min-h-screen">
      <AlertModal />

      <HeroComponent
        mediaItemUrlDesktop={bgHeroDesktop}
        mediaItemUrlMobile={bgHeroDesktopMobile}
      />

      <StoreFeatures />

      <SectionProductsReadyToDeliverWrapper
        title={page.sessao2?.title || "Sessão 2"}
        products={produtosSessao2}
        loading={!produtosSessao2.length}
      />

      <SectionProductsWrapper
        title={page.sessao3?.title || "Sessão 3"}
        products={produtosSessao3}
        loading={!produtosSessao3.length}
      />

      <SectionProductsWrapper
        products={produtosSessao5}
        loading={!produtosSessao5.length}
      />

      <HomeBanner
        imgUrlDesktop={bgBannerDesktop}
        imgUrlMobile={bgBannerDesktopMobile}
      />

      <SectionProductsWrapper
        title={page.sessao7?.title || "Sessão 7"}
        products={produtosSessao7}
        loading={!produtosSessao7.length}
      />
    </main>
  );
}
