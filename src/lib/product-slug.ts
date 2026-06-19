import type { CategorySlug } from "@/lib/products";

const CYRILLIC_TO_LATIN: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ё: "e",
  ж: "zh",
  з: "z",
  и: "i",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "h",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "sch",
  ъ: "",
  ы: "y",
  ь: "",
  э: "e",
  ю: "yu",
  я: "ya",
};

const GENERIC_LEGACY_SLUG =
  /^(koltso|sergi|kole|braslet|podarok)(-\d+)?$/i;

const CATEGORY_FALLBACK: Record<CategorySlug, string> = {
  rings: "koltso",
  earrings: "sergi",
  pendants: "podveska",
  bracelets: "braslet",
  gifts: "podarok",
};

function transliterate(value: string): string {
  return value
    .toLowerCase()
    .split("")
    .map((char) => CYRILLIC_TO_LATIN[char] ?? char)
    .join("");
}

function slugify(value: string): string {
  return transliterate(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function formatWeightSlug(weight: number): string {
  const normalized = weight.toFixed(2).replace(/\.?0+$/, "").replace(".", "-");
  return `${normalized}-karat`;
}

type BuildSeoProductSlugInput = {
  name: string;
  category: CategorySlug;
  stoneWeight: number;
  legacySlug: string;
  productId: string;
};

export function buildSeoProductSlug({
  name,
  category,
  stoneWeight,
  legacySlug,
  productId,
}: BuildSeoProductSlugInput): string {
  if (!GENERIC_LEGACY_SLUG.test(legacySlug)) {
    return legacySlug;
  }

  const nameSlug = slugify(name);
  const fallback = CATEGORY_FALLBACK[category];
  const baseName =
    nameSlug && nameSlug !== fallback ? nameSlug : `${fallback}-s-brilliantom`;

  const slug = `${baseName}-${formatWeightSlug(stoneWeight)}-serebro-925`
    .replace(/-{2,}/g, "-")
    .slice(0, 96);

  return slug || `${fallback}-${productId}`;
}

export function isLegacyProductSlug(
  slug: string,
  product: { slug: string; urlPath?: string }
): boolean {
  return slug !== product.slug && slug === (product.urlPath ?? product.slug);
}
