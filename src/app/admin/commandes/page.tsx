"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";

import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";
import { ORDER_STATUTS } from "@/lib/constants";
import { Eye } from "lucide-react";
import type { Order } from "@/lib/types";

export default function AdminCommandesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchOrders = async () => {
      const supabase = createClient();
      let query = supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (filter !== "all") query = query.eq("statut", filter);
      const { data } = await query;
      setOrders((data || []) as unknown as Order[]);
      setLoading(false);
    };
    fetchOrders();
  }, [filter]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const supabase = createClient();
    await supabase.from("orders").update({ statut: newStatus }).eq("id", orderId);
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, statut: newStatus as Order["statut"] } : o));
  };

  const STATUT_COLORS: Record<string, "warning" | "default" | "success" | "destructive"> = {
    en_attente: "warning",
    confirmee: "default",
    expediee: "default",
    livree: "success",
    annulee: "destructive",
  };

  if (loading) {
    return <div className="animate-pulse space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-16 bg-dark-100 rounded" />)}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Select
          options={[
            { value: "all", label: "Tous les statuts" },
            ...ORDER_STATUTS.map((s) => ({ value: s.value, label: s.label })),
          ]}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-48 bg-dark"
        />
        <span className="text-sm text-dark-500">{orders.length} commande(s)</span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-dark-200">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-200 bg-dark-50">
              <th className="px-4 py-3 text-left text-xs text-dark-500 uppercase">ID</th>
              <th className="px-4 py-3 text-left text-xs text-dark-500 uppercase">Client</th>
              <th className="px-4 py-3 text-left text-xs text-dark-500 uppercase">Téléphone</th>
              <th className="px-4 py-3 text-left text-xs text-dark-500 uppercase">Ville</th>
              <th className="px-4 py-3 text-left text-xs text-dark-500 uppercase">Total</th>
              <th className="px-4 py-3 text-left text-xs text-dark-500 uppercase">Statut</th>
              <th className="px-4 py-3 text-left text-xs text-dark-500 uppercase">Date</th>
              <th className="px-4 py-3 text-left text-xs text-dark-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-dark-50/50 transition-colors">
                <td className="px-4 py-3 text-xs text-dark-500 font-mono">{order.id.slice(0, 8)}...</td>
                <td className="px-4 py-3 text-sm text-white">{order.client_nom}</td>
                <td className="px-4 py-3 text-sm text-dark-500">{order.client_tel}</td>
                <td className="px-4 py-3 text-sm text-dark-500">{order.client_ville}</td>
                <td className="px-4 py-3 text-sm text-gold font-medium">{formatPrice(order.total)}</td>
                <td className="px-4 py-3">
                  <Badge variant={STATUT_COLORS[order.statut] || "default"}>
                    {ORDER_STATUTS.find((s) => s.value === order.statut)?.label || order.statut}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm text-dark-500">
                  {new Date(order.created_at).toLocaleDateString("fr-FR")}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/commandes/${order.id}`}>
                      <button className="p-1.5 text-dark-500 hover:text-gold transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </Link>
                    <select
                      value={order.statut}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="text-xs bg-dark border border-dark-200 rounded px-2 py-1 text-white"
                    >
                      {ORDER_STATUTS.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-dark-500 text-sm">Aucune commande</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
