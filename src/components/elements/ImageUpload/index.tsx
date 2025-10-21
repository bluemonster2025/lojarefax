"use client";
import { ChangeEvent } from "react";
import Image from "next/image";

interface ImageUploadProps {
  label: string;
  image: { id: number; url: string };
  onChange: (url: string) => void;
  containerClass?: string; // para passar classes do container externo
  aspectClass?: string; // para o div da imagem, ex: desktop/mobile
  imgClass?: string; // classes adicionais no <Image>
  rounded?: string;
}

export default function ImageUpload({
  label,
  image,
  onChange,
  containerClass = "",
  aspectClass = "aspect-1",
  imgClass = "",
  rounded,
}: ImageUploadProps) {
  return (
    <div className={`mb-4 ${containerClass}`}>
      <div
        className={`relative w-full ${aspectClass} bg-gray-100 ${rounded} overflow-hidden mb-2`}
      >
        {image?.url ? (
          <Image
            src={image.url}
            alt={label}
            fill
            className={`object-cover ${imgClass}`}
            loading="lazy"
            fetchPriority="low"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Sem imagem
          </div>
        )}
      </div>

      <label className="cursor-pointer px-6 py-2 bg-white border border-grayscale-100 text-grayscale-450 rounded text-sm font-semibold">
        {label}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const url = URL.createObjectURL(file);
            onChange(url);
          }}
        />
      </label>

      {image?.url && (
        <p className="mt-2 text-sm text-gray-500 truncate">
          {image.url.split("/").pop()}
        </p>
      )}
    </div>
  );
}
