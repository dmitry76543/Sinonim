import Image from "next/image";
import Link from "next/link";

const CATEGORIES = [
  {
    title: "Кольца",
    href: "/shop/rings",
    image: "/images/categories/rings.jpg",
    count: "24 модели",
    priceFrom: "от 14 900 ₽",
  },
  {
    title: "Серьги",
    href: "/shop/earrings",
    image: "/images/categories/earrings.jpg",
    count: "18 моделей",
    priceFrom: "от 12 900 ₽",
  },
  {
    title: "Подвески",
    href: "/shop/pendants",
    image: "/images/categories/pendants.jpg",
    count: "32 модели",
    priceFrom: "от 9 900 ₽",
  },
  {
    title: "Браслеты",
    href: "/shop/bracelets",
    image: "/images/categories/bracelets.jpg",
    count: "12 моделей",
    priceFrom: "от 18 500 ₽",
  },
];

const FEATURED = [
  {
    name: "Кольцо «Сияние»",
    price: "24 900 ₽",
    image: "/images/product-ring.webp",
    href: "/products/siyanie-ring",
    badge: "Хит",
  },
  {
    name: "Подвеска-крестик",
    price: "16 500 ₽",
    image: "/images/product-necklace.webp",
    href: "/products/cross-pendant",
    badge: null,
  },
  {
    name: "Серьги-пусеты",
    price: "19 800 ₽",
    image: "/images/product-earrings.webp",
    href: "/products/stud-earrings",
    badge: "Новинка",
  },
  {
    name: "Браслет теннисный",
    price: "42 000 ₽",
    image: "/images/product-bracelet.webp",
    href: "/products/tennis-bracelet",
    badge: null,
  },
];

export function Categories() {
  return (
    <section className="py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <p className="text-brand-olive text-sm tracking-[0.2em] uppercase mb-2">
              Каталог
            </p>
            <h2 className="font-heading text-3xl md:text-4xl text-brand-olive-dark">
              Выберите категорию
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-sm text-brand-olive hover:text-brand-terracotta transition-colors tracking-wide"
          >
            Весь каталог →
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16 md:mb-20">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="group relative bg-brand-surface rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-[4/5] relative overflow-hidden bg-brand-sand/50">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
              <div className="p-4 md:p-5">
                <h3 className="font-heading text-xl md:text-2xl mb-1 text-brand-olive-dark">
                  {cat.title}
                </h3>
                <p className="text-xs md:text-sm text-brand-muted">{cat.count}</p>
                <p className="text-sm text-brand-olive-dark mt-1">{cat.priceFrom}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <p className="text-brand-terracotta text-sm tracking-[0.2em] uppercase mb-2">
              Бестселлеры
            </p>
            <h2 className="font-heading text-3xl md:text-4xl text-brand-olive-dark">
              Популярные украшения
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {FEATURED.map((product) => (
            <Link
              key={product.href}
              href={product.href}
              className="group bg-brand-surface rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-square relative overflow-hidden bg-brand-sand/30">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                {product.badge && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-brand-terracotta text-white text-[10px] tracking-widest uppercase">
                    {product.badge}
                  </span>
                )}
                <span className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/90 rounded-full text-brand-olive-dark opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M12 20.5s-7-4.6-7-10a4 4 0 0 1 7-2.2A4 4 0 0 1 19 10.5c0 5.4-7 10-7 10Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-sm md:text-base text-brand-text group-hover:text-brand-olive transition-colors">
                  {product.name}
                </h3>
                <p className="mt-1.5 font-heading text-brand-olive-dark text-lg">
                  {product.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
