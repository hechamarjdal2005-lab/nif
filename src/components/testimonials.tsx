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
        <div className="scrollbar-hide -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 w-[82%] shrink-0 snap-start rounded-xl bg-surface-container-low sm:w-[46%] md:w-auto md:shrink" />
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

      <div className="scrollbar-hide -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 sm:gap-5 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="w-[82%] shrink-0 snap-start bg-background border border-outline-variant/40 rounded-lg p-4 hover:border-primary/20 transition-all duration-300 sm:w-[46%] sm:rounded-xl sm:p-6 md:w-auto md:shrink"
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
