import type { CategorySlug } from "@/lib/products";

export function isAdvantShopConfigured(): boolean {
  return Boolean(
    process.env.ADVANTSHOP_BASE_URL?.trim() &&
      process.env.ADVANTSHOP_API_KEY?.trim()
  );
}

export function getAdvantShopBaseUrl(): string {
  const base = process.env.ADVANTSHOP_BASE_URL?.trim();
  if (!base) {
    throw new Error("ADVANTSHOP_BASE_URL is not configured");
  }
  return base.replace(/\/$/, "");
}

export function getAdvantShopApiKey(): string {
  const key = process.env.ADVANTSHOP_API_KEY?.trim();
  if (!key) {
    throw new Error("ADVANTSHOP_API_KEY is not configured");
  }
  return key;
}

/** Map site category slugs to AdvantShop category URL paths */
export function getCategoryUrlMap(): Partial<Record<CategorySlug, string>> {
  const raw = process.env.ADVANTSHOP_CATEGORY_MAP?.trim();
  if (!raw) return {};

  try {
    return JSON.parse(raw) as Partial<Record<CategorySlug, string>>;
  } catch {
    return {};
  }
}

export const CATALOG_REVALIDATE_SECONDS = Number(
  process.env.ADVANTSHOP_REVALIDATE_SECONDS ?? 300
);
