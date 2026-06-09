"use client";

import { useState } from "react";
import Link from "next/link";
import { CompareButton } from "@/components/compare/CompareButton";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { useCart } from "@/context/CartContext";
import { formatPrice, type ProductDetails } from "@/lib/products";

type ProductConfiguratorProps = {
  product: ProductDetails;
};

export function ProductConfigurator({ product }: ProductConfiguratorProps) {
  const defaultVariant = product.stoneVariants.find(
    (v) => v.weight === product.stoneWeight
  ) ?? product.stoneVariants[0];

  const [selectedSize, setSelectedSize] = useState(
    product.sizes.length > 0 ? product.sizes[3] ?? product.sizes[0] : null
  );
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      productSlug: product.slug,
      name: product.name,
      image: product.image,
      price: defaultVariant.price,
      stoneWeight: defaultVariant.weight,
      stoneLabel: defaultVariant.label,
      size: selectedSize,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <p className="font-heading text-3xl md:text-4xl text-brand-olive-dark">
            {formatPrice(defaultVariant.price)}
          </p>
          {product.badge && (
            <span className="px-2.5 py-1 bg-brand-terracotta text-white text-[10px] tracking-widest uppercase">
              {product.badge}
            </span>
          )}
        </div>
        <p className="text-sm text-brand-muted">
          Лабораторный бриллиант · Сертификат качества
        </p>
      </div>

      <div className="space-y-4">
        {product.sizes.length > 0 && (
          <div>
            <label
              htmlFor="size-select"
              className="block text-xs tracking-[0.15em] uppercase text-brand-muted mb-2"
            >
              Размер
            </label>
            <div className="relative">
              <select
                id="size-select"
                value={selectedSize ?? ""}
                onChange={(e) => setSelectedSize(Number(e.target.value))}
                className="w-full appearance-none bg-brand-surface border border-brand-olive/20 rounded-lg pl-4 pr-10 py-3 text-sm text-brand-text focus:outline-none focus:border-brand-olive cursor-pointer"
              >
                {product.sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-brand-muted"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <path
                  d="M6 9l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <p className="mt-2 text-xs text-brand-muted">
              <a href="/how-size-ring" className="text-brand-olive hover:underline">
                Как определить размер →
              </a>
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex-1 px-6 py-3.5 bg-brand-terracotta hover:bg-brand-terracotta-logo text-white text-sm tracking-widest uppercase transition-colors"
        >
          {added ? "Добавлено ✓" : "В корзину"}
        </button>
        <button
          type="button"
          className="flex-1 px-6 py-3.5 border border-brand-olive text-brand-olive-dark hover:bg-brand-olive hover:text-white text-sm tracking-widest uppercase transition-colors"
        >
          Примерить в шоуруме
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <FavoriteButton slug={product.slug} variant="text" className="flex-1" />
        <CompareButton slug={product.slug} variant="text" className="flex-1" />
      </div>

      <Link
        href="/favorites"
        className="inline-flex text-sm text-brand-olive hover:text-brand-terracotta transition-colors"
      >
        Открыть избранное →
      </Link>

      {added && (
        <p className="text-sm text-brand-olive">
          Товар добавлен в корзину.{" "}
          <Link href="/cart" className="underline hover:text-brand-terracotta">
            Перейти в корзину →
          </Link>
        </p>
      )}

      <div className="flex items-start gap-3 p-4 bg-brand-surface rounded-xl text-sm text-brand-muted">
        <svg
          className="shrink-0 mt-0.5 text-brand-olive"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          <path
            d="M12 2l2.4 7.4H22l-6 4.6 2.3 7L12 17l-6.3 4 2.3-7-6-4.6h7.6L12 2Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
        <p>
          Подлинность лабораторного бриллианта подтверждена сертификатом
          геммологической лаборатории. Бесплатная полировка и чистка — навсегда.
        </p>
      </div>
    </div>
  );
}
