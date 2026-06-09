"use client";

import Image from "next/image";
import { useState } from "react";

type ProductGalleryProps = {
  images: string[];
  name: string;
};

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const uniqueImages = images.filter((img, i, arr) => arr.indexOf(img) === i);

  return (
    <div className="space-y-4">
      <div className="aspect-square relative overflow-hidden rounded-xl bg-brand-surface shadow-sm">
        <Image
          src={uniqueImages[activeIndex]}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>

      {uniqueImages.length > 1 && (
        <div className="flex gap-3">
          {uniqueImages.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                activeIndex === index
                  ? "border-brand-olive"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={src} alt="" fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
