"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { resolveProductImageUrl } from "@/lib/advantshop/images";

const FALLBACK_IMAGE = "/images/product-ring.webp";

type ProductImageProps = Omit<ImageProps, "src" | "alt"> & {
  src: string;
  alt: string;
  fallbackSrc?: string;
};

export function ProductImage({
  src,
  alt,
  fallbackSrc = FALLBACK_IMAGE,
  ...props
}: ProductImageProps) {
  const [currentSrc, setCurrentSrc] = useState(resolveProductImageUrl(src));
  const isProxied = currentSrc.startsWith("/api/advantshop-image");

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      unoptimized={isProxied}
      onError={() => {
        if (currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        }
      }}
    />
  );
}
