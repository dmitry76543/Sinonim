import { buildProductMetaDescription } from "@/lib/product-metadata";
import { CATEGORIES, type ProductDetails } from "@/lib/products";
import { absoluteImageUrl } from "@/lib/seo-images";
import { getSiteUrl } from "@/lib/site-url";

export function buildProductJsonLd(
  product: ProductDetails,
  slug: string
): Record<string, unknown>[] {
  const siteUrl = getSiteUrl();
  const productUrl = `${siteUrl}/products/${slug}`;
  const categoryTitle = CATEGORIES[product.category].title;
  const categoryUrl = `${siteUrl}/shop/${product.category}`;
  const images = product.images.map(absoluteImageUrl);

  return [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Главная",
          item: siteUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Каталог",
          item: `${siteUrl}/shop`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: categoryTitle,
          item: categoryUrl,
        },
        {
          "@type": "ListItem",
          position: 4,
          name: product.name,
          item: productUrl,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: buildProductMetaDescription(product),
      image: images,
      sku: product.artNo ?? product.id,
      brand: {
        "@type": "Brand",
        name: "Синоним",
      },
      offers: {
        "@type": "Offer",
        url: productUrl,
        priceCurrency: "RUB",
        price: product.price,
        availability: "https://schema.org/InStock",
        itemCondition: "https://schema.org/NewCondition",
      },
    },
  ];
}
