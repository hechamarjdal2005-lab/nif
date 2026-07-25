"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CollectionContent } from "@/components/collection-content";
import { useLanguage } from "@/lib/language-context";
import { getTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { Product, Category } from "@/lib/types";

export default function CollectionPage() {
  const { locale } = useLanguage();
  const isAr = locale === "ar";
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const supabase = createClient();
        const [productsRes, categoriesRes] = await Promise.all([
          supabase.from("products").select("*").order("created_at", { ascending: false }),
          supabase.from("categories").select("*").order("nom"),
        ]);
        setProducts((productsRes.data || []) as unknown as Product[]);
        setCategories((categoriesRes.data || []) as unknown as Category[]);
      } catch {
        setProducts([]);
        setCategories([]);
      }
    }
    fetchData();
  }, []);

  return (
    <main>
      <Navbar />
      <div className="pt-20 pb-12 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className={cn("font-heading text-on-background text-3xl sm:text-4xl mb-3 font-medium", isAr && "font-arabic")}>{getTranslation(locale, "collection.title")}</h1>
          <p className={cn("text-secondary max-w-xl mx-auto", isAr && "font-arabic")}>
            {getTranslation(locale, "collection.subtitle")}
          </p>
        </div>
        <CollectionContent products={products} categories={categories} />
      </div>
      <Footer />
    </main>
  );
}
