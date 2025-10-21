"use client";

import { useState } from "react";
import { ButtonTertiary } from "@/components/elements/Button";
import MediaModal from "../MediaModal";
import { Text } from "@/components/elements/Texts";

interface ImageUploadProps {
  label: string;
  initialImage?: string;
  onChange?: (url: string, id: number) => void;
  containerClass?: string;
  aspectClass?: string;
  rounded?: string;
  dimensions?: string;
}

export default function ImageUpload({
  label,
  initialImage,
  onChange,
  containerClass = "",
  aspectClass = "aspect-1",
  rounded = "rounded-lg",
  dimensions,
}: ImageUploadProps) {
  const [image, setImage] = useState(initialImage);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelect = (url: string, alt: string, id: number) => {
    setImage(url);
    onChange?.(url, id);
    setIsModalOpen(false);
  };

  return (
    <div className={`mb-4 ${containerClass}`}>
      <div
        className={`relative w-full bg-cover bg-center ${aspectClass} ${rounded} overflow-hidden mb-2 group`}
        style={{ backgroundImage: image ? `url(${image})` : undefined }}
      >
        {/* Overlay escuro apenas no hover */}
        {image && (
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}

        {/* Texto "Sem imagem" */}
        {!image && (
          <div className="flex items-center justify-center h-full text-gray-400">
            Sem imagem
          </div>
        )}

        {/* Conteúdo visível apenas no hover */}
        {image && (
          <div className="gap-4 absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 text-center px-4">
            <div>
              <ButtonTertiary onClick={() => setIsModalOpen(true)}>
                {label}
              </ButtonTertiary>
            </div>
            <div>
              <Text className="text-xs text-white font-bold">{dimensions}</Text>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <MediaModal
          onSelect={handleSelect}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
