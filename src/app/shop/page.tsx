import { Suspense } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { CatalogView } from "@/components/catalog/CatalogView";
import { getCatalogProducts } from "@/lib/products-service";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Каталог — Синоним",
  description:
    "Каталог украшений из серебра 925 с лабораторными бриллиантами. Кольца, серьги, подвески, браслеты.",
};

function CatalogFallback() {
  return (
    <div className="py-20 text-center text-brand-muted">Загрузка каталога…</div>
  );
}

export default async function ShopPage() {
  let initialProducts: Awaited<ReturnType<typeof getCatalogProducts>> = [];
  let catalogError: string | undefined;

  try {
    initialProducts = await getCatalogProducts();
  } catch (error) {
    catalogError =
      error instanceof Error
        ? error.message
        : "Не удалось загрузить каталог из AdvantShop";
  }

  return (
    <>
      <Header />
      <main>
        <Suspense fallback={<CatalogFallback />}>
          <CatalogView
            initialProducts={initialProducts}
            catalogError={catalogError}
          />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
