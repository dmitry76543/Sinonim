import type { AdvantShopCatalogProduct, AdvantShopOffer, AdvantShopProductDetails } from "./types";

/** Есть ли явное поле остатка (включая 0). */
function hasDefinedAmount(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

/**
 * Суммарный остаток товара.
 * Если у offers есть amount — суммируем их.
 * Иначе берём amount на уровне товара.
 * Если данных о остатке нет — `undefined` (не скрываем товар).
 */
export function getAdvantShopStockAmount(
  item: Pick<AdvantShopCatalogProduct, "amount" | "offers">,
): number | undefined {
  const offers = item.offers ?? [];
  const offerAmounts = offers
    .map((offer) => offer.amount)
    .filter(hasDefinedAmount);

  if (offerAmounts.length > 0) {
    return offerAmounts.reduce((sum, value) => sum + value, 0);
  }

  if (hasDefinedAmount(item.amount)) {
    return item.amount;
  }

  return undefined;
}

/** Товар в наличии: остаток > 0, либо остаток неизвестен. */
export function isAdvantShopProductInStock(
  item: Pick<AdvantShopCatalogProduct, "amount" | "offers">,
): boolean {
  const amount = getAdvantShopStockAmount(item);
  if (amount === undefined) return true;
  return amount > 0;
}

export function isOfferInStock(offer: Pick<AdvantShopOffer, "amount">): boolean {
  if (!hasDefinedAmount(offer.amount)) return true;
  return offer.amount > 0;
}

/** Размеры / офферы с остатком > 0 (или без данных об остатке). */
export function getInStockOffers(
  item: Pick<AdvantShopProductDetails, "offers">,
): AdvantShopOffer[] {
  const offers = item.offers ?? [];
  if (!offers.length) return [];

  const withStockInfo = offers.filter((offer) => hasDefinedAmount(offer.amount));
  if (!withStockInfo.length) return offers;

  return offers.filter(isOfferInStock);
}
