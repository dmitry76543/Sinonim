import Link from "next/link";
import { CATEGORIES, type ProductDetails } from "@/lib/products";
import type { Product } from "@/lib/products";
import { ProductCard } from "@/components/catalog/ProductCard";
import { ProductConfigurator } from "./ProductConfigurator";
import { ProductDescription } from "./ProductDescription";
import { ProductGallery } from "./ProductGallery";
import { ProductSelectionProvider } from "./ProductSelectionContext";

type ProductPageProps = {
  product: ProductDetails;
  relatedProducts: Product[];
};

export function ProductPage({ product, relatedProducts }: ProductPageProps) {
  const related = relatedProducts;
  const categoryTitle = CATEGORIES[product.category].title;

  return (
    <section className="py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-10">
        <nav className="text-sm text-brand-muted mb-6" aria-label="Хлебные крошки">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-brand-olive transition-colors">
                Главная
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href="/shop" className="hover:text-brand-olive transition-colors">
                Каталог
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link
                href={`/shop/${product.category}`}
                className="hover:text-brand-olive transition-colors"
              >
                {categoryTitle}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <span className="text-brand-text">{product.name}</span>
            </li>
          </ol>
        </nav>

        <ProductSelectionProvider product={product}>
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 mb-16 md:mb-20">
            <ProductGallery images={product.images} name={product.name} />

            <div>
              <p className="text-brand-olive text-sm tracking-[0.2em] uppercase mb-2">
                {categoryTitle}
              </p>
              <h1 className="font-heading text-3xl md:text-4xl text-brand-olive-dark mb-6">
                {product.name}
              </h1>
              <ProductConfigurator product={product} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16 md:mb-20">
            <ProductDescription product={product} />

          <div className="bg-brand-surface rounded-xl p-6 md:p-8">
            <h2 className="font-heading text-xl text-brand-olive-dark mb-4">
              Характеристики
            </h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4 border-b border-brand-sand pb-3">
                <dt className="text-brand-muted">Металл</dt>
                <dd className="text-brand-text text-right">{product.metal}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-brand-sand pb-3">
                <dt className="text-brand-muted">Тип камня</dt>
                <dd className="text-brand-text text-right">Лабораторный бриллиант</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-brand-sand pb-3">
                <dt className="text-brand-muted">Огранка</dt>
                <dd className="text-brand-text text-right">Круглая (57 граней)</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-brand-sand pb-3">
                <dt className="text-brand-muted">Вес бриллианта</dt>
                <dd className="text-brand-text text-right">{product.stoneWeight} карат</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-brand-sand pb-3">
                <dt className="text-brand-muted">Цвет</dt>
                <dd className="text-brand-text text-right">{product.color}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-brand-muted">Чистота</dt>
                <dd className="text-brand-text text-right">{product.clarity}</dd>
              </div>
            </dl>
          </div>
          </div>
        </ProductSelectionProvider>

        {related.length > 0 && (
          <div>
            <p className="text-brand-olive text-sm tracking-[0.2em] uppercase mb-2">
              Похожие
            </p>
            <h2 className="font-heading text-2xl md:text-3xl text-brand-olive-dark mb-8">
              Вам также понравится
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
