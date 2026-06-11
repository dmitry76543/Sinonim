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
import "./globals.css";

export const metadata: Metadata = {
  title: "Синоним — выращенные бриллианты в серебре",
  description:
    "Ювелирные украшения из серебра 925 с лабораторными бриллиантами. Шоурум в Москве.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-body">
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
