"use client";

import { useEffect } from "react";
import {
  getPhottaApiKey,
  PHOTTA_EMBED_SCRIPT_ID,
  PHOTTA_INLINE_MOUNT_ID,
} from "@/lib/photta/config";

export function ProductTryOn() {
  const apiKey = getPhottaApiKey();

  useEffect(() => {
    if (!apiKey) return;
    if (document.getElementById(PHOTTA_EMBED_SCRIPT_ID)) return;

    const js = document.createElement("script");
    js.id = PHOTTA_EMBED_SCRIPT_ID;
    js.async = true;
    js.src = "https://widget.photta.app/v1/embed.js";
    js.dataset.apiKey = apiKey;
    js.dataset.productType = "jewelry";
    js.dataset.mode = "inline";
    document.head.appendChild(js);
  }, [apiKey]);

  if (!apiKey) return null;

  return (
    <section
      className="mt-8 rounded-xl border border-brand-olive/15 bg-brand-surface p-6 md:p-8"
      aria-label="Виртуальная примерка"
    >
      <h2 className="font-heading text-xl text-brand-olive-dark mb-4">
        Примерка изделия
      </h2>
      <div id={PHOTTA_INLINE_MOUNT_ID} className="min-h-[280px]" />
      <noscript>
        <p className="mt-3 text-sm text-brand-muted">
          Для виртуальной примерки включите JavaScript в браузере.
        </p>
      </noscript>
    </section>
  );
}
