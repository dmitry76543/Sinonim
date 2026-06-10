import type { Metadata } from "next";
import { Categories } from "@/components/Categories";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroVideoBanner } from "@/components/HeroVideoBanner";
import { TrustBar } from "@/components/TrustBar";

export const metadata: Metadata = {
  title: "Синоним — вариант с видео",
  description:
    "Украшения с лабораторными бриллиантами в серебре 925. Альтернативная главная страница.",
};

export default function HomeVariantPage() {
  return (
    <>
      <Header />
      <main>
        <HeroVideoBanner />
        <TrustBar />
        <Categories />
      </main>
      <Footer />
    </>
  );
}
