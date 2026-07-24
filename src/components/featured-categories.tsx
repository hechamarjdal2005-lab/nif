"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    title: "Homme",
    description: "Parfums d'exception pour hommes",
    href: "/collection/homme",
    gradient: "from-primary/5 to-transparent",
  },
  {
    title: "Femme",
    description: "Essences raffinées pour femmes",
    href: "/collection/femme",
    gradient: "from-secondary/5 to-transparent",
  },
  {
    title: "Cadeaux",
    description: "Offres exclusives & coffrets",
    href: "/collection?category=cadeaux",
    gradient: "from-primary/8 to-transparent",
  },
  {
    title: "Packs",
    description: "Coffrets découverte & sets",
    href: "/collection/packs",
    gradient: "from-secondary/8 to-transparent",
  },
];

export function FeaturedCategories() {
  return (
    <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="font-heading text-on-background text-3xl sm:text-4xl leading-tight font-medium mb-3">
          Découvrez Nos Univers
        </h2>
        <p className="text-secondary text-base max-w-xl mx-auto">
          Explorez nos collections soigneusement composées pour chaque occasion
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
                <h3 className="font-heading text-on-background text-lg mb-1">
                  {cat.title}
                </h3>
                <p className="text-secondary text-sm mb-3">{cat.description}</p>
                <div className="flex items-center text-primary text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>Explorer</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
