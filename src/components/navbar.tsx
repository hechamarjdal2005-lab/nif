"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, User, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "glass py-3"
            : "bg-transparent py-5"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <h1 className="font-heading text-xl sm:text-2xl gold-text tracking-wider">
                {SITE_NAME}
              </h1>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-dark-600 hover:text-gold transition-colors duration-300 tracking-wide uppercase font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-4">
              <Link
                href="/panier"
                className="relative p-2 text-dark-600 hover:text-gold transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-black text-xs font-bold rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
              <Link
                href="/admin"
                className="p-2 text-dark-600 hover:text-gold transition-colors hidden sm:block"
              >
                <User className="w-5 h-5" />
              </Link>
              <button
                onClick={() => setIsMobileOpen(true)}
                className="md:hidden p-2 text-dark-600 hover:text-gold transition-colors"
              >
                <Menu className="w-5 h-5" />
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
          <div className="absolute right-0 top-0 h-full w-72 bg-dark border-l border-dark-200 p-6 animate-slide-in">
            <button
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-4 right-4 text-dark-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="mt-12 flex flex-col space-y-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className="text-lg text-dark-600 hover:text-gold transition-colors tracking-wide uppercase font-medium"
                >
                  {link.label}
                </Link>
              ))}
              <hr className="border-dark-200" />
              <Link
                href="/admin"
                onClick={() => setIsMobileOpen(false)}
                className="flex items-center space-x-2 text-dark-600 hover:text-gold transition-colors"
              >
                <User className="w-5 h-5" />
                <span>Admin</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
