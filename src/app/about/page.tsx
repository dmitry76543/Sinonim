import { AboutPage } from "@/components/about/AboutPage";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export const metadata = {
  title: "О бренде — Синоним",
  description:
    "Бренд Синоним — украшения из серебра с лабораторными бриллиантами. Качество без компромиссов.",
};

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
