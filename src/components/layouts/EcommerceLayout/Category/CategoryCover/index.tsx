import Image from "next/image";
import type { Category } from "@/types/category"; // ⚡ mudar para Category

interface CategoryCoverProps {
  category: Category; // agora recebe Category final
}

export default function CategoryCover({ category }: CategoryCoverProps) {
  const videoSrc = category.categoriaBanner?.categoryCoverVideo?.mediaItemUrl;
  const mobileSrc = category.categoriaBanner?.categoryCoverMobile?.sourceUrl;
  const desktopSrc = category.categoriaBanner?.categoryCoverDesktop?.sourceUrl;

  // Se não houver nenhum banner, retorna null
  if (!videoSrc && !mobileSrc && !desktopSrc) return null;

  return (
    <div className="mb-10 lg:mb-15 relative w-full overflow-hidden aspect-[0.83/1] md:aspect-[3/1]">
      {videoSrc ? (
        <video
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover object-center"
        />
      ) : (
        <>
          {mobileSrc && (
            <div className="block md:hidden w-full h-full relative">
              <Image
                src={mobileSrc}
                alt={`Capa da categoria ${category.name}`}
                fill
                className="object-cover object-center"
                sizes="100vw"
                priority
                fetchPriority="high"
              />
            </div>
          )}
          {desktopSrc && (
            <div className="hidden md:block relative w-full h-full">
              <Image
                src={desktopSrc}
                alt={`Capa da categoria ${category.name}`}
                fill
                className="object-cover object-center"
                sizes="100vw"
                priority
                fetchPriority="high"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
