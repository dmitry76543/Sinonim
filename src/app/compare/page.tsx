import { CompareView } from "@/components/compare/CompareView";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Сравнение товаров — Синоним",
  description: "Сравните украшения Синоним по цене, каратности и характеристикам",
  path: "/compare",
  noIndex: true,
});

export default function ComparePage() {
  return (
    <>
      <Header />
      <main>
        <CompareView />
      </main>
      <Footer />
    </>
  );
}
