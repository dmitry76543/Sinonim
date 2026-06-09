"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CATEGORIES, type CategorySlug, type Product } from "@/lib/products";
import {
  filterProducts,
  parseFiltersFromSearchParams,
} from "@/lib/catalog-utils";
import { CatalogFilters, SortSelect } from "./CatalogFilters";
import { ProductCard } from "./ProductCard";

type CatalogViewProps = {
  category?: CategorySlug;
  initialProducts?: Product[];
};

export function CatalogView({ category, initialProducts }: CatalogViewProps) {
  const searchParams = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [catalogProducts, setCatalogProducts] = useState<Product[]>(
    initialProducts ?? []
  );
  const [loading, setLoading] = useState(!initialProducts?.length);

  const basePath = category ? `/shop/${category}` : "/shop";
  const filters = parseFiltersFromSearchParams(
    new URLSearchParams(searchParams.toString()),
    category
  );

  useEffect(() => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (filters.sort !== "default") params.set("sort", filters.sort);

    let cancelled = false;
    setLoading(true);

    fetch(`/api/catalog?${params.toString()}`)
      .then((response) => response.json())
      .then((data: { products?: Product[] }) => {
        if (!cancelled) {
          setCatalogProducts(data.products ?? []);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCatalogProducts([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [category, filters.sort]);

  const products = filterProducts(filters, catalogProducts);

  const pageTitle = category
    ? CATEGORIES[category].titlePlural
    : "Все украшения";
  const pageDescription = category
    ? CATEGORIES[category].description
    : "Каталог украшений из серебра 925 с лабораторными бриллиантами";

  return (
    <section className="py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-10">
        <nav className="text-sm text-brand-muted mb-6" aria-label="Хлебные крошки">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-brand-olive transition-colors">
                Главная
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              {category ? (
                <Link href="/shop" className="hover:text-brand-olive transition-colors">
                  Каталог
                </Link>
              ) : (
                <span className="text-brand-text">Каталог</span>
              )}
            </li>
            {category && (
              <>
                <li aria-hidden>/</li>
                <li>
                  <span className="text-brand-text">{pageTitle}</span>
                </li>
              </>
            )}
          </ol>
        </nav>

        <div className="mb-8 md:mb-10">
          <p className="text-brand-olive text-sm tracking-[0.2em] uppercase mb-2">
            Каталог
          </p>
          <h1 className="font-heading text-3xl md:text-4xl text-brand-olive-dark mb-2">
            {pageTitle}
          </h1>
          <p className="text-brand-muted text-sm md:text-base max-w-2xl">
            {pageDescription}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-28 bg-brand-surface rounded-xl p-6 shadow-sm">
              <CatalogFilters filters={filters} basePath={basePath} />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <p className="text-sm text-brand-muted">
                {loading
                  ? "Загрузка каталога…"
                  : `${products.length} ${
                      products.length === 1
                        ? "изделие"
                        : products.length < 5
                          ? "изделия"
                          : "изделий"
                    }`}
              </p>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-brand-surface border border-brand-olive/20 rounded-lg text-sm text-brand-text hover:border-brand-olive transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M4 7h16M4 12h10M4 17h6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  Фильтры
                </button>
                <SortSelect filters={filters} basePath={basePath} />
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-xl bg-brand-sand/40 animate-pulse"
                  />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-brand-surface rounded-xl p-10 md:p-16 text-center">
                <p className="font-heading text-xl text-brand-olive-dark mb-2">
                  Ничего не найдено
                </p>
                <p className="text-brand-muted text-sm mb-6">
                  Попробуйте изменить фильтры или выберите другую категорию
                </p>
                <Link
                  href={basePath}
                  className="inline-flex px-6 py-3 bg-brand-olive text-white text-sm tracking-widest uppercase hover:bg-brand-olive-dark transition-colors"
                >
                  Сбросить фильтры
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Закрыть фильтры"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-full max-w-sm bg-brand-surface shadow-xl overflow-y-auto">
            <div className="p-6">
              <CatalogFilters
                filters={filters}
                basePath={basePath}
                onClose={() => setMobileFiltersOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
