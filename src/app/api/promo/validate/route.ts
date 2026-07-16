import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { code, cartItems } = await request.json();

    if (!code) {
      return NextResponse.json({ error: "Code promo requis." }, { status: 400 });
    }

    const { data: promo, error: promoError } = await supabase
      .from("promo_codes")
      .select("*")
      .eq("code", code.toUpperCase())
      .eq("actif", true)
      .single();

    if (promoError || !promo) {
      return NextResponse.json({ error: "Code promo invalide." }, { status: 404 });
    }

    const now = new Date();
    if (new Date(promo.date_debut) > now) {
      return NextResponse.json({ error: "Ce code promo n'est pas encore actif." }, { status: 400 });
    }
    if (new Date(promo.date_fin) < now) {
      return NextResponse.json({ error: "Ce code promo a expiré." }, { status: 400 });
    }

    if (promo.usage_max && promo.usage_count >= promo.usage_max) {
      return NextResponse.json({ error: "Ce code promo a atteint sa limite d'utilisation." }, { status: 400 });
    }

    const cartTotal = cartItems.reduce(
      (sum: number, item: { prix: number; quantite: number }) => sum + item.prix * item.quantite,
      0
    );

    if (promo.produit_id) {
      const hasProduct = cartItems.some(
        (item: { product_id: string }) => item.product_id === promo.produit_id
      );
      if (!hasProduct) {
        return NextResponse.json(
          { error: "Ce code promo s'applique à un produit spécifique non présent dans votre panier." },
          { status: 400 }
        );
      }
    }

    let reduction = 0;
    if (promo.type_reduction === "pourcentage") {
      if (promo.produit_id) {
        const productItem = cartItems.find(
          (item: { product_id: string }) => item.product_id === promo.produit_id
        );
        reduction = productItem ? (productItem.prix * productItem.quantite * promo.valeur) / 100 : 0;
      } else {
        reduction = (cartTotal * promo.valeur) / 100;
      }
    } else {
      reduction = Math.min(promo.valeur, cartTotal);
    }

    const total_after = Math.max(0, cartTotal - reduction);

    return NextResponse.json({
      reduction: Math.round(reduction * 100) / 100,
      total_after: Math.round(total_after * 100) / 100,
      message: `Réduction de ${promo.type_reduction === "pourcentage" ? promo.valeur + "%" : promo.valeur + " MAD"} appliquée.`,
      promo_code_id: promo.id,
    });
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
