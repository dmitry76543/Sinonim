import Image from "next/image";
import Link from "next/link";
import { CompareButton } from "@/components/compare/CompareButton";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { formatPrice, type Product } from "@/lib/products";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group bg-brand-surface rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-square relative overflow-hidden bg-brand-sand/30">
        <Link href={`/products/${product.slug}`} className="absolute inset-0">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </Link>
        {product.badge && (
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-brand-terracotta text-white text-[10px] tracking-widest uppercase">
            {product.badge}
          </span>
        )}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
          <FavoriteButton slug={product.slug} />
          <CompareButton slug={product.slug} />
        </div>
      </div>
      <Link
        href={`/products/${product.slug}`}
        className="block p-4"
      >
        <h3 className="text-sm md:text-base text-brand-text group-hover:text-brand-olive transition-colors">
          {product.name}
        </h3>
        <p className="mt-1 text-xs text-brand-muted">
          {product.stoneWeight} карат · серебро 925
        </p>
        <p className="mt-1.5 font-heading text-brand-olive-dark text-lg">
          {formatPrice(product.price)}
        </p>
      </Link>
    </article>
  );
}
