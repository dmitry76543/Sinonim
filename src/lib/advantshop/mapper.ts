import type { CategorySlug, Product, ProductDetails, StoneVariant } from "@/lib/products";
import { RING_BRACELET_SIZES } from "@/lib/products";
import { parseCaratWeightFromDescription } from "@/lib/product-weight";
import { buildSeoProductSlug } from "@/lib/product-slug";
import { resolveProductImageUrl, resolveProductImages } from "./images";
import type {
  AdvantShopCatalogProduct,
  AdvantShopPhoto,
  AdvantShopProductDetails,
  AdvantShopProperty,
} from "./types";

export function extractProductSizes(
  item: Pick<AdvantShopProductDetails, "sizeColorPicker">,
  category: CategorySlug
): number[] {
  const sizes =
    item.sizeColorPicker?.sizes
      ?.map((size) => Number.parseFloat(size.name.replace(",", ".")))
      .filter((size) => !Number.isNaN(size)) ?? [];

  if (sizes.length) return sizes;

  if (category === "rings" || category === "bracelets") {
    return [];
  }

  return [];
}

const DEFAULT_IMAGE = "/images/product-ring.webp";

const STONE_VARIANT_WEIGHTS = [0.1, 0.2, 0.3, 0.5, 1] as const;

function pickImage(
  product: Pick<
    AdvantShopCatalogProduct,
    "photoMiddle" | "photoSmall" | "photos"
  >
): string {
  if (product.photoMiddle) return product.photoMiddle;
  if (product.photoSmall) return product.photoSmall;

  const photos = product.photos ?? [];
  const main =
    photos.find((photo) => photo.main) ?? photos[0];

  return (
    main?.middleSrc ??
    main?.bigSrc ??
    main?.smallSrc ??
    DEFAULT_IMAGE
  );
}

function collectImages(photos?: AdvantShopPhoto[] | null): string[] {
  if (!photos?.length) return [];

  return photos
    .map((photo) => photo.bigSrc ?? photo.middleSrc ?? photo.smallSrc)
    .filter((src): src is string => Boolean(src));
}

function parseStoneWeight(
  properties: AdvantShopProperty[],
  description?: string,
): number {
  if (description) {
    const fromDescription = parseCaratWeightFromDescription(description);
    if (fromDescription !== undefined) return fromDescription;
  }

  for (const property of properties) {    const name = (property.propertyName ?? property.name ?? "").toLowerCase();
    const value = property.propertyValue ?? property.value ?? "";

    if (
      name.includes("карат") ||
      name.includes("вес камн") ||
      name.includes("carat")
    ) {
      const match = value.replace(",", ".").match(/(\d+(?:\.\d+)?)/);
      if (match) return Number(match[1]);
    }
  }

  return 0.2;
}

function parseWeightGrams(properties: AdvantShopProperty[]): string | undefined {
  const fromProperty = parseProperty(properties, ["вес, гр", "вес гр"]);
  if (fromProperty?.trim()) return fromProperty.trim();

  for (const property of properties) {
    const name = (property.propertyName ?? property.name ?? "").toLowerCase();
    const value = (property.propertyValue ?? property.value ?? "").trim();
    if (!value) continue;

    if (name === "вес, гр." || (name.includes("вес") && name.includes("гр"))) {
      return value;
    }
  }

  return undefined;
}

function parseProperty(
  properties: AdvantShopProperty[],
  keywords: string[]
): string | undefined {
  for (const property of properties) {
    const name = (property.propertyName ?? property.name ?? "").toLowerCase();
    if (keywords.some((keyword) => name.includes(keyword))) {
      const value = (property.propertyValue ?? property.value)?.trim();
      if (value) return value;
    }
  }

  return undefined;
}

function pickDefaultArtNo(
  item: Pick<AdvantShopProductDetails, "artNo" | "offers">
): string {
  return (
    item.artNo ??
    item.offers?.find((offer) => offer.isMain)?.artNo ??
    item.offers?.[0]?.artNo ??
    ""
  );
}

function buildSizeArtNos(
  item: AdvantShopProductDetails
): Record<string, string> | undefined {
  if (!item.sizeColorPicker?.sizes?.length || !item.offers?.length) {
    return undefined;
  }

  const map: Record<string, string> = {};
  const fallbackArtNo = pickDefaultArtNo(item);

  for (const size of item.sizeColorPicker.sizes) {
    const sizeValue = Number.parseFloat(size.name.replace(",", "."));
    if (Number.isNaN(sizeValue)) continue;

    const offer = item.offers.find((entry) => entry.sizeId === size.id);
    const artNo = offer?.artNo ?? fallbackArtNo;
    if (artNo) map[String(sizeValue)] = artNo;
  }

  return Object.keys(map).length ? map : undefined;
}

