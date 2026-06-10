import { CATALOG_PAGE_REVALIDATE } from "@/lib/catalog-page";

export const revalidate = CATALOG_PAGE_REVALIDATE;

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
