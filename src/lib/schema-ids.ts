import { getSiteUrl } from "@/lib/site-url";

export function getOrganizationId(): string {
  return `${getSiteUrl()}/about#organization`;
}

export function getShowroomId(): string {
  return `${getSiteUrl()}/showroom#store`;
}

export function getWebsiteId(): string {
  return `${getSiteUrl()}/#website`;
}
