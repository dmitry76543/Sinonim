import {
  getAdvantShopBaseUrl,
  getAdvantShopClientApiKey,
  getAdvantShopServerApiKey,
  CATALOG_REVALIDATE_SECONDS,
} from "./config";

type FetchOptions = {
  method?: "GET" | "POST";
  body?: unknown;
  searchParams?: Record<string, string | number | boolean | undefined>;
  revalidate?: number | false;
};

type AdvantShopApiEnvelope = {
  status?: string;
  errors?: string | string[];
  customer?: { id?: string };
};

let cachedClientUserId: string | null = null;

function buildAdvantShopUrl(base: string, path: string): URL {
  const normalizedPath = path.replace(/^\//, "");
  return new URL(`${base.replace(/\/$/, "")}/${normalizedPath}`);
}

function formatAdvantShopError(errors: string | string[] | undefined): string {
  if (Array.isArray(errors)) return errors.join(", ");
  return errors ?? "Unknown error";
}

function readResponseHeader(
  response: Response,
  name: string
): string | null {
  return response.headers.get(name) ?? response.headers.get(name.toLowerCase());
}

async function parseAdvantShopResponse<T>(
  response: Response
): Promise<T> {
  const text = await response.text();

  if (!response.ok) {
    throw new Error(`AdvantShop API ${response.status}: ${text}`);
  }

  let payload: T & AdvantShopApiEnvelope;
  try {
    payload = JSON.parse(text) as T & AdvantShopApiEnvelope;
  } catch {
    throw new Error(
      `AdvantShop API returned invalid JSON: ${text.slice(0, 200)}`
    );
  }

  if (payload.status === "error") {
    const message = formatAdvantShopError(payload.errors);
    if (message === "Check apikey") {
      throw new Error(
        "Неверный Client API ключ. Сгенерируйте ключ на вкладке «API с авторизацией» в AdvantShop (Настройки → API) и укажите его в ADVANTSHOP_CLIENT_API_KEY."
      );
    }
    throw new Error(`AdvantShop API error: ${message}`);
  }

  return payload;
}

async function advantshopRequest<T>(
  path: string,
  apiKey: string,
  options: FetchOptions = {},
  extraHeaders?: Record<string, string>
): Promise<T> {
  const url = buildAdvantShopUrl(getAdvantShopBaseUrl(), path);
  url.searchParams.set("apikey", apiKey);

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
      "X-API-KEY": apiKey,
      ...extraHeaders,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    next:
      options.revalidate === false
        ? { revalidate: 0 }
        : { revalidate: options.revalidate ?? CATALOG_REVALIDATE_SECONDS },
  });

  return parseAdvantShopResponse<T>(response);
}

async function ensureClientUserId(): Promise<string> {
  if (cachedClientUserId) return cachedClientUserId;

  const apiKey = getAdvantShopClientApiKey();
  const url = buildAdvantShopUrl(getAdvantShopBaseUrl(), "api/init");
  url.searchParams.set("apikey", apiKey);

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      "X-API-KEY": apiKey,
    },
    next: { revalidate: CATALOG_REVALIDATE_SECONDS },
  });

  const userId =
    readResponseHeader(response, "X-API-USER-ID") ??
    readResponseHeader(response, "x-api-user-id");

  if (userId) {
    cachedClientUserId = userId;
    return userId;
  }

  const payload = await parseAdvantShopResponse<{ customer?: { id?: string } }>(
    response
  );
  const customerId = payload.customer?.id;

  if (customerId) {
    cachedClientUserId = customerId;
    return customerId;
  }

  throw new Error(
    "AdvantShop не вернул X-API-USER-ID. Проверьте Client API ключ (вкладка «API с авторизацией»)."
  );
}

/** Server API — categories, orders */
export async function advantshopFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  return advantshopRequest<T>(path, getAdvantShopServerApiKey(), options);
}

/** Client API — catalog, products (requires X-API-USER-ID session) */
export async function advantshopClientFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const userId = await ensureClientUserId();
  return advantshopRequest<T>(path, getAdvantShopClientApiKey(), options, {
    "X-API-USER-ID": userId,
  });
}
