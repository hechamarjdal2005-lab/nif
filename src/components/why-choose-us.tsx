"use client";

import { useEffect, useState } from "react";
import { Shield, Leaf, Award, Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/language-context";
import { getTranslation, getLocalizedField } from "@/lib/i18n";

const ICONS = [Leaf, Award, Shield, Heart];

type Card = { title: string; description: string };

type WhyChooseContent = {
  title: string;
  subtitle: string;
  cards: Card[];
  cards_ar?: Card[];
};

const FALLBACK: WhyChooseContent = {
  title: "Pourquoi Nous Choisir",
  subtitle: "L\u2019excellence à chaque étape de notre création",
  cards: [
    { title: "Ingrédients Nobles", description: "Sélection rigoureuse des meilleures essences naturelles du Maroc et du monde." },
    { title: "Savoir-Faire Artisanal", description: "Chaque parfum est composé à la main par nos maîtres parfumeurs." },
    { title: "Qualité Garantie", description: "Longue tenue et sillage exceptionnel, certifié par nos experts." },
    { title: "Héritage Marocain", description: "Une tradition parfumière millénaire revisited avec modernité." },
  ],
};

export function WhyChooseUs() {
  const { locale } = useLanguage();
  const [content, setContent] = useState<WhyChooseContent>(FALLBACK);
  const isAr = locale === "ar";

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("site_content")
      .select("content")
      .eq("section", "pourquoi_nous_choisir")
      .single()
      .then(({ data }) => {
        if (data) {
          setContent({ ...FALLBACK, ...data.content });
        }
      });
  }, []);

  const cards = isAr && content.cards_ar ? content.cards_ar : content.cards;

  return (
    <section className="py-16 px-4 sm:px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className={`font-heading text-on-background text-2xl sm:text-4xl leading-tight font-medium mb-2.5 sm:mb-3 ${isAr ? "font-arabic section-heading-slide-rtl" : "section-heading-slide"}`}>
            {getLocalizedField(content, "title", locale) || getTranslation(locale, "whyChooseUs.title")}
          </h2>
          <p className={`text-secondary text-sm sm:text-base max-w-xl mx-auto ${isAr ? "font-arabic" : ""}`}>
            {getLocalizedField(content, "subtitle", locale) || getTranslation(locale, "whyChooseUs.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {cards.map((feature, i) => {
            const Icon = ICONS[i] || Shield;
            return (
              <div
                key={feature.title}
                className="text-center bg-background border border-outline-variant/40 rounded-lg sm:rounded-xl p-3 sm:p-6 hover:border-primary/20 transition-all duration-300 hover-lift"
              >
                <div className="w-9 h-9 sm:w-11 sm:h-11 mx-auto mb-2 sm:mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                <h3 className={`font-heading text-on-background text-sm sm:text-base mb-1.5 sm:mb-2 ${isAr ? "font-arabic" : ""}`}>{feature.title}</h3>
                <p className={`text-xs sm:text-sm text-secondary leading-relaxed ${isAr ? "font-arabic" : ""}`}>{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
