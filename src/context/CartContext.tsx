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
