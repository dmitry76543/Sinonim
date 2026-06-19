function readEnv(name: string): string | undefined {
  const raw = process.env[name]?.trim();
  if (!raw) return undefined;

  const value = raw.replace(/^["']|["']$/g, "");
  return value || undefined;
}

export function isYooKassaConfigured(): boolean {
  return Boolean(readEnv("YOOKASSA_SHOP_ID") && readEnv("YOOKASSA_SECRET_KEY"));
}

export function getYooKassaShopId(): string {
  const value = readEnv("YOOKASSA_SHOP_ID");
  if (!value) {
    throw new Error("YOOKASSA_SHOP_ID is not configured");
  }
  return value;
}

export function getYooKassaSecretKey(): string {
  const value = readEnv("YOOKASSA_SECRET_KEY");
  if (!value) {
    throw new Error("YOOKASSA_SECRET_KEY is not configured");
  }
  return value;
}

export function getSiteUrl(): string {
  const value =
    readEnv("SITE_URL") ??
    readEnv("NEXT_PUBLIC_SITE_URL") ??
    "https://synonym-jewelry.ru";

  return value.replace(/\/$/, "");
}

export function getYooKassaReturnUrl(orderId: string): string {
  const custom = readEnv("YOOKASSA_RETURN_URL");
  if (custom) {
    const url = new URL(custom);
    url.searchParams.set("orderId", orderId);
    return url.toString();
  }

  return `${getSiteUrl()}/checkout/success?orderId=${encodeURIComponent(orderId)}`;
}
