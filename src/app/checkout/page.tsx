import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata = {
  title: "Оформление заказа — Синоним",
  description: "Оформление заказа в интернет-магазине Синоним",
};

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <main>
        <CheckoutForm />
      </main>
      <Footer />
    </>
  );
}
