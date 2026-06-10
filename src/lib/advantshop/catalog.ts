import type { CategorySlug, Product, ProductDetails } from "@/lib/products";
import { advantshopClientFetch, advantshopFetch } from "./client";
import { getCategoryUrlMap } from "./config";
import { mapCatalogProduct, mapProductDetails } from "./mapper";
import type {
  AdvantShopCatalogResponse,
  AdvantShopCategoriesResponse,
  AdvantShopProductDetails,
  AdvantShopPropertiesResponse,
} from "./types";

const SORT_MAP: Record<string, string> = {
  default: "NoSorting",
  "price-asc": "AscByPrice",
  "price-desc": "DescByPrice",
  new: "DescByAddingDate",
};

function getCategorySlugByUrl(url: string): CategorySlug | undefined {
  const map = getCategoryUrlMap();

  for (const [slug, categoryUrl] of Object.entries(map) as [
    CategorySlug,
    string,
  ][]) {
    if (categoryUrl === url) return slug;
  }

  return undefined;
}

async function fetchCatalogPage(body: Record<string, unknown>) {
  return advantshopClientFetch<AdvantShopCatalogResponse>("/api/catalog", {
    method: "POST",
    body,
  });
}

async function fetchAllCatalogProducts(body: Record<string, unknown>) {
  const products: AdvantShopCatalogResponse["products"] = [];
  let page = 1;
  let totalPages = 1;
  const pageSize = 500;

  do {
    const response = await fetchCatalogPage({
      ...body,
      page,
      itemsPerPage: pageSize,
    });
    products.push(...(response.products ?? []));
    totalPages = response.pager?.totalPageCount ?? 1;
    page += 1;
  } while (page <= totalPages);

  return products;
}

export async function fetchAdvantShopCategories() {
  return advantshopFetch<AdvantShopCategoriesResponse>("/api/categories", {
    searchParams: { parentCategoryId: 0, extended: true },
  });
}

export async function fetchAdvantShopProducts(options?: {
  category?: CategorySlug;
  sort?: string;
}): Promise<Product[]> {
  const categoryMap = getCategoryUrlMap();
  const sort = SORT_MAP[options?.sort ?? "default"] ?? "NoSorting";

  if (options?.category) {
    const categoryUrl = categoryMap[options.category];
    if (!categoryUrl) return [];

    const items = await fetchAllCatalogProducts({ url: categoryUrl, sorting: sort });
    return items.map((item) => mapCatalogProduct(item, options.category!));
  }

  const slugs = Object.keys(categoryMap) as CategorySlug[];
  if (!slugs.length) return [];

  const results = await Promise.all(
    slugs.map(async (slug) => {
      const url = categoryMap[slug];
      if (!url) return [] as Product[];

      const items = await fetchAllCatalogProducts({ url, sorting: sort });
      return items.map((item) => mapCatalogProduct(item, slug));
    })
  );

  const merged = new Map<string, Product>();
  for (const list of results) {
    for (const product of list) {
      merged.set(product.id, product);
    }
  }

  return Array.from(merged.values());
}

export async function fetchAdvantShopProductDetails(
  slug: string
): Promise<ProductDetails | undefined> {
  const categoryMap = getCategoryUrlMap();
  const slugs = Object.keys(categoryMap) as CategorySlug[];

  const lists = await Promise.all(
    slugs.map(async (category) => ({
      category,
      products: await fetchAdvantShopProducts({ category }),
    }))
  );

  let summary: Product | undefined;
  let summaryCategory: CategorySlug | undefined;

  for (const list of lists) {
    const match = list.products.find((product) => product.slug === slug);
    if (match) {
      summary = match;
      summaryCategory = list.category;
      break;
    }
  }

  if (!summary || !summaryCategory) return undefined;

  const [details, propertiesResponse] = await Promise.all([
    advantshopClientFetch<AdvantShopProductDetails>(
      `/api/products/${summary.id}`
    ),
    advantshopClientFetch<AdvantShopPropertiesResponse>(
      `/api/products/${summary.id}/properties`,
      { searchParams: { type: "inDetails" } }
    ).catch(() => ({ properties: [] })),
  ]);

  const properties = propertiesResponse.properties ?? [];
  const product = mapProductDetails(
    details,
    summaryCategory,
    properties
  );

  return {
    ...product,
    stoneWeight: parseStoneWeightFromProperties(properties) || product.stoneWeight,
  };
}

function parseStoneWeightFromProperties(
  properties: { name?: string; value?: string; propertyName?: string; propertyValue?: string }[]
): number {
  for (const property of properties) {
    const name = (property.propertyName ?? property.name ?? "").toLowerCase();
    const value = property.propertyValue ?? property.value ?? "";

    if (name.includes("карат") || name.includes("вес камн")) {
      const match = value.replace(",", ".").match(/(\d+(?:\.\d+)?)/);
      if (match) return Number(match[1]);
    }
  }

  return 0;
}

export async function fetchAdvantShopProductsBySlugs(
  slugs: string[]
): Promise<Product[]> {
  if (!slugs.length) return [];

  const categoryMap = getCategoryUrlMap();
  const categories = Object.keys(categoryMap) as CategorySlug[];
  const slugSet = new Set(slugs);

  const lists = await Promise.all(
    categories.map((category) => fetchAdvantShopProducts({ category }))
  );

  const merged = lists.flat();
  return merged.filter((product) => slugSet.has(product.slug));
}

export function resolveCategorySlugFromAdvantShopUrl(
  url: string
): CategorySlug | undefined {
  return getCategorySlugByUrl(url);
}
