import Link from "next/link";
import { SparkleWord } from "@/components/SparkleWord";

type HeroContentProps = {
  className?: string;
};

export function HeroContent({ className = "" }: HeroContentProps) {
  return (
    <div className={className}>
      <p
        className="hero-unroll text-brand-sand/90 text-sm tracking-[0.25em] uppercase mb-4"
        style={{ animationDelay: "0ms" }}
      >
        Лабораторные бриллианты · Серебро 925
      </p>
      <h1
        className="hero-unroll font-heading text-4xl md:text-5xl lg:text-6xl leading-[1.1] mb-6"
        style={{ animationDelay: "120ms" }}
      >
        Лабораторные <SparkleWord>бриллианты</SparkleWord>
        <br />
        <span className="text-brand-sand">в серебре 925</span>
      </h1>
      <p
        className="hero-unroll text-white/80 text-base md:text-lg max-w-md leading-relaxed mb-8"
        style={{ animationDelay: "240ms" }}
      >
        Украшения с выращенными бриллиантами в серебре — та же сияющая
        огранка и забота об экологии.
      </p>
      <div
        className="hero-unroll flex flex-wrap gap-4"
        style={{ animationDelay: "360ms" }}
      >
        <Link
          href="/shop"
          className="inline-flex items-center justify-center px-8 py-3.5 bg-brand-terracotta hover:bg-brand-terracotta-logo text-white text-sm tracking-widest uppercase transition-colors"
        >
          Смотреть каталог
        </Link>
        <Link
          href="/showroom"
          className="inline-flex items-center justify-center px-8 py-3.5 border border-white/40 hover:border-white text-white text-sm tracking-widest uppercase transition-colors"
        >
          Примерить в шоуруме
        </Link>
      </div>
    </div>
  );
}
