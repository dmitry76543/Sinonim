import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { CartView } from "@/components/cart/CartView";

export const metadata = {
  title: "Корзина — Синоним",
  description: "Ваша корзина покупок в интернет-магазине Синоним",
};

export default function CartPage() {
  return (
    <>
      <Header />
      <main>
        <CartView />
      </main>
      <Footer />
    </>
  );
}
