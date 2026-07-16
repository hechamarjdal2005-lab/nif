"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ORDER_STATUTS } from "@/lib/constants";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Order, OrderItem } from "@/lib/types";

export default function AdminOrderDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [order, setOrder] = useState<(Order & { items: (OrderItem & { product: { nom: string; images: string[] } })[] }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("orders")
        .select("*, items:order_items(*, product:products(nom, images))")
        .eq("id", id)
        .single();
      setOrder(data as unknown as typeof order);
      setLoading(false);
    };
    fetchOrder();
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    const supabase = createClient();
    await supabase.from("orders").update({ statut: newStatus }).eq("id", id);
    setOrder((prev) => prev ? { ...prev, statut: newStatus as Order["statut"] } : prev);
  };

  const STATUT_COLORS: Record<string, "warning" | "default" | "success" | "destructive"> = {
    en_attente: "warning",
    confirmee: "default",
    expediee: "default",
    livree: "success",
    annulee: "destructive",
  };

  if (loading) {
    return <div className="animate-pulse space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-12 bg-dark-100 rounded" />)}</div>;
  }

  if (!order) {
    return <p className="text-dark-500">Commande non trouvée.</p>;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <Link href="/admin/commandes" className="inline-flex items-center text-dark-500 hover:text-gold text-sm transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Retour aux commandes
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl text-white">Commande #{order.id.slice(0, 8)}</h2>
          <p className="text-dark-500 text-sm">{new Date(order.created_at).toLocaleString("fr-FR")}</p>
        </div>
        <Badge variant={STATUT_COLORS[order.statut] || "default"} className="text-sm">
          {ORDER_STATUTS.find((s) => s.value === order.statut)?.label}
        </Badge>
      </div>

      {/* Status Change */}
      <div className="p-4 rounded-xl border border-dark-200 bg-dark-50">
        <h3 className="text-sm font-medium text-dark-500 mb-3">Changer le statut</h3>
        <div className="flex flex-wrap gap-2">
          {ORDER_STATUTS.map((s) => (
            <Button
              key={s.value}
              variant={order.statut === s.value ? "default" : "outline"}
              size="sm"
              onClick={() => handleStatusChange(s.value)}
            >
              {s.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Client Info */}
      <div className="p-4 rounded-xl border border-dark-200 bg-dark-50">
        <h3 className="text-sm font-medium text-dark-500 mb-3">Informations Client</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-dark-500">Nom:</span> <span className="text-white ml-2">{order.client_nom}</span></div>
          <div><span className="text-dark-500">Tél:</span> <span className="text-white ml-2">{order.client_tel}</span></div>
          <div><span className="text-dark-500">Email:</span> <span className="text-white ml-2">{order.client_email || "—"}</span></div>
          <div><span className="text-dark-500">Ville:</span> <span className="text-white ml-2">{order.client_ville}</span></div>
          <div className="col-span-2"><span className="text-dark-500">Adresse:</span> <span className="text-white ml-2">{order.client_adresse}</span></div>
        </div>
      </div>

      {/* Order Items */}
      <div className="p-4 rounded-xl border border-dark-200 bg-dark-50">
        <h3 className="text-sm font-medium text-dark-500 mb-3">Articles</h3>
        <div className="space-y-3">
          {order.items?.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-dark border border-dark-200">
              <div>
                <p className="text-white text-sm font-medium">{item.product?.nom}</p>
                <p className="text-dark-500 text-xs">Qté: {item.quantite} × {formatPrice(item.prix_unitaire)}</p>
              </div>
              <span className="text-gold text-sm font-medium">{formatPrice(item.quantite * item.prix_unitaire)}</span>
            </div>
          ))}
        </div>
        <hr className="border-dark-200 my-4" />
        <div className="flex justify-between">
          <span className="text-white font-medium">Total</span>
          <span className="text-gold font-semibold text-lg">{formatPrice(order.total)}</span>
        </div>
      </div>
    </div>
  );
}
