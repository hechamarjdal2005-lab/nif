import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PackDetail } from "@/components/pack-detail";

async function getPack(slug: string) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select("*, category:categories(*), pack_items:pack_items!pack_items_pack_id_fkey(*, product:products!pack_items_produit_id_fkey(*))")
      .eq("slug", slug)
      .eq("type", "pack")
      .single();
    return data;
  } catch {
    return null;
  }
}

export default async function PackPage({ params }: { params: { slug: string } }) {
  const pack = await getPack(params.slug);
  if (!pack) notFound();

  return (
    <main>
      <Navbar />
      <div className="pt-20 pb-12 px-4 sm:px-6 max-w-5xl mx-auto">
        <PackDetail pack={pack} />
      </div>
      <Footer />
    </main>
  );
}
