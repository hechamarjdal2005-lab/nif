"use client";

import { useEffect, useState } from "react";
import { Check, X, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/star-rating";
import { createClient } from "@/lib/supabase/client";
import type { Testimonial } from "@/lib/types";

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTestimonials = async () => {
    const supabase = createClient();
    const { data } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
    setTestimonials((data || []) as unknown as Testimonial[]);
    setLoading(false);
  };

  useEffect(() => { fetchTestimonials(); }, []);

  const handleApprove = async (id: string) => {
    const supabase = createClient();
    await supabase.from("testimonials").update({ is_approved: true }).eq("id", id);
    setTestimonials((prev) => prev.map((t) => t.id === id ? { ...t, is_approved: true } : t));
  };

  const handleReject = async (id: string) => {
    const supabase = createClient();
    await supabase.from("testimonials").update({ is_approved: false }).eq("id", id);
    setTestimonials((prev) => prev.map((t) => t.id === id ? { ...t, is_approved: false } : t));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce témoignage ?")) return;
    const supabase = createClient();
    await supabase.from("testimonials").delete().eq("id", id);
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
  };

  if (loading) {
    return <div className="animate-pulse space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-24 bg-dark-100 rounded" />)}</div>;
  }

  return (
    <div className="space-y-6">
      <p className="text-dark-500 text-sm">{testimonials.length} témoignage(s)</p>

      <div className="space-y-4">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="p-4 rounded-xl border border-dark-200 bg-dark-50 flex items-start justify-between gap-4"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <StarRating rating={t.rating} size="sm" />
                <Badge variant={t.is_approved ? "success" : "outline"}>
                  {t.is_approved ? "Approuvé" : "En attente"}
                </Badge>
              </div>
              <p className="text-white text-sm font-medium">{t.nom}</p>
              {t.ville && <p className="text-dark-500 text-xs">{t.ville}</p>}
              <p className="text-dark-500 text-sm mt-2 italic">&ldquo;{t.texte}&rdquo;</p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              {!t.is_approved && (
                <button
                  onClick={() => handleApprove(t.id)}
                  className="p-2 text-dark-500 hover:text-green-400 transition-colors"
                  title="Approuver"
                >
                  <Check className="w-5 h-5" />
                </button>
              )}
              {t.is_approved && (
                <button
                  onClick={() => handleReject(t.id)}
                  className="p-2 text-dark-500 hover:text-yellow-400 transition-colors"
                  title="Rejeter"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => handleDelete(t.id)}
                className="p-2 text-dark-500 hover:text-red-400 transition-colors"
                title="Supprimer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {testimonials.length === 0 && (
          <p className="text-center text-dark-500 py-8">Aucun témoignage</p>
        )}
      </div>
    </div>
  );
}
