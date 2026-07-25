import type { Metadata } from "next";
import { Playfair_Display, Montserrat, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { LanguageProvider } from "@/lib/language-context";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-noto-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Maison Nif Chrif | Parfumerie Marocaine de Luxe",
  description: "Découvrez nos parfums artisanaux marocains. Créations uniques alliant tradition et modernité.",
  keywords: ["parfum", "marocain", "luxe", "oud", "rose", "ambre", "maison nif chrif"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${playfair.variable} ${montserrat.variable} ${notoArabic.variable}`} suppressHydrationWarning>
      <body className="font-body antialiased bg-background text-on-background min-h-screen">
        <LanguageProvider>
          <CartProvider>{children}</CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
