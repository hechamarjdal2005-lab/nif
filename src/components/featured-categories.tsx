"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/language-context";
import { getTranslation } from "@/lib/i18n";

type FeaturedCategorySlug = "homme" | "femme" | "cadeaux" | "packs";
type FeaturedCategoryImage = {
  slug: FeaturedCategorySlug;
  image: string | null;
  image_url: string | null;
};

const FEATURED_CATEGORY_SLUGS: FeaturedCategorySlug[] = ["homme", "femme", "cadeaux", "packs"];

export function FeaturedCategories() {
  const { locale } = useLanguage();
  const isAr = locale === "ar";
  const [categoryImages, setCategoryImages] = useState<Record<string, string>>({});

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("categories")
      .select("slug, image, image_url")
      .in("slug", FEATURED_CATEGORY_SLUGS)
      .then(({ data }) => {
        if (!data) return;

        const images = (data as FeaturedCategoryImage[]).reduce<Record<string, string>>((acc, cat) => {
          const imageUrl = cat.image_url || cat.image;
          if (imageUrl) acc[cat.slug] = imageUrl;
          return acc;
        }, {});

        setCategoryImages(images);
      });
  }, []);

  const categories = [
    {
      slug: "homme",
      title: getTranslation(locale, "featuredCategories.homme.title"),
      description: getTranslation(locale, "featuredCategories.homme.desc"),
      href: "/collection/homme",
      gradient: "from-primary/5 to-transparent",
    },
    {
      slug: "femme",
      title: getTranslation(locale, "featuredCategories.femme.title"),
      description: getTranslation(locale, "featuredCategories.femme.desc"),
      href: "/collection/femme",
      gradient: "from-secondary/5 to-transparent",
    },
    {
      slug: "cadeaux",
      title: getTranslation(locale, "featuredCategories.cadeaux.title"),
      description: getTranslation(locale, "featuredCategories.cadeaux.desc"),
      href: "/collection/cadeaux",
      gradient: "from-primary/8 to-transparent",
    },
    {
      slug: "packs",
      title: getTranslation(locale, "featuredCategories.packs.title"),
      description: getTranslation(locale, "featuredCategories.packs.desc"),
      href: "/collection/packs",
      gradient: "from-secondary/8 to-transparent",
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h2 className={`font-heading text-on-background text-2xl sm:text-4xl leading-tight font-medium mb-2.5 sm:mb-3 ${isAr ? "font-arabic section-heading-slide-rtl" : "section-heading-slide"}`}>
          {getTranslation(locale, "featuredCategories.sectionTitle")}
        </h2>
        <p className={`text-secondary text-sm sm:text-base max-w-xl mx-auto ${isAr ? "font-arabic" : ""}`}>
          {getTranslation(locale, "featuredCategories.sectionSubtitle")}
        </p>
      </div>

      <div className="scrollbar-hide -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 sm:gap-5 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4">
        {categories.map((cat) => (
          <Link key={cat.title} href={cat.href} className="w-[82%] shrink-0 snap-start sm:w-[46%] md:w-auto md:shrink">
            <div className="group relative h-52 rounded-xl overflow-hidden bg-surface-container-low border border-outline-variant/40 hover:border-primary/30 transition-all duration-500">
              {categoryImages[cat.slug] && (
                <img
                  src={categoryImages[cat.slug]}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} group-hover:scale-110 transition-transform duration-500`}
              />
              {categoryImages[cat.slug] && <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent" />}
              <div className="relative h-full flex flex-col justify-end p-5">
                <h3 className={`font-heading text-lg mb-1 ${categoryImages[cat.slug] ? "text-white" : "text-on-background"} ${isAr ? "font-arabic" : ""}`}>
                  {cat.title}
                </h3>
                <p className={`text-sm mb-3 ${categoryImages[cat.slug] ? "text-white/85" : "text-secondary"} ${isAr ? "font-arabic" : ""}`}>{cat.description}</p>
                <div className={`flex items-center text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${categoryImages[cat.slug] ? "text-white" : "text-primary"} ${isAr ? "font-arabic" : ""}`}>
                  <span>{getTranslation(locale, "featuredCategories.explorer")}</span>
                  <ArrowRight className={`w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform ${isAr ? "rotate-180 ml-0 mr-1" : ""}`} />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
