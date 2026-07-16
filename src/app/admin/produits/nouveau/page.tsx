"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { GENRES, PRODUCT_TYPES } from "@/lib/constants";

type ProductFormData = {
  nom: string;
  slug: string;
  description: string;
  notes_olfactives: string;
  prix: number;
  categorie_id: string;
  genre: string;
  type: string;
  stock: number;
  is_bestseller: boolean;
  is_new: boolean;
}

function slugify(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

export default function AdminNewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Array<{ id: string; nom: string }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ProductFormData>({
    defaultValues: {
      genre: "homme",
      type: "parfum",
      stock: 0,
      is_bestseller: false,
      is_new: false,
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("categories").select("id, nom").order("nom");
      setCategories(data || []);
    };
    fetchCategories();
  }, []);

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("products").insert({
        nom: data.nom,
        slug: slugify(data.nom),
        description: data.description || null,
        notes_olfactives: data.notes_olfactives || null,
        prix: data.prix,
        categorie_id: data.categorie_id || null,
        genre: data.genre,
        type: data.type,
        stock: data.stock,
        is_bestseller: data.is_bestseller,
        is_new: data.is_new,
        images: [],
      });
      if (error) throw error;
      router.push("/admin/produits");
    } catch {
      alert("Erreur lors de la création.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <Link href="/admin/produits" className="inline-flex items-center text-dark-500 hover:text-gold text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Retour
      </Link>

      <h2 className="font-heading text-2xl text-white mb-6">Nouveau Produit</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm text-dark-500 mb-1">Nom *</label>
          <Input {...register("nom", { required: true })} placeholder="Nom du produit" className="bg-dark" />
          {errors.nom && <p className="text-red-400 text-xs mt-1">Nom requis</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-dark-500 mb-1">Genre *</label>
            <Select options={GENRES} {...register("genre")} className="bg-dark" />
          </div>
          <div>
            <label className="block text-sm text-dark-500 mb-1">Type *</label>
            <Select options={PRODUCT_TYPES} {...register("type")} className="bg-dark" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-dark-500 mb-1">Prix (MAD) *</label>
            <Input type="number" step="0.01" {...register("prix", { required: true, valueAsNumber: true })} className="bg-dark" />
            {errors.prix && <p className="text-red-400 text-xs mt-1">Prix requis</p>}
          </div>
          <div>
            <label className="block text-sm text-dark-500 mb-1">Stock</label>
            <Input type="number" {...register("stock", { valueAsNumber: true })} className="bg-dark" />
          </div>
        </div>

        <div>
          <label className="block text-sm text-dark-500 mb-1">Catégorie</label>
          <Select
            options={categories.map((c) => ({ value: c.id, label: c.nom }))}
            placeholder="Sélectionner..."
            {...register("categorie_id")}
            className="bg-dark"
          />
        </div>

        <div>
          <label className="block text-sm text-dark-500 mb-1">Notes Olfactives</label>
          <Input {...register("notes_olfactives")} placeholder="ex: Oud, Rose, Ambre" className="bg-dark" />
        </div>

        <div>
          <label className="block text-sm text-dark-500 mb-1">Description</label>
          <Textarea {...register("description")} rows={4} placeholder="Description du produit..." className="bg-dark" />
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-dark-500">
            <input type="checkbox" {...register("is_bestseller")} className="accent-gold" />
            Best Seller
          </label>
          <label className="flex items-center gap-2 text-sm text-dark-500">
            <input type="checkbox" {...register("is_new")} className="accent-gold" />
            Nouveau
          </label>
        </div>

        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Création..." : "Créer le Produit"}
        </Button>
      </form>
    </div>
  );
}
