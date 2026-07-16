"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PromoFormData {
  code: string;
  type_reduction: string;
  valeur: number;
  date_debut: string;
  date_fin: string;
  usage_max: number | undefined;
}

export default function AdminEditPromoCodePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, reset } = useForm<PromoFormData>();

  useEffect(() => {
    const fetchCode = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("promo_codes").select("*").eq("id", id).single();
      if (data) {
        reset({
          code: data.code,
          type_reduction: data.type_reduction,
          valeur: data.valeur,
          date_debut: data.date_debut.split("T")[0],
          date_fin: data.date_fin.split("T")[0],
          usage_max: data.usage_max || undefined,
        });
      }
      setLoading(false);
    };
    fetchCode();
  }, [id, reset]);

  const onSubmit = async (data: PromoFormData) => {
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("promo_codes")
        .update({
          code: data.code.toUpperCase(),
          type_reduction: data.type_reduction,
          valeur: data.valeur,
          date_debut: data.date_debut,
          date_fin: data.date_fin,
          usage_max: data.usage_max || null,
        })
        .eq("id", id);
      if (error) throw error;
      router.push("/admin/promo-codes");
    } catch {
      alert("Erreur lors de la mise à jour.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-12 bg-dark-100 rounded" />)}</div>;
  }

  return (
    <div className="max-w-lg">
      <Link href="/admin/promo-codes" className="inline-flex items-center text-dark-500 hover:text-gold text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Retour
      </Link>

      <h2 className="font-heading text-2xl text-white mb-6">Modifier le Code Promo</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm text-dark-500 mb-1">Code *</label>
          <Input {...register("code", { required: true })} className="bg-dark font-mono uppercase" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-dark-500 mb-1">Type *</label>
            <Select
              options={[
                { value: "pourcentage", label: "Pourcentage (%)" },
                { value: "montant_fixe", label: "Montant fixe (MAD)" },
              ]}
              {...register("type_reduction")}
              className="bg-dark"
            />
          </div>
          <div>
            <label className="block text-sm text-dark-500 mb-1">Valeur *</label>
            <Input type="number" step="0.01" {...register("valeur", { required: true, valueAsNumber: true })} className="bg-dark" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-dark-500 mb-1">Date début *</label>
            <Input type="date" {...register("date_debut", { required: true })} className="bg-dark" />
          </div>
          <div>
            <label className="block text-sm text-dark-500 mb-1">Date fin *</label>
            <Input type="date" {...register("date_fin", { required: true })} className="bg-dark" />
          </div>
        </div>

        <div>
          <label className="block text-sm text-dark-500 mb-1">Utilisations max</label>
          <Input type="number" {...register("usage_max", { valueAsNumber: true })} className="bg-dark" />
        </div>

        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Sauvegarde..." : "Sauvegarder"}
        </Button>
      </form>
    </div>
  );
}
