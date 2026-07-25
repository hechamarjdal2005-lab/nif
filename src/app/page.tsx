"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { NotreHistoire } from "@/components/notre-histoire";
import { FeaturedCategories } from "@/components/featured-categories";
import { ProductCard } from "@/components/product-card";
import { PacksSection } from "@/components/packs-section";
import { WhyChooseUs } from "@/components/why-choose-us";
import { Testimonials } from "@/components/testimonials";
import { ContactForm } from "@/components/contact-form";
import { Footer } from "@/components/footer";
import { useLanguage } from "@/lib/language-context";
import { getTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";

export default function HomePage() {
  const { locale } = useLanguage();
  const [bestsellers, setBestsellers] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const supabase = createClient();
        const [bs, np] = await Promise.all([
          supabase.from("products").select("*").eq("is_bestseller", true).limit(4),
          supabase.from("products").select("*").eq("is_new", true).limit(4),
        ]);
        setBestsellers((bs.data || []) as unknown as Product[]);
        setNewProducts((np.data || []) as unknown as Product[]);
      } catch {
        setBestsellers([]);
        setNewProducts([]);
      }
    }
    fetchProducts();
  }, []);

  const isAr = locale === "ar";

  return (
    <main>
      <Navbar />
      <Hero />
      <NotreHistoire />

      {/* Best Sellers */}
      {bestsellers.length > 0 && (
        <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className={cn("font-heading text-on-background text-3xl sm:text-4xl mb-3 font-medium", isAr && "font-arabic")}>Best Sellers</h2>
            <p className={cn("text-secondary max-w-xl mx-auto", isAr && "font-arabic")}>
              {getTranslation(locale, "home.bestSellersSubtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {bestsellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      <PacksSection />

      <FeaturedCategories />

      {/* Nouveautés */}
      {newProducts.length > 0 && (
        <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className={cn("font-heading text-on-background text-3xl sm:text-4xl mb-3 font-medium", isAr && "font-arabic")}>
              {getTranslation(locale, "home.newArrivals")}
            </h2>
            <p className={cn("text-secondary max-w-xl mx-auto", isAr && "font-arabic")}>
              {getTranslation(locale, "home.newArrivalsSubtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      <WhyChooseUs />
      <Testimonials />
      <ContactForm />
      <Footer />
    </main>
  );
}
