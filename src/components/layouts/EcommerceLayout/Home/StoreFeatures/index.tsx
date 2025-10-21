import Image from "next/image";
import { featureCardData } from "./content";
import { Title } from "@/components/elements/Texts";
import { Section } from "@/components/elements/Section";

export default function StoreFeatures() {
  return (
    <Section className="pb-16">
      <div className="flex justify-between gap-4">
        {featureCardData.map((feature) => (
          <article
            key={feature.id}
            className="flex items-center px-4 py-6 flex-1 border border-default-border rounded-lg w-full aspect-[2.53/1]"
          >
            <div className="relative w-12 h-12">
              <Image
                src={feature.src}
                alt={feature.alt}
                fill
                className="object-contain"
                sizes="48px"
              />
            </div>

            <div className="flex flex-col items-start">
              <Title as="h5" variant="h5">
                {feature.topText}
              </Title>
              <Title as="h4" variant="h4">
                {feature.bottomText}
              </Title>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
