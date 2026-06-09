"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { FAVORITES_STORAGE_KEY } from "@/lib/favorites";

type FavoritesContextValue = {
  slugs: string[];
  count: number;
  isReady: boolean;
  isFavorite: (slug: string) => boolean;
  toggleItem: (slug: string) => void;
  removeItem: (slug: string) => void;
  clearFavorites: () => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

function loadFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveFavorites(slugs: string[]) {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(slugs));
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setSlugs(loadFavorites());
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    saveFavorites(slugs);
  }, [slugs, isReady]);

  const isFavorite = useCallback(
    (slug: string) => slugs.includes(slug),
    [slugs]
  );

  const toggleItem = useCallback((slug: string) => {
    setSlugs((prev) =>
      prev.includes(slug)
        ? prev.filter((item) => item !== slug)
        : [...prev, slug]
    );
  }, []);

  const removeItem = useCallback((slug: string) => {
    setSlugs((prev) => prev.filter((item) => item !== slug));
  }, []);

  const clearFavorites = useCallback(() => {
    setSlugs([]);
  }, []);

  const value = useMemo(
    () => ({
      slugs,
      count: slugs.length,
      isReady,
      isFavorite,
      toggleItem,
      removeItem,
      clearFavorites,
    }),
    [slugs, isReady, isFavorite, toggleItem, removeItem, clearFavorites]
  );

  return (
    <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return context;
}
