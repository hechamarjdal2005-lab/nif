"use client";

import { useEffect, useState } from "react";
import { StarRating } from "@/components/ui/star-rating";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/language-context";
import { getTranslation, getLocalizedField } from "@/lib/i18n";
import type { Testimonial } from "@/lib/types";

export function Testimonials() {
  const { locale } = useLanguage();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const ar = locale === "ar";

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
      <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <Skeleton className="h-10 w-64 mx-auto mb-4 bg-surface-container-low" />
          <Skeleton className="h-5 w-96 mx-auto bg-surface-container-low" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 rounded-xl bg-surface-container-low" />
          ))}
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) return null;

  return (
    <section id="temoignages" className="py-16 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="text-center mb-8 sm:mb-10">
        <h2 className={`font-heading text-on-background text-2xl sm:text-4xl mb-2.5 sm:mb-3 ${ar ? "font-arabic section-heading-slide-rtl" : "section-heading-slide"}`}>{getTranslation(locale, "testimonials.title")}</h2>
        <p className={`text-secondary text-sm sm:text-base max-w-xl mx-auto ${ar ? "font-arabic" : ""}`}>
          {getTranslation(locale, "testimonials.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="bg-background border border-outline-variant/40 rounded-lg sm:rounded-xl p-4 sm:p-6 hover:border-primary/20 transition-all duration-300"
          >
            <StarRating rating={t.rating} size="sm" className="mb-4" />
            <p className={`text-secondary text-sm leading-relaxed mb-4 italic ${ar ? "font-arabic" : ""}`}>
              &ldquo;{getLocalizedField(t as unknown as Record<string, unknown>, "texte", locale)}&rdquo;
            </p>
            <div>
              <p className={`text-on-background font-medium text-sm ${ar ? "font-arabic" : ""}`}>{getLocalizedField(t as unknown as Record<string, unknown>, "nom", locale)}</p>
              {t.ville && <p className={`text-secondary text-xs ${ar ? "font-arabic" : ""}`}>{getLocalizedField(t as unknown as Record<string, unknown>, "ville", locale)}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
