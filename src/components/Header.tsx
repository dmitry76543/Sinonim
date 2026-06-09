import Image from "next/image";
import Link from "next/link";
import { CartLink } from "@/components/cart/CartLink";
import { CompareLink } from "@/components/compare/CompareLink";
import { FavoritesLink } from "@/components/favorites/FavoritesLink";
import { SITE_PHONE, SITE_PHONE_TEL } from "@/lib/contacts";

const NAV_ITEMS = [
  { label: "Кольца", href: "/shop/rings" },
  { label: "Серьги", href: "/shop/earrings" },
  { label: "Подвески", href: "/shop/pendants" },
  { label: "Браслеты", href: "/shop/bracelets" },
  { label: "Подарки", href: "/shop/gifts" },
  { label: "О бренде", href: "/about" },
];

function IconSearch() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M20 20L16.5 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-brand-surface/95 backdrop-blur-sm border-b border-brand-olive/10">
      <div className="hidden md:flex justify-between items-center px-6 lg:px-10 py-2 text-xs text-brand-muted border-b border-brand-sand">
        <div className="flex gap-6">
          <Link href="/shipping" className="hover:text-brand-olive transition-colors">
            Доставка и оплата
          </Link>
          <Link href="/showroom" className="hover:text-brand-olive transition-colors">
            Шоурум
          </Link>
        </div>
        <Link href={SITE_PHONE_TEL} className="hover:text-brand-olive transition-colors">
          {SITE_PHONE}
        </Link>
      </div>

      <div className="relative flex items-center justify-between px-4 md:px-6 lg:px-10 py-4 gap-4">
        <button
          type="button"
          className="md:hidden p-2 text-brand-olive-dark shrink-0 z-10"
          aria-label="Меню"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <Link
          href="/"
          className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center md:static md:translate-x-0 md:translate-y-0 md:items-start group shrink-0"
        >
          <Image
            src="/images/logo_20260527190756.png"
            alt="Синоним"
            width={1000}
            height={150}
            className="h-7 md:h-8 w-auto max-w-none object-contain brightness-0"
            style={{ width: "auto" }}
            priority
          />
          <span className="hidden sm:block text-[10px] md:text-xs text-brand-muted tracking-wide mt-1">
            выращенные бриллианты в серебре
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm tracking-wide text-brand-text hover:text-brand-olive transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 md:gap-2 shrink-0 z-10 ml-auto">
          <button
            type="button"
            className="p-2.5 text-brand-olive-dark hover:text-brand-olive transition-colors"
            aria-label="Поиск"
          >
            <IconSearch />
          </button>
          <FavoritesLink />
          <CompareLink />
          <CartLink />
        </div>
      </div>
    </header>
  );
}
