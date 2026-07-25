"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { formatPrice, getImageUrl } from "@/lib/utils";
import type { Product } from "@/lib/types";

export default function AdminPacksPage() {
  const [packs, setPacks] = useState<Product[]>([]);
  const [itemCounts, setItemCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const fetchPacks = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("type", "pack")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching packs:", error);
    }
    const packsList = (data || []) as unknown as Product[];

    if (packsList.length > 0) {
      const { data: itemsData } = await supabase
        .from("pack_items")
        .select("pack_id")
        .in("pack_id", packsList.map((p) => p.id));
      const counts: Record<string, number> = {};
      (itemsData || []).forEach((item: { pack_id: string }) => {
        counts[item.pack_id] = (counts[item.pack_id] || 0) + 1;
      });
      setItemCounts(counts);
    }

    setPacks(packsList);
    setLoading(false);
  };

  useEffect(() => {
    fetchPacks();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce pack ?")) return;
    const supabase = createClient();
    await supabase.from("pack_items").delete().eq("pack_id", id);
    await supabase.from("products").delete().eq("id", id);
    setPacks((prev) => prev.filter((p) => p.id !== id));
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
        <p className="text-dark-500 text-sm">{packs.length} pack(s)</p>
        <Link href="/admin/packs/nouveau">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Pack
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
              <th className="px-4 py-3 text-left text-xs text-dark-500 uppercase">Prix</th>
              <th className="px-4 py-3 text-left text-xs text-dark-500 uppercase">Stock</th>
              <th className="px-4 py-3 text-left text-xs text-dark-500 uppercase">Produits</th>
              <th className="px-4 py-3 text-left text-xs text-dark-500 uppercase">Badges</th>
              <th className="px-4 py-3 text-left text-xs text-dark-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-200">
            {packs.map((pack) => (
              <tr key={pack.id} className="hover:bg-dark-50/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="relative w-10 h-12 rounded-lg overflow-hidden bg-dark">
                    {pack.images?.[0] ? (
                      <Image src={getImageUrl(pack.images[0])} alt="" fill className="object-cover" sizes="40px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-dark-400 text-xs">✦</div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-white font-medium">{pack.nom}</td>
                <td className="px-4 py-3 text-sm text-dark-500 capitalize">{pack.genre}</td>
                <td className="px-4 py-3 text-sm text-gold">{formatPrice(pack.prix)}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={pack.stock > 0 ? "text-green-400" : "text-red-400"}>
                    {pack.stock}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-dark-500">
                  {itemCounts[pack.id] || 0} produit(s)
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    {pack.is_new && <Badge variant="default">New</Badge>}
                    {pack.is_bestseller && <Badge variant="outline">BS</Badge>}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/packs/${pack.id}`}>
                      <button className="p-1.5 text-dark-500 hover:text-gold transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(pack.id)}
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
