import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import {
  FeaturedProducts,
  FeaturedProductsFallback,
} from "@/components/FeaturedProducts";
import { ScrollReveal } from "@/components/ScrollReveal";
import { getCategoryStats } from "@/lib/catalog-stats";

export async function Categories() {
  const categories = (await getCategoryStats()).filter(
    (category) => category.slug !== "gifts",
  );

  return (
    <section className="py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <p className="text-brand-olive text-sm tracking-[0.2em] uppercase mb-2">
              Каталог
            </p>
            <h2 className="font-heading text-3xl md:text-4xl text-brand-olive-dark">
              Выберите категорию
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-sm text-brand-olive hover:text-brand-terracotta transition-colors tracking-wide"
          >
            Весь каталог →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16 md:mb-20">
          {categories.map((cat, index) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="group relative bg-brand-surface rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <ScrollReveal delayMs={index * 90} className="block">
                <div className="aspect-[4/5] relative overflow-hidden bg-brand-sand/50">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, 20vw"
                  />
                </div>
              </ScrollReveal>
              <div className="p-4 md:p-5">
                <h3 className="font-heading text-xl md:text-2xl mb-1 text-brand-olive-dark">
                  {cat.title}
                </h3>
                <p className="text-xs md:text-sm text-brand-muted">{cat.countLabel}</p>
                <p className="text-sm text-brand-olive-dark mt-1">{cat.priceFromLabel}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <p className="text-brand-terracotta text-sm tracking-[0.2em] uppercase mb-2">
              Бестселлеры
            </p>
            <h2 className="font-heading text-3xl md:text-4xl text-brand-olive-dark">
              Популярные украшения
            </h2>
          </div>
        </div>

        <Suspense fallback={<FeaturedProductsFallback />}>
          <FeaturedProducts />
        </Suspense>
      </div>
    </section>
  );
}
