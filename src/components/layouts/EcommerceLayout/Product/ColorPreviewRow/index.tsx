"use client";

import { useState } from "react";
import ColorCatalogModal from "./ColorCatalogModal";

export default function ColorPreviewRow() {
  const [open, setOpen] = useState(false);

  const previewColors = [
    "#5A4A2D",
    "#8A5C32",
    "#9A7B4E",
    "#B48C3A",
    "#D5A640",
    "#DB7F2A",
    "#A8372A",
    "#5A7A2F",
    "#2F7E4F",
    "#008066",
    "#007A6A",
  ];

  return (
    <>
      <div className="flex flex-col items-start gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {previewColors.map((c, i) => (
            <div
              key={i}
              className="h-6 w-6 rounded-[3px] border border-black/20"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        <button
          type="button"
          className="text-[10px] leading-none tracking-[0.08em] underline uppercase text-neutral-800 hover:text-black"
          onClick={() => setOpen(true)}
        >
          Veja o catálogo completo de cores
        </button>
      </div>

      <ColorCatalogModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
