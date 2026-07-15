import type { GuideArticle } from "@/lib/guides";
import { getOrganizationId } from "@/lib/schema-ids";
import { absoluteImageUrl, DEFAULT_OG_IMAGE } from "@/lib/seo-images";
import { getSiteUrl } from "@/lib/site-url";
import type { FaqItem } from "@/lib/warranty-faq";

export const LAB_GROWN_DIAMONDS_FAQ: FaqItem[] = [
  {
    question: "Чем лабораторный бриллиант отличается от природного?",
    answer:
      "Оба камня состоят из чистого углерода и имеют твёрдость 10 по шкале Мооса. Разница — в происхождении: природный формируется миллионы лет в земной коре, лабораторный — за несколько недель в контролируемых условиях.",
  },
  {
    question: "Есть ли разница в блеске между лабораторным и природным бриллиантом?",
    answer:
      "Визуальной разницы нет: игра света зависит от огранки, а не от происхождения камня. Лабораторные бриллианты оцениваются по той же системе 4C: цвет, чистота, каратность, огранка.",
  },
  {
    question: "Почему лабораторные бриллианты стоят дешевле природных?",
    answer:
      "Лабораторный путь короче и предсказуемее: нет добычи, многоступенчатой логистики и дефицита крупных кристаллов. За те же визуальные характеристики можно выбрать более заметный камень.",
  },
  {
    question: "Как проверить, что бриллиант лабораторный?",
    answer:
      "Без специального оборудования отличить лабораторный бриллиант от природного невозможно. Метод роста определяется в геммологической лаборатории. Надёжный ориентир — характеристики в паспорте изделия и добровольная аттестация качества.",
  },
];

export const GUIDE_SPEAKABLE_SELECTORS = [
  ".guide-intro",
  ".guide-content h2",
  ".guide-content > p",
] as const;

export function buildGuideArticleJsonLd(
  article: GuideArticle,
): Record<string, unknown> {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${siteUrl}/guide/${article.slug}#article`,
    headline: article.title,
    description: article.description,
    url: `${siteUrl}/guide/${article.slug}`,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    author: {
      "@type": "Organization",
      name: "Синоним",
      url: siteUrl,
    },
    publisher: {
      "@id": getOrganizationId(),
    },
    image: absoluteImageUrl(article.ogImage ?? DEFAULT_OG_IMAGE),
    inLanguage: "ru-RU",
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [...GUIDE_SPEAKABLE_SELECTORS],
    },
    ...(article.about && {
      about: {
        "@type": "Thing",
        name: article.about,
      },
    }),
  };
}
