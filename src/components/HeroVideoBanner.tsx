import { HeroContent } from "./HeroContent";

export function HeroVideoBanner() {
  return (
    <section className="relative min-h-[88vh] md:min-h-[92vh] flex items-center overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        aria-hidden
      >
        <source src="/images/vdeo-banner.mp4" type="video/mp4" />
      </video>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent md:from-black/35 md:via-transparent md:to-transparent" />

      <div className="relative mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-10 py-16 md:py-24">
        <HeroContent className="text-white max-w-xl md:max-w-2xl [text-shadow:0_1px_16px_rgba(0,0,0,0.35)]" />
      </div>
    </section>
  );
}
