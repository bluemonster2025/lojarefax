"use client";

import { Section } from "@/components/elements/Section";

interface ProductBannerProps {
  imgUrlMobile?: string;
  imgUrlDesktop?: string;
}

export default function ProductBannerSession({
  imgUrlMobile,
  imgUrlDesktop,
}: ProductBannerProps) {
  if (!imgUrlMobile && !imgUrlDesktop) return <p>Nenhum banner cadastrado</p>;

  return (
    <>
      {/* Desktop */}
      <Section className="hidden md:block pb-12 md:pb-2">
        <div
          className="relative w-full md:aspect-[3.51/1] bg-cover bg-no-repeat bg-center md:rounded-3xl"
          style={{ backgroundImage: `url(${imgUrlDesktop})` }}
          role="img"
          aria-label="Banner do produto"
        ></div>
      </Section>

      {/* Mobile */}
      <div className="pb-10 md:pb-8">
        <div
          className="block md:hidden relative w-full aspect-square bg-cover bg-no-repeat bg-center"
          style={{ backgroundImage: `url(${imgUrlMobile})` }}
          role="img"
          aria-label="Banner do produto"
        ></div>
      </div>
    </>
  );
}
