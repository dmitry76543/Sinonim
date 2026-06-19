import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ShippingPage } from "@/components/shipping/ShippingPage";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Доставка и оплата — Синоним",
  description:
    "Доставка СДЭК и самовывоз из шоурума. Оплата в шоуруме или на сайте картой и по QR через ЮKassa.",
  path: "/shipping",
});
export default function ShippingRoute() {
  return (
    <>
      <Header />
      <main>
        <ShippingPage />
      </main>
      <Footer />
    </>
  );
}
