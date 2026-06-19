import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { CatalogView } from "@/components/catalog/CatalogView";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd } from "@/lib/breadcrumb-schema";
import { hasCatalogFilterParams } from "@/lib/catalog-utils";
import { buildPageMetadata } from "@/lib/metadata";
import { CATEGORIES, isValidCategory, type CategorySlug, type Product } from "@/lib/products";
import { getCatalogProducts } from "@/lib/products-service";

type PageProps = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ sort?: string; price?: string | string[]; size?: string | string[] }>;
};

function buildFilterParams(searchParams: {
  sort?: string;
  price?: string | string[];
  size?: string | string[];
}) {
  const query = new URLSearchParams();
  if (searchParams.sort) query.set("sort", searchParams.sort);

  const prices = Array.isArray(searchParams.price)
    ? searchParams.price
    : searchParams.price
      ? [searchParams.price]
      : [];
  prices.forEach((value) => query.append("price", value));

  const sizes = Array.isArray(searchParams.size)
    ? searchParams.size
    : searchParams.size
      ? [searchParams.size]
      : [];
  sizes.forEach((value) => query.append("size", value));

  return query;
}

export async function generateMetadata({ params, searchParams }: PageProps) {
  const { category } = await params;
  if (!isValidCategory(category)) return {};

  const filterParams = buildFilterParams(await searchParams);
  const { titlePlural, description } = CATEGORIES[category];

  return buildPageMetadata({
    title: `${titlePlural} — каталог Синоним`,
    description,
    path: `/shop/${category}`,
    noIndex: hasCatalogFilterParams(filterParams),
    robotsFollow: hasCatalogFilterParams(filterParams),
  });
}

function CatalogFallback() {
  return (
    <div className="py-20 text-center text-brand-muted">Загрузка каталога…</div>
  );
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { category } = await params;
  const { sort } = await searchParams;

  if (!isValidCategory(category)) {
    notFound();
  }

  const categorySlug = category as CategorySlug;
  const categoryTitle = CATEGORIES[categorySlug].title;
  let initialProducts: Product[] = [];
  let initialError: string | undefined;

  try {
    initialProducts = await getCatalogProducts({
      category: categorySlug,
      sort: sort ?? "default",
    });
  } catch {
    initialError = "Не удалось загрузить каталог из AdvantShop";
  }

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Главная", path: "/" },
          { name: "Каталог", path: "/shop" },
          { name: categoryTitle, path: `/shop/${categorySlug}` },
        ])}
      />
      <Header />
      <main>
        <Suspense fallback={<CatalogFallback />}>
          <CatalogView
            category={categorySlug}
            initialProducts={initialProducts}
            initialError={initialError}
          />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
