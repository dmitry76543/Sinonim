"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CartLink } from "@/components/cart/CartLink";
import { CompareLink } from "@/components/compare/CompareLink";
import { FavoritesLink } from "@/components/favorites/FavoritesLink";
import { MetrikaPhoneLink } from "@/components/analytics/MetrikaPhoneLink";
import { SearchForm } from "@/components/search/SearchForm";
import { SITE_PHONE, SITE_PHONE_TEL } from "@/lib/contacts";

const NAV_ITEMS = [
  { label: "Кольца", href: "/shop/rings" },
  { label: "Серьги", href: "/shop/earrings" },
  { label: "Колье", href: "/shop/pendants" },
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

function HeaderActions({
  searchOpen,
  onSearchToggle,
}: {
  searchOpen: boolean;
  onSearchToggle: () => void;
}) {
  return (
    <>
      <button
        type="button"
        className="p-2 sm:p-2.5 text-brand-olive-dark hover:text-brand-terracotta transition-colors"
        aria-label={searchOpen ? "Закрыть поиск" : "Поиск"}
        aria-expanded={searchOpen}
        aria-controls="header-search"
        onClick={onSearchToggle}
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
        compact ? "items-center" : "items-center md:items-start"
      }`}
    >
      <span
        role="img"
        aria-label="Синоним"
        className={`logo-brand block aspect-[20/3] max-w-full object-contain ${
          compact ? "h-6 max-w-[8.75rem] sm:h-7 sm:max-w-[10rem]" : "h-7 md:h-8"
        }`}
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!searchOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSearchOpen(false);
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [searchOpen]);

  const closeMenu = () => setMenuOpen(false);
  const closeSearch = () => setSearchOpen(false);

  const toggleSearch = () => {
    setSearchOpen((open) => {
      if (!open) setMenuOpen(false);
      return !open;
    });
  };

  const openMenu = () => {
    setSearchOpen(false);
    setMenuOpen((open) => !open);
  };

  return (
    <header className="sticky top-0 z-50 bg-brand-surface/95 backdrop-blur-sm border-b border-brand-terracotta relative">
      <div className="hidden md:flex justify-between items-center px-6 lg:px-10 py-2 text-xs text-brand-muted border-b border-brand-sand">
        <div className="flex gap-6">
          <Link href="/shipping" className="hover:text-brand-terracotta transition-colors">
            Доставка и оплата
          </Link>
          <Link href="/showroom" className="hover:text-brand-terracotta transition-colors">
            Шоурум
          </Link>
        </div>
        <MetrikaPhoneLink
          href={SITE_PHONE_TEL}
          className="hover:text-brand-terracotta transition-colors"
        >
          {SITE_PHONE}
        </MetrikaPhoneLink>
      </div>

      <div className="px-4 md:px-6 lg:px-10 py-4">
        <div className="relative flex items-center justify-between gap-2 lg:hidden">
          <button
            type="button"
            className="relative z-10 p-2 text-brand-olive-dark shrink-0"
            aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={openMenu}
          >
            {menuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M18 6 6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>

          <div className="pointer-events-none absolute inset-x-0 flex justify-center">
            <div className="pointer-events-auto">
              <Logo compact />
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-0.5 sm:gap-1 shrink-0">
            <HeaderActions searchOpen={searchOpen} onSearchToggle={toggleSearch} />
          </div>
        </div>

        {menuOpen && (
          <>
            <button
              type="button"
              className="fixed inset-0 z-40 bg-black/30 lg:hidden"
              aria-label="Закрыть меню"
              onClick={closeMenu}
            />
            <nav
              id="mobile-nav"
              className="fixed inset-x-0 top-[calc(3.5rem+1px)] z-40 flex max-h-[calc(100dvh-3.5rem)] flex-col border-b border-brand-olive/10 bg-brand-surface shadow-lg lg:hidden md:top-[calc(5.5rem+1px)] md:max-h-[calc(100dvh-5.5rem)]"
            >
              <div className="shrink-0 px-4 pt-6 pb-4">
                <SearchForm compact onSubmit={closeMenu} />
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
              <ul className="flex flex-col gap-1">
                {NAV_ITEMS.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block rounded-lg px-3 py-3 text-base tracking-wide text-brand-text hover:bg-brand-surface hover:text-brand-terracotta transition-colors"
                      onClick={closeMenu}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-col gap-3 border-t border-brand-sand pt-6 text-sm text-brand-muted">
                <Link
                  href="/shop"
                  className="hover:text-brand-terracotta transition-colors"
                  onClick={closeMenu}
                >
                  Весь каталог
                </Link>
                <Link
                  href="/shipping"
                  className="hover:text-brand-terracotta transition-colors"
                  onClick={closeMenu}
                >
                  Доставка и оплата
                </Link>
                <Link
                  href="/showroom"
                  className="hover:text-brand-terracotta transition-colors"
                  onClick={closeMenu}
                >
                  Шоурум
                </Link>
                <MetrikaPhoneLink
                  href={SITE_PHONE_TEL}
                  className="font-medium text-brand-olive-dark hover:text-brand-terracotta transition-colors"
                  onClick={closeMenu}
                >
                  {SITE_PHONE}
                </MetrikaPhoneLink>
              </div>
              </div>
            </nav>
          </>
        )}

        <div className="hidden lg:flex items-center justify-between gap-4">
          <Logo />

          <nav className="flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm tracking-wide text-brand-text hover:text-brand-terracotta transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <HeaderActions searchOpen={searchOpen} onSearchToggle={toggleSearch} />
          </div>
        </div>

        {searchOpen && (
          <div
            id="header-search"
            className="mt-4 border-t border-brand-olive/10 pt-4 lg:mt-0 lg:border-t-0 lg:pt-0 lg:absolute lg:left-0 lg:right-0 lg:top-full lg:border-b lg:border-brand-olive/10 lg:bg-brand-surface lg:px-10 lg:py-4 lg:shadow-sm"
          >
            <div className="mx-auto max-w-xl lg:max-w-2xl">
              <SearchForm autoFocus compact onSubmit={closeSearch} />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
