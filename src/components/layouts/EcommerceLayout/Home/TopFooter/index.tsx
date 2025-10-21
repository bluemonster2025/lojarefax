import { Title, Text } from "@/components/elements/Texts";
import Image from "next/image";
import Carousel from "../../ui/Footer/Carousel";

export default function TopFooter() {
  return (
    <>
      {/* 🔹 Rodapé superior */}
      <div className="text-default-text bg-default-background py-8">
        <Carousel />
        <div className="flex flex-col gap-4">
          <Text
            variant="mini-default"
            className="text-5xl uppercase max-w-[346px] mx-auto text-center leading-[120%]"
          >
            40 anos de confiança
          </Text>
          <Title
            variant="h5"
            as="h5"
            className="text-xs max-w-[597px] mx-auto text-center leading-6"
          >
            Há quatro décadas, a Refax entrega qualidade, segurança e
            atendimento especializado em soluções metálicas para projetos de
            todos os portes. Unimos engenharia, processo industrial e acabamento
            premium para atender arquitetos, construtoras e instaladores em todo
            o Brasil.
          </Title>
          <div className="flex items-center gap-2 justify-center">
            {/* Bandeira do Brasil */}
            <div className="relative w-6 aspect-square">
              <Image
                src="/images/pictures/flag-brazil.svg"
                alt="Português (Brasil)"
                fill
                className="object-contain"
                loading="lazy"
                sizes="24px"
              />
            </div>

            {/* Bandeira da Espanha */}
            <div className="relative w-6 aspect-square">
              <Image
                src="/images/pictures/flag-spain.svg"
                alt="Español"
                fill
                className="object-contain"
                loading="lazy"
                sizes="24px"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
