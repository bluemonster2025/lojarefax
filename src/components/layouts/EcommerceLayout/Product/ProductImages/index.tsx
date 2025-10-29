"use client";

import Image from "next/image";
import { useMemo, useState, useEffect, useCallback } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { Product, ImageNode, VariationNode } from "@/types/product";
import ModelViewer from "../../ModelViewer";

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
    if (modeloAUrl) {
      arr.push({
        key: "modelA",
        label: modeloAName,
        url: modeloAUrl,
        is3d: isGlb(modeloAUrl),
      });
    }
    if (modeloBUrl) {
      arr.push({
        key: "modelB",
        label: modeloBName,
        url: modeloBUrl,
        is3d: isGlb(modeloBUrl),
      });
    }
    return arr;
  }, [modeloAUrl, modeloBUrl, modeloAName, modeloBName]);

  // ----- LISTA DE THUMBS DA GALERIA -----
  // regra:
  // - imagens da galeria oficial
  // - imagens das variações
  // - NÃO incluir product.image
  const imagesToShow: ImageNode[] = useMemo(() => {
    const arr: ImageNode[] = [];

    // imagens cadastradas na galeria
    product.galleryImages?.nodes.forEach((img) => {
      if (!arr.find((i) => i.sourceUrl === img.sourceUrl)) {
        arr.push(img);
      }
    });

    // imagens das variações
    variacoes.forEach((v) => {
      if (v.image && !arr.find((i) => i.sourceUrl === v.image!.sourceUrl)) {
        arr.push(v.image);
      }
    });

    return arr;
  }, [product.galleryImages?.nodes, variacoes]);

  // ----- VIEW MODE -----
  // null      = carregando/decidindo o que mostrar
  // "gallery" = vendo imagem clicada/selecionada
  // "modelA"  = vendo protótipo A
  // "modelB"  = vendo protótipo B
  type ViewMode = null | "gallery" | "modelA" | "modelB";

  const [viewMode, setViewMode] = useState<ViewMode>(null);

  // controle pra só mostrar o botão "VOLTAR AO MODELO" depois que o usuário
  // realmente clicou numa miniatura
  const [hasInteractedWithGallery, setHasInteractedWithGallery] =
    useState(false);

  // decide modo inicial uma vez
  useEffect(() => {
    if (viewMode !== null) return;

    if (isSimpleProduct) {
      if (modeloAUrl) {
        setViewMode("modelA");
      } else if (modeloBUrl) {
        setViewMode("modelB");
      } else {
        setViewMode("gallery");
      }
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

  const canPaginate = true;

  const goPrev = () => {
    const target = Math.max(current - STEP, 0);
    instanceRef.current?.moveToIdx(target);
  };

  const goNext = () => {
    const target = Math.min(current + STEP, maxIdx);
    instanceRef.current?.moveToIdx(target);
  };

  // pega dados do modelo atual
  const getModeloByKey = useCallback(
    (key: "modelA" | "modelB"): ModeloData | undefined => {
      return modelosDisponiveis.find((m) => m.key === key);
    },
    [modelosDisponiveis]
  );

  const currentModel =
    viewMode === "modelA" || viewMode === "modelB"
      ? getModeloByKey(viewMode)
      : undefined;

  const isBooting = viewMode === null;
  const isInGallery = viewMode === "gallery";

  // conteúdo grande principal renderizado
  const renderMainViewer = () => {
    // 1. carregando decisão inicial
    if (viewMode === null) {
      return (
        <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg flex items-center justify-center text-xs text-gray-500">
          Carregando visualização...
        </div>
      );
    }

    // 2. protótipo A/B (3D ou imagem)
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

    // 3. galeria normal
    if (viewMode === "gallery") {
      if (mainImage) {
        return (
          <Image
            src={mainImage.sourceUrl}
            alt={mainImage.altText || product.name}
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            className="object-contain"
            loading="lazy"
            fetchPriority="low"
          />
        );
      }

      return (
        <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg" />
      );
    }

    // fallback
    return (
      <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg" />
    );
  };

  // clique na miniatura → muda pra galeria
  const handleThumbClick = (img: ImageNode) => {
    setMainImage(img);

    const variation = variacoes.find(
      (v) => v.image?.sourceUrl === img.sourceUrl
    );
    if (variation) {
      setSelectedVar(variation);
    }

    setViewMode("gallery");
    setHasInteractedWithGallery(true); // agora podemos exibir botão VOLTAR AO MODELO
  };

  // voltar pro protótipo (prioriza modelo A, senão B)
  const handleVoltarAoModeloA = () => {
    if (modeloAUrl) {
      setViewMode("modelA");
    } else if (modeloBUrl) {
      setViewMode("modelB");
    }
  };

  // selecionar modelo manualmente (quando estou vendo protótipo)
  const handleSelectModel = (key: "modelA" | "modelB") => {
    setViewMode(key);
  };

  // label dinâmica do botão "voltar"
  const getVoltarLabel = () => {
    if (modeloAUrl) {
      return isGlb(modeloAUrl) ? "VOLTAR AO MODELO 3D" : "VOLTAR AO MODELO";
    }
    if (modeloBUrl) {
      return isGlb(modeloBUrl) ? "VOLTAR AO MODELO 3D" : "VOLTAR AO MODELO";
    }
    return "VOLTAR AO MODELO";
  };

  return (
    <div className="w-full bg-default-background/40 rounded-2xl p-4 md:p-6 border border-default-border/20">
      {/* bloco principal */}
      <div className="relative w-full rounded-xl bg-default-background border border-default-border/20 overflow-hidden">
        {/* SEGMENTED CONTROL (MODELO A / MODELO B)
           aparece se:
           - produto simples
           - tem pelo menos um modelo
           - NÃO estou em gallery
           - NÃO estou carregando
        */}
        {isSimpleProduct &&
          modelosDisponiveis.length > 0 &&
          !isInGallery &&
          !isBooting && (
            <div
              className="
                absolute top-3 left-3 z-20
                flex rounded-md border border-default-border/40 bg-white shadow-sm overflow-hidden
                text-[11px] md:text-[12px] font-semibold uppercase tracking-wide"
            >
              {modelosDisponiveis.map((modelo, idx) => {
                const active = viewMode === modelo.key;
                return (
                  <button
                    key={modelo.key}
                    type="button"
                    onClick={() => handleSelectModel(modelo.key)}
                    className={`
                      px-3 py-2 md:px-4 md:py-2 whitespace-nowrap
                      ${
                        active
                          ? "bg-[#FF6D6D] text-white"
                          : "bg-white text-default-text"
                      }
                      ${idx === 0 ? "rounded-l-md" : ""}
                      ${
                        idx === modelosDisponiveis.length - 1
                          ? "rounded-r-md"
                          : ""
                      }
                    `}
                  >
                    {modelo.label}
                  </button>
                );
              })}
            </div>
          )}

        {/* BOTÃO VOLTAR AO MODELO / VOLTAR AO MODELO 3D
           aparece se:
           - produto simples
           - tem modelos
           - estou vendo galeria AGORA
           - já cliquei na galeria pelo menos uma vez
           - e não está carregando inicial
        */}
        {isSimpleProduct &&
          modelosDisponiveis.length > 0 &&
          isInGallery &&
          hasInteractedWithGallery &&
          !isBooting && (
            <button
              type="button"
              onClick={handleVoltarAoModeloA}
              className="
                absolute top-3 right-3 z-20
                rounded-md border border-default-border/40 bg-white/90 shadow-sm
                px-3 py-2 md:px-4 md:py-2
                text-[11px] md:text-[12px] font-semibold uppercase tracking-wide text-default-text
              "
            >
              {getVoltarLabel()}
            </button>
          )}

        {/* BADGE ( 3D )
           aparece se:
           - estou vendo modelo (não galeria)
           - não estou carregando
           - e o modelo atual é 3D
        */}
        {!isInGallery && !isBooting && currentModel?.is3d && (
          <div
            className="
              absolute top-3 right-3 z-20
              rounded-full border border-default-text/70 text-default-text
              bg-white/90 px-2 py-1 text-[11px] font-semibold flex items-center justify-center leading-none"
          >
            ( 3D )
          </div>
        )}

        {/* área visual principal */}
        <div className="aspect-[0.97/1] md:aspect-[0.96/1] h-[270px] md:h-[360px] relative flex items-center justify-center bg-white">
          {renderMainViewer()}
        </div>
      </div>

      {/* Carrossel de miniaturas */}
      <div className="relative w-full mt-4 overflow-visible">
        {/* Prev */}
        {canPaginate && (
          <button
            type="button"
            onClick={goPrev}
            disabled={current <= 0}
            aria-label="Miniaturas anteriores"
            className={`
              absolute left-0 top-1/2 -translate-y-1/2
              w-8 h-8 rounded-full bg-default-text text-white flex items-center justify-center text-lg
              disabled:opacity-40 disabled:cursor-not-allowed
              shadow-md
              z-30
            `}
          >
            ‹
          </button>
        )}

        {/* trilho de thumbs (com margem pros botões laterais) */}
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
        {canPaginate && (
          <button
            type="button"
            onClick={goNext}
            disabled={current >= maxIdx}
            aria-label="Próximas miniaturas"
            className={`
              absolute right-0 top-1/2 -translate-y-1/2
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
