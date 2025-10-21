"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export interface MediaItem {
  databaseId: number;
  sourceUrl: string;
  altText: string | null;
  title: { rendered: string } | string;
}

interface MediaModalProps {
  onSelect: (url: string, alt: string, id: number) => void;
  onClose: () => void;
}

export default function MediaModal({ onSelect, onClose }: MediaModalProps) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Busca a galeria
  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/wpMedia", { credentials: "include" });
      const data = await res.json();

      if (!res.ok && res.status !== 200) {
        setError(data.error || "Erro desconhecido");
        setMedia([]);
        return;
      }

      setMedia(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao buscar mídia:", err);
      setError("Erro ao buscar mídia");
      setMedia([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  // ✅ Upload via rota Next.js
  const handleUpload = async (file: File) => {
    if (!file) return;
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", file.name);

      const res = await fetch("/api/wpMedia", {
        method: "POST",
        body: formData,
      });

      const uploaded = await res.json();

      if (!res.ok) {
        console.error("Erro no upload:", uploaded);
        alert("Erro ao enviar a imagem.");
        return;
      }

      // Adiciona a nova imagem no início da galeria
      setMedia((prev) => [
        {
          databaseId: uploaded.databaseId,
          sourceUrl: uploaded.sourceUrl,
          altText: uploaded.altText,
          title: uploaded.title,
        },
        ...prev,
      ]);
    } catch (err) {
      console.error("Erro ao enviar arquivo:", err);
      alert("Erro ao enviar a imagem.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl max-w-4xl w-full h-[80vh] overflow-auto">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold">Selecionar Imagem</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* Upload de nova imagem */}
        <div className="mb-4">
          <label className="block mb-2 font-medium">Enviar nova imagem:</label>
          <input
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={async (e) => {
              if (!e.target.files?.[0]) return;
              await handleUpload(e.target.files[0]);
              e.target.value = ""; // limpa o input
            }}
          />
          {uploading && (
            <p className="text-sm text-blue-500 mt-1">Enviando imagem...</p>
          )}
        </div>

        {loading ? (
          <p>Carregando...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : media.length === 0 ? (
          <p>Nenhuma imagem encontrada.</p>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {media
              .filter((item) => !!item.sourceUrl)
              .map((item) => (
                <div
                  key={item.databaseId}
                  className="cursor-pointer rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500"
                  onClick={() =>
                    onSelect(
                      item.sourceUrl,
                      item.altText ||
                        (typeof item.title === "string"
                          ? item.title
                          : item.title.rendered),
                      item.databaseId
                    )
                  }
                >
                  <Image
                    src={item.sourceUrl}
                    alt={
                      item.altText ||
                      (typeof item.title === "string"
                        ? item.title
                        : item.title.rendered) ||
                      "Imagem"
                    }
                    width={150}
                    height={150}
                    className="object-cover w-full h-24"
                    loading="lazy"
                    fetchPriority="low"
                  />
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
