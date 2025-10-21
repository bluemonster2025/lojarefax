// src/components/layouts/EcommerceLayout/Home/FeaturedFrameServer.tsx
import Image from "next/image";
import { Section } from "@/components/elements/Section";
import { Title } from "@/components/elements/Texts";

interface Props {
  image?: string;
  title?: string;
  text: string;
  linkButton?: string;
}

export default function FeaturedFrame({
  image,
  title,
  text,
  linkButton,
}: Props) {
  if (!image) return <p>Nenhum banner cadastrado</p>;

  return (
    <Section className="pb-8">
      <div className="flex flex-col md:flex-row items-center gap-1 md:gap-12">
        <div className="flex-1 relative w-full max-w-[385px] aspect-[0.78/1] md:aspect-[0.88/1]">
          <Image
            src={image}
            alt={title || "Featured"}
            fill
            sizes="(max-width: 768px) 100vw, 385px"
            className="rounded-lg object-contain"
            loading="lazy"
            fetchPriority="low"
          />
        </div>

        <div className="flex-1">
          {title && (
            <Title as="h3" className="text-3xl font-bold mb-4">
              {title}
            </Title>
          )}

          <div
            className="text-black mb-10 md:mb-6"
            dangerouslySetInnerHTML={{ __html: text }}
          />

          {linkButton && (
            <a
              href={linkButton}
              className="px-6 py-2 border border-black text-black font-semibold text-sm"
            >
              Saiba mais
            </a>
          )}
        </div>
      </div>
    </Section>
  );
}
