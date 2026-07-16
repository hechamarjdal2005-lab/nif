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
      .select("*, category:categories(*), pack_items(*, product:products(*))")
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
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <PackDetail pack={pack} />
      </div>
      <Footer />
    </main>
  );
}
