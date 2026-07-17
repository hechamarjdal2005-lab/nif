"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type HistoireContent = {
  section_label: string;
  title: string;
  paragraphs: string[];
  images: string[];
};

const FALLBACK: HistoireContent = {
  section_label: "Notre Histoire",
  title: "Un Héritage de L\u2019Art Parfumeur",
  paragraphs: [
    "Fondée au cœur de Marrakech, Maison Nif Chrif perpétue la tradition millénaire de la parfumerie marocaine. Nos créations naissent de la rencontre entre les essences les plus précieuses du Royaume et un savoir-faire artisanal transmis de génération en génération.",
    "Chaque flacon raconte une histoire — celle des souks animés, des jardins secrets, et des paysages grandioses du Maroc. Nous sélectionnons méticuleusement chaque ingrédient, de l\u2019oud du Souss à la rose de Kelaat M\u2019Gouna, pour créer des parfums qui évoquent l\u2019âme du Maroc.",
    "Notre engagement : vous offrir des fragrances d\u2019exception, alliant tradition et modernité, dans le respect de l\u2019artisanat et de la nature.",
  ],
  images: ["", "", "", ""],
};

const PLACEHOLDER_SYMBOLS = ["✦", "◆", "◆", "✦"];
const PLACEHOLDER_SIZES = ["text-5xl", "text-3xl", "text-3xl", "text-5xl"];
const ASPECT_CLASSES = ["aspect-[3/4]", "aspect-square", "aspect-square", "aspect-[3/4]"];

export function NotreHistoire() {
  const [content, setContent] = useState<HistoireContent>(FALLBACK);

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

  return (
    <section id="notre-histoire" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Text */}
        <div>
          <p className="text-gold text-sm uppercase tracking-[0.3em] mb-4 font-medium">{content.section_label}</p>
          <h2 className="font-heading text-3xl sm:text-4xl text-white mb-6 leading-tight">
            {content.title}
          </h2>
          <div className="space-y-4 text-dark-500 leading-relaxed">
            {content.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            {[0, 1].map((i) => (
              <div key={i} className={`${ASPECT_CLASSES[i]} bg-dark-50 border border-dark-200 rounded-xl overflow-hidden flex items-center justify-center`}>
                {content.images[i] ? (
                  <img src={content.images[i]} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className={`text-dark-300 ${PLACEHOLDER_SIZES[i]}`}>{PLACEHOLDER_SYMBOLS[i]}</span>
                )}
              </div>
            ))}
          </div>
          <div className="space-y-4 pt-8">
            {[2, 3].map((i) => (
              <div key={i} className={`${ASPECT_CLASSES[i]} bg-dark-50 border border-dark-200 rounded-xl overflow-hidden flex items-center justify-center`}>
                {content.images[i] ? (
                  <img src={content.images[i]} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className={`text-dark-300 ${PLACEHOLDER_SIZES[i]}`}>{PLACEHOLDER_SYMBOLS[i]}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
