"use client";

import { useEffect, useState } from "react";
import { Package, ShoppingCart, Star, MessageSquare } from "lucide-react";
import { StatsCard } from "@/components/admin/stats-card";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  unreadMessages: number;
  avgRating: number;
  recentOrders: Array<{
    id: string;
    client_nom: string;
    total: number;
    statut: string;
    created_at: string;
  }>;
}

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    unreadMessages: 0,
    avgRating: 0,
    recentOrders: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient();

      const [products, orders, messages, testimonials, recentOrders] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("id, total, statut, created_at, client_nom"),
        supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("is_read", false),
        supabase.from("testimonials").select("rating").eq("is_approved", true),
        supabase.from("orders").select("id, client_nom, total, statut, created_at").order("created_at", { ascending: false }).limit(5),
      ]);

      const allOrders = (orders.data || []) as Array<{ total: number; statut: string }>;
      const avgRating = testimonials.data && testimonials.data.length > 0
        ? testimonials.data.reduce((sum: number, t: { rating: number }) => sum + t.rating, 0) / testimonials.data.length
        : 0;

      setStats({
        totalProducts: products.count || 0,
        totalOrders: allOrders.length,
        totalRevenue: allOrders.reduce((sum, o) => sum + (o.total || 0), 0),
        pendingOrders: allOrders.filter((o) => o.statut === "en_attente").length,
        unreadMessages: messages.count || 0,
        avgRating: Math.round(avgRating * 10) / 10,
        recentOrders: (recentOrders.data || []) as Stats["recentOrders"],
      });
    };
    fetchStats();
  }, []);

  const STATUT_COLORS: Record<string, string> = {
    en_attente: "warning",
    confirmee: "default",
    expediee: "default",
    livree: "success",
    annulee: "destructive",
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Produits"
          value={stats.totalProducts}
          icon={<Package className="w-5 h-5" />}
        />
        <StatsCard
          title="Total Commandes"
          value={stats.totalOrders}
          icon={<ShoppingCart className="w-5 h-5" />}
          change={`${stats.pendingOrders} en attente`}
          changeType={stats.pendingOrders > 0 ? "negative" : "neutral"}
        />
        <StatsCard
          title="Chiffre d'Affaires"
          value={formatPrice(stats.totalRevenue)}
          icon={<Star className="w-5 h-5" />}
        />
        <StatsCard
          title="Messages Non Lus"
          value={stats.unreadMessages}
          icon={<MessageSquare className="w-5 h-5" />}
          changeType={stats.unreadMessages > 0 ? "negative" : "neutral"}
        />
      </div>

      {/* Recent Orders */}
      <div className="rounded-xl border border-dark-200 bg-dark-50 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-lg text-white">Commandes Récentes</h2>
          <Link href="/admin/commandes" className="text-sm text-gold hover:underline">
            Voir tout
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-200">
                <th className="px-4 py-2 text-left text-xs text-dark-500 uppercase">Client</th>
                <th className="px-4 py-2 text-left text-xs text-dark-500 uppercase">Total</th>
                <th className="px-4 py-2 text-left text-xs text-dark-500 uppercase">Statut</th>
                <th className="px-4 py-2 text-left text-xs text-dark-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-200">
              {stats.recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-3 text-sm text-white">{order.client_nom}</td>
                  <td className="px-4 py-3 text-sm text-gold">{formatPrice(order.total)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={(STATUT_COLORS[order.statut] as "warning") || "default"}>
                      {order.statut}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-dark-500">
                    {new Date(order.created_at).toLocaleDateString("fr-FR")}
                  </td>
                </tr>
              ))}
              {stats.recentOrders.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-dark-500 text-sm">
                    Aucune commande
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
