"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Camera, CheckCircle, MessageCircle, Music2, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";

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
      setError("Une erreur est survenue. Veuillez reessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="bg-dark px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h2 className="font-heading mb-3 text-2xl gold-text sm:text-3xl">Contactez-Nous</h2>
          <p className="text-dark-500">
            Une question ? Un besoin special ? Nous sommes a votre ecoute.
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-lg border border-dark-200 bg-darker/40 p-5 sm:p-6">
            {isSubmitted ? (
              <div className="py-8 text-center">
                <CheckCircle className="mx-auto mb-3 h-12 w-12 text-gold" />
                <h3 className="font-heading mb-2 text-xl text-white">Message Envoye !</h3>
                <p className="text-dark-500">Nous vous repondrons dans les plus brefs delais.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Input placeholder="Votre nom" {...register("nom")} className="bg-dark" />
                  {errors.nom && <p className="mt-1 text-xs text-red-400">{errors.nom.message}</p>}
                </div>
                <div>
                  <Input type="email" placeholder="Votre email" {...register("email")} className="bg-dark" />
                  {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
                </div>
                <div>
                  <Textarea placeholder="Votre message..." rows={5} {...register("message")} className="bg-dark" />
                  {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message.message}</p>}
                </div>
                {error && <p className="text-sm text-red-400">{error}</p>}
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  <Send className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Envoi..." : "Envoyer le Message"}
                </Button>
              </form>
            )}
          </div>

          <div className="rounded-lg border border-dark-200 bg-darker/40 p-5 sm:p-6">
            <h3 className="font-heading mb-2 text-xl text-white">Reseaux sociaux</h3>
            <p className="mb-5 text-sm text-dark-500">
              Contactez-nous directement sur votre canal prefere.
            </p>

            <div className="space-y-3">
              {socialLinks.map((link) => (
                <a
                  key={link.platform}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                  className="flex items-center gap-3 rounded-lg border border-dark-200 bg-dark/60 p-3 text-left transition-colors hover:border-gold/40 hover:text-gold"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold">
                    <SocialIcon platform={link.platform} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-white">{link.label}</span>
                    <span className="block truncate text-xs text-dark-500">{link.value}</span>
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
