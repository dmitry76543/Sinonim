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
import {
  buildCartItemId,
  CART_STORAGE_KEY,
  getCartCount,
  getCartTotal,
  type CartItem,
} from "@/lib/cart";
import { formatCaratWeight } from "@/lib/product-weight";

type AddToCartInput = {
  productSlug: string;
  name: string;
  image: string;
  price: number;
  stoneWeight: number;
  stoneLabel: string;
  size: string | null;
  artNo?: string;
};

type CartContextValue = {
  items: CartItem[];
  total: number;
  count: number;
  isReady: boolean;
  addItem: (input: AddToCartInput) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setItems(loadCart());
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    if (items.length === 0) return;

    let cancelled = false;

    const refreshStoneWeights = async () => {
      const candidates = items.filter(
        (item) =>
          Number.isFinite(item.stoneWeight) &&
          item.stoneWeight > 0 &&
          item.stoneWeight <= 0.11,
      );
      if (candidates.length === 0) return;

      const updates = await Promise.all(
        candidates.map(async (item) => {
          try {
            const response = await fetch(
              `/api/products/${encodeURIComponent(item.productSlug)}`,
            );
            if (!response.ok) return null;
            const json = (await response.json()) as { product?: { stoneWeight?: number } };
            const freshWeight = json.product?.stoneWeight;
            if (
              typeof freshWeight !== "number" ||
              !Number.isFinite(freshWeight) ||
              freshWeight <= 0
            ) {
              return null;
            }

            if (Math.abs(freshWeight - item.stoneWeight) < 0.001) return null;

            return {
              item,
              freshWeight,
              freshLabel: `${formatCaratWeight(freshWeight)} карат`,
            };
          } catch {
            return null;
          }
        }),
      );

      const normalized = updates.filter(
        (value): value is NonNullable<typeof value> => Boolean(value),
      );
      if (normalized.length === 0) return;

      if (cancelled) return;

      setItems((prev) => {
        const updateMap = new Map(
          normalized.map((entry) => [entry.item.id, entry]),
        );
        const merged = new Map<string, CartItem>();

        for (const item of prev) {
          const patch = updateMap.get(item.id);
          const nextWeight = patch ? patch.freshWeight : item.stoneWeight;
          const nextLabel = patch ? patch.freshLabel : item.stoneLabel;
          const nextId = buildCartItemId(item.productSlug, nextWeight, item.size);

          const existing = merged.get(nextId);
          if (existing) {
            merged.set(nextId, {
              ...existing,
              quantity: existing.quantity + item.quantity,
            });
          } else {
            merged.set(nextId, {
              ...item,
              id: nextId,
              stoneWeight: nextWeight,
              stoneLabel: nextLabel,
            });
          }
        }

        return Array.from(merged.values());
      });
    };

    void refreshStoneWeights();

    return () => {
      cancelled = true;
    };
    // Intentionally run on initial hydrate only; subsequent cart changes are user-driven.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  useEffect(() => {
    if (!isReady) return;
    saveCart(items);
  }, [items, isReady]);

  const addItem = useCallback((input: AddToCartInput) => {
    const id = buildCartItemId(input.productSlug, input.stoneWeight, input.size);

    setItems((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing) {
        return prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id,
          productSlug: input.productSlug,
          name: input.name,
          image: input.image,
          price: input.price,
          stoneWeight: input.stoneWeight,
          stoneLabel: input.stoneLabel,
          size: input.size,
          artNo: input.artNo,
          quantity: 1,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) {
      setItems((prev) => prev.filter((item) => item.id !== id));
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const value = useMemo(
    () => ({
      items,
      total: getCartTotal(items),
      count: getCartCount(items),
      isReady,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [items, isReady, addItem, removeItem, updateQuantity, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
