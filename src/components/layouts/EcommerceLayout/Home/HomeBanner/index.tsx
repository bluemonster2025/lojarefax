import { Section } from "@/components/elements/Section";

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
      <Section className="hidden md:block pb-12 md:pb-14 cursor-pointer">
        <div
          className="relative w-full md:aspect-[1296/413] bg-cover bg-no-repeat bg-center md:rounded-3xl overflow-hidden"
          style={{ backgroundImage: `url(${imgUrlDesktop})` }}
        ></div>
      </Section>

      {/* MOBILE */}
      <div className="block md:hidden pb-10 md:pb-8">
        <div
          className="relative w-full aspect-[1.44/1] bg-cover bg-no-repeat bg-center overflow-hidden"
          style={{ backgroundImage: `url(${imgUrlMobile})` }}
        ></div>
      </div>
    </>
  );
}
