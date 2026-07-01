"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Product } from "@/lib/products";
import { ProductCard } from "@/components/catalog/ProductCard";
import { SearchForm } from "./SearchForm";

const SEARCH_GRID =
  "grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 lg:gap-6";

const CLIENT_SEARCH_TIMEOUT_MS = 50_000;

async function fetchSearch(
  query: string,
  signal: AbortSignal
): Promise<{ products: Product[]; error?: string }> {
  const params = new URLSearchParams({ q: query });
  const response = await fetch(`/api/search?${params.toString()}`, { signal });
  const data = (await response.json()) as {
    products?: Product[];
    error?: string;
  };

  if (!response.ok || data.error) {
    return {
      products: [],
      error: data.error ?? "Не удалось выполнить поиск",
    };
  }

  return { products: data.products ?? [] };
}

export function SearchView() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.trim() ?? "";
  const [products, setProducts] = useState<Product[]>([]);
  const [searchError, setSearchError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const retrySearch = useCallback(() => {
    setReloadKey((key) => key + 1);
  }, []);

  useEffect(() => {
    if (!query) {
      setProducts([]);
      setSearchError(undefined);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      controller.abort();
    }, CLIENT_SEARCH_TIMEOUT_MS);

    let cancelled = false;
    setLoading(true);
    setSearchError(undefined);

    fetchSearch(query, controller.signal)
      .then(({ products: results, error }) => {
        if (cancelled) return;
        if (error) {
          setSearchError(error);
          setProducts([]);
          return;
        }
        setSearchError(undefined);
        setProducts(results);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        if (error instanceof Error && error.name === "AbortError") {
          setSearchError(
            "Поиск занял слишком много времени. Нажмите «Попробовать снова»."
          );
        } else {
          setSearchError("Не удалось выполнить поиск");
        }
        setProducts([]);
      })
      .finally(() => {
        window.clearTimeout(timeoutId);
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [query, reloadKey]);

  return (
    <section className="py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-10">
        <nav className="text-sm text-brand-muted mb-6" aria-label="Хлебные крошки">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-brand-terracotta transition-colors">
                Главная
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <span className="text-brand-text">Поиск</span>
            </li>
          </ol>
        </nav>

        <div className="mb-8 md:mb-10">
          <p className="text-brand-terracotta text-sm tracking-[0.2em] uppercase mb-2">
            Каталог
          </p>
          <h1 className="font-heading text-3xl md:text-4xl text-brand-olive-dark mb-4">
            Поиск
          </h1>
          <SearchForm defaultQuery={query} className="max-w-xl" />
        </div>

        {!query && (
          <p className="text-brand-muted text-sm md:text-base">
            Введите название украшения или артикул.
          </p>
        )}

        {query && loading && (
          <p className="py-12 text-center text-brand-muted">Ищем…</p>
        )}

        {query && searchError && !loading && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-6 text-center">
            <p className="text-brand-text mb-4">{searchError}</p>
            <button
              type="button"
              onClick={retrySearch}
              className="rounded-lg bg-brand-terracotta px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-terracotta-logo transition-colors"
            >
              Попробовать снова
            </button>
          </div>
        )}

        {query && !loading && !searchError && products.length === 0 && (
          <p className="py-12 text-center text-brand-muted">
            По запросу «{query}» ничего не найдено.
          </p>
        )}

        {query && !loading && !searchError && products.length > 0 && (
          <>
            <p className="mb-6 text-sm text-brand-muted">
              Найдено: {products.length}
            </p>
            <div className={SEARCH_GRID}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
