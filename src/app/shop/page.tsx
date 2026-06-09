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
  const initialProducts = await getCatalogProducts();

  return (
    <>
      <Header />
      <main>
        <Suspense fallback={<CatalogFallback />}>
          <CatalogView initialProducts={initialProducts} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
