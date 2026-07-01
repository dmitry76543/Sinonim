import { AutoplayVideo } from "./AutoplayVideo";
import { HeroContent } from "./HeroContent";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white border-b border-brand-sand">
      <div className="relative mx-auto max-w-7xl px-4 md:px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[520px] md:min-h-[580px] py-12 md:py-16">
          <HeroContent className="order-2 lg:order-1" />

          <div className="relative order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md lg:max-w-lg">
              <div className="relative aspect-square overflow-hidden rounded-2xl shadow-lg border border-brand-sand">
                <AutoplayVideo
                  src="/images/video_hero_2_1.mp4"
                  className="absolute inset-0 h-full w-full object-cover object-center scale-125"
                  aria-label="Кольцо с лабораторным бриллиантом в серебре"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
