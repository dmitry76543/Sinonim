import type { AdvantShopProperty } from "@/lib/advantshop/types";
import type { CategorySlug, Product } from "@/lib/products";

const COMPLECT_CATEGORY_ORDER: CategorySlug[] = [
  "rings",
  "earrings",
  "pendants",
  "bracelets",
];

function isValidComplectValue(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;

  const numeric = Number(trimmed.replace(",", "."));
  if (!Number.isNaN(numeric) && numeric === 0) return false;

  return true;
}

function parseComplectFromPropertyValue(value: string): string | undefined {
  const trimmed = value.trim();
  if (!isValidComplectValue(trimmed)) return undefined;

  const digits = trimmed.match(/(\d+)/);
  return digits?.[1];
}

export function parseComplectNumberFromProperties(
  properties: AdvantShopProperty[],
): string | undefined {
  for (const property of properties) {
    const name = (property.propertyName ?? property.name ?? "").toLowerCase();
    const value = property.propertyValue ?? property.value ?? "";

    if (
      name.includes("комплект") ||
      name.includes("complect") ||
      name.includes("набор")
    ) {
      const parsed = parseComplectFromPropertyValue(value);
      if (parsed) return parsed;
    }
  }

  return undefined;
}

export function resolveComplectNumber(
  properties: AdvantShopProperty[] = [],
): string | undefined {
  return parseComplectNumberFromProperties(properties);
}

export function formatComplectLabel(complectNumber: string): string {
  const display =
    /^\d+$/.test(complectNumber) && complectNumber.length > 1
      ? String(Number(complectNumber))
      : complectNumber;
  return `Комплект №${display}`;
}

export function getComplectSiblings(
  product: Product,
  catalog: Product[],
  limit = 3,
): Product[] {
  const complectKey = product.complectNumber;
  if (!complectKey) return [];

  return catalog
    .filter((item) => {
      if (item.id === product.id || item.category === "gifts") return false;
      return item.complectNumber === complectKey;
    })
    .sort(
      (a, b) =>
        COMPLECT_CATEGORY_ORDER.indexOf(a.category) -
        COMPLECT_CATEGORY_ORDER.indexOf(b.category),
    )
    .slice(0, limit);
}
