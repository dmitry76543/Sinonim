import Link from "next/link";
import { getCategoryStats } from "@/lib/catalog-stats";

export async function PriceOverview() {
  const categories = (await getCategoryStats()).filter(
    (category) => category.slug !== "gifts",
  );

  if (categories.length === 0) return null;

  const summary = categories
    .map((category) => `${category.title.toLowerCase()} ${category.priceFromLabel}`)
    .join(", ");

  return (
    <section
      className="bg-white border-y border-brand-sand py-10 md:py-12"
      aria-label="Цены на украшения"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-10">
        <p className="text-brand-terracotta text-sm tracking-[0.2em] uppercase mb-2">
          Стоимость
        </p>
        <h2 className="font-heading text-2xl md:text-3xl text-brand-olive-dark mb-4">
          Цены на украшения с лабораторными бриллиантами
        </h2>
        <p className="text-brand-text leading-relaxed max-w-3xl mb-8">
          Украшения из серебра 925 с выращенными бриллиантами: {summary}.
          Точная цена зависит от каратности камня, огранки и модели.
        </p>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {categories.map((category) => (
            <li key={category.slug}>
              <Link
                href={category.href}
                className="block rounded-xl border border-brand-olive/15 bg-brand-surface p-5 hover:border-brand-olive/35 transition-colors"
              >
                <h3 className="font-heading text-lg text-brand-olive-dark mb-1">
                  {category.title}
                </h3>
                <p className="text-brand-muted text-sm mb-2">{category.countLabel}</p>
                <p className="text-brand-olive-dark text-base font-medium">
                  {category.priceFromLabel}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
