export const SITE_NAME = "Maison Nif Chrif";
export const SITE_DESCRIPTION = "Parfumerie marocaine de luxe";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const NAV_LINKS = [
  { label: "Heritage", href: "/#notre-histoire" },
  { label: "Collection", href: "/collection" },
  { label: "Experience", href: "/#temoignages" },
  { label: "Boutique", href: "/#contact" },
];

export const GENRES = [
  { value: "homme", label: "Homme" },
  { value: "femme", label: "Femme" },
  { value: "mixte", label: "Mixte" },
] as const;

export const PRODUCT_TYPES = [
  { value: "parfum", label: "Parfum" },
  { value: "pack", label: "Pack" },
] as const;

export const ORDER_STATUTS = [
  { value: "en_attente", label: "En attente", color: "text-yellow-500" },
  { value: "confirmee", label: "Confirmée", color: "text-blue-500" },
  { value: "expediee", label: "Expédiée", color: "text-purple-500" },
  { value: "livree", label: "Livrée", color: "text-green-500" },
  { value: "annulee", label: "Annulée", color: "text-red-500" },
] as const;

export const COLLECTION_CATEGORIES = [
  { slug: "homme", label: "Homme", description: "Parfums pour hommes" },
  { slug: "femme", label: "Femme", description: "Parfums pour femmes" },
  { slug: "cadeaux", label: "Cadeaux", description: "Idées cadeaux" },
  { slug: "packs", label: "Packs", description: "Coffrets & Sets" },
  { slug: "nouveautes", label: "Nouveautés", description: "Dernières créations" },
  { slug: "best-sellers", label: "Best Sellers", description: "Les plus aimés" },
] as const;