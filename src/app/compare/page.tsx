import { CompareView } from "@/components/compare/CompareView";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export const metadata = {
  title: "Сравнение товаров — Синоним",
  description: "Сравните украшения Синоним по цене, каратности и характеристикам",
};

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
