"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { cn, formatPrice, getImageUrl } from "@/lib/utils";
import { StarRating } from "@/components/ui/star-rating";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/cart-context";
import { useLanguage } from "@/lib/language-context";
import { getTranslation, getLocalizedField } from "@/lib/i18n";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  discountedPrice?: number;
  className?: string;
}

export function ProductCard({ product, discountedPrice, className }: ProductCardProps) {
  const { addItem } = useCart();
  const { locale } = useLanguage();
  const ar = locale === "ar";
  const href = product.type === "pack" ? `/pack/${product.slug}` : `/produit/${product.slug}`;
  const productName = getLocalizedField(product as unknown as Record<string, unknown>, "nom", locale);

  return (
    <div
      className={cn(
        "group relative bg-background border border-outline-variant/40 rounded-lg sm:rounded-xl overflow-hidden hover-lift",
        className
      )}
    >
      <Link href={href} className="absolute inset-0 z-10" aria-label={productName} />

      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-surface-container-low">
        {product.images && product.images[0] ? (
          <Image
            src={getImageUrl(product.images[0])}
            alt={productName}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-outline-variant">
            <span className="text-4xl">*</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-on-background/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1.5 sm:gap-2">
          {product.is_new && <Badge variant="default">{getTranslation(locale, "product.nouveau")}</Badge>}
          {product.is_bestseller && <Badge variant="outline">Best Seller</Badge>}
        </div>
      </div>

      {/* Content */}
      <div className="p-2.5 sm:p-3">
        <div className="flex items-center justify-between mb-1.5 sm:mb-2">
          <StarRating rating={product.rating_avg} size="sm" />
          <span className="text-[10px] sm:text-xs text-secondary capitalize">{product.genre}</span>
        </div>

        <h3 className={`font-heading text-sm sm:text-base text-on-background group-hover:text-primary transition-colors mb-1 line-clamp-1 ${ar ? "font-arabic" : ""}`}>
          {productName}
        </h3>

        {product.notes_olfactives && (
          <p className="text-[10px] sm:text-xs text-secondary mb-2 sm:mb-3 line-clamp-1">{product.notes_olfactives}</p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {discountedPrice && discountedPrice < product.prix ? (
              <>
                <span className="text-xs sm:text-sm text-primary font-semibold">{formatPrice(discountedPrice)}</span>
                <span className="text-secondary text-xs sm:text-sm line-through">{formatPrice(product.prix)}</span>
              </>
            ) : (
              <span className="text-xs sm:text-sm text-primary font-semibold">{formatPrice(product.prix)}</span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addItem(product);
            }}
            className="relative z-20 p-1.5 bg-primary/10 text-primary rounded-md hover:bg-primary hover:text-on-primary transition-all duration-300"
          >
            <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
