"use client";

import Link from "next/link";
import Image from "next/image";
import { RawImage } from "@/types/siteConfig";

interface Props {
  logo?: RawImage;
  className?: string;
}

export default function Logo({
  logo,
  className = "relative w-27 aspect-[2/1] lg:aspect-square",
}: Props) {
  const imgUrl = logo?.sourceUrl || "";

  return (
    <Link href="/" aria-label="Logo">
      <div className={className}>
        <Image
          src={imgUrl}
          alt="Logo Ncell"
          fill
          sizes="(max-width: 768px) 100vw, 112px"
          className="object-contain"
          priority
          fetchPriority="high"
        />
      </div>
    </Link>
  );
}
