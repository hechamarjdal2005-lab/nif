"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-darker">
        {content.background_image_url ? (
          <img
            src={content.background_image_url}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-b from-darker via-darker/60 to-darker" />
        <div className="absolute inset-0 bg-gradient-to-r from-darker via-transparent to-darker" />
        {/* Decorative gold lines */}
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        <div className="absolute top-0 left-1/4 w-full h-px bg-gradient-to-b from-gold/10 via-transparent to-transparent" />
        <div className="absolute top-0 right-1/4 w-full h-px bg-gradient-to-b from-gold/10 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="animate-fade-in-up">
          <p className="text-gold text-sm sm:text-base uppercase tracking-[0.3em] mb-6 font-medium">
            {content.subtitle}
          </p>
          <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl gold-text mb-6 leading-tight">
            {content.title}
          </h1>
          <p className="text-dark-500 text-lg sm:text-xl max-w-2xl mx-auto mb-10 font-light leading-relaxed">
            {content.description}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={content.button_primary_link}>
              <Button size="lg" className="text-base px-10">
                {content.button_primary_text}
              </Button>
            </Link>
            <Link href={content.button_secondary_link}>
              <Button variant="outline" size="lg" className="text-base px-10">
                {content.button_secondary_text}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-gold/30 flex justify-center pt-2">
          <div className="w-1 h-2 bg-gold rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
