import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CollectionContent } from "@/components/collection-content";
import type { Product, Category } from "@/lib/types";

async function getProducts(): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    return (data || []) as unknown as Product[];
  } catch {
    return [];
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("nom");
    return (data || []) as unknown as Category[];
  } catch {
    return [];
  }
}

export default async function CollectionPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <main>
      <Navbar />
      <div className="pt-20 pb-12 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl sm:text-4xl gold-text mb-3">Notre Collection</h1>
          <p className="text-dark-500 max-w-xl mx-auto">
            Découvrez notre sélection de parfums artisanaux
          </p>
        </div>
        <CollectionContent products={products} categories={categories} />
      </div>
      <Footer />
    </main>
  );
}
