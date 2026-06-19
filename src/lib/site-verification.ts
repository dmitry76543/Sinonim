import type { Metadata } from "next";

function readEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value || undefined;
}

export function getSiteVerification(): Metadata["verification"] {
  const google = readEnv("GOOGLE_SITE_VERIFICATION");
  const yandex =
    readEnv("YANDEX_SITE_VERIFICATION") ?? "98707ef5a3ae9578";

  return {
    ...(google && { google }),
    yandex,
  };
}
