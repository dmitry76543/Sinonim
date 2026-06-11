import { Suspense } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { CatalogView } from "@/components/catalog/CatalogView";

export const metadata = {
  title: "Каталог — Синоним",
  description:
    "Каталог украшений из серебра 925 с лабораторными бриллиантами. Кольца, серьги, колье, браслеты.",
};

function CatalogFallback() {
  return (
    <div className="py-20 text-center text-brand-muted">Загрузка каталога…</div>
  );
}

export default function ShopPage() {
  return (
    <>
      <Header />
      <main>
        <Suspense fallback={<CatalogFallback />}>
          <CatalogView />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
