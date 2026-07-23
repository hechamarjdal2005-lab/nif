"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import type { ContactSocialLink, SocialPlatform } from "@/lib/types";

type EditableSocialLink = Pick<
  ContactSocialLink,
  "platform" | "label" | "href" | "value" | "sort_order" | "is_active"
>;

const DEFAULT_LINKS: EditableSocialLink[] = [
  { platform: "whatsapp", label: "WhatsApp", href: "https://wa.me/212600000000", value: "+212 6 00 00 00 00", sort_order: 1, is_active: true },
  { platform: "telephone", label: "Telephone", href: "tel:+212600000000", value: "+212 6 00 00 00 00", sort_order: 2, is_active: true },
  { platform: "instagram", label: "Instagram", href: "https://instagram.com/maisonnifchrif", value: "@maisonnifchrif", sort_order: 3, is_active: true },
  { platform: "facebook", label: "Facebook", href: "https://facebook.com/maisonnifchrif", value: "Maison Nif Chrif", sort_order: 4, is_active: true },
  { platform: "tiktok", label: "TikTok", href: "https://tiktok.com/@maisonnifchrif", value: "@maisonnifchrif", sort_order: 5, is_active: true },
];

const PLATFORM_LABELS: Record<SocialPlatform, string> = {
  whatsapp: "WhatsApp",
  telephone: "Telephone",
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
};

export default function AdminParametresPage() {
  const [links, setLinks] = useState<EditableSocialLink[]>(DEFAULT_LINKS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLinks = async () => {
      const supabase = createClient();
      const { data, error: loadError } = await supabase
        .from("contact_social_links")
        .select("platform,label,href,value,sort_order,is_active")
        .order("sort_order", { ascending: true });

      if (loadError) {
        setError("Table contact_social_links introuvable. Appliquez la migration SQL 019.");
        setLoading(false);
        return;
      }

      if (data?.length) {
        const rows = data as EditableSocialLink[];
        const merged = DEFAULT_LINKS.map((fallback) => (
          rows.find((row) => row.platform === fallback.platform) || fallback
        ));
        setLinks(merged);
      }

      setLoading(false);
    };

    loadLinks();
  }, []);

  const updateLink = (
    platform: SocialPlatform,
    field: keyof EditableSocialLink,
    value: string | number | boolean
  ) => {
    setLinks((prev) =>
      prev.map((link) =>
        link.platform === platform ? { ...link, [field]: value } : link
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    setError(null);

    const supabase = createClient();
    const payload = links.map((link, index) => ({
      ...link,
      sort_order: Number.isFinite(link.sort_order) ? link.sort_order : index + 1,
    }));

    const { error: saveError } = await supabase
      .from("contact_social_links")
      .upsert(payload, { onConflict: "platform" });

    if (saveError) {
      setError(saveError.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }

    setSaving(false);
  };

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h2 className="font-heading text-2xl text-white">Parametres du Site</h2>
        <p className="mt-1 text-sm text-dark-500">
          Modifiez les liens qui apparaissent dans la section Contact du site.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <section className="space-y-5 rounded-xl border border-dark-200 bg-dark-50 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="font-heading text-lg text-white">Reseaux sociaux</h3>
            <p className="text-sm text-dark-500">
              WhatsApp, telephone, Instagram, Facebook et TikTok.
            </p>
          </div>
          <Button onClick={handleSave} disabled={saving || loading}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Sauvegarder
          </Button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="h-24 animate-pulse rounded-lg bg-dark-100" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {links.map((link) => (
              <div key={link.platform} className="rounded-lg border border-dark-200 bg-dark p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <h4 className="font-heading text-base text-gold">{PLATFORM_LABELS[link.platform]}</h4>
                  <label className="flex items-center gap-2 text-sm text-dark-500">
                    <input
                      type="checkbox"
                      checked={link.is_active}
                      onChange={(e) => updateLink(link.platform, "is_active", e.target.checked)}
                      className="h-4 w-4 accent-gold"
                    />
                    Actif
                  </label>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1.5fr_1fr_90px]">
                  <div>
                    <label className="mb-1 block text-xs text-dark-500">Label</label>
                    <Input
                      value={link.label}
                      onChange={(e) => updateLink(link.platform, "label", e.target.value)}
                      className="bg-dark-50"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-dark-500">Lien</label>
                    <Input
                      value={link.href}
                      onChange={(e) => updateLink(link.platform, "href", e.target.value)}
                      className="bg-dark-50"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-dark-500">Texte affiche</label>
                    <Input
                      value={link.value}
                      onChange={(e) => updateLink(link.platform, "value", e.target.value)}
                      className="bg-dark-50"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-dark-500">Ordre</label>
                    <Input
                      type="number"
                      min={1}
                      value={link.sort_order}
                      onChange={(e) => updateLink(link.platform, "sort_order", Number(e.target.value))}
                      className="bg-dark-50"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {saved && (
          <div className="flex items-center gap-2 text-sm text-green-400 animate-fade-in-up">
            <CheckCircle className="h-4 w-4" />
            Sauvegarde effectuee.
          </div>
        )}
      </section>
    </div>
  );
}
