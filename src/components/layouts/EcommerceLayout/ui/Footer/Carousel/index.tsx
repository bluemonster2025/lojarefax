"use client";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Image from "next/image";
import { logos } from "./content";

const animation = { duration: 15000, easing: (t: number) => t };

export default function Carousel() {
  const [sliderRef] = useKeenSlider({
    loop: true,
    renderMode: "performance",
    drag: false,
    slides: { spacing: 5 },
    created(s) {
      s.moveToIdx(5, true, animation);
    },
    updated(s) {
      s.moveToIdx(s.track.details.abs + 5, true, animation);
    },
    animationEnded(s) {
      s.moveToIdx(s.track.details.abs + 5, true, animation);
    },
    breakpoints: {
      "(max-width: 639px)": {
        slides: { perView: 3, spacing: 5 },
      },
      "(min-width: 640px) and (max-width: 1023px)": {
        slides: { perView: 6, spacing: 5 },
      },
      "(min-width: 1024px)": {
        slides: { perView: 12, spacing: 5 },
      },
    },
  });

  return (
    <div className="w-full pb-16">
      <div ref={sliderRef} className="keen-slider w-full">
        {logos.map(({ src, alt }, idx) => (
          <div
            key={idx}
            className="keen-slider__slide flex items-center justify-center"
          >
            <div className="relative aspect-square w-full max-w-[120px]">
              <Image
                src={src}
                alt={alt}
                fill
                className="object-contain"
                sizes="120px"
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
