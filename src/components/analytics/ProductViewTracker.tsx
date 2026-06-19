"use client";

import { useEffect, useRef } from "react";
import { trackViewItem } from "@/lib/analytics/metrika";
import type { CategorySlug } from "@/lib/products";

type ProductViewTrackerProps = {
  id: string;
  name: string;
  price: number;
  category: CategorySlug;
  variant?: string;
};

export function ProductViewTracker({
  id,
  name,
  price,
  category,
  variant,
}: ProductViewTrackerProps) {
  const trackedRef = useRef(false);

  useEffect(() => {
    if (trackedRef.current) return;
    trackedRef.current = true;

    trackViewItem({ id, name, price, category, variant });
  }, [id, name, price, category, variant]);

  return null;
}