function mapBadge(
  product: Pick<AdvantShopCatalogProduct, "newProduct" | "bestseller" | "sales">
): Product["badge"] {
  if (product.newProduct) return "Новинка";
  if (product.bestseller) return "Хит";
  if (product.sales) return "Хит";
  return undefined;
}

function resolveCatalogSizes(
  sizes: number[],
  category: CategorySlug
): number[] | undefined {
  const needsSizes =
    category === "rings" || category === "bracelets" || sizes.length > 0;
  if (!needsSizes) return undefined;
  if (sizes.length) return sizes;
  if (category === "rings" || category === "bracelets") {
    return [...RING_BRACELET_SIZES];
  }
  return undefined;
}

export function mapCatalogProduct(
  item: AdvantShopCatalogProduct,
  category: CategorySlug
): Product {
  const price = Math.round(item.priceWithDiscount ?? item.price);
  const sizes = extractProductSizes(item, category);

  const description = item.briefDescription || undefined;
  const stoneWeight = description
    ? (parseCaratWeightFromDescription(description) ?? 0.2)
    : 0.2;
  const legacySlug = item.urlPath;

  return {
    id: String(item.productId),
    slug: buildSeoProductSlug({
      name: item.name,
      category,
      stoneWeight,
      legacySlug,
      productId: String(item.productId),
    }),
    urlPath: legacySlug,
    name: item.name,
    category,
    price,
    image: resolveProductImageUrl(pickImage(item)),
    stoneWeight,
    badge: mapBadge(item),
    isNew: Boolean(item.newProduct),
    description,
    images: resolveProductImages(collectImages(item.photos)),
    sizes: resolveCatalogSizes(sizes, category),
    artNo:
      item.artNo ??
      item.offers?.find((offer) => offer.isMain)?.artNo ??
      item.offers?.[0]?.artNo,
  };
}

export function mapProductDetails(
  item: AdvantShopProductDetails,
  category: CategorySlug,
  properties: AdvantShopProperty[] = [],
  catalogPrice?: number,
): ProductDetails {
  const offerPrice = Math.round(
    item.offers?.find((offer) => offer.isMain)?.price ??
      item.offers?.[0]?.price ??
      0,
  );
  const basePrice = catalogPrice ?? offerPrice;

  const description =
    item.description ||
    item.briefDescription ||
    `${item.name} — украшение из серебра 925 пробы с лабораторным бриллиантом.`;

  const stoneWeight = parseStoneWeight(properties, description);
  const rawImages = collectImages(item.photos);
  const images = resolveProductImages(rawImages);
  const fallbackImage = images[0] ?? DEFAULT_IMAGE;

  const stoneVariants: StoneVariant[] = STONE_VARIANT_WEIGHTS.map((weight) => ({
    weight,
    label: weight >= 1 ? "1 карат" : `${weight} карат`,
    price:
      Math.abs(weight - stoneWeight) < 0.001
        ? basePrice
        : Math.round(basePrice * (weight / Math.max(stoneWeight, 0.1))),
  }));

  const sizes = extractProductSizes(item, category);
  const hasSizes =
    category === "rings" || category === "bracelets" || sizes.length > 0;
  const artNo = pickDefaultArtNo(item);
  const sizeArtNos = buildSizeArtNos(item);
  const legacySlug = item.urlPath;

  return {
    id: String(item.productId),
    slug: buildSeoProductSlug({
      name: item.name,
      category,
      stoneWeight,
      legacySlug,
      productId: String(item.productId),
    }),
    urlPath: legacySlug,
    name: item.name,
    category,
    price: basePrice,
    image: fallbackImage,
    stoneWeight,
    badge: mapBadge(item),
    isNew: Boolean(item.newProduct),
    description,
    images: images.length ? images : [fallbackImage],
    cut:
      parseProperty(properties, ["огранк", "cut", "brilliant", "гранен"]) ??
      "Круглая (57 граней)",
    color: parseProperty(properties, ["цвет", "color"]) ?? "2",
    clarity: parseProperty(properties, ["чистот", "clarity"]) ?? "5",
    metal:
      parseProperty(properties, ["металл", "проба", "silver"]) ??
      "Серебро 925, родиевое покрытие",
    sizes: hasSizes ? sizes : [],
    stoneVariants,
    artNo: artNo || undefined,
    sizeArtNos,
    weightGrams: parseWeightGrams(properties),
  };
}
