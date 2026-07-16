"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, ToggleLeft, ToggleRight, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";
import type { PromoCode } from "@/lib/types";

export default function AdminPromoCodesPage() {
  const [codes, setCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCodes = async () => {
    const supabase = createClient();
    const { data } = await supabase.from("promo_codes").select("*").order("created_at", { ascending: false });
    setCodes((data || []) as unknown as PromoCode[]);
    setLoading(false);
  };

  useEffect(() => { fetchCodes(); }, []);

  const toggleActive = async (id: string, current: boolean) => {
    const supabase = createClient();
    await supabase.from("promo_codes").update({ actif: !current }).eq("id", id);
    setCodes((prev) => prev.map((c) => c.id === id ? { ...c, actif: !c.actif } : c));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce code promo ?")) return;
    const supabase = createClient();
    await supabase.from("promo_codes").delete().eq("id", id);
    setCodes((prev) => prev.filter((c) => c.id !== id));
  };

  const isExpired = (dateFin: string) => new Date(dateFin) < new Date();

  if (loading) {
    return <div className="animate-pulse space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-16 bg-dark-100 rounded" />)}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-dark-500 text-sm">{codes.length} code(s) promo</p>
        <Link href="/admin/promo-codes/nouveau">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Code
          </Button>
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-dark-200">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-200 bg-dark-50">
              <th className="px-4 py-3 text-left text-xs text-dark-500 uppercase">Code</th>
              <th className="px-4 py-3 text-left text-xs text-dark-500 uppercase">Type</th>
              <th className="px-4 py-3 text-left text-xs text-dark-500 uppercase">Valeur</th>
              <th className="px-4 py-3 text-left text-xs text-dark-500 uppercase">Validité</th>
              <th className="px-4 py-3 text-left text-xs text-dark-500 uppercase">Utilisations</th>
              <th className="px-4 py-3 text-left text-xs text-dark-500 uppercase">Statut</th>
              <th className="px-4 py-3 text-left text-xs text-dark-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-200">
            {codes.map((code) => (
              <tr key={code.id} className="hover:bg-dark-50/50 transition-colors">
                <td className="px-4 py-3 text-sm text-white font-mono font-bold">{code.code}</td>
                <td className="px-4 py-3 text-sm text-dark-500 capitalize">
                  {code.type_reduction === "pourcentage" ? "Pourcentage" : "Montant fixe"}
                </td>
                <td className="px-4 py-3 text-sm text-gold">
                  {code.type_reduction === "pourcentage" ? `${code.valeur}%` : formatPrice(code.valeur)}
                </td>
                <td className="px-4 py-3 text-xs text-dark-500">
                  {new Date(code.date_debut).toLocaleDateString("fr-FR")} — {new Date(code.date_fin).toLocaleDateString("fr-FR")}
                </td>
                <td className="px-4 py-3 text-sm text-dark-500">
                  {code.usage_count}{code.usage_max ? ` / ${code.usage_max}` : ""}
                </td>
                <td className="px-4 py-3">
                  {isExpired(code.date_fin) ? (
                    <Badge variant="destructive">Expiré</Badge>
                  ) : code.actif ? (
                    <Badge variant="success">Actif</Badge>
                  ) : (
                    <Badge variant="outline">Inactif</Badge>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleActive(code.id, code.actif)}
                      className="p-1.5 text-dark-500 hover:text-gold transition-colors"
                      title={code.actif ? "Désactiver" : "Activer"}
                    >
                      {code.actif ? <ToggleRight className="w-5 h-5 text-green-400" /> : <ToggleLeft className="w-5 h-5" />}
                    </button>
                    <Link href={`/admin/promo-codes/${code.id}`}>
                      <button className="p-1.5 text-dark-500 hover:text-gold transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(code.id)}
                      className="p-1.5 text-dark-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {codes.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-dark-500 text-sm">Aucun code promo</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
