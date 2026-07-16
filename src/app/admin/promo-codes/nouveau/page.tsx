"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type PromoFormData = {
  code: string;
  type_reduction: string;
  valeur: number;
  date_debut: string;
  date_fin: string;
  usage_max: number | undefined;
}

export default function AdminNewPromoCodePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<PromoFormData>({
    defaultValues: {
      type_reduction: "pourcentage",
      date_debut: new Date().toISOString().split("T")[0],
      date_fin: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    },
  });

  const typeValue = watch("type_reduction");

  const onSubmit = async (data: PromoFormData) => {
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("promo_codes").insert({
        code: data.code.toUpperCase(),
        type_reduction: data.type_reduction,
        valeur: data.valeur,
        date_debut: data.date_debut,
        date_fin: data.date_fin,
        usage_max: data.usage_max || null,
        actif: true,
        usage_count: 0,
      });
      if (error) throw error;
      router.push("/admin/promo-codes");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur lors de la création.";
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg">
      <Link href="/admin/promo-codes" className="inline-flex items-center text-dark-500 hover:text-gold text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Retour
      </Link>

      <h2 className="font-heading text-2xl text-white mb-6">Nouveau Code Promo</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm text-dark-500 mb-1">Code *</label>
          <Input {...register("code", { required: true })} placeholder="EX: BIENVENUE10" className="bg-dark font-mono uppercase" />
          {errors.code && <p className="text-red-400 text-xs mt-1">Code requis</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-dark-500 mb-1">Type de réduction *</label>
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
            <label className="block text-sm text-dark-500 mb-1">
              Valeur * {typeValue === "pourcentage" ? "(%)" : "(MAD)"}
            </label>
            <Input
              type="number"
              step="0.01"
              {...register("valeur", { required: true, valueAsNumber: true, min: 0.01 })}
              className="bg-dark"
            />
            {errors.valeur && <p className="text-red-400 text-xs mt-1">Valeur requise</p>}
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
          <label className="block text-sm text-dark-500 mb-1">Utilisations max (optionnel)</label>
          <Input type="number" {...register("usage_max", { valueAsNumber: true })} placeholder="Illimité" className="bg-dark" />
        </div>

        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Création..." : "Créer le Code Promo"}
        </Button>
      </form>
    </div>
  );
}
