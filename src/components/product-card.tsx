"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { StarRating } from "@/components/ui/star-rating";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  discountedPrice?: number;
  className?: string;
}

export function ProductCard({ product, discountedPrice, className }: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <div
      className={cn(
        "group relative bg-dark-50 border border-dark-200 rounded-xl overflow-hidden hover-lift",
        className
      )}
    >
      {/* Image */}
      <Link href={product.type === "pack" ? `/pack/${product.slug}` : `/produit/${product.slug}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-dark">
          {product.images && product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.nom}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-dark-400">
              <span className="text-4xl">✦</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.is_new && <Badge variant="default">Nouveau</Badge>}
            {product.is_bestseller && <Badge variant="outline">Best Seller</Badge>}
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <StarRating rating={product.rating_avg} size="sm" />
          <span className="text-xs text-dark-500 capitalize">{product.genre}</span>
        </div>

        <Link href={product.type === "pack" ? `/pack/${product.slug}` : `/produit/${product.slug}`}>
          <h3 className="font-heading text-lg text-white group-hover:text-gold transition-colors mb-1 line-clamp-1">
            {product.nom}
          </h3>
        </Link>

        {product.notes_olfactives && (
          <p className="text-xs text-dark-500 mb-3 line-clamp-1">{product.notes_olfactives}</p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {discountedPrice && discountedPrice < product.prix ? (
              <>
                <span className="text-gold font-semibold">{formatPrice(discountedPrice)}</span>
                <span className="text-dark-500 text-sm line-through">{formatPrice(product.prix)}</span>
              </>
            ) : (
              <span className="text-gold font-semibold">{formatPrice(product.prix)}</span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              addItem(product);
            }}
            className="p-2 bg-gold/10 text-gold rounded-lg hover:bg-gold hover:text-black transition-all duration-300"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
