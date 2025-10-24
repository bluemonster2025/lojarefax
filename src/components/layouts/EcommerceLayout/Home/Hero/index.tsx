"use client";

import { Section } from "@/components/elements/Section";
import { Title } from "@/components/elements/Texts";

interface HeroProps {
  mediaItemUrlMobile?: string;
  mediaItemUrlDesktop?: string;
}

export default function HeroComponent({
  mediaItemUrlMobile,
  mediaItemUrlDesktop,
}: HeroProps) {
  if (!mediaItemUrlMobile && !mediaItemUrlDesktop)
    return <p>Nenhum banner cadastrado</p>;

  return (
    <>
      {/* DESKTOP */}
      <div className="hidden md:block pb-8">
        <div className="relative w-full md:aspect-[1440/580] overflow-hidden">
          {mediaItemUrlDesktop && (
            <video
              src={mediaItemUrlDesktop}
              autoPlay
              loop
              muted
              playsInline
              className="absolute top-0 left-0 w-full h-full object-cover object-center"
            />
          )}

          {/* Overlay escuro */}
          <div className="absolute inset-0 bg-black/60 z-[5]" />

          {/* Texto sobre o vídeo */}
          <Section className="absolute inset-0 flex flex-col justify-center z-10 space-y-4">
            <Title as="h4" variant="h4" className="text-default-white">
              compre direto da fábrica refax
            </Title>
            <Title
              variant="hero"
              className="max-w-[899px] text-default-white leading-tight"
            >
              a maior fabricante de brises, forros e revestimentos metálicos do
              brasil
            </Title>
            <Title as="h4" variant="h4" className="text-default-white">
              produtos à pronta entrega
            </Title>
          </Section>
        </div>
      </div>

      {/* MOBILE */}
      <div className="pb-8 md:hidden">
        <div className="relative w-full aspect-[1.01/1] overflow-hidden">
          {mediaItemUrlMobile && (
            <video
              src={mediaItemUrlMobile}
              autoPlay
              loop
              muted
              playsInline
              className="absolute top-0 left-0 w-full h-full object-cover object-center"
            />
          )}

          {/* Overlay escuro */}
          <div className="absolute inset-0 bg-black/60 z-[5]" />

          {/* Texto sobre o vídeo */}
          <Section className="absolute inset-0 flex flex-col justify-center z-10 space-y-4">
            <Title as="h4" variant="h4" className="text-default-white">
              compre direto da fábrica refax
            </Title>
            <Title
              variant="hero"
              className="max-w-[899px] text-default-white leading-tight"
            >
              a maior fabricante de brises, forros e revestimentos metálicos do
              brasil
            </Title>
            <Title as="h4" variant="h4" className="text-default-white">
              produtos à pronta entrega
            </Title>
          </Section>
        </div>
      </div>
    </>
  );
}
