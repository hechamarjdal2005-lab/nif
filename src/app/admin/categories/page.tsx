"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import type { Category } from "@/lib/types";

function slugify(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

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
      .insert({ nom: newName.trim(), slug: slugify(newName.trim()) })
      .select()
      .single();
    if (data) setCategories((prev) => [...prev, data as unknown as Category].sort((a, b) => a.nom.localeCompare(b.nom)));
    setNewName("");
  };

  const handleUpdate = async (id: string) => {
    if (!editingName.trim()) return;
    const supabase = createClient();
    await supabase
      .from("categories")
      .update({ nom: editingName.trim(), slug: slugify(editingName.trim()) })
      .eq("id", id);
    setCategories((prev) => prev.map((c) => c.id === id ? { ...c, nom: editingName.trim(), slug: slugify(editingName.trim()) } : c));
    setEditingId(null);
    setEditingName("");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette catégorie ?")) return;
    const supabase = createClient();
    await supabase.from("categories").delete().eq("id", id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  if (loading) {
    return <div className="animate-pulse space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-12 bg-dark-100 rounded" />)}</div>;
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="font-heading text-2xl text-white">Catégories</h2>

      {/* Add new */}
      <div className="flex gap-2">
        <Input
          placeholder="Nouvelle catégorie..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          className="bg-dark"
        />
        <Button onClick={handleAdd} disabled={!newName.trim()}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* List */}
      <div className="space-y-2">
        {categories.map((cat) => (
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
                <button onClick={() => handleUpdate(cat.id)} className="p-2 text-green-400 hover:text-green-300">
                  <Check className="w-4 h-4" />
                </button>
                <button onClick={() => { setEditingId(null); setEditingName(""); }} className="p-2 text-dark-500 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <span className="flex-1 text-white text-sm">{cat.nom}</span>
                <span className="text-xs text-dark-500">{cat.slug}</span>
                <button
                  onClick={() => { setEditingId(cat.id); setEditingName(cat.nom); }}
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
