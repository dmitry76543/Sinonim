import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { WarrantyPage } from "@/components/warranty/WarrantyPage";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Гарантия — Синоним",
  description:
    "Добровольная аттестация изделий Синоним с совокупным весом камней от 0,5 карат. Гарантия 2 года на украшения.",
  path: "/warranty",
});
export default function WarrantyRoute() {
  return (
    <>
      <Header />
      <main>
        <WarrantyPage />
      </main>
      <Footer />
    </>
  );
}
