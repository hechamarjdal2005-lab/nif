"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    title: "Homme",
    description: "Parfums d'exception pour hommes",
    href: "/collection/homme",
    gradient: "from-blue-900/40 to-transparent",
  },
  {
    title: "Femme",
    description: "Essences raffinées pour femmes",
    href: "/collection/femme",
    gradient: "from-pink-900/40 to-transparent",
  },
  {
    title: "Cadeaux",
    description: "Offres exclusives & coffrets",
    href: "/collection?category=cadeaux",
    gradient: "from-purple-900/40 to-transparent",
  },
  {
    title: "Packs",
    description: "Coffrets découverte & sets",
    href: "/collection/packs",
    gradient: "from-amber-900/40 to-transparent",
  },
];

export function FeaturedCategories() {
  return (
    <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="font-heading text-2xl sm:text-3xl gold-text mb-3">Découvrez Nos Univers</h2>
        <p className="text-dark-500 max-w-xl mx-auto">
          Explorez nos collections soigneusement composées pour chaque occasion
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {categories.map((cat) => (
          <Link key={cat.title} href={cat.href}>
            <div className="group relative h-52 rounded-lg overflow-hidden border border-dark-200 hover:border-gold/30 transition-all duration-500">
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} group-hover:scale-110 transition-transform duration-500`} />
              <div className="absolute inset-0 bg-dark/40" />
              <div className="relative h-full flex flex-col justify-end p-5">
                <h3 className="font-heading text-lg text-white mb-1">{cat.title}</h3>
                <p className="text-sm text-dark-500 mb-3">{cat.description}</p>
                <div className="flex items-center text-gold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
