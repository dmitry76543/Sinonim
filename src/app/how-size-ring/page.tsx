import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HowSizeRingPage } from "@/components/size/HowSizeRingPage";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Как определить размер — Синоним",
  description:
    "Как подобрать размер кольца и браслета: примерка в шоуруме, замеры дома, таблица российских размеров и полезные советы.",
  path: "/how-size-ring",
});
export default function HowSizeRingRoute() {
  return (
    <>
      <Header />
      <main>
        <HowSizeRingPage />
      </main>
      <Footer />
    </>
  );
}
