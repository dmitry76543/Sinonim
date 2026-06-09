import type { CategorySlug } from "@/lib/products";

function readEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value || undefined;
}

export function isAdvantShopConfigured(): boolean {
  return Boolean(readEnv("ADVANTSHOP_BASE_URL") && readEnv("ADVANTSHOP_CATEGORY_MAP"));
}

export function getAdvantShopBaseUrl(): string {
  const base = readEnv("ADVANTSHOP_BASE_URL");
  if (!base) {
    throw new Error("ADVANTSHOP_BASE_URL is not configured");
  }
  return base.replace(/\/$/, "");
}

/** Server API key — categories, orders, customers */
export function getAdvantShopServerApiKey(): string {
  const key =
    readEnv("ADVANTSHOP_SERVER_API_KEY") ?? readEnv("ADVANTSHOP_API_KEY");
  if (!key) {
    throw new Error("ADVANTSHOP_SERVER_API_KEY is not configured");
  }
  return key;
}

/**
 * Client API key from «API с авторизацией» tab.
 * Required for catalog and product endpoints.
 */
export function getAdvantShopClientApiKey(): string {
  const key = getAdvantShopClientApiKeyOptional();
  if (!key) {
    throw new Error(
      "ADVANTSHOP_CLIENT_API_KEY is not configured. Generate it in AdvantShop admin: Settings → API → «API с авторизацией»."
    );
  }
  return key;
}

function getAdvantShopClientApiKeyOptional(): string | undefined {
  return readEnv("ADVANTSHOP_CLIENT_API_KEY") ?? readEnv("ADVANTSHOP_API_KEY");
}

/** @deprecated Use getAdvantShopServerApiKey or getAdvantShopClientApiKey */
export function getAdvantShopApiKey(): string {
  return getAdvantShopServerApiKey();
}

/** Map site category slugs to AdvantShop category URL paths */
export function getCategoryUrlMap(): Partial<Record<CategorySlug, string>> {
  const raw = readEnv("ADVANTSHOP_CATEGORY_MAP");
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
