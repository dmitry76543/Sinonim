"use client";

import { useEffect } from "react";
import {
  PHOTTA_EMBED_SCRIPT_ID,
  PHOTTA_EMBED_SCRIPT_SRC,
} from "@/lib/photta/config";

type ProductTryOnProps = {
  apiKey: string;
  productImage?: string;
};

function loadPhottaEmbed({ apiKey, productImage }: ProductTryOnProps) {
  const existing = document.getElementById(
    PHOTTA_EMBED_SCRIPT_ID,
  ) as HTMLScriptElement | null;

  if (existing) {
    existing.setAttribute("data-api-key", apiKey);
    existing.setAttribute("data-product-type", "jewelry");
    existing.setAttribute("data-mode", "inline");
    if (productImage) {
      existing.setAttribute("data-product-image", productImage);
    } else {
      existing.removeAttribute("data-product-image");
    }
    return;
  }

  const js = document.createElement("script");
  js.id = PHOTTA_EMBED_SCRIPT_ID;
  js.async = true;
  js.src = PHOTTA_EMBED_SCRIPT_SRC;
  js.setAttribute("data-api-key", apiKey);
  js.setAttribute("data-product-type", "jewelry");
  js.setAttribute("data-mode", "inline");
  if (productImage) {
    js.setAttribute("data-product-image", productImage);
  }
  document.head.appendChild(js);
}

export function ProductTryOn({ apiKey, productImage }: ProductTryOnProps) {
  useEffect(() => {
    loadPhottaEmbed({ apiKey, productImage });
  }, [apiKey, productImage]);

  return null;
}
