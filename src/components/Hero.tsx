import { AutoplayVideo } from "./AutoplayVideo";
import { HeroContent } from "./HeroContent";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-olive-dark">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-olive-dark via-[#5a6840] to-brand-olive opacity-90" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[520px] md:min-h-[580px] py-12 md:py-16">
          <HeroContent className="text-white order-2 lg:order-1" />

          <div className="relative order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md lg:max-w-lg aspect-square">
              <div className="absolute -inset-4 rounded-full bg-brand-sand/10 blur-2xl" />
              <AutoplayVideo
                src="/images/double_video.mp4"
                className="absolute inset-0 h-full w-full object-cover rounded-2xl shadow-2xl"
                aria-label="Кольцо с лабораторным бриллиантом в серебре"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
