import { Suspense } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { CatalogView } from "@/components/catalog/CatalogView";
import { buildPageMetadata } from "@/lib/metadata";
import { getCatalogProducts } from "@/lib/products-service";
import type { Product } from "@/lib/products";

export const metadata = buildPageMetadata({
  title: "Каталог — Синоним",
  description:
    "Каталог украшений из серебра 925 с лабораторными бриллиантами. Кольца, серьги, колье, браслеты.",
  path: "/shop",
});

type PageProps = {
  searchParams: Promise<{ sort?: string }>;
};

function CatalogFallback() {
  return (
    <div className="py-20 text-center text-brand-muted">Загрузка каталога…</div>
  );
}

export default async function ShopPage({ searchParams }: PageProps) {
  const { sort } = await searchParams;
  let initialProducts: Product[] = [];
  let initialError: string | undefined;

  try {
    initialProducts = await getCatalogProducts({ sort: sort ?? "default" });
  } catch {
    initialError = "Не удалось загрузить каталог из AdvantShop";
  }

  return (
    <>
      <Header />
      <main>
        <Suspense fallback={<CatalogFallback />}>
          <CatalogView
            initialProducts={initialProducts}
            initialError={initialError}
          />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
