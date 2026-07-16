import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { NotreHistoire } from "@/components/notre-histoire";
import { FeaturedCategories } from "@/components/featured-categories";
import { ProductCard } from "@/components/product-card";
import { WhyChooseUs } from "@/components/why-choose-us";
import { Testimonials } from "@/components/testimonials";
import { InstagramMasonry } from "@/components/instagram-masonry";
import { ContactForm } from "@/components/contact-form";
import { Footer } from "@/components/footer";
import type { Product } from "@/lib/types";

async function getFeaturedProducts(): Promise<{ bestsellers: Product[]; newProducts: Product[] }> {
  try {
    const supabase = await createClient();
    const [bestsellers, newProducts] = await Promise.all([
      supabase
        .from("products")
        .select("*")
        .eq("is_bestseller", true)
        .limit(4),
      supabase
        .from("products")
        .select("*")
        .eq("is_new", true)
        .limit(4),
    ]);
    return {
      bestsellers: (bestsellers.data || []) as unknown as Product[],
      newProducts: (newProducts.data || []) as unknown as Product[],
    };
  } catch {
    return { bestsellers: [], newProducts: [] };
  }
}

export default async function HomePage() {
  const { bestsellers, newProducts } = await getFeaturedProducts();

  return (
    <main>
      <Navbar />
      <Hero />
      <NotreHistoire />

      {/* Best Sellers */}
      {bestsellers.length > 0 && (
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl gold-text mb-4">Best Sellers</h2>
            <p className="text-dark-500 max-w-xl mx-auto">
              Les parfums les plus plébiscités par notre clientèle
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestsellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      <FeaturedCategories />

      {/* Nouveautés */}
      {newProducts.length > 0 && (
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-dark max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl gold-text mb-4">Nouveautés</h2>
            <p className="text-dark-500 max-w-xl mx-auto">
              Découvrez nos dernières créations
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      <WhyChooseUs />
      <Testimonials />
      <InstagramMasonry />
      <ContactForm />
      <Footer />
    </main>
  );
}
