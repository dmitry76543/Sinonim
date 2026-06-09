export type CartItem = {
  id: string;
  productSlug: string;
  name: string;
  image: string;
  price: number;
  stoneWeight: number;
  stoneLabel: string;
  size: number | null;
  quantity: number;
};

export const CART_STORAGE_KEY = "sinonim-cart";

export function buildCartItemId(
  slug: string,
  stoneWeight: number,
  size: number | null
): string {
  return `${slug}-${stoneWeight}-${size ?? "none"}`;
}

export function getCartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function getCartCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}
