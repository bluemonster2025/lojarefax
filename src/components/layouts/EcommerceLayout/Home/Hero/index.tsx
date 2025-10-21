"use client";

import { Section } from "@/components/elements/Section";
import Image from "next/image";

interface HeroProps {
  imgUrlMobile?: string;
  imgUrlDesktop?: string;
}

export default function HeroComponent({
  imgUrlMobile,
  imgUrlDesktop,
}: HeroProps) {
  if (!imgUrlMobile && !imgUrlDesktop) return <p>Nenhum banner cadastrado</p>;
  return (
    <>
      <Section className="hidden md:block pb-12 md:pb-2 lg:pt-8 ">
        <div className="relative w-full md:aspect-[3.51/1]">
          {imgUrlDesktop && (
            <Image
              src={imgUrlDesktop}
              alt="Banner principal"
              priority
              fetchPriority="high"
              fill
              className="bg-cover bg-no-repeat bg-center md:rounded-3xl"
              sizes="100vw"
            />
          )}
        </div>
      </Section>
      <div className="pb-8">
        <div className="block md:hidden relative w-full aspect-[1.01/1]">
          {imgUrlMobile && (
            <Image
              src={imgUrlMobile}
              alt="Banner principal"
              priority
              fetchPriority="high"
              fill
              className="bg-cover bg-no-repeat bg-center"
              sizes="100vw"
            />
          )}
        </div>
      </div>
    </>
  );
}
