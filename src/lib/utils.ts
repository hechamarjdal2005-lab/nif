import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-MA", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price) + " MAD";
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function getDiscountedPrice(prix: number, promoType: string, promoValue: number): number {
  if (promoType === "pourcentage") {
    return Math.max(0, prix - (prix * promoValue) / 100);
  }
  return Math.max(0, prix - promoValue);
}

const SUPABASE_PROJECT_URL = "https://rrpntzxmhldpuskhfufe.supabase.co";
const PRODUCT_IMAGES_BUCKET = "product-images";

export function getImageUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const filename = path.replace(/^\/images\/products\//, "").replace(/^\//, "");
  return `${SUPABASE_PROJECT_URL}/storage/v1/object/public/${PRODUCT_IMAGES_BUCKET}/${filename}`;
}