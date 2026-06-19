import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ShowroomPage } from "@/components/showroom/ShowroomPage";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Шоурум — Синоним",
  description:
    "Шоурум Синоним в Москве: 129110, ул. Гиляровского 40, офис 13. Примерьте украшения с лабораторными бриллиантами.",
  path: "/showroom",
});
export default function ShowroomRoute() {
  return (
    <>
      <Header />
      <main>
        <ShowroomPage />
      </main>
      <Footer />
    </>
  );
}
