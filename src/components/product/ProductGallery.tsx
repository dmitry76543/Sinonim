"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ProductImage } from "@/components/catalog/ProductImage";

type GallerySlide =
  | { type: "image"; src: string }
  | { type: "video"; src: string };

type ProductGalleryProps = {
  images: string[];
  name: string;
  videoUrl?: string;
};

type GalleryVideoProps = {
  src: string;
  label: string;
  className?: string;
  preload?: "auto" | "metadata";
};

function GalleryVideo({
  src,
  label,
  className = "",
  preload = "auto",
}: GalleryVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;

    const play = () => {
      const promise = video.play();
      if (promise) {
        promise.catch(() => {
          // Browser may block autoplay until interaction.
        });
      }
    };

    play();

    if (video.readyState < 2) {
      video.addEventListener("loadeddata", play, { once: true });
      return () => video.removeEventListener("loadeddata", play);
    }
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload={preload}
      className={className}
      aria-label={label}
    />
  );
}

export function ProductGallery({ images, name, videoUrl }: ProductGalleryProps) {
  const slides = useMemo(() => {
    const uniqueImages = images.filter((img, i, arr) => arr.indexOf(img) === i);
    const items: GallerySlide[] = uniqueImages.map((src) => ({
      type: "image",
      src,
    }));

    if (videoUrl) {
      items.unshift({ type: "video", src: videoUrl });
    }

    return items;
  }, [images, videoUrl]);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex] ?? slides[0];

  if (!activeSlide) return null;

  return (
    <div className="space-y-4">
      <div className="aspect-square relative overflow-hidden rounded-xl bg-brand-surface shadow-sm">
        {activeSlide.type === "video" ? (
          <GalleryVideo
            key={`main-${activeSlide.src}`}
            src={activeSlide.src}
            label={`Видео — ${name}`}
            className="h-full w-full object-cover bg-black"
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
              key={
                slide.type === "video"
                  ? `video-${slide.src}`
                  : `${slide.src}-${index}`
              }
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
                <GalleryVideo
                  key={`thumb-${slide.src}`}
                  src={slide.src}
                  label={`Видео ${name}`}
                  className="h-full w-full object-cover"
                  preload="metadata"
                />
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
