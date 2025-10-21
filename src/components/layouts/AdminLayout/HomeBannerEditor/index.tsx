"use client";

import { Section } from "@/components/elements/Section";
import ImageUpload from "../ImageUpload";

interface HomeBannerProps {
  desktop?: { src: string; alt: string; databaseId?: number };
  mobile?: { src: string; alt: string; databaseId?: number };
  onChange?: (images: {
    desktop?: { src: string; alt: string; databaseId?: number };
    mobile?: { src: string; alt: string; databaseId?: number };
  }) => void;
}

export default function HomeBannerEditor({
  desktop,
  mobile,
  onChange,
}: HomeBannerProps) {
  return (
    <Section>
      {/* Home Banner Desktop */}
      <ImageUpload
        label="Substituir Banner desktop"
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

      {/* Home Banner Mobile */}
      <ImageUpload
        label="Substituir Banner mobile"
        initialImage={mobile?.src || ""}
        aspectClass="aspect-[1.44/1]"
        containerClass="mb-12 max-w-[342px]"
        rounded="rounded-0"
        dimensions="A imagem deve ter o tamanho de 390px / 270px"
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
