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
  playing: boolean;
};

function GalleryVideo({
  src,
  label,
  className = "",
  preload = "auto",
  playing,
}: GalleryVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;

    if (!playing) {
      video.pause();
      return;
    }

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
  }, [src, playing]);

  return (
    <video
      ref={videoRef}
      src={src}
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
      items.push({ type: "video", src: videoUrl });
    }

    return items;
  }, [images, videoUrl]);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex] ?? slides[0];
  const isVideoActive = activeSlide?.type === "video";

  if (!activeSlide) return null;

  return (
    <div className="flex gap-3 md:gap-4 items-start">
      {slides.length > 1 && (
        <div className="flex shrink-0 flex-col gap-3 overflow-y-auto max-h-[min(80vw,36rem)] py-0.5 pr-0.5">
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
              aria-pressed={activeIndex === index}
              className={`relative h-24 w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
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
                  className="h-full w-full object-cover pointer-events-none"
                  preload="metadata"
                  playing={!isVideoActive}
                />
              ) : (
                <ProductImage
                  src={slide.src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              )}
            </button>
          ))}
        </div>
      )}

      <div className="min-w-0 flex-1 aspect-square relative overflow-hidden rounded-xl bg-brand-surface shadow-sm">
        {activeSlide.type === "video" ? (
          <GalleryVideo
            key={`main-${activeSlide.src}`}
            src={activeSlide.src}
            label={`Видео — ${name}`}
            className="h-full w-full object-cover bg-black"
            playing
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
    </div>
  );
}
