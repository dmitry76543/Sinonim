import { MESSENGERS, SHOWROOM, SITE_PHONE_TEL } from "@/lib/contacts";
import { absoluteImageUrl } from "@/lib/seo-images";
import { getSiteUrl } from "@/lib/site-url";

export function buildOrganizationJsonLd(): Record<string, unknown> {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/about#organization`,
    name: "Синоним",
    url: siteUrl,
    logo: absoluteImageUrl("/images/logo_20260527190756.png"),
    description:
      "Ювелирный бренд Синоним — украшения из серебра 925 с лабораторными бриллиантами.",
    telephone: SITE_PHONE_TEL.replace("tel:", ""),
    address: {
      "@type": "PostalAddress",
      streetAddress: "ул. Гиляровского 40, офис 13",
      addressLocality: "Москва",
      postalCode: "129110",
      addressCountry: "RU",
    },
    sameAs: [
      MESSENGERS.find((m) => m.id === "telegram")!.href,
      `${siteUrl}/showroom`,
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: SITE_PHONE_TEL.replace("tel:", ""),
      contactType: "customer service",
      areaServed: "RU",
      availableLanguage: "Russian",
    },
    location: {
      "@type": "Place",
      name: SHOWROOM.title,
      address: SHOWROOM.address,
    },
  };
}
