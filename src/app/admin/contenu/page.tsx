"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ImagePlus, X, Save, Loader2 } from "lucide-react";
import Link from "next/link";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

function sanitizeFilename(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9.-]/g, "_").replace(/_{2,}/g, "_");
}

// ─── Image upload helper ────────────────────────────────────────────────

type UploadState = Record<string, { file: File; preview: string } | null>;

async function uploadToStorage(
  supabase: ReturnType<typeof createClient>,
  file: File,
  bucket: string,
  onError: (msg: string) => void
): Promise<string | null> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    onError("Format invalide. Utilisez JPEG, PNG, WebP ou AVIF.");
    return null;
  }
  if (file.size > MAX_FILE_SIZE) {
    onError("Le fichier dépasse 5 Mo.");
    return null;
  }
  const ext = file.name.split(".").pop() || "jpg";
  const filename = `${Date.now()}-${sanitizeFilename(file.name.replace(/\.[^.]+$/, ""))}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(filename, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) {
    onError(`Upload échoué : ${error.message}`);
    return null;
  }
  const { data } = supabase.storage.from(bucket).getPublicUrl(filename);
  return data.publicUrl;
}

// ─── Reusable image picker ──────────────────────────────────────────────

function ImagePicker({
  label,
  currentUrl,
  uploadKey,
  pendingUploads,
  setPendingUploads,
  uploadErrors,
}: {
  label: string;
  currentUrl: string;
  uploadKey: string;
  pendingUploads: UploadState;
  setPendingUploads: React.Dispatch<React.SetStateAction<UploadState>>;
  uploadErrors: Record<string, string>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [resetTick, setResetTick] = useState(0);
  const pending = pendingUploads[uploadKey];
  const wasRemoved = uploadKey in pendingUploads && pending === null;
  const displayUrl = pending?.preview || (wasRemoved ? "" : currentUrl);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (pending?.preview) URL.revokeObjectURL(pending.preview);
    setPendingUploads((prev) => ({
      ...prev,
      [uploadKey]: { file, preview: URL.createObjectURL(file) },
    }));
  };

  const remove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (pending?.preview) URL.revokeObjectURL(pending.preview);
    setPendingUploads((prev) => ({ ...prev, [uploadKey]: null }));
    setResetTick((t) => t + 1);
  };

  return (
    <div>
      <label className="block text-sm text-dark-500 mb-1">{label}</label>
      <div className="flex flex-col gap-3">
        {displayUrl ? (
          <div className="relative inline-block w-fit">
            <img src={displayUrl} alt="" className="h-32 w-32 object-cover rounded-lg border border-dark-200" />
            <button
              type="button"
              onClick={remove}
              className="absolute -top-2 -right-2 bg-dark-100 border border-dark-200 rounded-full p-1 text-red-400 hover:text-red-300 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-dark-200 rounded-lg cursor-pointer hover:border-gold/50 transition-colors">
            <ImagePlus className="w-6 h-6 text-dark-500 mb-1" />
            <span className="text-xs text-dark-500">Choisir une image</span>
            <input
              ref={inputRef}
              key={resetTick}
              type="file"
              accept={ALLOWED_TYPES.join(",")}
              onChange={handleChange}
              className="hidden"
            />
          </label>
        )}
        {uploadErrors[uploadKey] && <p className="text-red-400 text-xs">{uploadErrors[uploadKey]}</p>}
      </div>
    </div>
  );
}

// ─── Main page ──────────────────────────────────────────────────────────

export default function AdminContenuPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<{ section: string; ok: boolean; text: string } | null>(null);

  // Hero state
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroTitle, setHeroTitle] = useState("");
  const [heroDesc, setHeroDesc] = useState("");
  const [heroBtnPrimary, setHeroBtnPrimary] = useState("");
  const [heroBtnPrimaryLink, setHeroBtnPrimaryLink] = useState("");
  const [heroBtnSecondary, setHeroBtnSecondary] = useState("");
  const [heroBtnSecondaryLink, setHeroBtnSecondaryLink] = useState("");
  const [heroBgUrl, setHeroBgUrl] = useState("");

  // Notre Histoire state
  const [nhLabel, setNhLabel] = useState("");
  const [nhTitle, setNhTitle] = useState("");
  const [nhParagraphs, setNhParagraphs] = useState(["", "", ""]);
  const [nhImages, setNhImages] = useState(["", "", "", ""]);

  // Pourquoi Nous Choisir state
  const [wnTitle, setWnTitle] = useState("");
  const [wnSubtitle, setWnSubtitle] = useState("");
  const [wnCards, setWnCards] = useState<Array<{ title: string; description: string }>>([
    { title: "", description: "" },
    { title: "", description: "" },
    { title: "", description: "" },
    { title: "", description: "" },
  ]);

  // Logo state
  const [logoUrl, setLogoUrl] = useState("");
  const [logoUpload, setLogoUpload] = useState<UploadState>({});

  // Upload state
  const [heroUploads, setHeroUploads] = useState<UploadState>({});
  const [nhUploads, setNhUploads] = useState<UploadState>({});
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({});

  const setUploadError = useCallback((key: string, msg: string) => {
    setUploadErrors((prev) => ({ ...prev, [key]: msg }));
  }, []);

  // Load data
  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("site_content").select("section, content");
      if (!data) { setLoading(false); return; }

      for (const row of data) {
        const c = row.content;
        switch (row.section) {
          case "hero":
            setHeroSubtitle(c.subtitle || "");
            setHeroTitle(c.title || "");
            setHeroDesc(c.description || "");
            setHeroBtnPrimary(c.button_primary_text || "");
            setHeroBtnPrimaryLink(c.button_primary_link || "");
            setHeroBtnSecondary(c.button_secondary_text || "");
            setHeroBtnSecondaryLink(c.button_secondary_link || "");
            setHeroBgUrl(c.background_image_url || "");
            break;
          case "notre_histoire":
            setNhLabel(c.section_label || "");
            setNhTitle(c.title || "");
            setNhParagraphs(c.paragraphs || ["", "", ""]);
            setNhImages(c.images || ["", "", "", ""]);
            break;
          case "pourquoi_nous_choisir":
            setWnTitle(c.title || "");
            setWnSubtitle(c.subtitle || "");
            if (c.cards?.length) setWnCards(c.cards);
            break;
          case "site_settings":
            setLogoUrl(c.logo_url || "");
            break;
        }
      }
      setLoading(false);
    };
    load();
  }, []);

  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      [...Object.values(heroUploads), ...Object.values(nhUploads), ...Object.values(logoUpload)]
        .filter(Boolean)
        .forEach((u) => { if (u?.preview) URL.revokeObjectURL(u.preview); });
    };
  }, [heroUploads, nhUploads, logoUpload]);

  // Upload pending files and return final URLs
  const resolveUploads = async (
    pending: UploadState,
    currentUrls: string[],
    bucket: string
  ): Promise<string[]> => {
    const supabase = createClient();
    const result = [...currentUrls];
    for (const [key, entry] of Object.entries(pending)) {
      if (!entry) {
        const idx = parseInt(key.split("_")[1], 10);
        result[idx] = "";
        continue;
      }
      const idx = parseInt(key.split("_")[1], 10);
      const url = await uploadToStorage(supabase, entry.file, bucket, (msg) => setUploadError(key, msg));
      if (!url) return currentUrls;
      result[idx] = url;
    }
    return result;
  };

  const showSuccess = (section: string) => {
    setSaveMessage({ section, ok: true, text: "Enregistré !" });
    setTimeout(() => setSaveMessage(null), 3000);
  };

  // ── Save Logo ───────────────────────────────────────────────────────
  const saveLogo = async () => {
    setSaving("site_settings");
    try {
      let url = logoUrl;
      if ("logo" in logoUpload) {
        if (logoUpload.logo) {
          const supabase = createClient();
          const uploaded = await uploadToStorage(supabase, logoUpload.logo.file, "site-assets", (msg) => setUploadError("logo", msg));
          if (!uploaded) { setSaving(null); return; }
          url = uploaded;
        } else {
          url = "";
        }
      }
      const supabase = createClient();
      const { error } = await supabase.from("site_content").update({
        content: { logo_url: url },
      }).eq("section", "site_settings");
      if (error) throw error;
      if (logoUpload.logo?.preview) URL.revokeObjectURL(logoUpload.logo.preview);
      setLogoUpload({});
      setLogoUrl(url);
      showSuccess("site_settings");
    } catch { alert("Erreur lors de la sauvegarde du logo."); }
    setSaving(null);
  };

  // ── Save Hero ───────────────────────────────────────────────────────
  const saveHero = async () => {
    setSaving("hero");
    try {
      let bgUrl = heroBgUrl;
      if (heroUploads.bg) {
        const supabase = createClient();
        const url = await uploadToStorage(supabase, heroUploads.bg.file, "site-assets", (msg) => setUploadError("bg", msg));
        if (!url) { setSaving(null); return; }
        bgUrl = url;
      }
      const supabase = createClient();
      const { error } = await supabase.from("site_content").update({
        content: {
          subtitle: heroSubtitle,
          title: heroTitle,
          description: heroDesc,
          button_primary_text: heroBtnPrimary,
          button_primary_link: heroBtnPrimaryLink,
          button_secondary_text: heroBtnSecondary,
          button_secondary_link: heroBtnSecondaryLink,
          background_image_url: bgUrl,
        },
      }).eq("section", "hero");
      if (error) throw error;
      if (heroUploads.bg?.preview) URL.revokeObjectURL(heroUploads.bg.preview);
      setHeroUploads({});
      setHeroBgUrl(bgUrl);
      showSuccess("hero");
    } catch { alert("Erreur lors de la sauvegarde du Hero."); }
    setSaving(null);
  };

  // ── Save Notre Histoire ─────────────────────────────────────────────
  const saveNotreHistoire = async () => {
    setSaving("notre_histoire");
    try {
      const images = await resolveUploads(nhUploads, nhImages, "site-assets");
      if (images === nhImages && Object.keys(nhUploads).some((k) => nhUploads[k])) {
        setSaving(null);
        return;
      }
      const supabase = createClient();
      const { error } = await supabase.from("site_content").update({
        content: {
          section_label: nhLabel,
          title: nhTitle,
          paragraphs: nhParagraphs,
          images,
        },
      }).eq("section", "notre_histoire");
      if (error) throw error;
      Object.values(nhUploads).forEach((u) => { if (u?.preview) URL.revokeObjectURL(u.preview); });
      setNhUploads({});
      setNhImages(images);
      showSuccess("notre_histoire");
    } catch { alert("Erreur lors de la sauvegarde."); }
    setSaving(null);
  };

  // ── Save Pourquoi Nous Choisir ──────────────────────────────────────
  const savePourquoi = async () => {
    setSaving("pourquoi_nous_choisir");
    try {
      const supabase = createClient();
      const { error } = await supabase.from("site_content").update({
        content: {
          title: wnTitle,
          subtitle: wnSubtitle,
          cards: wnCards,
        },
      }).eq("section", "pourquoi_nous_choisir");
      if (error) throw error;
      showSuccess("pourquoi_nous_choisir");
    } catch { alert("Erreur lors de la sauvegarde."); }
    setSaving(null);
  };

  if (loading) {
    return <div className="animate-pulse space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-12 bg-dark-100 rounded" />)}</div>;
  }

  return (
    <div className="max-w-3xl space-y-10">
      <Link href="/admin" className="inline-flex items-center text-dark-500 hover:text-gold text-sm transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Retour
      </Link>

      <h2 className="font-heading text-2xl text-white">Contenu de la Page d&apos;Accueil</h2>

      {saveMessage && (
        <div className={`p-3 rounded-lg text-sm ${saveMessage.ok ? "bg-green-500/10 border border-green-500/20 text-green-400" : "bg-red-500/10 border border-red-500/20 text-red-400"}`}>
          {saveMessage.text}
        </div>
      )}

      {/* ── LOGO DU SITE ────────────────────────────────────────────── */}
      <section className="p-6 rounded-xl border border-dark-200 bg-dark-50 space-y-4">
        <h3 className="font-heading text-lg text-white">Logo du Site</h3>

        <ImagePicker
          label="Logo"
          currentUrl={logoUrl}
          uploadKey="logo"
          pendingUploads={logoUpload}
          setPendingUploads={setLogoUpload}
          uploadErrors={uploadErrors}
        />
        <p className="text-xs text-dark-400">
          Le logo remplace le texte &quot;Maison Nif Chrif&quot; dans la barre de navigation. Si aucune image n&apos;est définie, le texte s&apos;affiche en fallback.
        </p>

        <Button onClick={saveLogo} disabled={saving === "site_settings"} className="mt-2">
          {saving === "site_settings" ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Enregistrer le Logo
        </Button>
      </section>

      {/* ── HERO ────────────────────────────────────────────────────── */}
      <section className="p-6 rounded-xl border border-dark-200 bg-dark-50 space-y-4">
        <h3 className="font-heading text-lg text-white">Hero</h3>

        <ImagePicker
          label="Image de fond"
          currentUrl={heroBgUrl}
          uploadKey="bg"
          pendingUploads={heroUploads}
          setPendingUploads={setHeroUploads}
          uploadErrors={uploadErrors}
        />

        <div>
          <label className="block text-sm text-dark-500 mb-1">Sous-titre</label>
          <Input value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} className="bg-dark" />
        </div>
        <div>
          <label className="block text-sm text-dark-500 mb-1">Titre</label>
          <Input value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} className="bg-dark" />
        </div>
        <div>
          <label className="block text-sm text-dark-500 mb-1">Description</label>
          <Textarea value={heroDesc} onChange={(e) => setHeroDesc(e.target.value)} rows={3} className="bg-dark" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-dark-500 mb-1">Texte bouton principal</label>
            <Input value={heroBtnPrimary} onChange={(e) => setHeroBtnPrimary(e.target.value)} className="bg-dark" />
          </div>
          <div>
            <label className="block text-sm text-dark-500 mb-1">Lien bouton principal</label>
            <Input value={heroBtnPrimaryLink} onChange={(e) => setHeroBtnPrimaryLink(e.target.value)} className="bg-dark" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-dark-500 mb-1">Texte bouton secondaire</label>
            <Input value={heroBtnSecondary} onChange={(e) => setHeroBtnSecondary(e.target.value)} className="bg-dark" />
          </div>
          <div>
            <label className="block text-sm text-dark-500 mb-1">Lien bouton secondaire</label>
            <Input value={heroBtnSecondaryLink} onChange={(e) => setHeroBtnSecondaryLink(e.target.value)} className="bg-dark" />
          </div>
        </div>

        <Button onClick={saveHero} disabled={saving === "hero"} className="mt-2">
          {saving === "hero" ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Enregistrer le Hero
        </Button>
      </section>

      {/* ── NOTRE HISTOIRE ──────────────────────────────────────────── */}
      <section className="p-6 rounded-xl border border-dark-200 bg-dark-50 space-y-4">
        <h3 className="font-heading text-lg text-white">Notre Histoire</h3>

        <div>
          <label className="block text-sm text-dark-500 mb-1">Label (au-dessus du titre)</label>
          <Input value={nhLabel} onChange={(e) => setNhLabel(e.target.value)} className="bg-dark" />
        </div>
        <div>
          <label className="block text-sm text-dark-500 mb-1">Titre</label>
          <Input value={nhTitle} onChange={(e) => setNhTitle(e.target.value)} className="bg-dark" />
        </div>

        {nhParagraphs.map((p, i) => (
          <div key={i}>
            <label className="block text-sm text-dark-500 mb-1">Paragraphe {i + 1}</label>
            <Textarea
              value={p}
              onChange={(e) => {
                const next = [...nhParagraphs];
                next[i] = e.target.value;
                setNhParagraphs(next);
              }}
              rows={3}
              className="bg-dark"
            />
          </div>
        ))}

        <div>
          <label className="block text-sm text-dark-500 mb-2">Images du grid (4)</label>
          <div className="grid grid-cols-2 gap-4">
            {nhImages.map((url, i) => (
              <ImagePicker
                key={i}
                label={`Image ${i + 1}`}
                currentUrl={url}
                uploadKey={`img_${i}`}
                pendingUploads={nhUploads}
                setPendingUploads={setNhUploads}
                uploadErrors={uploadErrors}
              />
            ))}
          </div>
        </div>

        <Button onClick={saveNotreHistoire} disabled={saving === "notre_histoire"} className="mt-2">
          {saving === "notre_histoire" ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Enregistrer Notre Histoire
        </Button>
      </section>

      {/* ── POURQUOI NOUS CHOISIR ───────────────────────────────────── */}
      <section className="p-6 rounded-xl border border-dark-200 bg-dark-50 space-y-4">
        <h3 className="font-heading text-lg text-white">Pourquoi Nous Choisir</h3>

        <div>
          <label className="block text-sm text-dark-500 mb-1">Titre</label>
          <Input value={wnTitle} onChange={(e) => setWnTitle(e.target.value)} className="bg-dark" />
        </div>
        <div>
          <label className="block text-sm text-dark-500 mb-1">Sous-titre</label>
          <Input value={wnSubtitle} onChange={(e) => setWnSubtitle(e.target.value)} className="bg-dark" />
        </div>

        <div className="space-y-4">
          <label className="block text-sm text-dark-500">Cards (4)</label>
          {wnCards.map((card, i) => (
            <div key={i} className="p-4 rounded-lg border border-dark-200 space-y-3">
              <p className="text-xs text-dark-400">Card {i + 1}</p>
              <div>
                <label className="block text-sm text-dark-500 mb-1">Titre</label>
                <Input
                  value={card.title}
                  onChange={(e) => {
                    const next = [...wnCards];
                    next[i] = { ...next[i], title: e.target.value };
                    setWnCards(next);
                  }}
                  className="bg-dark"
                />
              </div>
              <div>
                <label className="block text-sm text-dark-500 mb-1">Description</label>
                <Textarea
                  value={card.description}
                  onChange={(e) => {
                    const next = [...wnCards];
                    next[i] = { ...next[i], description: e.target.value };
                    setWnCards(next);
                  }}
                  rows={2}
                  className="bg-dark"
                />
              </div>
            </div>
          ))}
        </div>

        <Button onClick={savePourquoi} disabled={saving === "pourquoi_nous_choisir"} className="mt-2">
          {saving === "pourquoi_nous_choisir" ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Enregistrer Pourquoi Nous Choisir
        </Button>
      </section>
    </div>
  );
}
