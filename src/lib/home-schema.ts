import { buildOrganizationJsonLd } from "@/lib/organization-schema";
import { buildShowroomJsonLd } from "@/lib/showroom-schema";
import { buildWebSiteJsonLd } from "@/lib/website-schema";

export function buildHomeJsonLd(): Record<string, unknown>[] {
  return [
    buildOrganizationJsonLd(),
    buildWebSiteJsonLd(),
    buildShowroomJsonLd(),
  ];
}
