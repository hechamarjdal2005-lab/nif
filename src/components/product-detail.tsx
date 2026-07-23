"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingBag, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/star-rating";
import { formatPrice, getImageUrl } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/types";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [quantite, setQuantite] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem } = useCart();

  const images = product.images && product.images.length > 0 ? product.images : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Image Gallery */}
      <div>
        <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-dark-50 border border-dark-200 mb-3 max-w-md">
          {images[selectedImage] ? (
            <Image
              src={getImageUrl(images[selectedImage])}
              alt={product.nom}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-dark-400">
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
                  i === selectedImage ? "border-gold" : "border-dark-200"
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
          {product.is_new && <Badge variant="default">Nouveau</Badge>}
          {product.is_bestseller && <Badge variant="outline">Best Seller</Badge>}
          {product.category && <Badge variant="outline">{product.category.nom}</Badge>}
        </div>

        <h1 className="font-heading text-2xl sm:text-3xl text-white mb-3">{product.nom}</h1>

        <div className="flex items-center gap-3 mb-5">
          <StarRating rating={product.rating_avg} size="md" />
          <span className="text-dark-500 text-sm capitalize">{product.genre}</span>
        </div>

        <div className="flex items-baseline gap-3 mb-5">
          <span className="text-2xl font-semibold gold-text">{formatPrice(product.prix)}</span>
        </div>

        {product.notes_olfactives && (
          <div className="mb-5">
            <h3 className="text-sm font-medium text-dark-500 uppercase tracking-wider mb-2">Notes Olfactives</h3>
            <p className="text-white">{product.notes_olfactives}</p>
          </div>
        )}

        {product.description && (
          <div className="mb-5">
            <h3 className="text-sm font-medium text-dark-500 uppercase tracking-wider mb-2">Description</h3>
            <p className="text-dark-500 leading-relaxed">{product.description}</p>
          </div>
        )}

        <div className="mb-5">
          <span className={`text-sm ${product.stock > 0 ? "text-green-400" : "text-red-400"}`}>
            {product.stock > 0 ? `En stock (${product.stock})` : "Rupture de stock"}
          </span>
        </div>

        {/* Quantity & Add to Cart */}
        <div className="flex items-center gap-3 mb-6">
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
          <Button
            className="flex-1"
            disabled={product.stock === 0}
            onClick={() => addItem(product, quantite)}
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            Ajouter au Panier
          </Button>
        </div>
      </div>
    </div>
  );
}
