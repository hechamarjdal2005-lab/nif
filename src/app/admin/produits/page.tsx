"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/types";

export default function AdminProduitsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    setProducts((data || []) as unknown as Product[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce produit ?")) return;
    const supabase = createClient();
    await supabase.from("products").delete().eq("id", id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-dark-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-dark-500 text-sm">{products.length} produits</p>
        <Link href="/admin/produits/nouveau">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter
          </Button>
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-dark-200">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-200 bg-dark-50">
              <th className="px-4 py-3 text-left text-xs text-dark-500 uppercase">Image</th>
              <th className="px-4 py-3 text-left text-xs text-dark-500 uppercase">Nom</th>
              <th className="px-4 py-3 text-left text-xs text-dark-500 uppercase">Genre</th>
              <th className="px-4 py-3 text-left text-xs text-dark-500 uppercase">Type</th>
              <th className="px-4 py-3 text-left text-xs text-dark-500 uppercase">Prix</th>
              <th className="px-4 py-3 text-left text-xs text-dark-500 uppercase">Stock</th>
              <th className="px-4 py-3 text-left text-xs text-dark-500 uppercase">Badges</th>
              <th className="px-4 py-3 text-left text-xs text-dark-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-dark-50/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="relative w-10 h-12 rounded-lg overflow-hidden bg-dark">
                    {product.images?.[0] ? (
                      <Image src={product.images[0]} alt="" fill className="object-cover" sizes="40px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-dark-400 text-xs">✦</div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-white font-medium">{product.nom}</td>
                <td className="px-4 py-3 text-sm text-dark-500 capitalize">{product.genre}</td>
                <td className="px-4 py-3 text-sm text-dark-500 capitalize">{product.type}</td>
                <td className="px-4 py-3 text-sm text-gold">{formatPrice(product.prix)}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={product.stock > 0 ? "text-green-400" : "text-red-400"}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    {product.is_new && <Badge variant="default">New</Badge>}
                    {product.is_bestseller && <Badge variant="outline">BS</Badge>}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/produits/${product.id}`}>
                      <button className="p-1.5 text-dark-500 hover:text-gold transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-1.5 text-dark-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
