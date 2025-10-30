"use client";

import Image from "next/image";
import { useMemo, useState, useEffect, useCallback } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { Product, ImageNode, VariationNode } from "@/types/product";
import ModelViewer from "../../../../elements/ModelViewer";
import { Title } from "@/components/elements/Texts";
import Badge3DFromSVG from "./Badge3DFromSVG";

// util rápida pra saber se a URL é .glb
function isGlb(url?: string) {
  if (!url) return false;
  return url.toLowerCase().endsWith(".glb");
}

// Dados que vamos usar pra montar os modelos A / B
type ModeloData = {
  key: "modelA" | "modelB";
  label: string;
  url?: string;
  is3d: boolean;
};

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

  // É produto simples se não tem variação
  const isSimpleProduct = (variacoes?.length || 0) === 0;

  // ----- PREPARAR MODELOS A / B -----
  const modeloAUrl =
    product.imagemPrincipal?.imagemOuPrototipoA?.mediaItemUrl || undefined;
  const modeloBUrl =
    product.imagemPrincipal?.imagemOuPrototipoB?.mediaItemUrl || undefined;

  const modeloAName = product.imagemPrincipal?.modeloProdutoA || "MODELO A";
  const modeloBName = product.imagemPrincipal?.modeloProdutoB || "MODELO B";

  const modelosDisponiveis: ModeloData[] = useMemo(() => {
    const arr: ModeloData[] = [];
    if (modeloBUrl) {
      arr.push({
        key: "modelB",
        label: modeloBName,
        url: modeloBUrl,
        is3d: isGlb(modeloBUrl),
      });
    }
    if (modeloAUrl) {
      arr.push({
        key: "modelA",
        label: modeloAName,
        url: modeloAUrl,
        is3d: isGlb(modeloAUrl),
      });
    }
    return arr;
  }, [modeloAUrl, modeloBUrl, modeloAName, modeloBName]);

  // ----- LISTA DE THUMBS DA GALERIA -----
  const imagesToShow: ImageNode[] = useMemo(() => {
    const arr: ImageNode[] = [];
    product.galleryImages?.nodes.forEach((img) => {
      if (!arr.find((i) => i.sourceUrl === img.sourceUrl)) {
        arr.push(img);
      }
    });
    variacoes.forEach((v) => {
      if (v.image && !arr.find((i) => i.sourceUrl === v.image!.sourceUrl)) {
        arr.push(v.image);
      }
    });
    return arr;
  }, [product.galleryImages?.nodes, variacoes]);

  // ----- VIEW MODE -----
  type ViewMode = null | "gallery" | "modelA" | "modelB";
  const [viewMode, setViewMode] = useState<ViewMode>(null);
  const [hasInteractedWithGallery, setHasInteractedWithGallery] =
    useState(false);

  useEffect(() => {
    if (viewMode !== null) return;
    if (isSimpleProduct) {
      if (modeloAUrl) setViewMode("modelA");
      else if (modeloBUrl) setViewMode("modelB");
      else setViewMode("gallery");
    } else {
      setViewMode("gallery");
    }
  }, [isSimpleProduct, modeloAUrl, modeloBUrl, viewMode]);

  // ----- SLIDER STATE -----
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
      setMaxIdx(s.track.details.maxIdx);
      setCurrent(s.track.details.rel);
    },
  });

  const goPrev = () => {
    const target = Math.max(current - STEP, 0);
    instanceRef.current?.moveToIdx(target);
  };

  const goNext = () => {
    const target = Math.min(current + STEP, maxIdx);
    instanceRef.current?.moveToIdx(target);
  };

  const getModeloByKey = useCallback(
    (key: "modelA" | "modelB"): ModeloData | undefined =>
      modelosDisponiveis.find((m) => m.key === key),
    [modelosDisponiveis]
  );

  const currentModel =
    viewMode === "modelA" || viewMode === "modelB"
      ? getModeloByKey(viewMode)
      : undefined;

  const isBooting = viewMode === null;
  const isInGallery = viewMode === "gallery";

  const renderMainViewer = () => {
    if (viewMode === null) {
      return (
        <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg flex items-center justify-center text-xs text-gray-500">
          Carregando visualização...
        </div>
      );
    }
    if (viewMode === "modelA" || viewMode === "modelB") {
      const m = getModeloByKey(viewMode);
      if (!m || !m.url) {
        return (
          <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg flex items-center justify-center text-xs text-gray-500">
            Sem mídia do {m?.label || "modelo"}
          </div>
        );
      }
      if (m.is3d) {
        return (
          <ModelViewer
            src={m.url}
            alt={m.label}
            camera-controls
            auto-rotate
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "transparent",
            }}
          />
        );
      }
      return (
        <Image
          src={m.url}
          alt={m.label}
          fill
          sizes="(max-width: 768px) 100vw, 600px"
          className="object-contain"
          loading="lazy"
          fetchPriority="low"
        />
      );
    }
    if (viewMode === "gallery") {
      if (mainImage) {
        return (
          <Image
            src={mainImage.sourceUrl}
            alt={mainImage.altText || product.name}
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            className="object-fill"
            loading="lazy"
            fetchPriority="low"
          />
        );
      }
      return (
        <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg" />
      );
    }
    return (
      <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg" />
    );
  };

  const handleThumbClick = (img: ImageNode) => {
    setMainImage(img);
    const variation = variacoes.find(
      (v) => v.image?.sourceUrl === img.sourceUrl
    );
    if (variation) setSelectedVar(variation);
    setViewMode("gallery");
    setHasInteractedWithGallery(true);
  };

  const handleVoltarAoModeloA = () => {
    if (modeloAUrl) setViewMode("modelA");
    else if (modeloBUrl) setViewMode("modelB");
  };

  const handleSelectModel = (key: "modelA" | "modelB") => setViewMode(key);

  const getVoltarLabel = () => {
    if (modeloAUrl)
      return isGlb(modeloAUrl) ? "VOLTAR AO MODELO 3D" : "VOLTAR AO MODELO";
    if (modeloBUrl)
      return isGlb(modeloBUrl) ? "VOLTAR AO MODELO 3D" : "VOLTAR AO MODELO";
    return "VOLTAR AO MODELO";
  };

  return (
    <div className="w-full bg-default-background/40 rounded-2xl border border-default-border/20">
      {/* bloco principal */}
      <div className="relative w-full overflow-visible">
        {/* segmented control (A/B) */}
        {isSimpleProduct &&
          modelosDisponiveis.length > 0 &&
          !isInGallery &&
          !isBooting && (
            <div className="absolute top-3 left-3 z-20 p-2 flex rounded-lg border border-default-border bg-white overflow-hidden tracking-wide">
              {modelosDisponiveis.map((modelo, idx) => {
                const active = viewMode === modelo.key;
                return (
                  <button
                    key={modelo.key}
                    type="button"
                    onClick={() => handleSelectModel(modelo.key)}
                    className={`
                      px-3 py-2 md:px-4 md:py-2 whitespace-nowrap cursor-pointer
                      ${
                        active
                          ? "bg-alert-red text-white"
                          : "bg-white text-default-text"
                      }
                      ${idx === 0 ? "rounded-lg" : ""}
                      ${
                        idx === modelosDisponiveis.length - 1
                          ? "rounded-lg"
                          : ""
                      }
                    `}
                  >
                    <Title as="h5" variant="h5">
                      {modelo.label}
                    </Title>
                  </button>
                );
              })}
            </div>
          )}

        {/* voltar ao modelo */}
        {isSimpleProduct &&
          modelosDisponiveis.length > 0 &&
          isInGallery &&
          hasInteractedWithGallery &&
          !isBooting && (
            <button
              type="button"
              onClick={handleVoltarAoModeloA}
              className="
                cursor-pointer absolute top-3 right-3 z-20
                rounded-md border border-default-border/40 bg-white/90 shadow-sm
                px-3 py-2 md:px-4 md:py-2
              "
            >
              <Title as="h5" variant="h5">
                {getVoltarLabel()}
              </Title>
            </button>
          )}

        {/* BADGE (3D) — substitui o antigo bloco estático */}
        {!isInGallery && !isBooting && currentModel?.is3d && <Badge3DFromSVG />}

        {/* área visual principal */}
        <div className="aspect-[0.97/1] md:aspect-[1.52/1] h-full relative bg-white mx-auto rounded-2xl overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            {renderMainViewer()}
          </div>
        </div>
      </div>

      {/* Carrossel de miniaturas */}
      <div className="relative w-full mt-4 overflow-visible">
        {/* Prev */}
        {true && (
          <button
            type="button"
            onClick={goPrev}
            disabled={current <= 0}
            aria-label="Miniaturas anteriores"
            className={`
              cursor-pointer absolute left-0 top-1/2 -translate-y-1/2
              w-8 h-8 rounded-full bg-default-text text-white flex items-center justify-center text-lg
              disabled:opacity-40 disabled:cursor-not-allowed
              shadow-md
              z-30
            `}
          >
            ‹
          </button>
        )}

        {/* trilho */}
        <div className="mx-10 overflow-hidden">
          {imagesToShow.length === 0 ? (
            <div className="flex gap-3">
              {Array(7)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square w-20 bg-gray-200 rounded-lg animate-pulse"
                  />
                ))}
            </div>
          ) : (
            <div ref={sliderRef} className="keen-slider">
              {imagesToShow.map((img) => (
                <button
                  key={img.sourceUrl}
                  onClick={() => handleThumbClick(img)}
                  className="keen-slider__slide cursor-pointer"
                >
                  <div
                    className="
                      aspect-square w-full relative rounded-lg overflow-hidden
                      border-2 border-white shadow-sm
                    "
                  >
                    <Image
                      src={img.sourceUrl}
                      alt={img.altText || product.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                      loading="lazy"
                      fetchPriority="low"
                    />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Next */}
        {true && (
          <button
            type="button"
            onClick={goNext}
            disabled={current >= maxIdx}
            aria-label="Próximas miniaturas"
            className={`
              cursor-pointer absolute right-0 top-1/2 -translate-y-1/2
              w-8 h-8 rounded-full bg-default-text text-white flex items-center justify-center text-lg
              disabled:opacity-40 disabled:cursor-not-allowed
              shadow-md
              z-30
            `}
          >
            ›
          </button>
        )}
      </div>
    </div>
  );
}
