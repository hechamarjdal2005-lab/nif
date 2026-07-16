"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SITE_NAME } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-darker">
        <div className="absolute inset-0 bg-gradient-to-b from-darker via-transparent to-darker" />
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
            Parfumerie Artisanale Marocaine
          </p>
          <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl gold-text mb-6 leading-tight">
            {SITE_NAME}
          </h1>
          <p className="text-dark-500 text-lg sm:text-xl max-w-2xl mx-auto mb-10 font-light leading-relaxed">
            L&apos;art de la parfumerie marocaine, sublimé par des créations uniques
            qui racontent l&apos;histoire de notre héritage.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/collection">
              <Button size="lg" className="text-base px-10">
                Explore Collection
              </Button>
            </Link>
            <Link href="/#notre-histoire">
              <Button variant="outline" size="lg" className="text-base px-10">
                Our Story
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
