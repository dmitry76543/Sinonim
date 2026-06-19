import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { GuidePage } from "@/components/guide/GuidePage";
import { buildPageMetadata } from "@/lib/metadata";
import { getGuideArticle } from "@/lib/guides";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = getGuideArticle(slug);
  if (!article) return {};

  return buildPageMetadata({
    title: `${article.title} — Синоним`,
    description: article.description,
    path: `/guide/${slug}`,
    ogType: "article",
  });
}

export default async function GuideArticleRoute({ params }: PageProps) {
  const { slug } = await params;
  const article = getGuideArticle(slug);
  if (!article) notFound();

  return (
    <>
      <Header />
      <main>
        {slug === "lab-grown-diamonds" && <LabGrownGuide />}
        {slug === "silver-care" && <SilverCareGuide />}
        {slug === "diamond-gift" && <DiamondGiftGuide />}
      </main>
      <Footer />
    </>
  );
}

function LabGrownGuide() {
  return (
    <GuidePage
      eyebrow="Гид покупателя"
      title="Лабораторный и природный бриллиант: в чём разница"
      intro="Лабораторные бриллианты и природные камни имеют одинаковый химический состав и сияние. Разница — в происхождении, цене и экологическом следе."
    >
      <p>
        Выращенный бриллиант формируется в контролируемых условиях за несколько
        недель, а природный — миллионы лет в земной коре. При этом оба камня
        состоят из чистого углерода и имеют твёрдость 10 по шкале Мооса.
      </p>
      <h2 className="font-heading text-xl text-brand-olive-dark">Блеск и качество</h2>
      <p>
        Игра света зависит от огранки, а не от происхождения камня. В украшениях
        Синоним используются лабораторные бриллианты с огранкой brillant и
        сертификацией по системе 4C: цвет, чистота, каратность, огранка.
      </p>
      <h2 className="font-heading text-xl text-brand-olive-dark">Почему цена ниже</h2>
      <p>
        Лабораторный путь короче и предсказуемее: нет добычи, многоступенчатой
        логистики и дефицита крупных кристаллов. Поэтому за те же визуальные
        характеристики можно выбрать более заметный камень или собрать комплект
        украшений.
      </p>
      <h2 className="font-heading text-xl text-brand-olive-dark">Как проверить камень</h2>
      <p>
        Без специального оборудования отличить лабораторный бриллиант от
        природного невозможно. Надёжный ориентир — репутация бренда,
        характеристики в паспорте изделия и добровольная аттестация качества.
      </p>
    </GuidePage>
  );
}

function SilverCareGuide() {
  return (
    <GuidePage
      eyebrow="Гид покупателя"
      title="Как ухаживать за серебром 925 с бриллиантом"
      intro="Серебро 925 с родиевым покрытием и лабораторным бриллиантом не требует сложного ухода. Достаточно нескольких простых правил, чтобы украшение долго сохраняло блеск."
    >
      <h2 className="font-heading text-xl text-brand-olive-dark">Ежедневная носка</h2>
      <p>
        Снимайте украшения перед спортом, уборкой, бассейном и контактом с
        косметикой или духами. Бриллиант держится надёжно, но удары и абразивы
        могут повредить металл и крепление.
      </p>
      <h2 className="font-heading text-xl text-brand-olive-dark">Хранение</h2>
      <p>
        Храните изделия отдельно в мягком мешочке или коробке, чтобы они не
        царапали друг друга. Серебро лучше держать в сухом месте, вдали от
        влажной ванной.
      </p>
      <h2 className="font-heading text-xl text-brand-olive-dark">Чистка</h2>
      <p>
        Для регулярного ухода достаточно мягкой ткани. При загрязнении
        используйте тёплую воду с мягким мылом и щётку с мягким ворсом. После
        чистки тщательно высушите украшение.
      </p>
      <h2 className="font-heading text-xl text-brand-olive-dark">Когда обращаться в сервис</h2>
      <p>
        Если покрытие потускнело, крепление ослабло или нужна полировка —
        обратитесь в сервис Синоним. На изделия действует гарантия 2 года.
      </p>
    </GuidePage>
  );
}

function DiamondGiftGuide() {
  return (
    <GuidePage
      eyebrow="Гид покупателя"
      title="Как выбрать подарок с лабораторным бриллиантом"
      intro="Подарок с бриллиантом не обязан быть огромным по каратности. Важнее стиль, повод и удобство носки — особенно если украшение выбирается до примерки."
    >
      <h2 className="font-heading text-xl text-brand-olive-dark">С чего начать</h2>
      <p>
        Определите формат подарка: кольцо, серьги, колье или готовый набор до
        30 000 ₽. Для первого подарка чаще выбирают пусеты или лаконичное
        кольцо с камнем 0,1–0,3 карата.
      </p>
      <h2 className="font-heading text-xl text-brand-olive-dark">Размер и примерка</h2>
      <p>
        Для колец и браслетов важен размер. Если сюрприз должен остаться
        тайной, ориентируйтесь на уже имеющееся кольцо или пригласите в шоурум
        на совместную примерку.
      </p>
      <h2 className="font-heading text-xl text-brand-olive-dark">Бюджет</h2>
      <p>
        В серебре 925 с лабораторным бриллиантом можно подобрать выразительное
        украшение в диапазоне от 10 000 до 30 000 ₽. Посмотрите раздел
        «Подарки» в каталоге — там собраны готовые решения.
      </p>
      <h2 className="font-heading text-xl text-brand-olive-dark">Упаковка и сервис</h2>
      <p>
        Все изделия Синоним сопровождаются информацией о характеристиках камня.
        При необходимости менеджер поможет собрать комплект и организовать
        доставку или самовывоз из шоурума в Москве.
      </p>
    </GuidePage>
  );
}
