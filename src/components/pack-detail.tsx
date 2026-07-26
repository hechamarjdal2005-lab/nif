"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Minus, Plus, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, getImageUrl } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import { useLanguage } from "@/lib/language-context";
import { getTranslation, getLocalizedField } from "@/lib/i18n";
import type { Product, PackItem } from "@/lib/types";

interface PackDetailProps {
  pack: Product & { pack_items: (PackItem & { product: Product })[] };
}

export function PackDetail({ pack }: PackDetailProps) {
  const [quantite, setQuantite] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem } = useCart();
  const { locale } = useLanguage();
  const ar = locale === "ar";

  const images = pack.images && pack.images.length > 0 ? pack.images : [];
  const packItems = pack.pack_items || [];
  const totalSeparate = packItems.reduce(
    (sum, item) => sum + (item.product?.prix || 0) * item.quantite,
    0
  );
  const savings = totalSeparate - pack.prix;
  const packDescription = getLocalizedField(pack as unknown as Record<string, unknown>, "description", locale);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1fr] gap-6 lg:gap-8">
      {/* Image */}
      <div>
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-surface-container-low border border-outline-variant/40 max-w-[520px]">
          {images[selectedImage] ? (
            <Image
              src={getImageUrl(images[selectedImage])}
              alt={getLocalizedField(pack as unknown as Record<string, unknown>, "nom", locale)}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-outline-variant">
              <Package className="w-20 h-20" />
            </div>
          )}
        </div>
        {images.length > 1 && (
          <div className="flex gap-2 mt-3">
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

      {/* Info */}
      <div>
        <Badge variant="default" className="mb-3">{getTranslation(locale, "pack.coffret")}</Badge>
        <h1 className={`font-heading text-on-background text-2xl sm:text-[28px] mb-3 ${ar ? "font-arabic" : ""}`}>{getLocalizedField(pack as unknown as Record<string, unknown>, "nom", locale)}</h1>

        <div className="flex items-baseline gap-3 mb-4">
          <span className="text-primary text-xl sm:text-2xl font-semibold">{formatPrice(pack.prix)}</span>
          {savings > 0 && (
            <>
              <span className="text-secondary line-through">{formatPrice(totalSeparate)}</span>
              <Badge variant="success">{getTranslation(locale, "pack.save")} {formatPrice(savings)}</Badge>
            </>
          )}
        </div>

        {packDescription && (
          <p className={`text-sm sm:text-base text-secondary leading-relaxed mb-5 ${ar ? "font-arabic" : ""}`}>{packDescription}</p>
        )}

        {/* Pack Contents */}
        <div className="mb-5">
          <h3 className={`text-xs font-medium text-secondary uppercase tracking-[0.1em] mb-3 ${ar ? "font-arabic" : ""}`}>{getTranslation(locale, "pack.contents")}</h3>
          <div className="space-y-3">
            {packItems.map((item) => {
              const itemDescription =
                item.description ||
                getLocalizedField(item.product as unknown as Record<string, unknown>, "description", locale);

              return (
              <Link
                key={item.id}
                href={`/produit/${item.product?.slug}`}
                className="flex items-start gap-3 p-3 rounded-lg border border-outline-variant/40 bg-background hover:border-primary/30 hover:bg-primary/5 transition-colors group"
              >
                <div className="relative w-16 h-16 rounded-md overflow-hidden bg-surface-container-low flex-shrink-0">
                  {item.product?.images?.[0] ? (
                    <Image
                      src={getImageUrl(item.product.images[0])}
                      alt={item.product.nom}
                      fill
                      className="object-cover"
                      sizes="72px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-outline-variant">
                      ✦
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-on-background text-sm font-medium group-hover:text-primary transition-colors ${ar ? "font-arabic" : ""}`}>
                    {getLocalizedField(item.product as unknown as Record<string, unknown>, "nom", locale)}
                  </p>
                  {itemDescription && (
                    <p className={`text-secondary text-xs leading-relaxed mt-1 line-clamp-2 ${ar ? "font-arabic" : ""}`}>
                      {itemDescription}
                    </p>
                  )}
                  <p className={`text-secondary text-xs mt-1.5 ${ar ? "font-arabic" : ""}`}>
                    {getTranslation(locale, "pack.qty")}: {item.quantite} × {formatPrice(item.product?.prix || 0)}
                  </p>
                </div>
                <span className="text-primary text-sm font-medium whitespace-nowrap">
                  {formatPrice((item.product?.prix || 0) * item.quantite)}
                </span>
              </Link>
              );
            })}
          </div>
        </div>

        {/* Quantity & Add to Cart */}
        <div className="flex items-center gap-3">
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
          <Button className={`flex-1 ${ar ? "font-arabic" : ""}`} onClick={() => addItem(pack, quantite)}>
            <ShoppingBag className="w-5 h-5 mr-2" />
            {getTranslation(locale, "pack.addToCart")}
          </Button>
        </div>
      </div>
    </div>
  );
}
