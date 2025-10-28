"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
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
  const STEP = 7;

  // Monta array de thumbs (ImageNode)
  const imagesToShow: ImageNode[] = useMemo(() => {
    const arr: ImageNode[] = [];
    if (product.image) arr.push(product.image);

    product.galleryImages?.nodes.forEach((img) => {
      if (!arr.find((i) => i.sourceUrl === img.sourceUrl)) arr.push(img);
    });

    variacoes.forEach((v) => {
      if (v.image && !arr.find((i) => i.sourceUrl === v.image!.sourceUrl)) {
        arr.push(v.image);
      }
    });

    return arr;
  }, [product.image, product.galleryImages?.nodes, variacoes]);

  // Estado que acompanha o slider
  const [current, setCurrent] = useState(0);
  const [maxIdx, setMaxIdx] = useState(0);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    mode: "snap",
    rubberband: false,
    slides: { perView: 7, spacing: 12 },
    breakpoints: {
      "(max-width: 1024px)": { slides: { perView: 5, spacing: 12 } },
      "(max-width: 768px)": { slides: { perView: 4, spacing: 10 } },
      "(max-width: 480px)": { slides: { perView: 3.2, spacing: 10 } },
    },
    created(s) {
      setCurrent(s.track.details.rel);
      setMaxIdx(s.track.details.maxIdx);
    },
    slideChanged(s) {
      setCurrent(s.track.details.rel);
    },
    updated(s) {
      // Atualiza limites ao mudar viewport/quantidade de slides
      setMaxIdx(s.track.details.maxIdx);
      setCurrent(s.track.details.rel);
    },
  });

  const canPaginate = imagesToShow.length > 7;

  const goPrev = () => {
    const target = Math.max(current - STEP, 0);
    instanceRef.current?.moveToIdx(target);
  };

  const goNext = () => {
    const target = Math.min(current + STEP, maxIdx);
    instanceRef.current?.moveToIdx(target);
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      {/* Imagem principal */}
      <div className="w-full bg-default-background rounded-2lg">
        <div className="aspect-[0.97/1] md:aspect-[0.96/1] h-[270px] relative overflow-hidden mx-auto">
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

      {/* Carrossel de miniaturas */}
      <div className="w-full relative">
        {/* Prev à esquerda da primeira thumb */}
        {canPaginate && (
          <button
            type="button"
            onClick={goPrev}
            disabled={current <= 0}
            aria-label="Miniaturas anteriores"
            className={`absolute left-0 top-1/4 z-10 
              rounded-full bg-default-text text-default-white w-8 h-8 cursor-pointer flex items-center justify-center 
              disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            ‹
          </button>
        )}

        <div className="mx-10">
          {imagesToShow.length === 0 ? (
            <div className="flex gap-3">
              {Array(7)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square w-20 bg-gray-200 rounded animate-pulse"
                  />
                ))}
            </div>
          ) : (
            <div ref={sliderRef} className="keen-slider">
              {imagesToShow.map((img) => (
                <button
                  key={img.sourceUrl}
                  onClick={() => {
                    setMainImage(img);
                    const variation = variacoes.find(
                      (v) => v.image?.sourceUrl === img.sourceUrl
                    );
                    if (variation) setSelectedVar(variation);
                  }}
                  className="keen-slider__slide overflow-hidden cursor-pointer rounded-lg"
                >
                  <div className="aspect-square w-full relative">
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
              ))}
            </div>
          )}
        </div>

        {/* Next à direita da última thumb */}
        {canPaginate && (
          <button
            type="button"
            onClick={goNext}
            disabled={current >= maxIdx}
            aria-label="Próximas miniaturas"
            className={`absolute right-0 top-1/4 z-10 
              rounded-full bg-default-text text-default-white w-8 h-8 cursor-pointer flex items-center justify-center 
              disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            ›
          </button>
        )}
      </div>
    </div>
  );
}
