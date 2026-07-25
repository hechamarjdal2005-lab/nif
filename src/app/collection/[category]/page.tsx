"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CollectionContent } from "@/components/collection-content";
import { useLanguage } from "@/lib/language-context";
import { getTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { Product, Category } from "@/lib/types";

const VALID_CATEGORIES = ["homme", "femme", "packs", "cadeaux", "nouveautes", "best-sellers"];
const FILTER_CATEGORIES = ["homme", "femme", "packs", "cadeaux"];

const CATEGORY_TITLES: Record<string, { fr: string; ar: string }> = {
  homme: { fr: "Collection Homme", ar: "مجموعة رجال" },
  femme: { fr: "Collection Femme", ar: "مجموعة نساء" },
  packs: { fr: "Coffrets & Packs", ar: "حِزم ومجموعات" },
  cadeaux: { fr: "Idées Cadeaux", ar: "أفكار هدايا" },
  nouveautes: { fr: "Nouveautés", ar: "وصل حديثاً" },
  "best-sellers": { fr: "Best Sellers", ar: "الأكثر مبيعاً" },
};

export default function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const { category } = params;
  const { locale } = useLanguage();
  const isAr = locale === "ar";

  if (!VALID_CATEGORIES.includes(category)) notFound();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const supabase = createClient();
        let query = supabase.from("products").select("*");

        switch (category) {
          case "best-sellers":
            query = query.eq("is_bestseller", true);
            break;
          case "nouveautes":
            query = query.eq("is_new", true);
            break;
        }

        const [productsRes, categoriesRes] = await Promise.all([
          query.order("created_at", { ascending: false }),
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
  }, [category]);

  const categoryTitle = CATEGORY_TITLES[category]?.[isAr ? "ar" : "fr"] ?? CATEGORY_TITLES[category]?.fr ?? category;

  return (
    <main>
      <Navbar />
      <div className="pt-20 pb-12 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className={cn("font-heading text-on-background text-3xl sm:text-4xl mb-3 font-medium", isAr && "font-arabic")}>
            {categoryTitle}
          </h1>
          <p className={cn("text-secondary max-w-xl mx-auto", isAr && "font-arabic")}>
            {getTranslation(locale, "collection.subtitle")}
          </p>
        </div>
        <CollectionContent
          products={products}
          categories={categories}
          initialCategory={FILTER_CATEGORIES.includes(category) ? category : undefined}
          showGenreFilter={false}
        />
      </div>
      <Footer />
    </main>
  );
}
