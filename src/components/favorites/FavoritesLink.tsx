"use client";

import Link from "next/link";
import { useFavorites } from "@/context/FavoritesContext";

function IconHeart() {
  return (
    <svg className="size-6 lg:size-5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 20.5s-7-4.6-7-10a4 4 0 0 1 7-2.2A4 4 0 0 1 19 10.5c0 5.4-7 10-7 10Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FavoritesLink() {
  const { count, isReady } = useFavorites();

  return (
    <Link
      href="/favorites"
      className="flex p-2 sm:p-2.5 text-brand-olive-dark hover:text-brand-terracotta transition-colors relative"
      aria-label={count > 0 ? `Избранное: ${count} товаров` : "Избранное"}
    >
      <IconHeart />
      {isReady && count > 0 && (
        <span className="absolute top-1 right-1 min-w-[18px] h-[18px] flex items-center justify-center px-1 bg-brand-terracotta text-white text-[10px] font-medium rounded-full">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
