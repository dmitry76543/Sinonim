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

function HeaderActions() {
  return (
    <>
      <button
        type="button"
        className="p-2 sm:p-2.5 text-brand-olive-dark hover:text-brand-olive transition-colors"
        aria-label="Поиск"
      >
        <IconSearch />
      </button>
      <FavoritesLink />
      <CompareLink />
      <CartLink />
    </>
  );
}

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      className={`flex flex-col group shrink-0 min-w-0 ${
        compact
          ? "col-start-2 justify-self-center md:col-start-1 md:justify-self-start items-center md:items-start"
          : "items-center md:items-start"
      }`}
    >
      <Image
        src="/images/logo_20260527190756.png"
        alt="Синоним"
        width={1000}
        height={150}
        className={`w-auto max-w-full object-contain brightness-0 ${
          compact ? "h-6 max-w-[8.75rem] sm:h-7 sm:max-w-[10rem]" : "h-7 md:h-8"
        }`}
        style={{ width: "auto" }}
        priority
      />
      {!compact && (
        <span className="hidden sm:block text-[10px] md:text-xs text-brand-muted tracking-wide mt-1 text-center md:text-left">
          выращенные бриллианты в серебре
        </span>
      )}
    </Link>
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

      <div className="px-4 md:px-6 lg:px-10 py-4">
        <div className="grid grid-cols-[2.25rem_minmax(0,1fr)_auto] md:grid-cols-[minmax(0,1fr)_auto] items-center gap-2 lg:hidden">
          <button
            type="button"
            className="p-2 text-brand-olive-dark shrink-0 justify-self-start md:hidden"
            aria-label="Меню"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          <Logo compact />

          <div className="col-start-3 md:col-start-2 flex items-center gap-0.5 sm:gap-1 shrink-0 justify-self-end">
            <HeaderActions />
          </div>
        </div>

        <div className="hidden lg:flex items-center justify-between gap-4">
          <Logo />

          <nav className="flex items-center gap-8">
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

          <div className="flex items-center gap-2 shrink-0">
            <HeaderActions />
          </div>
        </div>
      </div>
    </header>
  );
}
