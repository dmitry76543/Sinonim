import {
  PRICE_RANGES,
  STONE_WEIGHTS,
  type CategorySlug,
  type Product,
} from "./products";

export type CatalogFilters = {
  category?: CategorySlug;
  priceRanges: string[];
  stoneWeights: string[];
  sort: string;
};

export function filterProducts(
  filters: CatalogFilters,
  products: Product[]
): Product[] {
  let result = [...products];

  if (filters.category) {
    result = result.filter((p) => p.category === filters.category);
  }

  if (filters.priceRanges.length > 0) {
    const ranges = PRICE_RANGES.filter((r) => filters.priceRanges.includes(r.id));
    result = result.filter((p) =>
      ranges.some((r) => p.price >= r.min && p.price < r.max)
    );
  }

  if (filters.stoneWeights.length > 0) {
    const weights = STONE_WEIGHTS.filter((w) => filters.stoneWeights.includes(w.id));
    result = result.filter((p) =>
      weights.some((w) => {
        if (w.id === "1+") return p.stoneWeight >= 1;
        return p.stoneWeight === w.value;
      })
    );
  }

  switch (filters.sort) {
    case "price-asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "new":
      result.sort((a, b) => Number(b.isNew) - Number(a.isNew));
      break;
    default:
      break;
  }

  return result;
}

export function parseFiltersFromSearchParams(
  params: URLSearchParams,
  category?: CategorySlug
): CatalogFilters {
  return {
    category,
    priceRanges: params.getAll("price"),
    stoneWeights: params.getAll("stone"),
    sort: params.get("sort") ?? "default",
  };
}

export function buildFilterQuery(
  filters: CatalogFilters,
  updates: Partial<CatalogFilters>
): string {
  const next = { ...filters, ...updates };
  const query = new URLSearchParams();

  next.priceRanges.forEach((p) => query.append("price", p));
  next.stoneWeights.forEach((s) => query.append("stone", s));
  if (next.sort && next.sort !== "default") {
    query.set("sort", next.sort);
  }

  const str = query.toString();
  return str ? `?${str}` : "";
}

export function countActiveFilters(filters: CatalogFilters): number {
  return filters.priceRanges.length + filters.stoneWeights.length;
}
