import type { CategorySlug, Product } from "./products";

export const GIFTS_MAX_PRICE = 30_000;
export const GIFTS_MAX_COUNT = 10;

export const GIFT_SOURCE_CATEGORIES: CategorySlug[] = [
  "rings",
  "earrings",
  "pendants",
  "bracelets",
];

function sortGiftProducts(products: Product[], sort: string): Product[] {
  const result = [...products];

  switch (sort) {
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
      result.sort((a, b) => a.price - b.price);
      break;
  }

  return result;
}

export function pickGiftProducts(
  products: Product[],
  sort = "default"
): Product[] {
  const eligible = products.filter(
    (product) =>
      GIFT_SOURCE_CATEGORIES.includes(product.category) &&
      product.price <= GIFTS_MAX_PRICE
  );

  return sortGiftProducts(eligible, sort).slice(0, GIFTS_MAX_COUNT);
}
