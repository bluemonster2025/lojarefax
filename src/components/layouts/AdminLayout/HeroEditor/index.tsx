"use client";

import { Section } from "@/components/elements/Section";
import ImageUpload from "../ImageUpload";

interface HeroProps {
  desktop?: { src: string; alt: string; databaseId?: number };
  mobile?: { src: string; alt: string; databaseId?: number };
  onChange?: (images: {
    desktop?: { src: string; alt: string; databaseId?: number };
    mobile?: { src: string; alt: string; databaseId?: number };
  }) => void;
}

export default function HeroEditor({ desktop, mobile, onChange }: HeroProps) {
  return (
    <Section>
      {/* Hero Desktop */}
      <ImageUpload
        label="Substituir banner Hero desktop"
        initialImage={desktop?.src || ""}
        aspectClass="aspect-[3.51/1]"
        rounded="md:rounded-3xl"
        dimensions="A imagem deve ter o tamanho de 1144px / 327px"
        onChange={(url, id) => {
          onChange?.({
            desktop: { src: url, alt: desktop?.alt || "", databaseId: id },
            mobile,
          });
        }}
      />

      {/* Hero Mobile */}
      <ImageUpload
        label="Substituir banner Hero mobile"
        initialImage={mobile?.src || ""}
        aspectClass="aspect-[0.98/1]"
        containerClass="mb-12 max-w-[342px]"
        rounded="rounded-0"
        dimensions="A imagem deve ter o tamanho de 390px / 385px"
        onChange={(url, id) => {
          onChange?.({
            desktop,
            mobile: { src: url, alt: mobile?.alt || "", databaseId: id },
          });
        }}
      />
    </Section>
  );
}
