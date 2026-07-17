"use client";

import { useEffect, useState } from "react";
import { Shield, Leaf, Award, Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const ICONS = [Leaf, Award, Shield, Heart];

type Card = { title: string; description: string };

type WhyChooseContent = {
  title: string;
  subtitle: string;
  cards: Card[];
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
  const [content, setContent] = useState<WhyChooseContent>(FALLBACK);

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

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-dark">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl gold-text mb-4">{content.title}</h2>
          <p className="text-dark-500 max-w-xl mx-auto">
            {content.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {content.cards.map((feature, i) => {
            const Icon = ICONS[i] || Shield;
            return (
              <div
                key={feature.title}
                className="text-center p-6 rounded-xl border border-dark-200 hover:border-gold/20 transition-all duration-300 hover-lift"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gold/10 flex items-center justify-center">
                  <Icon className="w-7 h-7 text-gold" />
                </div>
                <h3 className="font-heading text-lg text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-dark-500 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
