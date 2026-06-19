import { resolveProductImageUrl } from "@/lib/advantshop/images";
import { getSiteUrl } from "@/lib/site-url";

export const DEFAULT_OG_IMAGE = "/images/product-ring.webp";

export function absoluteImageUrl(src: string): string {
  const siteUrl = getSiteUrl();
  const resolved = resolveProductImageUrl(src);

  if (resolved.startsWith("http://") || resolved.startsWith("https://")) {
    return resolved;
  }

  return `${siteUrl}${resolved}`;
}
