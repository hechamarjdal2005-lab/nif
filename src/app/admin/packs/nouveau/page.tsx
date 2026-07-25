"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { ArrowLeft, ImagePlus, X, Plus, Minus } from "lucide-react";
import Link from "next/link";
import { GENRES } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/types";

type PackFormData = {
  nom: string;
  nom_ar: string;
  description: string;
  description_ar: string;
  prix: number;
  categorie_id: string;
  genre: string;
  stock: number;
  is_bestseller: boolean;
  is_new: boolean;
}

interface PackItemSelection {
  product_id: string;
  quantite: number;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

function slugify(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

function sanitizeFilename(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9.-]/g, "_").replace(/_{2,}/g, "_");
}

export default function AdminNewPackPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Array<{ id: string; nom: string }>>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [packItems, setPackItems] = useState<PackItemSelection[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [promoCodes, setPromoCodes] = useState<Array<{ id: string; code: string }>>([]);
  const [promoCodeId, setPromoCodeId] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<PackFormData>({
    defaultValues: {
      genre: "homme",
      stock: 10,
      is_bestseller: false,
      is_new: false,
    },
  });

  const watchedPrix = watch("prix");

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const [catsRes, productsRes, promoRes] = await Promise.all([
        supabase.from("categories").select("id, nom").eq("type", "pack").order("nom"),
        supabase.from("products").select("id, nom, prix, images").eq("type", "parfum").order("nom"),
        supabase.from("promo_codes").select("id, code").eq("actif", true).order("code"),
      ]);
      setCategories(catsRes.data || []);
      setAllProducts((productsRes.data || []) as unknown as Product[]);
      setPromoCodes(promoRes.data || []);
    };
    fetchData();
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

  const addPackItem = () => {
    setPackItems((prev) => [...prev, { product_id: "", quantite: 1 }]);
  };

  const removePackItem = (index: number) => {
    setPackItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updatePackItem = (index: number, field: "product_id" | "quantite", value: string | number) => {
    setPackItems((prev) => prev.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const onSubmit = async (data: PackFormData) => {
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
        nom_ar: data.nom_ar || null,
        slug: slugify(data.nom),
        description: data.description || null,
        description_ar: data.description_ar || null,
        prix: data.prix,
        categorie_id: data.categorie_id || null,
        genre: data.genre,
        type: "pack",
        stock: data.stock,
        is_bestseller: data.is_bestseller,
        is_new: data.is_new,
        images: imageUrl ? [imageUrl] : [],
      });
      if (error) throw error;

      const { data: newPack } = await supabase
        .from("products")
        .select("id")
        .eq("slug", slugify(data.nom))
        .single();

      if (newPack) {
        const validItems = packItems.filter((item) => item.product_id && item.quantite > 0);
        if (validItems.length > 0) {
          const { error: itemsError } = await supabase.from("pack_items").insert(
            validItems.map((item) => ({
              pack_id: newPack.id,
              produit_id: item.product_id,
              quantite: item.quantite,
            }))
          );
          if (itemsError) throw itemsError;
        }

        if (promoCodeId) {
          await supabase.from("promo_codes").update({ produit_id: newPack.id }).eq("id", promoCodeId);
        }
      }

      router.push("/admin/packs");
    } catch {
      alert("Erreur lors de la création du pack.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalContents = packItems.reduce((sum, item) => {
    const product = allProducts.find((p) => p.id === item.product_id);
    return sum + (product?.prix || 0) * item.quantite;
  }, 0);

  return (
    <div className="max-w-2xl">
      <Link href="/admin/packs" className="inline-flex items-center text-dark-500 hover:text-gold text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Retour
      </Link>

      <h2 className="font-heading text-2xl text-white mb-6">Nouveau Pack</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm text-dark-500 mb-1">Image du pack</label>
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
          <Input {...register("nom", { required: true })} placeholder="Nom du pack" className="bg-dark" />
          {errors.nom && <p className="text-red-400 text-xs mt-1">Nom requis</p>}
        </div>

        <div>
          <label className="block text-sm text-dark-500 mb-1">Nom (AR) <span className="text-dark-400">العربية</span></label>
          <Input {...register("nom_ar")} placeholder="اسم الحزمة" className="bg-dark" dir="rtl" />
        </div>

        <div>
          <label className="block text-sm text-dark-500 mb-1">Description</label>
          <Textarea {...register("description")} rows={4} placeholder="Description du pack..." className="bg-dark" />
        </div>

        <div>
          <label className="block text-sm text-dark-500 mb-1">Description (AR) <span className="text-dark-400">العربية</span></label>
          <Textarea {...register("description_ar")} rows={4} placeholder="وصف الحزمة..." className="bg-dark" dir="rtl" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-dark-500 mb-1">Genre *</label>
            <Select options={GENRES} {...register("genre")} className="bg-dark" />
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

        {/* Pack Items */}
        <div className="border border-dark-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm text-dark-500 font-medium">Produits dans le pack</label>
            <button
              type="button"
              onClick={addPackItem}
              className="flex items-center gap-1 text-xs text-gold hover:text-gold-400 transition-colors"
            >
              <Plus className="w-3 h-3" />
              Ajouter
            </button>
          </div>

          {packItems.length === 0 && (
            <p className="text-dark-400 text-xs">Aucun produit ajouté. Cliquez sur &quot;Ajouter&quot; pour commencer.</p>
          )}

          {packItems.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <select
                value={item.product_id}
                onChange={(e) => updatePackItem(index, "product_id", e.target.value)}
                className="flex-1 bg-dark border border-dark-200 rounded-lg px-3 py-2 text-sm text-white"
              >
                <option value="">Choisir un produit...</option>
                {allProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nom} — {formatPrice(p.prix)}
                  </option>
                ))}
              </select>
              <div className="flex items-center border border-dark-200 rounded-lg">
                <button
                  type="button"
                  onClick={() => updatePackItem(index, "quantite", Math.max(1, item.quantite - 1))}
                  className="p-1.5 text-dark-500 hover:text-white"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-8 text-center text-sm text-white">{item.quantite}</span>
                <button
                  type="button"
                  onClick={() => updatePackItem(index, "quantite", item.quantite + 1)}
                  className="p-1.5 text-dark-500 hover:text-white"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => removePackItem(index)}
                className="p-1.5 text-dark-500 hover:text-red-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}

          {packItems.length > 0 && (
            <div className="pt-2 border-t border-dark-200 flex justify-between text-xs text-dark-500">
              <span>Total séparé : {formatPrice(totalContents)}</span>
              <span className="text-green-400">
                Économie : {formatPrice(Math.max(0, totalContents - (watchedPrix || 0)))}
              </span>
            </div>
          )}
        </div>

        {/* Promo Code */}
        <div>
          <label className="block text-sm text-dark-500 mb-1">Code Promo (optionnel)</label>
          <select
            value={promoCodeId}
            onChange={(e) => setPromoCodeId(e.target.value)}
            className="w-full bg-dark border border-dark-200 rounded-lg px-3 py-2 text-sm text-white"
          >
            <option value="">Aucun</option>
            {promoCodes.map((pc) => (
              <option key={pc.id} value={pc.id}>{pc.code}</option>
            ))}
          </select>
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
          {isUploadingImage ? "Upload de l'image..." : isSubmitting ? "Création..." : "Créer le Pack"}
        </Button>
      </form>
    </div>
  );
}
