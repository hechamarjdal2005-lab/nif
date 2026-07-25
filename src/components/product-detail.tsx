"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingBag, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/star-rating";
import { formatPrice, getImageUrl } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import { useLanguage } from "@/lib/language-context";
import { getTranslation, getLocalizedField } from "@/lib/i18n";
import type { Product } from "@/lib/types";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [quantite, setQuantite] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem } = useCart();
  const { locale } = useLanguage();
  const ar = locale === "ar";

  const images = product.images && product.images.length > 0 ? product.images : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1fr] gap-6 lg:gap-8">
      {/* Image Gallery */}
      <div>
        <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-surface-container-low border border-outline-variant/40 mb-3 max-w-[340px] sm:max-w-[380px] lg:max-w-[360px]">
          {images[selectedImage] ? (
            <Image
              src={getImageUrl(images[selectedImage])}
              alt={getLocalizedField(product as unknown as Record<string, unknown>, "nom", locale)}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-outline-variant">
              <span className="text-4xl">✦</span>
            </div>
          )}
        </div>
        {images.length > 1 && (
          <div className="flex gap-2">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`relative w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                  i === selectedImage ? "border-primary" : "border-outline-variant/40"
                }`}
              >
                <Image src={getImageUrl(img)} alt="" fill className="object-cover" sizes="80px" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          {product.is_new && <Badge variant="default">{getTranslation(locale, "product.nouveau")}</Badge>}
          {product.is_bestseller && <Badge variant="outline">Best Seller</Badge>}
          {product.category && <Badge variant="outline">{product.category.nom}</Badge>}
        </div>

        <h1 className={`font-heading text-2xl sm:text-[28px] text-on-background mb-3 ${ar ? "font-arabic" : ""}`}>{getLocalizedField(product as unknown as Record<string, unknown>, "nom", locale)}</h1>

        <div className="flex items-center gap-3 mb-5">
          <StarRating rating={product.rating_avg} size="md" />
          <span className="text-secondary text-sm capitalize">{product.genre}</span>
        </div>

        <div className="flex items-baseline gap-3 mb-5">
          <span className="text-primary text-xl sm:text-2xl font-semibold">{formatPrice(product.prix)}</span>
        </div>

        {product.notes_olfactives && (
          <div className="mb-5">
            <h3 className={`text-sm font-medium text-secondary uppercase tracking-[0.1em] mb-2 ${ar ? "font-arabic" : ""}`}>{getTranslation(locale, "product.notesOlfactives")}</h3>
            <p className={`text-on-background ${ar ? "font-arabic" : ""}`}>{getLocalizedField(product as unknown as Record<string, unknown>, "notes_olfactives", locale)}</p>
          </div>
        )}

        {product.description && (
          <div className="mb-5">
            <h3 className={`text-sm font-medium text-secondary uppercase tracking-[0.1em] mb-2 ${ar ? "font-arabic" : ""}`}>{getTranslation(locale, "product.description")}</h3>
            <p className={`text-secondary leading-relaxed ${ar ? "font-arabic" : ""}`}>{getLocalizedField(product as unknown as Record<string, unknown>, "description", locale)}</p>
          </div>
        )}

        <div className="mb-5">
          <span className={`text-sm ${product.stock > 0 ? "text-green-400" : "text-red-400"} ${ar ? "font-arabic" : ""}`}>
            {product.stock > 0 ? `${getTranslation(locale, "product.inStock")} (${product.stock})` : getTranslation(locale, "product.outOfStock")}
          </span>
        </div>

        {/* Quantity & Add to Cart */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center border border-outline-variant/40 rounded-lg">
            <button
              onClick={() => setQuantite(Math.max(1, quantite - 1))}
              className="p-2.5 text-secondary hover:text-on-background transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-12 text-center text-on-background font-medium">{quantite}</span>
            <button
              onClick={() => setQuantite(quantite + 1)}
              className="p-2.5 text-secondary hover:text-on-background transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <Button
            className={`flex-1 ${ar ? "font-arabic" : ""}`}
            disabled={product.stock === 0}
            onClick={() => addItem(product, quantite)}
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            {getTranslation(locale, "product.addToCart")}
          </Button>
        </div>
      </div>
    </div>
  );
}
