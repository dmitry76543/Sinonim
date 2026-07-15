import Link from "next/link";
import type { ReactNode } from "react";

type GuidePageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
  primaryCta?: {
    label: string;
    href: string;
  };
};

export function GuidePage({
  eyebrow,
  title,
  intro,
  children,
  primaryCta = { label: "Смотреть каталог", href: "/shop" },
}: GuidePageProps) {
  return (
    <>
      <section className="py-10 md:py-14">
        <div className="mx-auto max-w-3xl px-4 md:px-6 lg:px-10">
          <p className="text-brand-terracotta text-sm tracking-[0.2em] uppercase mb-2">
            {eyebrow}
          </p>
          <h1 className="font-heading text-3xl md:text-5xl text-brand-olive-dark mb-6 md:mb-8">
            {title}
          </h1>
          <p className="guide-intro text-brand-text leading-relaxed text-base md:text-lg">
            {intro}
          </p>
        </div>
      </section>

      <section className="pb-12 md:pb-16">
        <div className="guide-content mx-auto max-w-3xl px-4 md:px-6 lg:px-10 space-y-8 text-brand-text leading-relaxed text-sm md:text-base">
          {children}
        </div>
      </section>

      <section className="pb-12 md:pb-16">
        <div className="mx-auto max-w-3xl px-4 md:px-6 lg:px-10 text-center">
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={primaryCta.href}
              className="inline-flex items-center justify-center px-8 py-3.5 bg-brand-terracotta hover:bg-brand-terracotta-logo text-white text-sm tracking-widest uppercase transition-colors"
            >
              {primaryCta.label}
            </Link>
            <Link
              href="/guide"
              className="inline-flex items-center justify-center px-8 py-3.5 border border-brand-olive/30 text-brand-olive-dark hover:border-brand-olive text-sm tracking-widest uppercase transition-colors"
            >
              Все гайды
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
