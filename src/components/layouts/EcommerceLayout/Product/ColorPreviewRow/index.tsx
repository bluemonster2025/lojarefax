"use client";

import { useState } from "react";
import ColorCatalogModal from "./ColorCatalogModal";
import { Title } from "@/components/elements/Texts";

export default function ColorPreviewRow() {
  const [open, setOpen] = useState(false);

  const previewColors = [
    "#625536",
    "#8B5B33",
    "#424038",
    "#585139",
    "#D1A63F",
    "#D49A3D",
    "#C86334",
    "#962A28",
    "#568D46",
    "#005E37",
    "#007E7B",
    "#005E37",
  ];

  return (
    <>
      <div className="flex flex-col items-start gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {previewColors.map((c, i) => (
            <div
              key={i}
              className="h-8 w-8 rounded"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        <button
          type="button"
          className="text-[10px] leading-none tracking-[0.08em] underline uppercase text-neutral-800 hover:text-black"
          onClick={() => setOpen(true)}
        >
          <Title as="h5" variant="h5" className="underline cursor-pointer">
            Veja o catálogo completo de cores
          </Title>
        </button>
      </div>

      <ColorCatalogModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
