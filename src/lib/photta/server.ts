export function getPhottaApiKey(): string | undefined {
  const key =
    process.env.NEXT_PUBLIC_PHOTTA_API_KEY?.trim() ||
    process.env.PHOTTA_API_KEY?.trim();
  return key || undefined;
}

export function isPhottaConfigured(): boolean {
  return Boolean(getPhottaApiKey());
}
