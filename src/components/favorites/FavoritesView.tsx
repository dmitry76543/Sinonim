"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/catalog/ProductCard";
import { useFavorites } from "@/context/FavoritesContext";
import type { Product } from "@/lib/products";

export function FavoritesView() {
  const { slugs, clearFavorites, isReady } = useFavorites();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isReady) return;

    if (!slugs.length) {
      setProducts([]);
      return;
    }

    let cancelled = false;
    setLoading(true);

    Promise.all(
      slugs.map(async (slug) => {
        const response = await fetch(`/api/products/${slug}`);
        if (!response.ok) return null;
        const data = (await response.json()) as { product?: Product };
        return data.product ?? null;
      })
    )
      .then((items) => {
        if (!cancelled) {
          setProducts(items.filter((item): item is Product => item !== null));
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
  }, [slugs, isReady]);

  if (!isReady || loading) {    return (
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-10 text-center text-brand-muted">
          Загрузка…
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-10 text-center">
          <h1 className="font-heading text-3xl md:text-4xl text-brand-olive-dark mb-4">
            Избранное
          </h1>
          <p className="text-brand-muted mb-8 max-w-md mx-auto">
            Сохраняйте понравившиеся украшения — нажмите на сердечко в каталоге
            или на странице товара
          </p>
          <Link
            href="/shop"
            className="inline-flex px-8 py-3.5 bg-brand-terracotta hover:bg-brand-terracotta-logo text-white text-sm tracking-widest uppercase transition-colors"
          >
            Перейти в каталог
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-brand-terracotta text-sm tracking-[0.2em] uppercase mb-2">
              Сохранённое
            </p>
            <h1 className="font-heading text-3xl md:text-4xl text-brand-olive-dark">
              Избранное
            </h1>
            <p className="text-sm text-brand-muted mt-2">
              {products.length}{" "}
              {products.length === 1
                ? "товар"
                : products.length < 5
                  ? "товара"
                  : "товаров"}
            </p>
          </div>
          <button
            type="button"
            onClick={clearFavorites}
            className="text-sm text-brand-muted hover:text-brand-terracotta transition-colors"
          >
            Очистить избранное
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
