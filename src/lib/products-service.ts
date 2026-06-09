import {
  fetchAdvantShopProductDetails,
  fetchAdvantShopProducts,
  fetchAdvantShopProductsBySlugs,
} from "@/lib/advantshop/catalog";
import { isAdvantShopConfigured } from "@/lib/advantshop/config";
import {
  PRODUCTS,
  getProductBySlug as getStaticProductBySlug,
  getProductDetails as getStaticProductDetails,
  getRelatedProducts as getStaticRelatedProducts,
  type CategorySlug,
  type Product,
  type ProductDetails,
} from "@/lib/products";

export async function getCatalogProducts(options?: {
  category?: CategorySlug;
  sort?: string;
}): Promise<Product[]> {
  if (isAdvantShopConfigured()) {
    return fetchAdvantShopProducts(options);
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
    const products = await fetchAdvantShopProducts();
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
    const products = await fetchAdvantShopProductsBySlugs(slugs);
    const order = new Map(slugs.map((slug, index) => [slug, index]));
    return products.sort(
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
