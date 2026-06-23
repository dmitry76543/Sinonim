export const PHOTTA_EMBED_SCRIPT_ID = "photta-embed-script";
export const PHOTTA_INLINE_MOUNT_ID = "photta-inline";

export function getPhottaApiKey(): string | undefined {
  return process.env.NEXT_PUBLIC_PHOTTA_API_KEY?.trim() || undefined;
}

export function isPhottaConfigured(): boolean {
  return Boolean(getPhottaApiKey());
}
