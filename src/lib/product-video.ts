import { existsSync } from "node:fs";
import path from "node:path";

const PRODUCT_VIDEOS_DIR = ["public", "videos", "products"];

function normalizeArtNo(artNo: string): string {
  return artNo.trim();
}

function getProductVideoFilePath(artNo: string): string {
  const safeName = normalizeArtNo(artNo).replace(/[\\/]/g, "");
  return path.join(process.cwd(), ...PRODUCT_VIDEOS_DIR, `${safeName}.mp4`);
}

/** Public URL for a product video matched by art number, if the file exists. */
export function getProductVideoUrl(artNo?: string | null): string | undefined {
  if (!artNo) return undefined;

  const normalized = normalizeArtNo(artNo);
  if (!normalized) return undefined;

  const filePath = getProductVideoFilePath(normalized);
  if (!existsSync(filePath)) return undefined;

  return `/videos/products/${encodeURIComponent(normalized)}.mp4`;
}

/** First matching video among base artNo and modification art numbers. */
export function resolveProductVideoUrl(
  artNos: Array<string | undefined | null>,
): string | undefined {
  for (const artNo of artNos) {
    const url = getProductVideoUrl(artNo);
    if (url) return url;
  }
  return undefined;
}
