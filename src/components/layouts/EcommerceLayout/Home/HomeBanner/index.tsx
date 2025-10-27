import BuyButton from "@/components/elements/BuyButton";
import { Section } from "@/components/elements/Section";
import { Title } from "@/components/elements/Texts";

interface BannerProps {
  imgUrlMobile?: string;
  imgUrlDesktop?: string;
}

export default function HomeBanner({
  imgUrlMobile,
  imgUrlDesktop,
}: BannerProps) {
  if (!imgUrlMobile && !imgUrlDesktop) return <p>Nenhum banner cadastrado</p>;

  return (
    <>
      {/* DESKTOP */}
      <Section className="hidden md:block pb-12 md:pb-14">
        <div
          className="relative w-full md:aspect-[1296/413] bg-cover bg-no-repeat bg-center md:rounded-3xl overflow-hidden"
          style={{ backgroundImage: `url(${imgUrlDesktop})` }}
        >
          {/* Texto e botão sobre a imagem */}
          <div className="gap-8 absolute inset-0 flex flex-col items-start justify-center px-12 text-white z-10">
            <div className="gap-4">
              <Title as={"h4"} variant="h4">
                Produtos sob demanda
              </Title>
              <Title as="h2" variant="hero" className="max-w-[327px]">
                monte seu projeto
              </Title>
              <Title as={"h4"} variant="h4" className="max-w-[327px]">
                solicite um orçamento exclusivo para o seu projeto
              </Title>
            </div>

            {/* Botão Comprar */}
            <div className="w-fit">
              <BuyButton
                title="Envie seu projeto para orçamento"
                icon="BsWhatsapp"
              />
            </div>
          </div>

          {/* Overlay opcional para melhor contraste */}
          <div className="absolute inset-0 bg-black/30 z-0"></div>
        </div>
      </Section>

      {/* MOBILE */}
      <div className="block md:hidden pb-10 md:pb-8">
        <div
          className="relative w-full aspect-[1.44/1] bg-cover bg-no-repeat bg-center overflow-hidden"
          style={{ backgroundImage: `url(${imgUrlMobile})` }}
        >
          <div className="absolute inset-0 flex flex-col items-start justify-center px-6 text-white z-10">
            <Title as="h3" variant="h3" className="mb-3">
              Monte
            </Title>
            <button className="bg-white text-black px-5 py-2 rounded-full font-semibold hover:bg-gray-100 transition">
              Button
            </button>
          </div>
          <div className="absolute inset-0 bg-black/30 z-0"></div>
        </div>
      </div>
    </>
  );
}
