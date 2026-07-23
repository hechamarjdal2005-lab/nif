"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Minus, Plus, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, getImageUrl } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import type { Product, PackItem } from "@/lib/types";

interface PackDetailProps {
  pack: Product & { pack_items: (PackItem & { product: Product })[] };
}

export function PackDetail({ pack }: PackDetailProps) {
  const [quantite, setQuantite] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem } = useCart();

  const images = pack.images && pack.images.length > 0 ? pack.images : [];
  const packItems = pack.pack_items || [];
  const totalSeparate = packItems.reduce(
    (sum, item) => sum + (item.product?.prix || 0) * item.quantite,
    0
  );
  const savings = totalSeparate - pack.prix;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Image */}
      <div>
        <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-dark-50 border border-dark-200 max-w-md">
          {images[selectedImage] ? (
            <Image
              src={getImageUrl(images[selectedImage])}
              alt={pack.nom}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-dark-400">
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
                  i === selectedImage ? "border-gold" : "border-dark-200"
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
        <Badge variant="default" className="mb-3">Coffret</Badge>
        <h1 className="font-heading text-2xl sm:text-3xl text-white mb-3">{pack.nom}</h1>

        <div className="flex items-baseline gap-3 mb-4">
          <span className="text-2xl font-semibold gold-text">{formatPrice(pack.prix)}</span>
          {savings > 0 && (
            <>
              <span className="text-dark-500 line-through">{formatPrice(totalSeparate)}</span>
              <Badge variant="success">Économisez {formatPrice(savings)}</Badge>
            </>
          )}
        </div>

        {pack.description && (
          <p className="text-sm sm:text-base text-dark-500 leading-relaxed mb-5">{pack.description}</p>
        )}

        {/* Pack Contents */}
        <div className="mb-5">
          <h3 className="text-xs font-medium text-dark-500 uppercase tracking-wider mb-3">Contenu du Coffret</h3>
          <div className="space-y-2">
            {packItems.map((item) => (
              <Link
                key={item.id}
                href={`/produit/${item.product?.slug}`}
                className="flex items-center gap-3 p-3 rounded-lg border border-dark-200 hover:border-gold/30 transition-colors group"
              >
                <div className="relative w-12 h-12 rounded-md overflow-hidden bg-dark flex-shrink-0">
                  {item.product?.images?.[0] ? (
                    <Image
                      src={getImageUrl(item.product.images[0])}
                      alt={item.product.nom}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-dark-400">
                      ✦
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate group-hover:text-gold transition-colors">
                    {item.product?.nom}
                  </p>
                  <p className="text-dark-500 text-xs">
                    Qté: {item.quantite} × {formatPrice(item.product?.prix || 0)}
                  </p>
                </div>
                <span className="text-gold text-sm font-medium">
                  {formatPrice((item.product?.prix || 0) * item.quantite)}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Quantity & Add to Cart */}
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-dark-200 rounded-lg">
            <button
              onClick={() => setQuantite(Math.max(1, quantite - 1))}
              className="p-2.5 text-dark-500 hover:text-white transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-12 text-center text-white font-medium">{quantite}</span>
            <button
              onClick={() => setQuantite(quantite + 1)}
              className="p-2.5 text-dark-500 hover:text-white transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <Button className="flex-1" onClick={() => addItem(pack, quantite)}>
            <ShoppingBag className="w-5 h-5 mr-2" />
            Ajouter au Panier
          </Button>
        </div>
      </div>
    </div>
  );
}
