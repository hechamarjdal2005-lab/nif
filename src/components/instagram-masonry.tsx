"use client";

import { useLanguage } from "@/lib/language-context";
import { getTranslation } from "@/lib/i18n";

export function InstagramMasonry() {
  const { locale } = useLanguage();
  const items = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    color: ["bg-surface-container-low", "bg-outline-variant/20", "bg-primary/5"][i % 3],
  }));

  return (
    <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className={`font-heading text-on-background text-3xl sm:text-4xl mb-3 ${locale === "ar" ? "font-arabic" : ""}`}>@MaisonNifChrif</h2>
        <p className={`text-secondary ${locale === "ar" ? "font-arabic" : ""}`}>{getTranslation(locale, "instagram.subtitle")}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {items.map((item) => (
          <div
            key={item.id}
            className={`aspect-square ${item.color} rounded-xl overflow-hidden relative group cursor-pointer`}
          >
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-all duration-300 flex items-center justify-center">
              <span className="text-primary text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                ✦
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
