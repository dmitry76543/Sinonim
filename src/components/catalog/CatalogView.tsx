"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CATEGORIES, type CategorySlug, type Product } from "@/lib/products";
import {
  filterProducts,
  parseFiltersFromSearchParams,
  countActiveFilters,
} from "@/lib/catalog-utils";
import { CatalogFilters, SortSelect } from "./CatalogFilters";
import { ProductCard } from "./ProductCard";

const CATALOG_GRID =
  "grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 lg:gap-6";

type CatalogViewProps = {
  category?: CategorySlug;
  initialProducts?: Product[];
  catalogError?: string;
};

export function CatalogView({
  category,
  initialProducts,
  catalogError: initialError,
}: CatalogViewProps) {
  const searchParams = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [catalogProducts, setCatalogProducts] = useState<Product[]>(
    initialProducts ?? []
  );
  const [catalogError, setCatalogError] = useState<string | undefined>(
    initialError
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

    if (filters.sort === "default" && initialProducts?.length && !initialError) {
      setCatalogProducts(initialProducts);
      setCatalogError(undefined);
      setLoading(false);
      return;
    }

    if (filters.sort !== "default") {
      params.set("sort", filters.sort);
    }

    let cancelled = false;
    setLoading(true);
    setCatalogError(undefined);

    fetch(`/api/catalog?${params.toString()}`)
      .then(async (response) => {
        const data = (await response.json()) as {
          products?: Product[];
          error?: string;
        };
        if (!cancelled) {
          if (!response.ok || data.error) {
            setCatalogError(
              data.error ?? "Не удалось загрузить каталог из AdvantShop"
            );
            setCatalogProducts([]);
            return;
          }
          setCatalogError(undefined);
          setCatalogProducts(data.products ?? []);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCatalogError("Не удалось загрузить каталог из AdvantShop");
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
  }, [category, filters.sort, initialProducts, initialError]);

  const products = filterProducts(filters, catalogProducts);
  const activeFilterCount = countActiveFilters(filters);

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

        <div className={`relative flex transition-[gap] duration-300 ${filtersOpen ? "lg:gap-6" : "gap-0"}`}>
          {filtersOpen && (
            <button
              type="button"
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px] transition-opacity duration-300 lg:hidden"
              aria-label="Закрыть фильтры"
              onClick={() => setFiltersOpen(false)}
            />
          )}

          <aside
            id="catalog-filters"
            aria-hidden={!filtersOpen}
            className={`shrink-0 overflow-hidden transition-[width,transform,opacity] duration-300 ease-in-out will-change-[width,transform]
              fixed inset-y-0 left-0 z-50 h-full lg:relative lg:inset-auto lg:z-10 lg:h-auto
              ${
                filtersOpen
                  ? "w-[min(100%,18rem)] translate-x-0 opacity-100"
                  : "w-0 -translate-x-full opacity-0 pointer-events-none lg:translate-x-0 lg:w-0"
              }`}
          >
            <div className="h-full w-72 max-w-[85vw] overflow-y-auto border-r border-brand-olive/10 bg-brand-surface p-6 shadow-xl lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:w-64 lg:rounded-xl lg:border lg:border-r lg:shadow-sm">
              <CatalogFilters
                filters={filters}
                basePath={basePath}
                onClose={() => setFiltersOpen(false)}
              />
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  aria-expanded={filtersOpen}
                  aria-controls="catalog-filters"
                  onClick={() => setFiltersOpen((open) => !open)}
                  className="inline-flex items-center gap-2 rounded-lg border border-brand-olive/20 bg-brand-surface px-4 py-2.5 text-sm text-brand-text transition-colors hover:border-brand-olive"
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
                  {activeFilterCount > 0 && (
                    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-olive px-1.5 text-[10px] font-medium text-white">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

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
              </div>

              <SortSelect filters={filters} basePath={basePath} />
            </div>

            {loading ? (
              <div className={CATALOG_GRID}>
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-xl bg-brand-sand/40 animate-pulse"
                  />
                ))}
              </div>
            ) : catalogError ? (
              <div className="rounded-xl bg-brand-surface p-10 text-center md:p-16">
                <p className="mb-2 font-heading text-xl text-brand-olive-dark">
                  Каталог временно недоступен
                </p>
                <p className="mx-auto mb-2 max-w-xl text-sm text-brand-muted">
                  {catalogError}
                </p>
                <p className="mx-auto max-w-xl text-xs text-brand-muted">
                  Проверьте ключ Client API в `.env.local` (вкладка «API с
                  авторизацией» в AdvantShop) и перезапустите сервер.
                </p>
              </div>
            ) : products.length > 0 ? (
              <div className={CATALOG_GRID}>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl bg-brand-surface p-10 text-center md:p-16">
                <p className="mb-2 font-heading text-xl text-brand-olive-dark">
                  Ничего не найдено
                </p>
                <p className="mb-6 text-sm text-brand-muted">
                  Попробуйте изменить фильтры или выберите другую категорию
                </p>
                <Link
                  href={basePath}
                  className="inline-flex bg-brand-olive px-6 py-3 text-sm tracking-widest uppercase text-white transition-colors hover:bg-brand-olive-dark"
                >
                  Сбросить фильтры
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
