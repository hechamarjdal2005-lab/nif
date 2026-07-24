"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SITE_NAME } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";

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
  const [content, setContent] = useState<HeroContent>(FALLBACK);

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
    <section className="hero-section relative h-screen min-h-[700px] flex items-center overflow-hidden">
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
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="max-w-2xl">
          {/* Tagline */}
          <p className="hero-reveal font-body text-primary text-xs sm:text-sm uppercase tracking-[0.2em] mb-4 sm:mb-5 font-medium">
            {content.subtitle}
          </p>

          {/* Title */}
          <h1 className="hero-reveal-delay-1 font-heading text-on-background text-[36px] sm:text-[44px] lg:text-[52px] leading-[1.05] tracking-[-0.02em] mb-5 sm:mb-6 font-medium">
            {content.title}
          </h1>

          {/* Description */}
          <p className="hero-reveal-delay-2 font-body text-secondary text-base sm:text-lg leading-relaxed mb-8 sm:mb-10 max-w-lg font-normal">
            {content.description}
          </p>

          {/* Buttons */}
          <div className="hero-reveal-delay-3 flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
            <Link
              href={content.button_primary_link}
              className="inline-flex items-center justify-center px-8 py-3.5 bg-primary text-on-primary font-body text-sm uppercase tracking-[0.18em] font-medium rounded-none hover:opacity-90 transition-all duration-300 shadow-lg shadow-primary/10"
            >
              {content.button_primary_text}
            </Link>
            <Link
              href={content.button_secondary_link}
              className="inline-flex items-center justify-center px-8 py-3.5 border border-primary text-primary font-body text-sm uppercase tracking-[0.18em] font-medium rounded-none hover:bg-primary hover:text-on-primary transition-all duration-300"
            >
              {content.button_secondary_text}
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="w-5 h-8 rounded-full border-2 border-primary/30 flex justify-center pt-2">
          <div className="w-1 h-2 bg-primary/60 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
