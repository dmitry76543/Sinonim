import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import { CompareProvider } from "@/context/CompareContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { MessengerFab } from "@/components/MessengerFab";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "cyrillic"],
});

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
    <html lang="ru" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
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
