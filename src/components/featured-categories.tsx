"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { getTranslation } from "@/lib/i18n";

export function FeaturedCategories() {
  const { locale } = useLanguage();
  const isAr = locale === "ar";

  const categories = [
    {
      title: getTranslation(locale, "featuredCategories.homme.title"),
      description: getTranslation(locale, "featuredCategories.homme.desc"),
      href: "/collection/homme",
      gradient: "from-primary/5 to-transparent",
    },
    {
      title: getTranslation(locale, "featuredCategories.femme.title"),
      description: getTranslation(locale, "featuredCategories.femme.desc"),
      href: "/collection/femme",
      gradient: "from-secondary/5 to-transparent",
    },
    {
      title: getTranslation(locale, "featuredCategories.cadeaux.title"),
      description: getTranslation(locale, "featuredCategories.cadeaux.desc"),
      href: "/collection?category=cadeaux",
      gradient: "from-primary/8 to-transparent",
    },
    {
      title: getTranslation(locale, "featuredCategories.packs.title"),
      description: getTranslation(locale, "featuredCategories.packs.desc"),
      href: "/collection/packs",
      gradient: "from-secondary/8 to-transparent",
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h2 className={`font-heading text-on-background text-3xl sm:text-4xl leading-tight font-medium mb-3 ${isAr ? "font-arabic" : ""}`}>
          {getTranslation(locale, "featuredCategories.sectionTitle")}
        </h2>
        <p className={`text-secondary text-base max-w-xl mx-auto ${isAr ? "font-arabic" : ""}`}>
          {getTranslation(locale, "featuredCategories.sectionSubtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {categories.map((cat) => (
          <Link key={cat.title} href={cat.href}>
            <div className="group relative h-52 rounded-xl overflow-hidden bg-surface-container-low border border-outline-variant/40 hover:border-primary/30 transition-all duration-500">
              <div
                className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} group-hover:scale-110 transition-transform duration-500`}
              />
              <div className="relative h-full flex flex-col justify-end p-5">
                <h3 className={`font-heading text-on-background text-lg mb-1 ${isAr ? "font-arabic" : ""}`}>
                  {cat.title}
                </h3>
                <p className={`text-secondary text-sm mb-3 ${isAr ? "font-arabic" : ""}`}>{cat.description}</p>
                <div className={`flex items-center text-primary text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isAr ? "font-arabic" : ""}`}>
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
