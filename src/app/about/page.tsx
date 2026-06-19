import { AboutPage } from "@/components/about/AboutPage";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "О бренде — Синоним",
  description:
    "Бренд Синоним — украшения из серебра с лабораторными бриллиантами. Качество без компромиссов.",
  path: "/about",
});
export default function AboutRoute() {
  return (
    <>
      <Header />
      <main>
        <AboutPage />
      </main>
      <Footer />
    </>
  );
}
