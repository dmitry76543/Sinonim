import { unstable_cache } from "next/cache";
import {
  fetchAdvantShopSearch,
  fetchAdvantShopSearchAutocomplete,
} from "@/lib/advantshop/search";
import {
  CATALOG_REVALIDATE_SECONDS,
  isAdvantShopConfigured,
} from "@/lib/advantshop/config";
import {
  CATALOG_CATEGORY_SLUGS,
  CATEGORIES,
  PRODUCTS,
  type CategorySlug,
  type Product,
} from "@/lib/products";
import type { SearchAutocompleteResult } from "@/lib/search-types";

const getCachedAdvantShopSearch = unstable_cache(
  async (query: string, sort: string) => fetchAdvantShopSearch(query, { sort }),
  ["advantshop-search"],
  { revalidate: CATALOG_REVALIDATE_SECONDS, tags: ["search"] }
);

function searchStaticProducts(query: string, sort?: string): Product[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  let products = PRODUCTS.filter(
    (product) =>
      product.name.toLowerCase().includes(normalized) ||
      product.slug.toLowerCase().includes(normalized) ||
      (product.artNo?.toLowerCase().includes(normalized) ?? false)
  );

  if (sort === "price-asc") {
    products.sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    products.sort((a, b) => b.price - a.price);
  } else if (sort === "new") {
    products.sort((a, b) => Number(b.isNew) - Number(a.isNew));
  }

  return products;
}

function getStaticAutocomplete(query: string): SearchAutocompleteResult {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return { products: [], categories: [] };
  }

  const categories = CATALOG_CATEGORY_SLUGS.filter((slug) => {
    const category = CATEGORIES[slug];
    return (
      category.titlePlural.toLowerCase().includes(normalized) ||
      category.title.toLowerCase().includes(normalized) ||
      slug.includes(normalized)
    );
  })
    .slice(0, 4)
    .map((slug: CategorySlug) => ({
      type: "category" as const,
      slug,
      name: CATEGORIES[slug].titlePlural,
      href: `/shop/${slug}`,
    }));

  const products = searchStaticProducts(normalized).slice(0, 6).map((product) => ({
    type: "product" as const,
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    image: product.image,
    artNo: product.artNo,
    href: `/products/${product.slug}`,
  }));

  return { products, categories };
}

export async function getSearchAutocomplete(
  query: string
): Promise<SearchAutocompleteResult> {
  const trimmed = query.trim();
  if (trimmed.length < 2) {
    return { products: [], categories: [] };
  }

  if (isAdvantShopConfigured()) {
    return fetchAdvantShopSearchAutocomplete(trimmed);
  }

  return getStaticAutocomplete(trimmed);
}

export async function getSearchProducts(
  query: string,
  options?: { sort?: string }
): Promise<Product[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const sort = options?.sort ?? "default";

  if (isAdvantShopConfigured()) {
    return getCachedAdvantShopSearch(trimmed, sort);
  }

  return searchStaticProducts(trimmed, sort);
}
