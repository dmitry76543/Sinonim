import { unstable_cache } from "next/cache";
import {
  fetchAdvantShopProductDetails,
  fetchAdvantShopProducts,
} from "@/lib/advantshop/catalog";
import {
  CATALOG_REVALIDATE_SECONDS,
  isAdvantShopConfigured,
} from "@/lib/advantshop/config";
import {
  PRODUCTS,
  getProductBySlug as getStaticProductBySlug,
  getProductDetails as getStaticProductDetails,
  getRelatedProducts as getStaticRelatedProducts,
  type CategorySlug,
  type Product,
  type ProductDetails,
} from "@/lib/products";

const getCachedAdvantShopCatalog = unstable_cache(
  async (categoryKey: string, sort: string) => {
    const category =
      categoryKey === "all" ? undefined : (categoryKey as CategorySlug);
    return fetchAdvantShopProducts({ category, sort });
  },
  ["advantshop-catalog"],
  { revalidate: CATALOG_REVALIDATE_SECONDS, tags: ["catalog"] }
);

export async function getCatalogProducts(options?: {
  category?: CategorySlug;
  sort?: string;
}): Promise<Product[]> {
  if (isAdvantShopConfigured()) {
    return getCachedAdvantShopCatalog(
      options?.category ?? "all",
      options?.sort ?? "default"
    );
  }

  let products = [...PRODUCTS];

  if (options?.category) {
    products = products.filter((product) => product.category === options.category);
  }

  if (options?.sort === "price-asc") {
    products.sort((a, b) => a.price - b.price);
  } else if (options?.sort === "price-desc") {
    products.sort((a, b) => b.price - a.price);
  } else if (options?.sort === "new") {
    products.sort((a, b) => Number(b.isNew) - Number(a.isNew));
  }

  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  if (isAdvantShopConfigured()) {
    const products = await getCatalogProducts();
    return products.find((item) => item.slug === slug);
  }

  return getStaticProductBySlug(slug);
}

export async function getProductDetails(
  slug: string
): Promise<ProductDetails | undefined> {
  if (isAdvantShopConfigured()) {
    return fetchAdvantShopProductDetails(slug);
  }

  return getStaticProductDetails(slug);
}

export async function getRelatedProducts(
  product: Product,
  limit = 4
): Promise<Product[]> {
  const catalog = await getCatalogProducts({ category: product.category });
  return catalog.filter((item) => item.id !== product.id).slice(0, limit);
}

export async function getProductsBySlugs(slugs: string[]): Promise<Product[]> {
  if (isAdvantShopConfigured()) {
    const products = await getCatalogProducts();
    const slugSet = new Set(slugs);
    const order = new Map(slugs.map((slug, index) => [slug, index]));
    return products
      .filter((product) => slugSet.has(product.slug))
      .sort(
        (a, b) => (order.get(a.slug) ?? 0) - (order.get(b.slug) ?? 0)
      );
  }

  return slugs
    .map((slug) => getStaticProductBySlug(slug))
    .filter((product): product is Product => product !== undefined);
}

export function getCatalogSource(): "advantshop" | "static" {
  return isAdvantShopConfigured() ? "advantshop" : "static";
}
