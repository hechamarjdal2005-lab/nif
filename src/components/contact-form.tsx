"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type ContactFormData = { nom: string; email: string; message: string; }

export function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>();

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
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 bg-dark">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl sm:text-4xl gold-text mb-4">Contactez-Nous</h2>
          <p className="text-dark-500">
            Une question ? Un besoin spécial ? Nous sommes à votre écoute.
          </p>
        </div>

        {isSubmitted ? (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-gold mx-auto mb-4" />
            <h3 className="font-heading text-xl text-white mb-2">Message Envoyé !</h3>
            <p className="text-dark-500">Nous vous répondrons dans les plus brefs délais.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Input
                placeholder="Votre nom"
                {...register("nom")}
                className="bg-dark"
              />
              {errors.nom && <p className="text-red-400 text-xs mt-1">{errors.nom.message}</p>}
            </div>
            <div>
              <Input
                type="email"
                placeholder="Votre email"
                {...register("email")}
                className="bg-dark"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <Textarea
                placeholder="Votre message..."
                rows={5}
                {...register("message")}
                className="bg-dark"
              />
              {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              <Send className="w-4 h-4 mr-2" />
              {isSubmitting ? "Envoi..." : "Envoyer le Message"}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
