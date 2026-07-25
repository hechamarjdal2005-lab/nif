"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, X, Check, ImagePlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { Category, CategoryType } from "@/lib/types";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const FEATURED_CATEGORY_SLUGS = ["homme", "femme", "cadeaux", "packs"] as const;

function slugify(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

function sanitizeFilename(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9.-]/g, "_").replace(/_{2,}/g, "_");
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [newNameAr, setNewNameAr] = useState("");
  const [newType, setNewType] = useState<CategoryType>("product");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingNameAr, setEditingNameAr] = useState("");
  const [editingType, setEditingType] = useState<CategoryType>("product");
  const [filterType, setFilterType] = useState<"all" | CategoryType>("all");
  const [uploadingCategoryId, setUploadingCategoryId] = useState<string | null>(null);
  const [imagePreviews, setImagePreviews] = useState<Record<string, string>>({});
  const [imageErrors, setImageErrors] = useState<Record<string, string>>({});

  const fetchCategories = async () => {
    const supabase = createClient();
    const { data } = await supabase.from("categories").select("*").order("nom");
    setCategories((data || []) as unknown as Category[]);
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    const supabase = createClient();
    const { data } = await supabase
      .from("categories")
      .insert({ nom: newName.trim(), nom_ar: newNameAr.trim() || null, slug: slugify(newName.trim()), type: newType })
      .select()
      .single();
    if (data) setCategories((prev) => [...prev, data as unknown as Category].sort((a, b) => a.nom.localeCompare(b.nom)));
    setNewName("");
    setNewNameAr("");
    setNewType("product");
  };

  const handleUpdate = async (id: string) => {
    if (!editingName.trim()) return;
    const supabase = createClient();
    await supabase
      .from("categories")
      .update({ nom: editingName.trim(), nom_ar: editingNameAr.trim() || null, slug: slugify(editingName.trim()), type: editingType })
      .eq("id", id);
    setCategories((prev) => prev.map((c) => c.id === id ? { ...c, nom: editingName.trim(), nom_ar: editingNameAr.trim() || null, slug: slugify(editingName.trim()), type: editingType } : c));
    setEditingId(null);
    setEditingName("");
    setEditingNameAr("");
    setEditingType("product");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette catégorie ?")) return;
    const supabase = createClient();
    await supabase.from("categories").delete().eq("id", id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const handleFeaturedImageUpload = async (category: Category, file: File) => {
    setImageErrors((prev) => ({ ...prev, [category.id]: "" }));

    if (!ALLOWED_TYPES.includes(file.type)) {
      setImageErrors((prev) => ({ ...prev, [category.id]: "Format invalide. Utilisez JPEG, PNG, WebP ou AVIF." }));
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setImageErrors((prev) => ({ ...prev, [category.id]: "Le fichier dépasse 5 Mo." }));
      return;
    }

    const preview = URL.createObjectURL(file);
    setImagePreviews((prev) => ({ ...prev, [category.id]: preview }));
    setUploadingCategoryId(category.id);

    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() || "jpg";
      const filename = `featured-categories/${category.slug}-${Date.now()}-${sanitizeFilename(file.name.replace(/\.[^.]+$/, ""))}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("site-assets").upload(filename, file, {
        contentType: file.type,
        upsert: false,
      });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("site-assets").getPublicUrl(filename);
      const imageUrl = data.publicUrl;
      const { error: updateError } = await supabase
        .from("categories")
        .update({ image_url: imageUrl })
        .eq("id", category.id);

      if (updateError) throw updateError;

      setCategories((prev) => prev.map((c) => (c.id === category.id ? { ...c, image_url: imageUrl } : c)));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload échoué.";
      setImageErrors((prev) => ({ ...prev, [category.id]: message }));
    } finally {
      setUploadingCategoryId(null);
      setImagePreviews((prev) => {
        const next = { ...prev };
        delete next[category.id];
        return next;
      });
      URL.revokeObjectURL(preview);
    }
  };

  if (loading) {
    return <div className="animate-pulse space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-12 bg-dark-100 rounded" />)}</div>;
  }

  const filtered = filterType === "all" ? categories : categories.filter((c) => (c.type || "product") === filterType);
  const featuredCategories = FEATURED_CATEGORY_SLUGS.map((slug) => categories.find((c) => c.slug === slug)).filter(
    (category): category is Category => Boolean(category)
  );

  return (
    <div className="max-w-5xl space-y-6">
      <h2 className="font-heading text-2xl text-white">Catégories</h2>

      {featuredCategories.length > 0 && (
        <section className="space-y-4 rounded-xl border border-dark-200 bg-dark-50 p-4">
          <div>
            <h3 className="font-heading text-lg text-white">Images des univers</h3>
            <p className="text-sm text-dark-500">Images de fond pour la section &quot;Découvrez Nos Univers&quot;.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredCategories.map((cat) => {
              const displayUrl = imagePreviews[cat.id] || cat.image_url || cat.image || "";
              const isUploading = uploadingCategoryId === cat.id;

              return (
                <div key={cat.id} className="space-y-3 rounded-lg border border-dark-200 bg-dark p-3">
                  <div className="relative h-36 overflow-hidden rounded-lg border border-dark-200 bg-dark-100">
                    {displayUrl ? (
                      <img src={displayUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <ImagePlus className="h-7 w-7 text-dark-500" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <p className="font-heading text-base text-white">{cat.nom}</p>
                      <p className="text-xs text-white/70">{cat.slug}</p>
                    </div>
                    {isUploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/45">
                        <Loader2 className="h-6 w-6 animate-spin text-white" />
                      </div>
                    )}
                  </div>

                  <label
                    className={cn(
                      "inline-flex h-9 w-full cursor-pointer items-center justify-center rounded-lg border border-gold text-xs font-medium text-gold transition-colors hover:bg-gold hover:text-dark",
                      isUploading && "pointer-events-none opacity-60"
                    )}
                  >
                    {isUploading ? "Upload..." : "Remplacer l'image"}
                    <input
                      type="file"
                      accept={ALLOWED_TYPES.join(",")}
                      className="hidden"
                      disabled={isUploading}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        e.currentTarget.value = "";
                        if (file) handleFeaturedImageUpload(cat, file);
                      }}
                    />
                  </label>

                  {imageErrors[cat.id] && <p className="text-xs text-red-400">{imageErrors[cat.id]}</p>}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Filter */}
      <div className="flex gap-2">
        {(["all", "product", "pack"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={cn(
              "px-3 py-1.5 text-xs rounded-lg border transition-colors",
              filterType === t
                ? "border-gold bg-gold/10 text-gold"
                : "border-dark-200 text-dark-500 hover:text-white hover:border-dark-300"
            )}
          >
            {t === "all" ? "Toutes" : t === "product" ? "Produits" : "Packs"}
          </button>
        ))}
      </div>

      {/* Add new */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            placeholder="Nouvelle catégorie..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            className="bg-dark flex-1"
          />
          <Input
            placeholder="الاسم بالعربية..."
            value={newNameAr}
            onChange={(e) => setNewNameAr(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            className="bg-dark flex-1"
            dir="rtl"
          />
          <select
            value={newType}
            onChange={(e) => setNewType(e.target.value as CategoryType)}
            className="bg-dark border border-dark-200 rounded-lg px-3 py-2 text-sm text-white"
          >
            <option value="product">Produit</option>
            <option value="pack">Pack</option>
          </select>
          <Button onClick={handleAdd} disabled={!newName.trim()}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-2">
        {filtered.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center gap-3 p-3 rounded-lg border border-dark-200 bg-dark-50"
          >
            {editingId === cat.id ? (
              <>
                <Input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleUpdate(cat.id)}
                  className="bg-dark flex-1"
                  autoFocus
                />
                <Input
                  value={editingNameAr}
                  onChange={(e) => setEditingNameAr(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleUpdate(cat.id)}
                  className="bg-dark flex-1"
                  dir="rtl"
                  placeholder="العربية"
                />
                <select
                  value={editingType}
                  onChange={(e) => setEditingType(e.target.value as CategoryType)}
                  className="bg-dark border border-dark-200 rounded-lg px-3 py-2 text-sm text-white"
                >
                  <option value="product">Produit</option>
                  <option value="pack">Pack</option>
                </select>
                <button onClick={() => handleUpdate(cat.id)} className="p-2 text-green-400 hover:text-green-300">
                  <Check className="w-4 h-4" />
                </button>
                <button onClick={() => { setEditingId(null); setEditingName(""); setEditingNameAr(""); setEditingType("product"); }} className="p-2 text-dark-500 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <span className="flex-1 text-white text-sm">{cat.nom}</span>
                {cat.nom_ar && <span className="text-dark-400 text-sm" dir="rtl">{cat.nom_ar}</span>}
                <span className={cn(
                  "text-xs px-2 py-0.5 rounded-full",
                  (cat.type || "product") === "pack" ? "bg-gold/10 text-gold" : "bg-dark-200 text-dark-500"
                )}>
                  {(cat.type || "product") === "pack" ? "Pack" : "Produit"}
                </span>
                <span className="text-xs text-dark-500">{cat.slug}</span>
                <button
                  onClick={() => { setEditingId(cat.id); setEditingName(cat.nom); setEditingNameAr(cat.nom_ar || ""); setEditingType(cat.type || "product"); }}
                  className="p-2 text-dark-500 hover:text-gold transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-2 text-dark-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
