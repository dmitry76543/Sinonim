import type { Metadata } from "next";
import "@fontsource/inter/cyrillic-400.css";
import "@fontsource/inter/cyrillic-500.css";
import "@fontsource/inter/latin-400.css";
import "@fontsource/playfair-display/cyrillic-400.css";
import "@fontsource/playfair-display/cyrillic-600.css";
import "@fontsource/playfair-display/latin-400.css";
import { CartProvider } from "@/context/CartContext";
import { CompareProvider } from "@/context/CompareContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { MessengerFab } from "@/components/MessengerFab";
import { YandexMetrika } from "@/components/analytics/YandexMetrika";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Синоним — выращенные бриллианты в серебре",
    template: "%s",
  },
  description:
    "Ювелирные украшения из серебра 925 с лабораторными бриллиантами. Шоурум в Москве.",
  icons: {
    icon: [{ url: "/favicon.ico", type: "image/x-icon" }],
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-body">
        <YandexMetrika />
        <CartProvider>
          <CompareProvider>
            <FavoritesProvider>
              {children}
              <MessengerFab />
            </FavoritesProvider>
          </CompareProvider>
        </CartProvider>
      </body>
    </html>
  );
}
