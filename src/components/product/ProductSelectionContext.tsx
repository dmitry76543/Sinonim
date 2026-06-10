"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ProductDetails } from "@/lib/products";

type ProductSelectionContextValue = {
  selectedSize: number | null;
  setSelectedSize: (size: number | null) => void;
  artNo?: string;
};

const ProductSelectionContext = createContext<ProductSelectionContextValue | null>(
  null
);

function resolveArtNo(
  product: ProductDetails,
  selectedSize: number | null
): string | undefined {
  if (selectedSize !== null && product.sizeArtNos?.[String(selectedSize)]) {
    return product.sizeArtNos[String(selectedSize)];
  }
  return product.artNo;
}

export function ProductSelectionProvider({
  product,
  children,
}: {
  product: ProductDetails;
  children: ReactNode;
}) {
  const [selectedSize, setSelectedSize] = useState<number | null>(
    product.sizes.length > 0 ? (product.sizes[3] ?? product.sizes[0]) : null
  );

  const value = useMemo(
    () => ({
      selectedSize,
      setSelectedSize,
      artNo: resolveArtNo(product, selectedSize),
    }),
    [product, selectedSize]
  );

  return (
    <ProductSelectionContext.Provider value={value}>
      {children}
    </ProductSelectionContext.Provider>
  );
}

export function useProductSelection() {
  const context = useContext(ProductSelectionContext);
  if (!context) {
    throw new Error(
      "useProductSelection must be used within ProductSelectionProvider"
    );
  }
  return context;
}
