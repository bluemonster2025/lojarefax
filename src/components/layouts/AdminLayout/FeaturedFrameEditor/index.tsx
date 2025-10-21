"use client";

import { useState } from "react";
import { Section } from "@/components/elements/Section";
import ImageUpload from "../ImageUpload";
import InputField from "@/components/elements/InputField";
import { ButtonPrimary } from "@/components/elements/Button";
import { EditorSwing } from "../EditorSwing";

interface FeaturedFrameData {
  image?: { src: string; alt?: string; databaseId?: number };
  title?: string;
  text?: string;
  linkButton?: string;
}

interface FeaturedFrameEditorProps extends FeaturedFrameData {
  onChange?: (data: FeaturedFrameData) => void;
}

export default function FeaturedFrameEditor({
  image,
  title,
  text,
  linkButton,
  onChange,
}: FeaturedFrameEditorProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  return (
    <Section>
      <div className="flex flex-col md:flex-row items-center gap-1 md:gap-12">
        {/* Imagem */}
        <div className="flex-1 relative w-full max-w-[385px] aspect-[0.78/1] md:aspect-[0.88/1]">
          <ImageUpload
            label="Substituir banner"
            initialImage={image?.src || ""}
            aspectClass="aspect-[0.88/1]"
            containerClass="max-w-[385px]"
            rounded="rounded-3xl"
            dimensions="A imagem deve ter o tamanho de 385px / 435px"
            onChange={(url, id) => {
              onChange?.({
                image: { src: url, alt: image?.alt || "", databaseId: id },
                title,
                text,
                linkButton,
              });
            }}
          />
        </div>

        {/* Título e demais campos */}
        <div className="flex flex-col w-1/2 gap-4">
          <div className="w-fit">
            <ButtonPrimary
              className="h-6 rounded font-bold"
              onClick={() => setIsEditingTitle((prev) => !prev)}
            >
              {isEditingTitle ? "Concluir edição" : "Editar título"}
            </ButtonPrimary>
          </div>

          <InputField
            className={`text-3xl font-bold w-[90%] ${
              isEditingTitle ? "bg-white" : "border-none bg-transparent"
            } focus:outline-none p-1 ${
              !isEditingTitle
                ? "cursor-not-allowed text-grayscale-300 bg-transparent"
                : ""
            }`}
            placeholder="Digite o título..."
            value={title}
            disabled={!isEditingTitle}
            onChange={(val) => onChange?.({ title: val })}
          />

          {/* Texto */}
          <EditorSwing
            value={text}
            maxLength={350}
            onChange={(val) =>
              onChange?.({ image, title, text: val, linkButton })
            }
          />

          {/* Link do botão */}
          <InputField
            label="Saiba mais (link)"
            placeholder="Digite o link do botão..."
            value={linkButton}
            onChange={(val) =>
              onChange?.({ image, title, text, linkButton: val })
            }
          />
        </div>
      </div>
    </Section>
  );
}
