import { FavoritesView } from "@/components/favorites/FavoritesView";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export const metadata = {
  title: "Избранное — Синоним",
  description: "Сохранённые украшения в интернет-магазине Синоним",
};

export default function FavoritesPage() {
  return (
    <>
      <Header />
      <main>
        <FavoritesView />
      </main>
      <Footer />
    </>
  );
}
