const FAQ_ITEMS = [
  {
    question:
      "Как отличить лабораторный бриллиант от природного без экспертизы?",
    answer:
      "Без экспертизы отличить невозможно! Специальное оборудование покажет метод роста. Качество изделия может гарантировать и честное имя проверенного производителя!",
  },
  {
    question:
      "А вдруг через 10 лет выяснится, что у камней есть скрытый дефект?",
    answer:
      "Многолетние тесты и гарантия производителя подтверждают: лабораторные бриллианты стабильны. Риски скрытых дефектов исключены при наличии сертификата.",
  },
  {
    question:
      "Есть ли разница в игре света между природным и лабораторным камнем?",
    answer:
      "Разницы нет: игра света зависит от формы огранки, а не от происхождения камня. Наши бриллианты гранятся по тем же стандартам, что и природные.",
  },
  {
    question: "А вдруг они быстро потеряют блеск или поцарапаются?",
    answer:
      "Лабораторные бриллианты имеют ту же твёрдость (10 по шкале Мооса) и устойчивость к царапинам, что и у природных. Их блеск остаётся неизменным со временем.",
  },
  {
    question: "Не может бриллиант столько стоить, это подделка!",
    answer:
      "Лабораторный бриллиант идентичен природному по составу и физическим, химическим, оптическим свойствам. Разница лишь в происхождении: один формировался миллионы лет в природе, другой был создан в лаборатории.",
  },
  {
    question:
      "Лабораторные бриллианты – это не очередная маркетинговая уловка?",
    answer:
      "Лабораторные бриллианты – не уловка, а научный прорыв. Их производят ведущие институты, а сертифицируют независимые геммологические лаборатории.",
  },
];

function IconChevron() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0 text-brand-olive transition-transform duration-200 group-open:rotate-180"
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

export function WarrantyFaq() {
  return (
    <section className="bg-brand-surface border-y border-brand-olive/10 py-12 md:py-16">
      <div className="mx-auto max-w-3xl px-4 md:px-6 lg:px-10">
        <h2 className="font-heading text-2xl md:text-3xl text-brand-olive-dark mb-2 text-center">
          Отвечаем на вопросы
        </h2>
        <p className="text-brand-muted text-sm md:text-base text-center mb-8 md:mb-10">
          О лабораторных бриллиантах, качестве и гарантии
        </p>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item) => (
            <details
              key={item.question}
              className="group rounded-xl border border-brand-olive/15 bg-brand-sand/20 open:bg-brand-surface open:shadow-sm transition-colors"
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
