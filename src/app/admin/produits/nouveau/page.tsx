"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { ArrowLeft, ImagePlus, X } from "lucide-react";
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

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

function slugify(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

function sanitizeFilename(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9.-]/g, "_").replace(/_{2,}/g, "_");
}

export default function AdminNewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Array<{ id: string; nom: string }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setUploadError("Format invalide. Utilisez JPEG, PNG, WebP ou AVIF.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setUploadError("Le fichier dépasse 5 Mo.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const uploadImage = async (supabase: ReturnType<typeof createClient>): Promise<string | null> => {
    if (!imageFile) return null;

    setIsUploadingImage(true);
    try {
      const ext = imageFile.name.split(".").pop() || "jpg";
      const filename = `${Date.now()}-${sanitizeFilename(imageFile.name.replace(/\.[^.]+$/, ""))}.${ext}`;

      const { error } = await supabase.storage
        .from("product-images")
        .upload(filename, imageFile, { contentType: imageFile.type, upsert: false });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(filename);

      return urlData.publicUrl;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      if (message.includes("quota") || message.includes("storage")) {
        setUploadError("Espace de stockage insuffisant.");
      } else {
        setUploadError(`Erreur lors de l'upload : ${message}`);
      }
      return null;
    } finally {
      setIsUploadingImage(false);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      const supabase = createClient();

      let imageUrl: string | null = null;
      if (imageFile) {
        imageUrl = await uploadImage(supabase);
        if (imageFile && !imageUrl) return;
      }

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
        images: imageUrl ? [imageUrl] : [],
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
          <label className="block text-sm text-dark-500 mb-1">Image du produit</label>
          <div className="flex flex-col gap-3">
            {imagePreview ? (
              <div className="relative inline-block w-fit">
                <img src={imagePreview} alt="Aperçu" className="h-40 w-40 object-cover rounded-lg border border-dark-200" />
                <button type="button" onClick={removeImage} className="absolute -top-2 -right-2 bg-dark-100 border border-dark-200 rounded-full p-1 text-red-400 hover:text-red-300 transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-dark-200 rounded-lg cursor-pointer hover:border-gold/50 transition-colors">
                <ImagePlus className="w-8 h-8 text-dark-500 mb-2" />
                <span className="text-sm text-dark-500">Choisir une image</span>
                <span className="text-xs text-dark-400 mt-1">JPEG, PNG, WebP ou AVIF — max 5 Mo</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
            {uploadError && <p className="text-red-400 text-xs">{uploadError}</p>}
          </div>
        </div>

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

        <Button type="submit" size="lg" disabled={isSubmitting || isUploadingImage}>
          {isUploadingImage ? "Upload de l'image..." : isSubmitting ? "Création..." : "Créer le Produit"}
        </Button>
      </form>
    </div>
  );
}
