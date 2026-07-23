"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { CartItem, Product } from "@/lib/types";

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantite?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantite: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function isValidCartItem(item: unknown): item is CartItem {
  if (!item || typeof item !== "object") return false;

  const cartItem = item as Partial<CartItem>;
  const product = cartItem.product as Partial<Product> | undefined;

  return (
    !!product &&
    typeof product.id === "string" &&
    product.id.length > 0 &&
    typeof product.prix === "number" &&
    Number.isFinite(product.prix) &&
    typeof cartItem.quantite === "number" &&
    Number.isFinite(cartItem.quantite) &&
    cartItem.quantite > 0
  );
}

function parseCartItems(saved: string): CartItem[] {
  const parsed: unknown = JSON.parse(saved);
  return Array.isArray(parsed) ? parsed.filter(isValidCartItem) : [];
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("cart");
      if (saved) setItems(parseCartItems(saved));
    } catch {}
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("cart", JSON.stringify(items));
    }
  }, [items, isLoading]);

  const addItem = useCallback((product: Product, quantite = 1) => {
    if (!product?.id || quantite <= 0) return;

    setItems((prev) => {
      const validItems = prev.filter(isValidCartItem);
      const existing = validItems.find((item) => item.product.id === product.id);
      if (existing) {
        return validItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantite: item.quantite + quantite }
            : item
        );
      }
      return [...validItems, { product, quantite }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => isValidCartItem(item) && item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantite: number) => {
    if (quantite <= 0) {
      setItems((prev) => prev.filter((item) => isValidCartItem(item) && item.product.id !== productId));
      return;
    }
    setItems((prev) =>
      prev
        .filter(isValidCartItem)
        .map((item) =>
          item.product.id === productId ? { ...item, quantite } : item
        )
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const getTotal = useCallback(() => {
    return items.reduce((sum, item) => sum + item.product.prix * item.quantite, 0);
  }, [items]);

  const getItemCount = useCallback(() => {
    return items.reduce((sum, item) => sum + item.quantite, 0);
  }, [items]);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, getTotal, getItemCount, isLoading }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
