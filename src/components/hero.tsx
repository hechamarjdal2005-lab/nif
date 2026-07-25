"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SITE_NAME } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/language-context";
import { getTranslation, getLocalizedField } from "@/lib/i18n";

type HeroContent = {
  subtitle: string;
  title: string;
  description: string;
  button_primary_text: string;
  button_primary_link: string;
  button_secondary_text: string;
  button_secondary_link: string;
  background_image_url: string;
};

const FALLBACK: HeroContent = {
  subtitle: "Parfumerie Artisanale Marocaine",
  title: SITE_NAME,
  description: "L\u2019art de la parfumerie marocaine, sublimé par des créations uniques qui racontent l\u2019histoire de notre héritage.",
  button_primary_text: "Explore Collection",
  button_primary_link: "/collection",
  button_secondary_text: "Our Story",
  button_secondary_link: "/#notre-histoire",
  background_image_url: "",
};

export function Hero() {
  const { locale } = useLanguage();
  const [content, setContent] = useState<HeroContent>(FALLBACK);
  const isAr = locale === "ar";

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("site_content")
      .select("content")
      .eq("section", "hero")
      .single()
      .then(({ data }) => {
        if (data) {
          setContent({ ...FALLBACK, ...data.content });
        }
      });
  }, []);

  return (
    <section className={`hero-section relative min-h-[460px] sm:min-h-[500px] lg:min-h-[540px] flex items-center overflow-hidden py-20 sm:py-24 lg:py-28 ${isAr ? "hero-section-rtl" : ""}`}>
      {/* Background image */}
      {content.background_image_url ? (
        <div className="absolute inset-0">
          <img
            src={content.background_image_url}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      ) : null}

      {/* Gradient overlay — cream left → transparent right */}
      <div className="hero-overlay absolute inset-0 z-[1]" />

      {/* Content — left aligned */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className={`max-w-xl ${isAr ? "dir-rtl ml-auto text-right" : ""}`} dir={isAr ? "rtl" : undefined}>
          {/* Tagline */}
          <p className={`hero-reveal font-body text-primary text-[10px] sm:text-xs uppercase tracking-[0.16em] mb-2.5 sm:mb-3 font-medium ${isAr ? "font-arabic tracking-normal" : ""}`}>
            {getLocalizedField(content, "subtitle", locale) || getTranslation(locale, "hero.subtitle")}
          </p>

          {/* Title */}
          <h1 className="hero-reveal-delay-1 font-heading text-on-background text-[32px] sm:text-[38px] lg:text-[46px] leading-[1.02] tracking-normal mb-3 sm:mb-4 font-medium">
            {getLocalizedField(content, "title", locale)}
          </h1>

          {/* Description */}
          <p className={`hero-reveal-delay-2 font-body text-secondary text-sm sm:text-[15px] leading-relaxed mb-5 sm:mb-6 max-w-md font-normal ${isAr ? "font-arabic ml-auto" : ""}`}>
            {getLocalizedField(content, "description", locale) || getTranslation(locale, "hero.description")}
          </p>

          {/* Buttons */}
          <div className={`hero-reveal-delay-3 flex flex-col sm:flex-row gap-2.5 sm:gap-3 ${isAr ? "items-end sm:justify-end" : "items-start"}`}>
            <Link
              href={content.button_primary_link}
              className={`inline-flex items-center justify-center px-6 py-3 bg-primary text-on-primary font-body text-xs uppercase tracking-[0.14em] font-medium rounded-none hover:opacity-90 transition-all duration-300 shadow-lg shadow-primary/10 ${isAr ? "font-arabic tracking-normal" : ""}`}
            >
              {getLocalizedField(content, "button_primary_text", locale) || getTranslation(locale, "hero.btnDiscover")}
            </Link>
            <Link
              href={content.button_secondary_link}
              className={`inline-flex items-center justify-center px-6 py-3 border border-primary text-primary font-body text-xs uppercase tracking-[0.14em] font-medium rounded-none hover:bg-primary hover:text-on-primary transition-all duration-300 ${isAr ? "font-arabic tracking-normal" : ""}`}
            >
              {getLocalizedField(content, "button_secondary_text", locale) || getTranslation(locale, "hero.btnCollection")}
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 hidden sm:block">
        <div className="w-4 h-7 rounded-full border-2 border-primary/30 flex justify-center pt-1.5">
          <div className="w-1 h-2 bg-primary/60 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
