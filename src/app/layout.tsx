import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";

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
    <html lang="fr" className={`${playfair.variable} ${montserrat.variable}`}>
      <body className="font-body antialiased bg-darker text-white min-h-screen">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
