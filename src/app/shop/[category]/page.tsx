import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { CatalogView } from "@/components/catalog/CatalogView";
import { CATEGORIES, isValidCategory, type CategorySlug } from "@/lib/products";

type PageProps = {
  params: Promise<{ category: string }>;
};

export async function generateStaticParams() {
  return (Object.keys(CATEGORIES) as CategorySlug[]).map((category) => ({
    category,
  }));
}

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

  return (
    <>
      <Header />
      <main>
        <Suspense fallback={<CatalogFallback />}>
          <CatalogView category={category} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
