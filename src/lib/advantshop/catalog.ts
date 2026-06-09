import type { CategorySlug, Product, ProductDetails } from "@/lib/products";
import { advantshopClientFetch, advantshopFetch } from "./client";
import { getCategoryUrlMap } from "./config";
import { mapCatalogProduct, mapProductDetails, extractProductSizes } from "./mapper";
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

  do {
    const response = await fetchCatalogPage({ ...body, page });
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

async function enrichProductsWithSizes(products: Product[]): Promise<Product[]> {
  const targets = products.filter(
    (product) =>
      (product.category === "rings" || product.category === "bracelets") &&
      !product.sizes?.length
  );

  if (!targets.length) return products;

  const sizeEntries = await Promise.all(
    targets.map(async (product) => {
      try {
        const details = await advantshopClientFetch<AdvantShopProductDetails>(
          `/api/products/${product.id}`
        );
        const sizes = extractProductSizes(details, product.category);
        return sizes.length ? ([product.id, sizes] as const) : null;
      } catch {
        return null;
      }
    })
  );

  const sizesByProductId = new Map(
    sizeEntries.filter(
      (entry): entry is readonly [string, number[]] => entry !== null
    )
  );

  if (!sizesByProductId.size) return products;

  return products.map((product) =>
    sizesByProductId.has(product.id)
      ? { ...product, sizes: sizesByProductId.get(product.id) }
      : product
  );
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
    const products = items.map((item) => mapCatalogProduct(item, options.category!));
    return enrichProductsWithSizes(products);
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

  return enrichProductsWithSizes(Array.from(merged.values()));
}

export async function fetchAdvantShopProductDetails(
  slug: string
): Promise<ProductDetails | undefined> {
  const allProducts = await fetchAdvantShopProducts();
  const summary = allProducts.find((product) => product.slug === slug);

  if (!summary) return undefined;

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
    summary.category,
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

  const allProducts = await fetchAdvantShopProducts();
  const slugSet = new Set(slugs);
  return allProducts.filter((product) => slugSet.has(product.slug));
}

export function resolveCategorySlugFromAdvantShopUrl(
  url: string
): CategorySlug | undefined {
  return getCategorySlugByUrl(url);
}
