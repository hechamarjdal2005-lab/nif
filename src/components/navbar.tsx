"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Menu, X, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import { SITE_NAME } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/language-context";
import { getTranslation } from "@/lib/i18n";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { key: "nav.accueil", href: "/" },
  { key: "nav.boutique", href: "/collection" },
  { key: "nav.contact", href: "/#contact" },
] as const;

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const { getItemCount } = useCart();
  const itemCount = getItemCount();
  const { locale, setLocale } = useLanguage();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("site_content")
      .select("content")
      .eq("section", "site_settings")
      .single()
      .then(({ data }) => {
        if (data?.content?.logo_url) {
          setLogoUrl(data.content.logo_url);
        }
      });
  }, []);

  const toggleLocale = () => {
    setLocale(locale === "fr" ? "ar" : "fr");
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 pt-3">
        <nav
          className={cn(
            "mx-auto max-w-5xl rounded-full transition-all duration-300",
            isScrolled
              ? "bg-background/80 backdrop-blur-xl shadow-md border border-outline-variant/30 py-2"
              : "bg-background/50 backdrop-blur-md shadow-sm border border-outline-variant/20 py-2.5"
          )}
        >
          <div className="flex items-center justify-between px-5 sm:px-6">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={SITE_NAME}
                  width={120}
                  height={36}
                  className="h-8 w-auto"
                  priority
                />
              ) : (
                <h1
                  className={cn(
                    "font-heading text-base sm:text-lg tracking-wider transition-colors duration-300",
                    isScrolled ? "text-primary" : "text-on-background"
                  )}
                >
                  {SITE_NAME}
                </h1>
              )}
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "px-3.5 py-1.5 text-[11px] tracking-[0.1em] uppercase font-medium transition-all duration-300 rounded-full",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-on-background/50 hover:text-primary hover:bg-primary/5"
                    )}
                  >
                    {getTranslation(locale, item.key)}
                  </Link>
                );
              })}
            </div>

            {/* Right Group: Language, Cart, Hamburger */}
            <div className="flex items-center gap-1">
              <button
                onClick={toggleLocale}
                className={cn(
                  "flex items-center gap-1 px-2.5 py-1.5 rounded-full transition-all duration-300 text-[11px] font-medium tracking-wider uppercase",
                  "text-on-background/50 hover:text-primary hover:bg-primary/5"
                )}
                title={locale === "fr" ? "العربية" : "Français"}
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {locale === "fr" ? "AR" : "FR"}
                </span>
              </button>

              <Link
                href="/panier"
                className={cn(
                  "relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300",
                  "text-on-background/50 hover:text-primary hover:bg-primary/5"
                )}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-primary text-on-primary text-[9px] font-bold rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setIsMobileOpen(true)}
                className="md:hidden flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 text-on-background/50 hover:text-primary hover:bg-primary/5"
              >
                <Menu className="w-4 h-4" />
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
          <div
            className={cn(
              "absolute top-4 h-[calc(100%-2rem)] w-[280px] bg-background/95 backdrop-blur-xl rounded-2xl border border-outline-variant/30 p-6 animate-slide-in shadow-2xl",
              locale === "ar" ? "left-4" : "right-4"
            )}
          >
            <button
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-surface-container-low text-secondary hover:text-on-background transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="mt-14 flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={cn(
                      "px-4 py-2.5 text-sm tracking-wide uppercase font-medium rounded-xl transition-all duration-300",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-secondary hover:text-primary hover:bg-primary/5"
                    )}
                  >
                    {getTranslation(locale, item.key)}
                  </Link>
                );
              })}
              <div className="my-3 border border-outline-variant/30" />
              <button
                onClick={() => {
                  toggleLocale();
                  setIsMobileOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-secondary hover:text-primary transition-colors tracking-wide uppercase font-medium rounded-xl hover:bg-primary/5 text-left"
              >
                <Globe className="w-4 h-4" />
                {locale === "fr" ? "العربية" : "Français"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
