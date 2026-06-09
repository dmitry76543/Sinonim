import {
  getAdvantShopApiKey,
  getAdvantShopBaseUrl,
  CATALOG_REVALIDATE_SECONDS,
} from "./config";

type FetchOptions = {
  method?: "GET" | "POST";
  body?: unknown;
  searchParams?: Record<string, string | number | boolean | undefined>;
  revalidate?: number | false;
};

export async function advantshopFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const base = getAdvantShopBaseUrl();
  const url = new URL(path.startsWith("/") ? path : `/${path}`, base);
  url.searchParams.set("apikey", getAdvantShopApiKey());

  if (options.searchParams) {
    for (const [key, value] of Object.entries(options.searchParams)) {
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }

  const response = await fetch(url.toString(), {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    next:
      options.revalidate === false
        ? { revalidate: 0 }
        : { revalidate: options.revalidate ?? CATALOG_REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`AdvantShop API ${response.status}: ${text}`);
  }

  return response.json() as Promise<T>;
}
