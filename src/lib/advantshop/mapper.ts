import type { CategorySlug, Product, ProductDetails, StoneVariant } from "@/lib/products";
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

function parseStoneWeight(properties: AdvantShopProperty[]): number {
  for (const property of properties) {
    const name = (property.propertyName ?? property.name ?? "").toLowerCase();
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

function parseProperty(
  properties: AdvantShopProperty[],
  keywords: string[]
): string | undefined {
  for (const property of properties) {
    const name = (property.propertyName ?? property.name ?? "").toLowerCase();
    if (keywords.some((keyword) => name.includes(keyword))) {
      return property.propertyValue ?? property.value;
    }
  }

  return undefined;
}

function mapBadge(
  product: Pick<AdvantShopCatalogProduct, "newProduct" | "bestseller" | "sales">
): Product["badge"] {
  if (product.newProduct) return "Новинка";
  if (product.bestseller) return "Хит";
  if (product.sales) return "Хит";
  return undefined;
}

export function mapCatalogProduct(
  item: AdvantShopCatalogProduct,
  category: CategorySlug
): Product {
  const price = Math.round(item.priceWithDiscount ?? item.price);
  const sizes = extractProductSizes(item, category);
  const hasSizes =
    category === "rings" || category === "bracelets" || sizes.length > 0;

  return {
    id: String(item.productId),
    slug: item.urlPath,
    name: item.name,
    category,
    price,
    image: resolveProductImageUrl(pickImage(item)),
    stoneWeight: 0.2,
    badge: mapBadge(item),
    isNew: Boolean(item.newProduct),
    description: item.briefDescription || undefined,
    images: resolveProductImages(collectImages(item.photos)),
    sizes: hasSizes ? sizes : undefined,
  };
}

export function mapProductDetails(
  item: AdvantShopProductDetails,
  category: CategorySlug,
  properties: AdvantShopProperty[] = []
): ProductDetails {
  const basePrice = Math.round(
    item.offers?.find((offer) => offer.isMain)?.price ??
      item.offers?.[0]?.price ??
      0
  );

  const stoneWeight = parseStoneWeight(properties);
  const rawImages = collectImages(item.photos);
  const images = resolveProductImages(rawImages);
  const fallbackImage = images[0] ?? DEFAULT_IMAGE;

  const stoneVariants: StoneVariant[] = STONE_VARIANT_WEIGHTS.map((weight) => ({
    weight,
    label: weight >= 1 ? "1 карат" : `${weight} карат`,
    price: Math.round(basePrice * (weight / Math.max(stoneWeight, 0.1))),
  }));

  const sizes = extractProductSizes(item, category);
  const hasSizes =
    category === "rings" || category === "bracelets" || sizes.length > 0;

  return {
    id: String(item.productId),
    slug: item.urlPath,
    name: item.name,
    category,
    price: basePrice,
    image: fallbackImage,
    stoneWeight,
    badge: mapBadge(item),
    isNew: Boolean(item.newProduct),
    description:
      item.description ||
      item.briefDescription ||
      `${item.name} — украшение из серебра 925 пробы с лабораторным бриллиантом.`,
    images: images.length ? images : [fallbackImage],
    color: parseProperty(properties, ["цвет", "color"]) ?? "F (бесцветный)",
    clarity: parseProperty(properties, ["чистот", "clarity"]) ?? "VS1",
    metal:
      parseProperty(properties, ["металл", "проба", "silver"]) ??
      "Серебро 925, родиевое покрытие",
    sizes: hasSizes ? sizes : [],
    stoneVariants,
  };
}
