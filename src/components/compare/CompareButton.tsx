"use client";

import { useState } from "react";
import { useCompare } from "@/context/CompareContext";
import { MAX_COMPARE_ITEMS } from "@/lib/compare";

type CompareButtonProps = {
  slug: string;
  variant?: "icon" | "text";
  className?: string;
};

function IconCompare({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 6h12M9 12h12M9 18h12M3 6h.01M3 12h.01M3 18h.01"
        stroke="currentColor"
        strokeWidth={active ? 2 : 1.5}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CompareButton({
  slug,
  variant = "icon",
  className = "",
}: CompareButtonProps) {
  const { isInCompare, toggleItem, isFull, isReady } = useCompare();
  const [limitHint, setLimitHint] = useState(false);
  const active = isInCompare(slug);
  const disabled = isReady && isFull && !active;

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (disabled) {
      setLimitHint(true);
      window.setTimeout(() => setLimitHint(false), 2500);
      return;
    }

    toggleItem(slug);
  };

  if (variant === "text") {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={!isReady}
        className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 border text-sm tracking-widest uppercase transition-colors ${
          active
            ? "border-brand-olive bg-brand-surface text-brand-olive-dark"
            : "border-brand-olive/30 text-brand-olive-dark hover:border-brand-olive"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
        aria-pressed={active}
        aria-label={active ? "Убрать из сравнения" : "Добавить в сравнение"}
        title={
          disabled
            ? `Можно сравнить до ${MAX_COMPARE_ITEMS} товаров`
            : undefined
        }
      >
        <IconCompare active={active} />
        {active ? "В сравнении" : "Сравнить"}
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleClick}
        disabled={!isReady}
        className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
          active
            ? "bg-brand-terracotta text-white opacity-100"
            : "bg-white/90 text-brand-olive-dark opacity-0 group-hover:opacity-100"
        } ${disabled && !active ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
        aria-pressed={active}
        aria-label={active ? "Убрать из сравнения" : "Добавить в сравнение"}
        title={
          disabled
            ? `Можно сравнить до ${MAX_COMPARE_ITEMS} товаров`
            : active
              ? "Убрать из сравнения"
              : "Добавить в сравнение"
        }
      >
        <IconCompare active={active} />
      </button>
      {limitHint && (
        <span className="absolute top-full right-0 mt-2 z-10 w-44 rounded-lg bg-brand-text text-white text-[11px] leading-snug px-3 py-2 shadow-lg">
          Можно сравнить до {MAX_COMPARE_ITEMS} товаров
        </span>
      )}
    </div>
  );
}
