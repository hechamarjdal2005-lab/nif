"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useCart } from "@/lib/cart-context";
import { formatPrice, getImageUrl, cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";
import { getTranslation } from "@/lib/i18n";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, getItemCount, isLoading } = useCart();
  const { locale } = useLanguage();
  const isAr = locale === "ar";

  if (isLoading) {
    return (
      <main>
        <Navbar />
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-10 w-48 bg-surface-container-low rounded" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-surface-container-low rounded-xl" />
            ))}
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Navbar />
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className={cn("font-heading text-on-background text-3xl sm:text-4xl mb-8 font-medium", isAr && "font-arabic")}>{getTranslation(locale, "cart.title")}</h1>

        {items.length === 0 ? (
          <EmptyState
            icon={<ShoppingBag className="w-16 h-16" />}
            title={getTranslation(locale, "cart.emptyTitle")}
            description={getTranslation(locale, "cart.emptyDesc")}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 p-4 rounded-xl border border-outline-variant/40 bg-background"
                >
                  <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-surface-container-low flex-shrink-0">
                    {item.product.images?.[0] ? (
                      <Image
                        src={getImageUrl(item.product.images[0])}
                        alt={item.product.nom}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-outline-variant">
                        ✦
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-on-background font-medium truncate">{item.product.nom}</h3>
                    <p className="text-secondary text-sm capitalize">{item.product.genre}</p>
                    <p className="text-primary font-semibold mt-1">{formatPrice(item.product.prix)}</p>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-secondary hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="flex items-center border border-outline-variant/40 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantite - 1)}
                        className="p-1.5 text-secondary hover:text-on-background transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-on-background text-sm">{item.quantite}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantite + 1)}
                        className="p-1.5 text-secondary hover:text-on-background transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="p-6 rounded-xl border border-outline-variant/40 bg-background sticky top-24">
                <h2 className={cn("font-heading text-on-background text-xl mb-4", isAr && "font-arabic")}>{getTranslation(locale, "cart.summary")}</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className={cn("text-secondary", isAr && "font-arabic")}>{getTranslation(locale, "cart.articles")} ({getItemCount()})</span>
                    <span className="text-on-background">{formatPrice(getTotal())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className={cn("text-secondary", isAr && "font-arabic")}>{getTranslation(locale, "cart.shipping")}</span>
                    <span className={cn("text-primary", isAr && "font-arabic")}>{getTranslation(locale, "cart.free")}</span>
                  </div>
                  <hr className="border-outline-variant/40" />
                  <div className="flex justify-between">
                    <span className={cn("text-on-background font-medium", isAr && "font-arabic")}>{getTranslation(locale, "cart.total")}</span>
                    <span className="text-primary font-semibold text-lg">{formatPrice(getTotal())}</span>
                  </div>
                </div>
                <Link href="/checkout">
                  <Button size="lg" className={cn("w-full", isAr && "font-arabic")}>
                    {getTranslation(locale, "cart.checkout")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
