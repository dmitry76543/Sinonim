import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-2xl px-4 md:px-6 lg:px-10 text-center">
            <p className="text-sm tracking-widest uppercase text-brand-muted mb-4">
              404
            </p>
            <h1 className="font-heading text-3xl md:text-4xl text-brand-olive-dark mb-4">
              Страница не найдена
            </h1>
            <p className="text-brand-muted mb-10">
              Такой страницы нет или она была удалена. Загляните в каталог —
              там много украшений.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/shop"
                className="inline-flex justify-center px-8 py-3.5 bg-brand-terracotta hover:bg-brand-terracotta-logo text-white text-sm tracking-widest uppercase transition-colors"
              >
                В каталог
              </Link>
              <Link
                href="/"
                className="inline-flex justify-center px-8 py-3.5 border border-brand-olive/30 text-brand-olive-dark hover:border-brand-olive text-sm tracking-widest uppercase transition-colors"
              >
                На главную
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
