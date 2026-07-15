import type { Product } from "@/lib/products";
import { getSiteUrl } from "@/lib/site-url";

const ITEM_LIST_LIMIT = 10;

type CatalogItemListOptions = {
  name: string;
  url: string;
  products: Product[];
};

export function buildCatalogItemListJsonLd({
  name,
  url,
  products,
}: CatalogItemListOptions): Record<string, unknown> {
  const siteUrl = getSiteUrl();
  const listedProducts = products.slice(0, ITEM_LIST_LIMIT);

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    url,
    numberOfItems: products.length,
    itemListElement: listedProducts.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: product.name,
      url: `${siteUrl}/products/${product.slug}`,
    })),
  };
}
