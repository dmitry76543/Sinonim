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
    try {
      const products = await fetchAdvantShopProducts(options);
      if (products.length) return products;
    } catch (error) {
      console.error("AdvantShop catalog fetch failed:", error);
    }
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
    try {
      const products = await fetchAdvantShopProducts();
      const product = products.find((item) => item.slug === slug);
      if (product) return product;
    } catch (error) {
      console.error("AdvantShop product lookup failed:", error);
    }
  }

  return getStaticProductBySlug(slug);
}

export async function getProductDetails(
  slug: string
): Promise<ProductDetails | undefined> {
  if (isAdvantShopConfigured()) {
    try {
      const product = await fetchAdvantShopProductDetails(slug);
      if (product) return product;
    } catch (error) {
      console.error("AdvantShop product details fetch failed:", error);
    }
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
    try {
      const products = await fetchAdvantShopProductsBySlugs(slugs);
      if (products.length) {
        const order = new Map(slugs.map((slug, index) => [slug, index]));
        return products.sort(
          (a, b) => (order.get(a.slug) ?? 0) - (order.get(b.slug) ?? 0)
        );
      }
    } catch (error) {
      console.error("AdvantShop products by slugs fetch failed:", error);
    }
  }

  return slugs
    .map((slug) => getStaticProductBySlug(slug))
    .filter((product): product is Product => product !== undefined);
}

export function getCatalogSource(): "advantshop" | "static" {
  return isAdvantShopConfigured() ? "advantshop" : "static";
}
