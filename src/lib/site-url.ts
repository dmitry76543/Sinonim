function readEnv(name: string): string | undefined {
  const raw = process.env[name]?.trim();
  if (!raw) return undefined;

  const value = raw.replace(/^["']|["']$/g, "");
  return value || undefined;
}

export function getSiteUrl(): string {
  const value =
    readEnv("SITE_URL") ??
    readEnv("NEXT_PUBLIC_SITE_URL") ??
    "https://synonym-jewelry.ru";

  return value.replace(/\/$/, "");
}
