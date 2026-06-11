"use client";

import type { ProductDetails } from "@/lib/products";
import { useProductSelection } from "./ProductSelectionContext";

type ProductDescriptionProps = {
  product: ProductDetails;
};

export function ProductDescription({ product }: ProductDescriptionProps) {
  const { artNo } = useProductSelection();

  return (
    <div className="bg-brand-surface rounded-xl p-6 md:p-8">
      <h2 className="font-heading text-xl text-brand-olive-dark mb-4">
        Описание
      </h2>
      <p className="text-brand-muted leading-relaxed">{product.description}</p>
      {artNo && (
        <p className="mt-4 text-sm text-brand-muted">
          <span className="text-brand-text">Артикул изделия:</span>{" "}
          <span className="font-medium text-brand-olive-dark">{artNo}</span>
        </p>
      )}
    </div>
  );
}
