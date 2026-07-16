"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { useCart } from "@/lib/cart-context";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag, Tag, CheckCircle } from "lucide-react";

type CheckoutFormData = {
  nom: string;
  tel: string;
  email: string;
  adresse: string;
  ville: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart, isLoading } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [promoResult, setPromoResult] = useState<{
    reduction: number;
    total_after: number;
    message: string;
  } | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isCheckingPromo, setIsCheckingPromo] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>();

  const subtotal = getTotal();
  const discount = promoResult?.reduction || 0;
  const total = promoResult?.total_after || subtotal;

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setIsCheckingPromo(true);
    setPromoError(null);
    setPromoResult(null);

    try {
      const res = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: promoCode.trim(),
          cartItems: items.map((item) => ({
            product_id: item.product.id,
            quantite: item.quantite,
            prix: item.product.prix,
          })),
        }),
      });
      const data = await res.json();
      if (data.error) {
        setPromoError(data.error);
      } else {
        setPromoResult(data);
      }
    } catch {
      setPromoError("Erreur lors de la vérification du code promo.");
    } finally {
      setIsCheckingPromo(false);
    }
  };

  const onSubmit = async (formData: CheckoutFormData) => {
    if (items.length === 0) return;
    setIsSubmitting(true);

    try {
      const supabase = createClient();

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          client_nom: formData.nom,
          client_tel: formData.tel,
          client_email: formData.email || null,
          client_adresse: formData.adresse,
          client_ville: formData.ville,
          total,
          promo_code_id: promoResult ? null : null,
          statut: "en_attente",
        })
        .select("id")
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        quantite: item.quantite,
        prix_unitaire: item.product.prix,
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
      if (itemsError) throw itemsError;

      clearCart();
      setIsSuccess(true);
    } catch {
      alert("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <main>
        <Navbar />
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-10 w-48 bg-dark-100 rounded" />
            <div className="h-64 bg-dark-100 rounded-xl" />
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (isSuccess) {
    return (
      <main>
        <Navbar />
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto text-center">
          <CheckCircle className="w-20 h-20 text-gold mx-auto mb-6" />
          <h1 className="font-heading text-3xl gold-text mb-4">Commande Passée !</h1>
          <p className="text-dark-500 mb-8">
            Merci pour votre commande. Nous vous contacterons bientôt pour la livraison.
          </p>
          <Button onClick={() => router.push("/")}>Retour à l&apos;accueil</Button>
        </div>
        <Footer />
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main>
        <Navbar />
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <EmptyState
            icon={<ShoppingBag className="w-16 h-16" />}
            title="Votre panier est vide"
            description="Ajoutez des produits avant de passer commande."
          />
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Navbar />
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <h1 className="font-heading text-3xl sm:text-4xl gold-text mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 space-y-6">
            <h2 className="font-heading text-xl text-white">Informations de Livraison</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Input placeholder="Nom complet *" {...register("nom")} className="bg-dark" />
                {errors.nom && <p className="text-red-400 text-xs mt-1">Nom requis</p>}
              </div>
              <div>
                <Input placeholder="Téléphone *" {...register("tel")} className="bg-dark" />
                {errors.tel && <p className="text-red-400 text-xs mt-1">Téléphone requis</p>}
              </div>
            </div>

            <div>
              <Input type="email" placeholder="Email (optionnel)" {...register("email")} className="bg-dark" />
            </div>

            <div>
              <Input placeholder="Adresse complète *" {...register("adresse")} className="bg-dark" />
              {errors.adresse && <p className="text-red-400 text-xs mt-1">Adresse requise</p>}
            </div>

            <div>
              <Input placeholder="Ville *" {...register("ville")} className="bg-dark" />
              {errors.ville && <p className="text-red-400 text-xs mt-1">Ville requise</p>}
            </div>

            {/* Promo Code */}
            <div className="border border-dark-200 rounded-xl p-4">
              <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4 text-gold" />
                Code Promo
              </h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Entrez votre code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  className="bg-dark flex-1"
                />
                <Button type="button" variant="outline" onClick={handleApplyPromo} disabled={isCheckingPromo}>
                  {isCheckingPromo ? "..." : "Appliquer"}
                </Button>
              </div>
              {promoError && <p className="text-red-400 text-xs mt-2">{promoError}</p>}
              {promoResult && (
                <p className="text-green-400 text-xs mt-2">
                  ✓ Réduction de {formatPrice(promoResult.reduction)} appliquée !
                </p>
              )}
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Traitement en cours..." : `Payer ${formatPrice(total)}`}
            </Button>
            <p className="text-xs text-dark-500 text-center">
              Paiement à la livraison (Cash on Delivery)
            </p>
          </form>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="p-6 rounded-xl border border-dark-200 bg-dark-50 sticky top-24">
              <h2 className="font-heading text-xl text-white mb-4">Votre Commande</h2>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-dark-500 truncate flex-1 mr-2">
                      {item.product.nom} × {item.quantite}
                    </span>
                    <span className="text-white whitespace-nowrap">
                      {formatPrice(item.product.prix * item.quantite)}
                    </span>
                  </div>
                ))}
              </div>
              <hr className="border-dark-200 mb-4" />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-dark-500">Sous-total</span>
                  <span className="text-white">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-400">Réduction</span>
                    <span className="text-green-400">-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-dark-500">Livraison</span>
                  <span className="text-gold">Gratuite</span>
                </div>
                <hr className="border-dark-200" />
                <div className="flex justify-between">
                  <span className="text-white font-medium">Total</span>
                  <span className="text-gold font-semibold text-lg">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
