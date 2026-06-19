import { pickGiftProducts } from "@/lib/gift-products";
import {
  CATALOG_CATEGORY_SLUGS,
  CATEGORIES,
  formatPrice,
  type CategorySlug,
  type Product,
} from "@/lib/products";
import { getCatalogProducts } from "@/lib/products-service";

export type CategoryStat = {
  slug: CategorySlug;
  title: string;
  countLabel: string;
  priceFromLabel: string;
  href: string;
  image: string;
};

const CATEGORY_IMAGES: Record<CategorySlug, string> = {
  rings: "/images/categories/rings.jpg",
  earrings: "/images/categories/earrings.jpg",
  pendants: "/images/categories/pendants.jpg",
  bracelets: "/images/categories/bracelets.jpg",
  gifts: "/images/product-necklace.webp",
};

function formatModelCount(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod100 >= 11 && mod100 <= 14) return `${count} моделей`;
  if (mod10 === 1) return `${count} модель`;
  if (mod10 >= 2 && mod10 <= 4) return `${count} модели`;
  return `${count} моделей`;
}

function buildStats(products: Product[]): CategoryStat[] {
  return CATALOG_CATEGORY_SLUGS.map((slug) => {
    const categoryProducts =
      slug === "gifts"
        ? pickGiftProducts(products)
        : products.filter((product) => product.category === slug);
    const count = categoryProducts.length;
    const minPrice = categoryProducts.reduce(
      (min, product) => Math.min(min, product.price),
      Number.POSITIVE_INFINITY
    );

    return {
      slug,
      title: CATEGORIES[slug].title,
      countLabel: count > 0 ? formatModelCount(count) : "Скоро в каталоге",
      priceFromLabel:
        count > 0 && Number.isFinite(minPrice)
          ? `от ${formatPrice(minPrice)}`
          : "Уточняйте цену",
      href: `/shop/${slug}`,
      image: CATEGORY_IMAGES[slug],
    };
  });
}

export async function getCategoryStats(): Promise<CategoryStat[]> {
  try {
    const products = await getCatalogProducts();
    return buildStats(products);
  } catch {
    return buildStats([]);
  }
}
