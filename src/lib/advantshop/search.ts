import type { CategorySlug, Product } from "@/lib/products";
import type {
  SearchAutocompleteCategory,
  SearchAutocompleteProduct,
  SearchAutocompleteResult,
} from "@/lib/search-types";
import { advantshopClientFetch } from "./client";
import {
  fetchAdvantShopProductsBySlugs,
  resolveCategorySlugFromAdvantShopUrl,
} from "./catalog";
import { resolveProductImageUrl } from "./images";
import { buildSeoProductSlug } from "@/lib/product-slug";
import { parseCaratWeightFromDescription } from "@/lib/product-weight";
import { mapCatalogProduct } from "./mapper";
import { isAdvantShopProductInStock } from "./stock";
import type {
  AdvantShopCatalogProduct,
  AdvantShopCategory,
  AdvantShopSearchAutocompleteResponse,
  AdvantShopSearchResponse,
} from "./types";

const DEFAULT_IMAGE = "/images/product-ring.webp";
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

function buildCategoryLookup(products: Product[]) {
  const bySlug = new Map<string, CategorySlug>();
  const byId = new Map<string, CategorySlug>();

  for (const product of products) {
    bySlug.set(product.slug, product.category);
    if (product.urlPath) bySlug.set(product.urlPath, product.category);
    byId.set(product.id, product.category);
  }

  return { bySlug, byId };
}

function resolveSearchProductCategory(
  item: AdvantShopCatalogProduct,
  lookup: ReturnType<typeof buildCategoryLookup>
): CategorySlug {
  return (
    lookup.bySlug.get(item.urlPath) ??
    lookup.byId.get(String(item.productId)) ??
    "rings"
  );
}

function pickAutocompleteImage(item: AdvantShopCatalogProduct): string {
  const raw =
    item.photoSmall ??
    item.photoMiddle ??
    item.photos?.find((photo) => photo.main)?.smallSrc ??
    item.photos?.[0]?.smallSrc ??
    item.photos?.[0]?.middleSrc ??
    DEFAULT_IMAGE;

  return resolveProductImageUrl(raw);
}

function mapAutocompleteProduct(
  item: AdvantShopCatalogProduct,
  category: CategorySlug = "rings"
): SearchAutocompleteProduct {
  const price = Math.round(
    item.priceWithDiscount && item.priceWithDiscount > 0
      ? item.priceWithDiscount
      : item.price ?? 0,
  );
  const description = item.briefDescription || undefined;
  const stoneWeight = description
    ? (parseCaratWeightFromDescription(description) ?? 0.2)
    : 0.2;
  const legacySlug = item.urlPath;
  const slug = buildSeoProductSlug({
    name: item.name,
    category,
    stoneWeight,
    legacySlug,
    productId: String(item.productId),
  });

  return {
    type: "product",
    id: String(item.productId),
    slug,
    name: item.name,
    price,
    image: pickAutocompleteImage(item),
    artNo: item.artNo,
    href: `/products/${slug}`,
  };
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
  const lookup = buildCategoryLookup(knownProducts);

  const products = rawProducts
    .filter(isAdvantShopProductInStock)
    .slice(0, MAX_AUTOCOMPLETE_PRODUCTS)
    .map((item) =>
      mapAutocompleteProduct(item, resolveSearchProductCategory(item, lookup))
    );

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
  const lookup = buildCategoryLookup(knownProducts);

  return items
    .filter(isAdvantShopProductInStock)
    .map((item) =>
      mapCatalogProduct(item, resolveSearchProductCategory(item, lookup))
    );
}
