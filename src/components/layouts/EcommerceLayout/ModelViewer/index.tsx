"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";

interface ModelViewerProps {
  src: string;
  alt?: string;
  autoRotate?: boolean;
  cameraControls?: boolean;
  ar?: boolean;
  exposure?: string | number;
  shadowIntensity?: string | number;
  environmentImage?: string;
  interactionPrompt?: string;
  initialCameraOrbit?: string;
  zoomScale?: number;
  className?: string;
  style?: React.CSSProperties;
  posterUrl?: string; // imagem leve antes do glb carregar
}

const defaultProps = {
  alt: "3D model",
  autoRotate: true,
  cameraControls: true,
  ar: false,
  exposure: "1",
  shadowIntensity: "1",
  environmentImage: "neutral",
  interactionPrompt: "auto",
  initialCameraOrbit: undefined,
  zoomScale: 1,
  posterUrl: undefined,
};

export default function ModelViewer(rawProps: ModelViewerProps) {
  // container visível que React controla
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // slot interno onde vamos injetar <model-viewer>
  const viewerHostRef = useRef<HTMLDivElement | null>(null);

  // guardo a instância criada pra poder fazer cleanup certinho
  const modelElRef = useRef<HTMLElement | null>(null);

  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isLibReady, setIsLibReady] = useState(false);

  const {
    src,
    alt,
    autoRotate,
    cameraControls,
    ar,
    exposure,
    shadowIntensity,
    environmentImage,
    interactionPrompt,
    initialCameraOrbit,
    zoomScale,
    className = "",
    style,
    posterUrl,
  } = { ...defaultProps, ...rawProps };

  useEffect(() => {
    let cancelled = false;

    async function setup() {
      // 1. carrega o web component só no client (lazy import)
      if (!isLibReady) {
        try {
          await import("@google/model-viewer");
          if (cancelled) return;
          setIsLibReady(true);
        } catch (err) {
          console.error("Erro carregando @google/model-viewer", err);
          return;
        }
      }

      if (!viewerHostRef.current) return;

      // 2. se já existia um <model-viewer>, remove ele antes de recriar
      if (modelElRef.current && modelElRef.current.parentNode) {
        modelElRef.current.parentNode.removeChild(modelElRef.current);
        modelElRef.current = null;
      }

      // 3. cria elemento <model-viewer>
      const mv = document.createElement("model-viewer") as HTMLElement;
      modelElRef.current = mv;

      mv.setAttribute("src", src);
      mv.setAttribute("alt", alt || "3D model");

      // Performance / UX
      mv.setAttribute("loading", "lazy");
      mv.setAttribute("reveal", "auto");

      if (posterUrl) {
        mv.setAttribute("poster", posterUrl);
      }

      if (autoRotate) mv.setAttribute("auto-rotate", "");
      if (cameraControls) mv.setAttribute("camera-controls", "");
      if (ar) mv.setAttribute("ar", "true");

      if (exposure !== undefined) {
        mv.setAttribute("exposure", String(exposure));
      }

      if (shadowIntensity !== undefined) {
        mv.setAttribute("shadow-intensity", String(shadowIntensity));
      }

      if (environmentImage) {
        mv.setAttribute("environment-image", environmentImage);
      }

      if (interactionPrompt) {
        mv.setAttribute("interaction-prompt", interactionPrompt);
      }

      if (initialCameraOrbit) {
        mv.setAttribute("camera-orbit", initialCameraOrbit);
      }

      // aplica estilo inline no <model-viewer>
      Object.assign(mv.style, {
        width: "100%",
        height: "100%",
        backgroundColor: "transparent",
        transform: `scale(${zoomScale})`,
        transformOrigin: "center",
        ...(style || {}),
      });

      // 4. quando terminar o load, some overlay
      const handleLoad = () => {
        if (!cancelled) {
          setIsModelLoaded(true);
        }
      };
      mv.addEventListener("load", handleLoad);

      // 5. injeta só dentro do viewerHostRef
      viewerHostRef.current.appendChild(mv);
    }

    setup();

    return () => {
      cancelled = true;
      if (modelElRef.current && modelElRef.current.parentNode) {
        modelElRef.current.parentNode.removeChild(modelElRef.current);
      }
      modelElRef.current = null;
    };
  }, [
    src,
    alt,
    autoRotate,
    cameraControls,
    ar,
    exposure,
    shadowIntensity,
    environmentImage,
    interactionPrompt,
    initialCameraOrbit,
    zoomScale,
    style,
    posterUrl,
    isLibReady,
  ]);

  return (
    <div
      ref={wrapperRef}
      className={`relative w-full h-full ${className}`}
      style={{ backgroundColor: "transparent" }}
    >
      {/* host onde vamos montar <model-viewer> dinamicamente */}
      <div
        ref={viewerHostRef}
        className="w-full h-full"
        style={{ backgroundColor: "transparent" }}
      />

      {/* overlay controlado por React, fica por cima até carregar */}
      {!isModelLoaded && (
        <div className="pointer-events-none absolute inset-0 rounded-lg bg-white/60 flex items-center justify-center text-[11px] text-gray-600">
          {posterUrl ? (
            <div className="relative max-w-[80%] max-h-[80%] w-full h-full flex items-center justify-center">
              <Image
                src={posterUrl}
                alt={alt || "preview"}
                fill
                sizes="300px"
                className="object-contain rounded"
                priority={false}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full border-2 border-gray-400 border-t-transparent animate-spin" />
              <span>Carregando visualização 3D…</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
