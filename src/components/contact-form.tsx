"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Camera, CheckCircle, MessageCircle, Music2, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/language-context";
import { getTranslation, getLocalizedField } from "@/lib/i18n";

type ContactFormData = {
  nom: string;
  email: string;
  message: string;
};

type SocialPlatform = "whatsapp" | "telephone" | "instagram" | "facebook" | "tiktok";

type ContactSocialLink = {
  platform: SocialPlatform;
  label: string;
  href: string;
  value: string;
  sort_order: number;
};

const FALLBACK_LINKS: ContactSocialLink[] = [
  { platform: "whatsapp", label: "WhatsApp", href: "https://wa.me/212600000000", value: "+212 6 00 00 00 00", sort_order: 1 },
  { platform: "telephone", label: "Telephone", href: "tel:+212600000000", value: "+212 6 00 00 00 00", sort_order: 2 },
  { platform: "instagram", label: "Instagram", href: "https://instagram.com/maisonnifchrif", value: "@maisonnifchrif", sort_order: 3 },
  { platform: "facebook", label: "Facebook", href: "https://facebook.com/maisonnifchrif", value: "Maison Nif Chrif", sort_order: 4 },
  { platform: "tiktok", label: "TikTok", href: "https://tiktok.com/@maisonnifchrif", value: "@maisonnifchrif", sort_order: 5 },
];

function SocialIcon({ platform }: { platform: SocialPlatform }) {
  if (platform === "telephone") return <Phone className="h-4 w-4" />;
  if (platform === "instagram") return <Camera className="h-4 w-4" />;
  if (platform === "tiktok") return <Music2 className="h-4 w-4" />;
  if (platform === "facebook") return <span className="font-heading text-base leading-none">f</span>;
  return <MessageCircle className="h-4 w-4" />;
}

export function ContactForm() {
  const { locale } = useLanguage();
  const ar = locale === "ar";
  const t = (key: string) => getTranslation(locale, key);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [socialLinks, setSocialLinks] = useState<ContactSocialLink[]>(FALLBACK_LINKS);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>();

  useEffect(() => {
    const loadLinks = async () => {
      const supabase = createClient();
      const { data, error: linksError } = await supabase
        .from("contact_social_links")
        .select("platform,label,href,value,sort_order")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (!linksError && data?.length) {
        setSocialLinks(data as ContactSocialLink[]);
      }
    };

    loadLinks();
  }, []);

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error: dbError } = await supabase.from("contact_messages").insert({
        nom: data.nom,
        email: data.email,
        message: data.message,
      });
      if (dbError) throw dbError;
      setIsSubmitted(true);
      reset();
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch {
      setError(t("contact.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h2 className={`font-heading mb-3 text-3xl text-on-background ${ar ? "font-arabic" : ""}`}>{t("contact.title")}</h2>
          <p className={`text-secondary ${ar ? "font-arabic" : ""}`}>
            {t("contact.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-xl border border-outline-variant/40 bg-background p-6">
            {isSubmitted ? (
              <div className="py-8 text-center">
                <CheckCircle className="mx-auto mb-3 h-12 w-12 text-primary" />
                <h3 className={`font-heading mb-2 text-xl text-on-background ${ar ? "font-arabic" : ""}`}>{t("contact.successTitle")}</h3>
                <p className={`text-secondary ${ar ? "font-arabic" : ""}`}>{t("contact.successBody")}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Input placeholder={t("contact.namePlaceholder")} {...register("nom")} className={`bg-surface-container-low ${ar ? "font-arabic" : ""}`} />
                  {errors.nom && <p className="mt-1 text-xs text-red-400">{errors.nom.message}</p>}
                </div>
                <div>
                  <Input type="email" placeholder={t("contact.emailPlaceholder")} {...register("email")} className={`bg-surface-container-low ${ar ? "font-arabic" : ""}`} />
                  {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
                </div>
                <div>
                  <Textarea placeholder={t("contact.messagePlaceholder")} rows={5} {...register("message")} className={`bg-surface-container-low ${ar ? "font-arabic" : ""}`} />
                  {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message.message}</p>}
                </div>
                {error && <p className="text-sm text-red-400">{error}</p>}
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  <Send className="mr-2 h-4 w-4" />
                  {isSubmitting ? t("contact.sending") : t("contact.send")}
                </Button>
              </form>
            )}
          </div>

          <div className="rounded-xl border border-outline-variant/40 bg-background p-6">
            <h3 className={`font-heading mb-2 text-xl text-on-background ${ar ? "font-arabic" : ""}`}>{t("contact.socialsTitle")}</h3>
            <p className={`mb-5 text-sm text-secondary ${ar ? "font-arabic" : ""}`}>
              {t("contact.socialsSubtitle")}
            </p>

            <div className="space-y-3">
              {socialLinks.map((link) => (
                <a
                  key={link.platform}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                  className="flex items-center gap-3 rounded-lg border border-outline-variant/40 bg-surface-container-low p-3 text-left transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <SocialIcon platform={link.platform} />
                  </span>
                  <span className="min-w-0">
                    <span className={`block text-sm font-medium text-on-background ${ar ? "font-arabic" : ""}`}>{getLocalizedField(link as unknown as Record<string, unknown>, "label", locale)}</span>
                    <span className="block truncate text-xs text-secondary">{link.value}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
