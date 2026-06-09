"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

function IconCart() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 6h15l-1.5 9h-12L6 6Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M6 6 5 3H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="9" cy="20" r="1" fill="currentColor" />
      <circle cx="18" cy="20" r="1" fill="currentColor" />
    </svg>
  );
}

export function CartLink() {
  const { count, isReady } = useCart();

  return (
    <Link
      href="/cart"
      className="p-2.5 text-brand-olive-dark hover:text-brand-olive transition-colors relative"
      aria-label={count > 0 ? `Корзина: ${count} товаров` : "Корзина"}
    >
      <IconCart />
      {isReady && count > 0 && (
        <span className="absolute top-1 right-1 min-w-[18px] h-[18px] flex items-center justify-center px-1 bg-brand-terracotta text-white text-[10px] font-medium rounded-full">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
