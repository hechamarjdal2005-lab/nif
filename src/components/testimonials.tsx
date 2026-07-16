"use client";

import { useEffect, useState } from "react";
import { StarRating } from "@/components/ui/star-rating";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/client";
import type { Testimonial } from "@/lib/types";

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_approved", true)
        .order("created_at", { ascending: false })
        .limit(6);
      setTestimonials(data || []);
      setLoading(false);
    };
    fetchTestimonials();
  }, []);

  if (loading) {
    return (
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Skeleton className="h-10 w-64 mx-auto mb-4" />
          <Skeleton className="h-5 w-96 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) return null;

  return (
    <section id="temoignages" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="font-heading text-3xl sm:text-4xl gold-text mb-4">Ce Que Disent Nos Clients</h2>
        <p className="text-dark-500 max-w-xl mx-auto">
          Des mots précieux de ceux qui ont découvert nos créations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="p-6 rounded-xl border border-dark-200 bg-dark-50 hover:border-gold/20 transition-all duration-300"
          >
            <StarRating rating={t.rating} size="sm" className="mb-4" />
            <p className="text-dark-500 text-sm leading-relaxed mb-4 italic">
              &ldquo;{t.texte}&rdquo;
            </p>
            <div>
              <p className="text-white font-medium text-sm">{t.nom}</p>
              {t.ville && <p className="text-dark-500 text-xs">{t.ville}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
