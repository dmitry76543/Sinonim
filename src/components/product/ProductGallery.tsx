"use client";

import { useMemo, useState } from "react";
import { ProductImage } from "@/components/catalog/ProductImage";

type GallerySlide =
  | { type: "image"; src: string }
  | { type: "video"; src: string };

type ProductGalleryProps = {
  images: string[];
  name: string;
  videoUrl?: string;
};

export function ProductGallery({ images, name, videoUrl }: ProductGalleryProps) {
  const slides = useMemo(() => {
    const uniqueImages = images.filter((img, i, arr) => arr.indexOf(img) === i);
    const items: GallerySlide[] = uniqueImages.map((src) => ({
      type: "image",
      src,
    }));

    if (videoUrl) {
      items.push({ type: "video", src: videoUrl });
    }

    return items;
  }, [images, videoUrl]);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex] ?? slides[0];
  const poster = slides.find((slide) => slide.type === "image")?.src;

  if (!activeSlide) return null;

  return (
    <div className="space-y-4">
      <div className="aspect-square relative overflow-hidden rounded-xl bg-brand-surface shadow-sm">
        {activeSlide.type === "video" ? (
          <video
            key={activeSlide.src}
            src={activeSlide.src}
            controls
            playsInline
            preload="metadata"
            poster={poster}
            className="h-full w-full object-cover bg-black"
            aria-label={`Видео — ${name}`}
          />
        ) : (
          <ProductImage
            src={activeSlide.src}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        )}
      </div>

      {slides.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {slides.map((slide, index) => (
            <button
              key={slide.type === "video" ? `video-${slide.src}` : `${slide.src}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={
                slide.type === "video"
                  ? `Видео ${name}`
                  : `${name} — фото ${index + 1}`
              }
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                activeIndex === index
                  ? "border-brand-olive"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              {slide.type === "video" ? (
                <>
                  {poster ? (
                    <ProductImage
                      src={poster}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : (
                    <span className="absolute inset-0 bg-brand-olive-dark" />
                  )}
                  <span className="absolute inset-0 flex items-center justify-center bg-black/35">
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden
                      className="text-white"
                    >
                      <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M10 8.5v7l6-3.5-6-3.5z" fill="currentColor" />
                    </svg>
                  </span>
                </>
              ) : (
                <ProductImage
                  src={slide.src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
