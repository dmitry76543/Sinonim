import { unstable_cache } from "next/cache";
import {
  fetchAdvantShopSearch,
  fetchAdvantShopSearchAutocomplete,
} from "@/lib/advantshop/search";
import { loadAdvantShopProductDetails } from "@/lib/advantshop/catalog";
import {
  findMatchingArtNo,
  mergeAutocompleteResults,
  productMatchesArtQuery,
  searchCatalogByArtNo,
  searchCatalogProductsByArtNo,
} from "@/lib/art-search";
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
import { getCatalogProducts } from "@/lib/products-service";

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

async function searchModificationArtProducts(
  catalog: Product[],
  query: string,
): Promise<Product[]> {
  const normalized = query.trim().toLowerCase();
  if (!normalized.includes("-")) {
    return [];
  }

  const direct = searchCatalogProductsByArtNo(catalog, query);
  if (
    direct.some((product) =>
      findMatchingArtNo(product, query)?.toLowerCase() === normalized,
    )
  ) {
    return direct;
  }

  const base = normalized.replace(/-\d+$/, "");
  const candidates = catalog
    .filter((product) =>
      [product.artNo, ...(product.offerArtNos ?? [])].some((artNo) =>
        artNo?.toLowerCase().startsWith(base),
      ),
    )
    .slice(0, 8);

  const products: Product[] = [];
  for (const candidate of candidates) {
    const details = await loadAdvantShopProductDetails(candidate);
    if (!details) continue;

    if (productMatchesArtQuery(details, query)) {
      products.push(details);
    }
  }

  return products;
}

async function searchModificationArtInCatalog(
  catalog: Product[],
  query: string,
  limit = 6,
): Promise<SearchAutocompleteResult> {
  const normalized = query.trim().toLowerCase();
  if (!normalized.includes("-")) {
    return { products: [], categories: [] };
  }

  const direct = searchCatalogByArtNo(catalog, query, limit);
  if (direct.products.some((product) => product.artNo?.toLowerCase() === normalized)) {
    return direct;
  }

  const base = normalized.replace(/-\d+$/, "");
  const candidates = catalog
    .filter((product) =>
      [product.artNo, ...(product.offerArtNos ?? [])].some((artNo) =>
        artNo?.toLowerCase().startsWith(base),
      ),
    )
    .slice(0, 8);

  const products = [];
  for (const candidate of candidates) {
    const details = await loadAdvantShopProductDetails(candidate);
    if (!details) continue;

    const match = searchCatalogByArtNo([details], query, 1);
    if (match.products[0]) {
      products.push(match.products[0]);
    }
    if (products.length >= limit) break;
  }

  return { products, categories: [] };
}

export async function getSearchAutocomplete(
  query: string
): Promise<SearchAutocompleteResult> {
  const trimmed = query.trim();
  if (trimmed.length < 2) {
    return { products: [], categories: [] };
  }

  if (isAdvantShopConfigured()) {
    const catalog = await getCatalogProducts();
    const localMatches = searchCatalogByArtNo(catalog, trimmed);
    const modificationMatches = localMatches.products.some(
      (product) => product.artNo?.toLowerCase() === trimmed.toLowerCase(),
    )
      ? { products: [], categories: [] }
      : await searchModificationArtInCatalog(catalog, trimmed);

    try {
      const remote = await fetchAdvantShopSearchAutocomplete(trimmed);
      return mergeAutocompleteResults(
        mergeAutocompleteResults(localMatches, modificationMatches),
        remote,
      );
    } catch (error) {
      const fallback = mergeAutocompleteResults(localMatches, modificationMatches);
      if (fallback.products.length) {
        return fallback;
      }
      throw error;
    }
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
    const catalog = await getCatalogProducts();
    const localMatches = searchCatalogProductsByArtNo(catalog, trimmed);
    const modificationMatches = await searchModificationArtProducts(catalog, trimmed);
    const remoteMatches = await getCachedAdvantShopSearch(trimmed, sort);

    const merged = new Map<string, Product>();
    for (const product of [...localMatches, ...modificationMatches, ...remoteMatches]) {
      merged.set(product.id, product);
    }
    return [...merged.values()];
  }

  return searchStaticProducts(trimmed, sort);
}
