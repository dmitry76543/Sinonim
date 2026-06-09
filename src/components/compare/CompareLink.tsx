"use client";

import Link from "next/link";
import { useCompare } from "@/context/CompareContext";

function IconCompare() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 6h12M9 12h12M9 18h12M3 6h.01M3 12h.01M3 18h.01"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CompareLink() {
  const { count, isReady } = useCompare();

  return (
    <Link
      href="/compare"
      className="hidden sm:flex p-2.5 text-brand-olive-dark hover:text-brand-olive transition-colors relative"
      aria-label={count > 0 ? `Сравнение: ${count} товаров` : "Сравнение товаров"}
    >
      <IconCompare />
      {isReady && count > 0 && (
        <span className="absolute top-1 right-1 min-w-[18px] h-[18px] flex items-center justify-center px-1 bg-brand-olive text-white text-[10px] font-medium rounded-full">
          {count}
        </span>
      )}
    </Link>
  );
}
