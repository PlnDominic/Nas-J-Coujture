"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Slide = { src: string; alt: string };

const INTERVAL_MS = 4500;

export default function HeroSlider({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [paused, slides.length]);

  return (
    <div
      className="relative h-full w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, i) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          fill
          priority={i === 0}
          sizes="(min-width: 640px) 500px, 62vw"
          className={`object-cover transition-opacity duration-700 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {slides.length > 1 && (
        <div className="absolute inset-x-0 bottom-3 z-30 flex justify-center gap-1.5">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show slide ${i + 1}: ${slide.alt}`}
              aria-current={i === index}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-5 bg-foreground" : "w-1.5 bg-foreground/30"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
