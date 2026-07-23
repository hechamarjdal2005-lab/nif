"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

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

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "glass py-2"
            : "bg-transparent py-3"
        )}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={SITE_NAME}
                  width={120}
                  height={36}
                  className="h-10 w-auto"
                  priority
                />
              ) : (
                <h1 className="font-heading text-lg sm:text-xl gold-text tracking-wider">
                  {SITE_NAME}
                </h1>
              )}
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs text-dark-600 hover:text-gold transition-colors duration-300 tracking-wide uppercase font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-3">
              <Link
                href="/panier"
                className="relative p-1.5 text-dark-600 hover:text-gold transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-gold text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setIsMobileOpen(true)}
                className="md:hidden p-1.5 text-dark-600 hover:text-gold transition-colors"
              >
                <Menu className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-64 bg-dark border-l border-dark-200 p-5 animate-slide-in">
            <button
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-4 right-4 text-dark-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="mt-12 flex flex-col space-y-5">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className="text-base text-dark-600 hover:text-gold transition-colors tracking-wide uppercase font-medium"
                >
                  {link.label}
                </Link>
              ))}
              <hr className="border-dark-200" />
              
            </div>
          </div>
        </div>
      )}
    </>
  );
}
