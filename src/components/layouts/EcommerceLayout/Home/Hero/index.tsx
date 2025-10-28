"use client";

import { Section } from "@/components/elements/Section";
import { Title } from "@/components/elements/Texts";

export default function HeroComponent() {
  const videoUrl =
    "https://cms.lojarefax.com.br/wp-content/uploads/2025/10/0_Metal_Texture_3840x2160.mp4";

  return (
    <>
      {/* DESKTOP */}
      <div className="hidden md:block pb-8">
        <div className="relative w-full md:aspect-[1440/580] overflow-hidden">
          <video
            src={videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover object-center"
          />

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
          <video
            src={videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover object-center"
          />

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
