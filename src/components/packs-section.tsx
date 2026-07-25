"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Package } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatPrice, getImageUrl, cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";
import { getTranslation, getLocalizedField } from "@/lib/i18n";
import type { Product, PackItem } from "@/lib/types";

type PackWithItems = Product & { pack_items: (PackItem & { product?: Product })[] };

export function PacksSection() {
  const [packs, setPacks] = useState<PackWithItems[]>([]);
  const { locale } = useLanguage();
  const isAr = locale === "ar";

  useEffect(() => {
    async function fetchPacks() {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("products")
          .select("*, pack_items(*, product:products(*))")
          .eq("type", "pack")
          .order("created_at", { ascending: false })
          .limit(4);
        setPacks((data || []) as unknown as PackWithItems[]);
      } catch {
        setPacks([]);
      }
    }
    fetchPacks();
  }, []);

  if (packs.length === 0) return null;

  return (
    <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h2 className={cn("font-heading text-on-background text-3xl sm:text-4xl mb-3 font-medium", isAr && "font-arabic")}>
          {getTranslation(locale, "home.packsTitle")}
        </h2>
        <p className={cn("text-secondary max-w-xl mx-auto", isAr && "font-arabic")}>
          {getTranslation(locale, "home.packsSubtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {packs.map((pack) => {
          const itemCount = pack.pack_items?.length || 0;
          return (
            <Link key={pack.id} href={`/pack/${pack.slug}`}>
              <div className="group relative bg-background border border-outline-variant/40 rounded-xl overflow-hidden hover-lift">
                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden bg-surface-container-low">
                  {pack.images?.[0] ? (
                    <Image
                      src={getImageUrl(pack.images[0])}
                      alt={getLocalizedField(pack as unknown as Record<string, unknown>, "nom", locale)}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-outline-variant">
                      <Package className="w-12 h-12" />
                    </div>
                  )}

                  {/* Pack badge */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-block bg-primary/90 text-on-primary text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full">
                      {getTranslation(locale, "pack.coffret")}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-3">
                  <h3 className={cn("font-heading text-base text-on-background group-hover:text-primary transition-colors mb-1 line-clamp-1", isAr && "font-arabic")}>
                    {getLocalizedField(pack as unknown as Record<string, unknown>, "nom", locale)}
                  </h3>

                  <p className={cn("text-xs text-secondary mb-3", isAr && "font-arabic")}>
                    {getTranslation(locale, "home.containsProducts").replace("{count}", String(itemCount))}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-primary font-semibold">{formatPrice(pack.prix)}</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
