import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { CatalogView } from "@/components/catalog/CatalogView";
import { buildPageMetadata } from "@/lib/metadata";
import { CATEGORIES, isValidCategory, type CategorySlug, type Product } from "@/lib/products";
import { getCatalogProducts } from "@/lib/products-service";

type PageProps = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ sort?: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { category } = await params;
  if (!isValidCategory(category)) return {};

  const { titlePlural, description } = CATEGORIES[category];
  return buildPageMetadata({
    title: `${titlePlural} — каталог Синоним`,
    description,
    path: `/shop/${category}`,
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
