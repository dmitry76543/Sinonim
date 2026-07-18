import type {
  AdvantShopCatalogProduct,
  AdvantShopOffer,
  AdvantShopProductDetails,
} from "./types";

/** Нормализует amount из API (number или numeric string). */
export function parseAdvantShopAmount(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value.replace(",", "."));
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
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
    .map((offer) => parseAdvantShopAmount(offer.amount))
    .filter((value): value is number => value !== undefined);

  if (offerAmounts.length > 0) {
    return offerAmounts.reduce((sum, value) => sum + value, 0);
  }

  return parseAdvantShopAmount(item.amount);
}

/** Товар в наличии по данным списка каталога (часто неточные без offers). */
export function isAdvantShopProductInStock(
  item: Pick<AdvantShopCatalogProduct, "amount" | "offers">,
): boolean {
  const amount = getAdvantShopStockAmount(item);
  if (amount === undefined) return true;
  return amount > 0;
}

export function isOfferInStock(offer: Pick<AdvantShopOffer, "amount">): boolean {
  const amount = parseAdvantShopAmount(offer.amount);
  if (amount === undefined) return true;
  return amount > 0;
}

function hasOfferStockData(
  item: Pick<AdvantShopProductDetails, "offers">,
): boolean {
  return (item.offers ?? []).some(
    (offer) => parseAdvantShopAmount(offer.amount) !== undefined,
  );
}

/** Размеры / офферы с остатком > 0 (или без данных об остатке). */
export function getInStockOffers(
  item: Pick<AdvantShopProductDetails, "offers">,
): AdvantShopOffer[] {
  const offers = item.offers ?? [];
  if (!offers.length) return [];

  if (!hasOfferStockData(item)) return offers;

  return offers.filter(isOfferInStock);
}

/**
 * Точный признак наличия по карточке товара (offers + размеры).
 * Список /api/catalog часто отдаёт завышенный product.amount без офферов.
 */
export function isAdvantShopDetailsInStock(
  item: Pick<AdvantShopProductDetails, "amount" | "offers" | "sizeColorPicker">,
): boolean {
  const sizes = item.sizeColorPicker?.sizes ?? [];
  const offerStockKnown = hasOfferStockData(item);

  if (offerStockKnown && sizes.length > 0) {
    const inStockSizeIds = new Set(
      getInStockOffers(item)
        .map((offer) => offer.sizeId)
        .filter((id): id is number => typeof id === "number"),
    );
    return sizes.some((size) => inStockSizeIds.has(size.id));
  }

  if (offerStockKnown) {
    return getInStockOffers(item).length > 0;
  }

  const amount = getAdvantShopStockAmount(item);
  if (amount === undefined) return true;
  return amount > 0;
}

export type AdvantShopStockInfo = {
  stockAmount?: number;
  inStock: boolean;
};

export function getAdvantShopDetailsStockInfo(
  item: Pick<AdvantShopProductDetails, "amount" | "offers" | "sizeColorPicker">,
): AdvantShopStockInfo {
  return {
    stockAmount: getAdvantShopStockAmount(item),
    inStock: isAdvantShopDetailsInStock(item),
  };
}
