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
import { formatPrice, cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";
import { getTranslation } from "@/lib/i18n";
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
  const { locale } = useLanguage();
  const isAr = locale === "ar";
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
      setPromoError(getTranslation(locale, "checkout.promoError"));
    } finally {
      setIsCheckingPromo(false);
    }
  };

  const onSubmit = async (formData: CheckoutFormData) => {
    if (items.length === 0) return;
    setIsSubmitting(true);

    try {
      const supabase = createClient();

      const orderId = crypto.randomUUID();

      const { error: orderError } = await supabase
        .from("orders")
        .insert({
          id: orderId,
          client_nom: formData.nom,
          client_tel: formData.tel,
          client_email: formData.email || null,
          client_adresse: formData.adresse,
          client_ville: formData.ville,
          total,
          promo_code_id: promoResult ? null : null,
          statut: "en_attente",
        });

      if (orderError) throw orderError;

      const orderItems = items.map((item) => ({
        order_id: orderId,
        product_id: item.product.id,
        quantite: item.quantite,
        prix_unitaire: item.product.prix,
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
      if (itemsError) throw itemsError;

      clearCart();
      setIsSuccess(true);
    } catch {
      alert(getTranslation(locale, "checkout.error"));
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
            <div className="h-10 w-48 bg-surface-container-low rounded" />
            <div className="h-64 bg-surface-container-low rounded-xl" />
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
          <CheckCircle className="w-20 h-20 text-primary mx-auto mb-6" />
          <h1 className={cn("font-heading text-on-background text-3xl sm:text-4xl mb-4 font-medium", isAr && "font-arabic")}>{getTranslation(locale, "checkout.successTitle")}</h1>
          <p className={cn("text-secondary mb-8", isAr && "font-arabic")}>
            {getTranslation(locale, "checkout.successBody")}
          </p>
          <Button onClick={() => router.push("/")} className={cn(isAr && "font-arabic")}>{getTranslation(locale, "checkout.backHome")}</Button>
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
            title={getTranslation(locale, "checkout.emptyTitle")}
            description={getTranslation(locale, "checkout.emptyDesc")}
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
        <h1 className={cn("font-heading text-on-background text-3xl sm:text-4xl mb-8 font-medium", isAr && "font-arabic")}>Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 space-y-6">
            <h2 className={cn("font-heading text-on-background text-xl", isAr && "font-arabic")}>{getTranslation(locale, "checkout.shippingTitle")}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Input placeholder={getTranslation(locale, "checkout.name")} {...register("nom")} className="bg-surface-container-low" />
                {errors.nom && <p className="text-red-500 text-xs mt-1">{getTranslation(locale, "checkout.nameReq")}</p>}
              </div>
              <div>
                <Input placeholder={getTranslation(locale, "checkout.phone")} {...register("tel")} className="bg-surface-container-low" />
                {errors.tel && <p className="text-red-500 text-xs mt-1">{getTranslation(locale, "checkout.phoneReq")}</p>}
              </div>
            </div>

            <div>
              <Input type="email" placeholder={getTranslation(locale, "checkout.email")} {...register("email")} className="bg-surface-container-low" />
            </div>

            <div>
              <Input placeholder={getTranslation(locale, "checkout.address")} {...register("adresse")} className="bg-surface-container-low" />
              {errors.adresse && <p className="text-red-500 text-xs mt-1">{getTranslation(locale, "checkout.addressReq")}</p>}
            </div>

            <div>
              <Input placeholder={getTranslation(locale, "checkout.city")} {...register("ville")} className="bg-surface-container-low" />
              {errors.ville && <p className="text-red-500 text-xs mt-1">{getTranslation(locale, "checkout.cityReq")}</p>}
            </div>

            {/* Promo Code */}
            <div className="border border-outline-variant/40 rounded-xl p-4">
              <h3 className={cn("text-sm font-medium text-on-background mb-3 flex items-center gap-2", isAr && "font-arabic")}>
                <Tag className="w-4 h-4 text-primary" />
                {getTranslation(locale, "checkout.promoTitle")}
              </h3>
              <div className="flex gap-2">
                <Input
                  placeholder={getTranslation(locale, "checkout.promoPlaceholder")}
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  className="bg-surface-container-low flex-1"
                />
                <Button type="button" variant="outline" onClick={handleApplyPromo} disabled={isCheckingPromo} className={cn(isAr && "font-arabic")}>
                  {isCheckingPromo ? "..." : getTranslation(locale, "checkout.apply")}
                </Button>
              </div>
              {promoError && <p className="text-red-500 text-xs mt-2">{promoError}</p>}
              {promoResult && (
                <p className="text-green-600 text-xs mt-2">
                  {getTranslation(locale, "checkout.promoSuccess").replace("{amount}", formatPrice(promoResult.reduction))}
                </p>
              )}
            </div>

            <Button type="submit" size="lg" className={cn("w-full", isAr && "font-arabic")} disabled={isSubmitting}>
              {isSubmitting ? getTranslation(locale, "checkout.processing") : getTranslation(locale, "checkout.pay").replace("{total}", formatPrice(total))}
            </Button>
            <p className={cn("text-xs text-secondary text-center", isAr && "font-arabic")}>
              {getTranslation(locale, "checkout.paymentInfo")}
            </p>
          </form>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="p-6 rounded-xl border border-outline-variant/40 bg-background sticky top-24">
              <h2 className={cn("font-heading text-on-background text-xl mb-4", isAr && "font-arabic")}>{getTranslation(locale, "checkout.orderSummary")}</h2>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-secondary truncate flex-1 mr-2">
                      {item.product.nom} × {item.quantite}
                    </span>
                    <span className="text-on-background whitespace-nowrap">
                      {formatPrice(item.product.prix * item.quantite)}
                    </span>
                  </div>
                ))}
              </div>
              <hr className="border-outline-variant/40 mb-4" />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className={cn("text-secondary", isAr && "font-arabic")}>{getTranslation(locale, "checkout.subtotal")}</span>
                  <span className="text-on-background">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">{getTranslation(locale, "checkout.reduction")}</span>
                    <span className="text-green-600">-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className={cn("text-secondary", isAr && "font-arabic")}>{getTranslation(locale, "checkout.shippingLabel")}</span>
                  <span className={cn("text-primary", isAr && "font-arabic")}>{getTranslation(locale, "checkout.freeShipping")}</span>
                </div>
                <hr className="border-outline-variant/40" />
                <div className="flex justify-between">
                  <span className={cn("text-on-background font-medium", isAr && "font-arabic")}>{getTranslation(locale, "checkout.totalLabel")}</span>
                  <span className="text-primary font-semibold text-lg">{formatPrice(total)}</span>
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
