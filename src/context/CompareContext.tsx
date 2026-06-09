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
import { COMPARE_STORAGE_KEY, MAX_COMPARE_ITEMS } from "@/lib/compare";

type CompareContextValue = {
  slugs: string[];
  count: number;
  isReady: boolean;
  isFull: boolean;
  isInCompare: (slug: string) => boolean;
  toggleItem: (slug: string) => boolean;
  removeItem: (slug: string) => void;
  clearCompare: () => void;
};

const CompareContext = createContext<CompareContextValue | null>(null);

function loadCompare(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(COMPARE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed.slice(0, MAX_COMPARE_ITEMS) : [];
  } catch {
    return [];
  }
}

function saveCompare(slugs: string[]) {
  localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(slugs));
}

export function CompareProvider({ children }: { children: ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setSlugs(loadCompare());
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    saveCompare(slugs);
  }, [slugs, isReady]);

  const isInCompare = useCallback(
    (slug: string) => slugs.includes(slug),
    [slugs]
  );

  const toggleItem = useCallback((slug: string) => {
    let added = false;

    setSlugs((prev) => {
      if (prev.includes(slug)) {
        return prev.filter((item) => item !== slug);
      }
      if (prev.length >= MAX_COMPARE_ITEMS) {
        return prev;
      }
      added = true;
      return [...prev, slug];
    });

    return added;
  }, []);

  const removeItem = useCallback((slug: string) => {
    setSlugs((prev) => prev.filter((item) => item !== slug));
  }, []);

  const clearCompare = useCallback(() => {
    setSlugs([]);
  }, []);

  const value = useMemo(
    () => ({
      slugs,
      count: slugs.length,
      isReady,
      isFull: slugs.length >= MAX_COMPARE_ITEMS,
      isInCompare,
      toggleItem,
      removeItem,
      clearCompare,
    }),
    [slugs, isReady, isInCompare, toggleItem, removeItem, clearCompare]
  );

  return (
    <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within CompareProvider");
  }
  return context;
}
