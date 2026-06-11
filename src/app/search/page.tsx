import { Suspense } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SearchView } from "@/components/search/SearchView";

export const metadata = {
  title: "Поиск — Синоним",
  description:
    "Поиск украшений из серебра 925 с лабораторными бриллиантами в каталоге Синоним.",
};

function SearchFallback() {
  return (
    <div className="py-20 text-center text-brand-muted">Загрузка…</div>
  );
}

export default function SearchPage() {
  return (
    <>
      <Header />
      <main>
        <Suspense fallback={<SearchFallback />}>
          <SearchView />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
