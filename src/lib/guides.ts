export type GuideArticle = {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
};

export const GUIDE_ARTICLES: GuideArticle[] = [
  {
    slug: "lab-grown-diamonds",
    title: "Лабораторный и природный бриллиант: в чём разница",
    description:
      "Сравниваем выращенные и природные бриллианты по блеску, прочности, сертификации и стоимости.",
    eyebrow: "Гид покупателя",
  },
  {
    slug: "silver-care",
    title: "Как ухаживать за серебром 925 с бриллиантом",
    description:
      "Простые правила хранения, чистки и носки серебряных украшений с лабораторными камнями.",
    eyebrow: "Гид покупателя",
  },
  {
    slug: "diamond-gift",
    title: "Как выбрать подарок с лабораторным бриллиантом",
    description:
      "На что смотреть при выборе кольца, серёг или колье в подарок до 30 000 ₽.",
    eyebrow: "Гид покупателя",
  },
];

export function getGuideArticle(slug: string): GuideArticle | undefined {
  return GUIDE_ARTICLES.find((article) => article.slug === slug);
}
