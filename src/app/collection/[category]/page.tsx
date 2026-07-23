import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CollectionContent } from "@/components/collection-content";
import type { Product, Category } from "@/lib/types";

const VALID_CATEGORIES = ["homme", "femme", "packs", "cadeaux", "nouveautes", "best-sellers"];

async function getFilteredProducts(category: string): Promise<Product[]> {
  try {
    const supabase = await createClient();
    let query = supabase.from("products").select("*");

    switch (category) {
      case "homme":
        query = query.eq("genre", "homme");
        break;
      case "femme":
        query = query.eq("genre", "femme");
        break;
      case "packs":
        query = query.eq("type", "pack");
        break;
      case "best-sellers":
        query = query.eq("is_bestseller", true);
        break;
      case "nouveautes":
        query = query.eq("is_new", true);
        break;
      // cadeaux - show all as gift ideas
    }

    const { data } = await query.order("created_at", { ascending: false });
    return (data || []) as unknown as Product[];
  } catch {
    return [];
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("categories").select("*").order("nom");
    return (data || []) as unknown as Category[];
  } catch {
    return [];
  }
}

const CATEGORY_TITLES: Record<string, string> = {
  homme: "Collection Homme",
  femme: "Collection Femme",
  packs: "Coffrets & Packs",
  cadeaux: "Idées Cadeaux",
  nouveautes: "Nouveautés",
  "best-sellers": "Best Sellers",
};

export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const { category } = params;
  if (!VALID_CATEGORIES.includes(category)) notFound();

  const [products, categories] = await Promise.all([
    getFilteredProducts(category),
    getCategories(),
  ]);

  return (
    <main>
      <Navbar />
      <div className="pt-20 pb-12 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl sm:text-4xl gold-text mb-3">
            {CATEGORY_TITLES[category]}
          </h1>
          <p className="text-dark-500 max-w-xl mx-auto">
            Découvrez notre sélection de parfums artisanaux
          </p>
        </div>
        <CollectionContent
          products={products}
          categories={categories}
          initialGenre={["homme", "femme"].includes(category) ? category : undefined}
          showGenreFilter={!["homme", "femme"].includes(category)}
        />
      </div>
      <Footer />
    </main>
  );
}
