import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-olive-dark">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-olive-dark via-[#5a6840] to-brand-olive opacity-90" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[520px] md:min-h-[580px] py-12 md:py-16">
          <div className="text-white order-2 lg:order-1">
            <p className="text-brand-sand/90 text-sm tracking-[0.25em] uppercase mb-4">
              Лабораторные бриллианты · Серебро 925
            </p>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl leading-[1.1] mb-6">
              Красота бриллианта.
              <br />
              <span className="text-brand-sand">Честная цена.</span>
            </h1>
            <p className="text-white/80 text-base md:text-lg max-w-md leading-relaxed mb-8">
              Украшения с выращенными бриллиантами в серебре — та же сияющая
              огранка, сертификат качества и забота об экологии.
            </p>
            <div className="flex flex-wrap gap-4">
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
            <div className="flex flex-wrap gap-6 mt-10 text-sm text-white/70">
              <span>от 12 900 ₽</span>
              <span className="w-px h-4 bg-white/30 hidden sm:block" />
              <span>Сертификат на камни</span>
              <span className="w-px h-4 bg-white/30 hidden sm:block" />
              <span>Бесплатная полировка</span>
            </div>
          </div>

          <div className="relative order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md lg:max-w-lg aspect-square">
              <div className="absolute -inset-4 rounded-full bg-brand-sand/10 blur-2xl" />
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 h-full w-full object-cover rounded-2xl shadow-2xl"
                aria-label="Кольцо с лабораторным бриллиантом в серебре"
              >
                <source src="/images/double_video.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
