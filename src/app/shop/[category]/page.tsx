import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { CatalogView } from "@/components/catalog/CatalogView";
import { CATEGORIES, isValidCategory, type CategorySlug } from "@/lib/products";
import { getCatalogProducts } from "@/lib/products-service";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { category } = await params;
  if (!isValidCategory(category)) return {};

  const { titlePlural, description } = CATEGORIES[category];
  return {
    title: `${titlePlural} — каталог Синоним`,
    description,
  };
}

function CatalogFallback() {
  return (
    <div className="py-20 text-center text-brand-muted">Загрузка каталога…</div>
  );
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;

  if (!isValidCategory(category)) {
    notFound();
  }

  const initialProducts = await getCatalogProducts({
    category: category as CategorySlug,
  });

  return (
    <>
      <Header />
      <main>
        <Suspense fallback={<CatalogFallback />}>
          <CatalogView
            category={category as CategorySlug}
            initialProducts={initialProducts}
          />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
