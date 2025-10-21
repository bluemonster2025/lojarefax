"use client";

import Image from "next/image";
import { Product, ImageNode, VariationNode } from "@/types/product";

interface ProductImagesProps {
  product: Product;
  mainImage?: ImageNode;
  setMainImage: (img: ImageNode) => void;
  selectedVar: VariationNode | null;
  variacoes: VariationNode[];
  setSelectedVar: (v: VariationNode) => void;
}

export default function ProductImages({
  product,
  mainImage,
  setMainImage,
  variacoes,
  setSelectedVar,
}: ProductImagesProps) {
  // Monta array de thumbs (ImageNode)
  const imagesToShow: ImageNode[] = [];

  if (product.image) imagesToShow.push(product.image);

  product.galleryImages?.nodes.forEach((img) => {
    if (!imagesToShow.find((i) => i.sourceUrl === img.sourceUrl)) {
      imagesToShow.push(img);
    }
  });

  variacoes.forEach((v) => {
    if (
      v.image &&
      !imagesToShow.find((i) => i.sourceUrl === v.image!.sourceUrl)
    ) {
      imagesToShow.push(v.image);
    }
  });

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 items-center">
      {/* Thumbnails */}
      <div className="flex flex-row md:flex-col gap-7">
        {imagesToShow.length === 0
          ? Array(4)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="aspect-[0.61/1] md:aspect-[0.62/1] h-20 bg-gray-200 rounded animate-pulse"
                />
              ))
          : imagesToShow.map((img) => {
              return (
                <button
                  key={img.sourceUrl}
                  onClick={() => {
                    setMainImage(img);
                    const variation = variacoes.find(
                      (v) => v.image?.sourceUrl === img.sourceUrl
                    );
                    if (variation) setSelectedVar(variation);
                  }}
                  className={`overflow-hidden cursor-pointer rounded-lg`}
                >
                  <div className="aspect-[0.61/1] md:aspect-square h-20 relative">
                    <Image
                      src={img.sourceUrl}
                      alt={img.altText || product.name}
                      fill
                      sizes="80px"
                      className="object-contain"
                      loading="lazy"
                      fetchPriority="low"
                    />
                  </div>
                </button>
              );
            })}
      </div>

      {/* Imagem principal */}
      <div className="flex-1">
        <div className="aspect-[0.97/1] md:aspect-[0.96/1] h-[270px] relative overflow-hidden rounded-lg">
          {mainImage ? (
            <Image
              src={mainImage.sourceUrl}
              alt={mainImage.altText || product.name}
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-contain"
              loading="lazy"
              fetchPriority="low"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg" />
          )}
        </div>
      </div>
    </div>
  );
}
