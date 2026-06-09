"use client";

import { useFavorites } from "@/context/FavoritesContext";

type FavoriteButtonProps = {
  slug: string;
  variant?: "icon" | "text";
  className?: string;
};

function IconHeart({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M12 20.5s-7-4.6-7-10a4 4 0 0 1 7-2.2A4 4 0 0 1 19 10.5c0 5.4-7 10-7 10Z"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FavoriteButton({
  slug,
  variant = "icon",
  className = "",
}: FavoriteButtonProps) {
  const { isFavorite, toggleItem, isReady } = useFavorites();
  const active = isFavorite(slug);

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
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
            ? "border-brand-terracotta bg-brand-terracotta/10 text-brand-terracotta"
            : "border-brand-olive/30 text-brand-olive-dark hover:border-brand-terracotta hover:text-brand-terracotta"
        } ${className}`}
        aria-pressed={active}
        aria-label={active ? "Убрать из избранного" : "Добавить в избранное"}
      >
        <IconHeart active={active} />
        {active ? "В избранном" : "Добавить в избранное"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!isReady}
      className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
        active
          ? "bg-brand-terracotta text-white opacity-100"
          : "bg-white/90 text-brand-olive-dark opacity-0 group-hover:opacity-100 hover:text-brand-terracotta"
      } ${className}`}
      aria-pressed={active}
      aria-label={active ? "Убрать из избранного" : "Добавить в избранное"}
      title={active ? "Убрать из избранного" : "Добавить в избранное"}
    >
      <IconHeart active={active} />
    </button>
  );
}
