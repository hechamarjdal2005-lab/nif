"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/language-context";
import { getTranslation, getLocalizedField } from "@/lib/i18n";

type HistoireContent = {
  section_label: string;
  title: string;
  paragraphs: string[];
  paragraphs_ar?: string[];
  images: string[];
};

const FALLBACK: HistoireContent = {
  section_label: "Notre Histoire",
  title: "Un Héritage de L'Art Parfumeur",
  paragraphs: [
    "Fondée au cœur de Marrakech, Maison Nif Chrif perpétue la tradition millénaire de la parfumerie marocaine. Nos créations naissent de la rencontre entre les essences les plus précieuses du Royaume et un savoir-faire artisanal transmis de génération en génération.",
    "Chaque flacon raconte une histoire — celle des souks animés, des jardins secrets, et des paysages grandioses du Maroc. Nous sélectionnons méticuleusement chaque ingrédient, de l'oud du Souss à la rose de Kelaat M'Gouna, pour créer des parfums qui évoquent l'âme du Maroc.",
    "Notre engagement : vous offrir des fragrances d'exception, alliant tradition et modernité, dans le respect de l'artisanat et de la nature.",
  ],
  images: ["", "", "", ""],
};

const PLACEHOLDER_SYMBOLS = ["✦", "◆", "◆", "✦"];
const PLACEHOLDER_SIZES = ["text-5xl", "text-3xl", "text-3xl", "text-5xl"];
const ASPECT_CLASSES = ["aspect-[3/4]", "aspect-square", "aspect-square", "aspect-[3/4]"];

export function NotreHistoire() {
  const { locale } = useLanguage();
  const [content, setContent] = useState<HistoireContent>(FALLBACK);
  const isAr = locale === "ar";

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("site_content")
      .select("content")
      .eq("section", "notre_histoire")
      .single()
      .then(({ data }) => {
        if (data) {
          setContent({ ...FALLBACK, ...data.content });
        }
      });
  }, []);

  const paragraphs = isAr && content.paragraphs_ar ? content.paragraphs_ar : content.paragraphs;

  return (
    <section id="notre-histoire" className="py-16 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Text */}
        <div>
          <p className={`text-primary text-[10px] sm:text-xs uppercase tracking-[0.16em] sm:tracking-[0.2em] mb-2.5 sm:mb-3 font-medium ${isAr ? "font-arabic tracking-normal" : ""}`}>
            {getLocalizedField(content, "section_label", locale) || getTranslation(locale, "notreHistoire.label")}
          </p>
          <h2 className={`font-heading text-on-background text-2xl sm:text-4xl leading-tight font-medium mb-3 sm:mb-4 ${isAr ? "font-arabic section-side-reveal-rtl" : "section-side-reveal"}`}>
            {getLocalizedField(content, "title", locale) || getTranslation(locale, "notreHistoire.title")}
          </h2>
          <div className={`space-y-2.5 sm:space-y-3 text-secondary text-sm sm:text-base leading-relaxed ${isAr ? "font-arabic" : ""}`}>
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-3">
            {[0, 1].map((i) => (
              <div key={i} className={`${ASPECT_CLASSES[i]} bg-surface-container-low border border-outline-variant/40 rounded-xl overflow-hidden flex items-center justify-center`}>
                {content.images[i] ? (
                  <img src={content.images[i]} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className={`text-outline-variant ${PLACEHOLDER_SIZES[i]}`}>{PLACEHOLDER_SYMBOLS[i]}</span>
                )}
              </div>
            ))}
          </div>
          <div className="space-y-3 pt-6">
            {[2, 3].map((i) => (
              <div key={i} className={`${ASPECT_CLASSES[i]} bg-surface-container-low border border-outline-variant/40 rounded-xl overflow-hidden flex items-center justify-center`}>
                {content.images[i] ? (
                  <img src={content.images[i]} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className={`text-outline-variant ${PLACEHOLDER_SIZES[i]}`}>{PLACEHOLDER_SYMBOLS[i]}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
