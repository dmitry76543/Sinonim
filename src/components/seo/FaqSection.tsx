import type { FaqItem } from "@/lib/warranty-faq";

function IconChevron() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0 text-brand-terracotta transition-transform duration-200 group-open:rotate-180"
      aria-hidden
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type FaqSectionProps = {
  title: string;
  subtitle?: string;
  items: FaqItem[];
  className?: string;
};

export function FaqSection({
  title,
  subtitle,
  items,
  className = "bg-brand-surface border-y border-brand-olive/10 py-12 md:py-16",
}: FaqSectionProps) {
  return (
    <section className={className}>
      <div className="mx-auto max-w-3xl px-4 md:px-6 lg:px-10">
        <h2 className="font-heading text-2xl md:text-3xl text-brand-olive-dark mb-2 text-center">
          {title}
        </h2>
        {subtitle && (
          <p className="text-brand-muted text-sm md:text-base text-center mb-8 md:mb-10">
            {subtitle}
          </p>
        )}

        <div className="space-y-3">
          {items.map((item) => (
            <details
              key={item.question}
              className="group rounded-xl border border-brand-olive/15 bg-brand-surface open:bg-brand-surface open:shadow-sm transition-colors"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-5 md:p-6 [&::-webkit-details-marker]:hidden">
                <span className="font-heading text-base md:text-lg text-brand-olive-dark leading-snug">
                  {item.question}
                </span>
                <IconChevron />
              </summary>
              <div className="px-5 pb-5 md:px-6 md:pb-6 -mt-1">
                <p className="text-brand-text text-sm md:text-base leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
