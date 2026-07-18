import type { Product } from "@/lib/products";
import type {
  SearchAutocompleteCategory,
  SearchAutocompleteResult,
} from "@/lib/search-types";
import { advantshopClientFetch } from "./client";
import {
  fetchAdvantShopProductsBySlugs,
  resolveCategorySlugFromAdvantShopUrl,
} from "./catalog";
import type {
  AdvantShopCatalogProduct,
  AdvantShopCategory,
  AdvantShopSearchAutocompleteResponse,
  AdvantShopSearchResponse,
} from "./types";

const MAX_AUTOCOMPLETE_PRODUCTS = 6;
const MAX_AUTOCOMPLETE_CATEGORIES = 4;

const SORT_MAP: Record<string, string> = {
  default: "NoSorting",
  "price-asc": "AscByPrice",
  "price-desc": "DescByPrice",
  new: "DescByAddingDate",
};

async function fetchSearchPage(body: Record<string, unknown>) {
  return advantshopClientFetch<AdvantShopSearchResponse>("/api/search", {
    method: "POST",
    body,
  });
}

async function fetchAllSearchProducts(query: string, sorting: string) {
  const products: AdvantShopCatalogProduct[] = [];
  let page = 1;
  let totalPages = 1;
  const pageSize = 500;

  do {
    const response = await fetchSearchPage({
      query,
      sorting,
      page,
      itemsPerPage: pageSize,
    });
    products.push(...(response.products ?? []));
    totalPages = response.pager?.totalPageCount ?? 1;
    page += 1;
  } while (page <= totalPages);

  return products;
}

function mapAutocompleteCategory(
  item: AdvantShopCategory
): SearchAutocompleteCategory | null {
  const slug = resolveCategorySlugFromAdvantShopUrl(item.url);
  if (!slug) return null;

  return {
    type: "category",
    slug,
    name: item.name,
    href: `/shop/${slug}`,
  };
}

export async function fetchAdvantShopSearchAutocomplete(
  query: string
): Promise<SearchAutocompleteResult> {
  const trimmed = query.trim();
  if (!trimmed) {
    return { products: [], categories: [] };
  }

  const response = await advantshopClientFetch<AdvantShopSearchAutocompleteResponse>(
    "/api/search/autocomplete",
    {
      method: "POST",
      body: { query: trimmed },
    }
  );

  const categories = (response.categories ?? [])
    .map(mapAutocompleteCategory)
    .filter((item): item is SearchAutocompleteCategory => item !== null)
    .slice(0, MAX_AUTOCOMPLETE_CATEGORIES);

  const rawProducts = response.products ?? [];
  const knownProducts = await fetchAdvantShopProductsBySlugs(
    rawProducts.map((item) => item.urlPath)
  );
  const knownById = new Map(
    knownProducts.map((product) => [product.id, product] as const),
  );

  const products = rawProducts
    .map((item) => knownById.get(String(item.productId)))
    .filter((product): product is Product => Boolean(product))
    .slice(0, MAX_AUTOCOMPLETE_PRODUCTS)
    .map((product) => ({
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

export async function fetchAdvantShopSearch(
  query: string,
  options?: { sort?: string }
): Promise<Product[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const sorting = SORT_MAP[options?.sort ?? "default"] ?? "NoSorting";
  const items = await fetchAllSearchProducts(trimmed, sorting);
  if (!items.length) return [];

  const slugs = items.map((item) => item.urlPath);
  const knownProducts = await fetchAdvantShopProductsBySlugs(slugs);
  const knownById = new Map(
    knownProducts.map((product) => [product.id, product] as const),
  );

  return items
    .map((item) => knownById.get(String(item.productId)))
    .filter((product): product is Product => Boolean(product));
}
