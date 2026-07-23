"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useCart } from "@/lib/cart-context";
import { formatPrice, getImageUrl } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, getItemCount, isLoading } = useCart();

  if (isLoading) {
    return (
      <main>
        <Navbar />
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-10 w-48 bg-dark-100 rounded" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-dark-100 rounded-xl" />
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
        <h1 className="font-heading text-3xl sm:text-4xl gold-text mb-8">Mon Panier</h1>

        {items.length === 0 ? (
          <EmptyState
            icon={<ShoppingBag className="w-16 h-16" />}
            title="Votre panier est vide"
            description="Découvrez notre collection et ajoutez vos parfums favoris."
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 p-4 rounded-xl border border-dark-200 bg-dark-50"
                >
                  <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-dark flex-shrink-0">
                    {item.product.images?.[0] ? (
                      <Image
                        src={getImageUrl(item.product.images[0])}
                        alt={item.product.nom}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-dark-400">
                        ✦
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate">{item.product.nom}</h3>
                    <p className="text-dark-500 text-sm capitalize">{item.product.genre}</p>
                    <p className="text-gold font-semibold mt-1">{formatPrice(item.product.prix)}</p>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-dark-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="flex items-center border border-dark-200 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantite - 1)}
                        className="p-1.5 text-dark-500 hover:text-white transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-white text-sm">{item.quantite}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantite + 1)}
                        className="p-1.5 text-dark-500 hover:text-white transition-colors"
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
              <div className="p-6 rounded-xl border border-dark-200 bg-dark-50 sticky top-24">
                <h2 className="font-heading text-xl text-white mb-4">Récapitulatif</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-500">Articles ({getItemCount()})</span>
                    <span className="text-white">{formatPrice(getTotal())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-500">Livraison</span>
                    <span className="text-gold">Gratuite</span>
                  </div>
                  <hr className="border-dark-200" />
                  <div className="flex justify-between">
                    <span className="text-white font-medium">Total</span>
                    <span className="text-gold font-semibold text-lg">{formatPrice(getTotal())}</span>
                  </div>
                </div>
                <Link href="/checkout">
                  <Button size="lg" className="w-full">
                    Passer la commande
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
