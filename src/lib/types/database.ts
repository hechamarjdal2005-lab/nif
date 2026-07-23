export type Genre = "homme" | "femme" | "mixte";
export type ProductType = "parfum" | "pack";
export type OrderStatut = "en_attente" | "confirmee" | "expediee" | "livree" | "annulee";
export type TypeReduction = "pourcentage" | "montant_fixe";
export type SocialPlatform = "whatsapp" | "telephone" | "instagram" | "facebook" | "tiktok";

export interface Category {
  id: string;
  nom: string;
  slug: string;
  image: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  nom: string;
  slug: string;
  description: string | null;
  notes_olfactives: string | null;
  prix: number;
  categorie_id: string | null;
  genre: Genre;
  type: ProductType;
  images: string[];
  stock: number;
  rating_avg: number;
  is_bestseller: boolean;
  is_new: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
  pack_items?: PackItem[];
}

export interface PackItem {
  id: string;
  pack_id: string;
  produit_id: string;
  quantite: number;
  product?: Product;
}

export interface PromoCode {
  id: string;
  code: string;
  type_reduction: TypeReduction;
  valeur: number;
  date_debut: string;
  date_fin: string;
  actif: boolean;
  usage_max: number | null;
  usage_count: number;
  produit_id: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  client_nom: string;
  client_tel: string;
  client_email: string | null;
  client_adresse: string;
  client_ville: string;
  total: number;
  promo_code_id: string | null;
  statut: OrderStatut;
  created_at: string;
  items?: OrderItem[];
  promo_code?: PromoCode;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantite: number;
  prix_unitaire: number;
  product?: Product;
}

export interface Testimonial {
  id: string;
  nom: string;
  ville: string | null;
  texte: string;
  rating: number;
  image: string | null;
  is_approved: boolean;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  nom: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface ContactSocialLink {
  id: string;
  platform: SocialPlatform;
  label: string;
  href: string;
  value: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantite: number;
}

export interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantite?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantite: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}
