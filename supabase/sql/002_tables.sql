-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  notes_olfactives TEXT,
  prix NUMERIC(10,2) NOT NULL,
  categorie_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  genre TEXT CHECK (genre IN ('homme', 'femme', 'mixte')) NOT NULL,
  type TEXT CHECK (type IN ('parfum', 'pack')) NOT NULL DEFAULT 'parfum',
  images TEXT[] DEFAULT '{}',
  stock INTEGER DEFAULT 0,
  rating_avg NUMERIC(3,2) DEFAULT 0,
  is_bestseller BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Pack items table (links packs to their contained products)
CREATE TABLE IF NOT EXISTS pack_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pack_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  produit_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantite INTEGER DEFAULT 1,
  UNIQUE(pack_id, produit_id)
);

-- Promo codes table
CREATE TABLE IF NOT EXISTS promo_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  type_reduction TEXT CHECK (type_reduction IN ('pourcentage', 'montant_fixe')) NOT NULL,
  valeur NUMERIC(10,2) NOT NULL,
  date_debut TIMESTAMPTZ NOT NULL,
  date_fin TIMESTAMPTZ NOT NULL,
  actif BOOLEAN DEFAULT true,
  usage_max INTEGER,
  usage_count INTEGER DEFAULT 0,
  produit_id UUID REFERENCES products(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_nom TEXT NOT NULL,
  client_tel TEXT NOT NULL,
  client_email TEXT,
  client_adresse TEXT NOT NULL,
  client_ville TEXT NOT NULL,
  total NUMERIC(10,2) NOT NULL,
  promo_code_id UUID REFERENCES promo_codes(id) ON DELETE SET NULL,
  statut TEXT CHECK (statut IN ('en_attente', 'confirmee', 'expediee', 'livree', 'annulee')) DEFAULT 'en_attente',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantite INTEGER NOT NULL DEFAULT 1,
  prix_unitaire NUMERIC(10,2) NOT NULL
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom TEXT NOT NULL,
  ville TEXT,
  texte TEXT NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  image TEXT,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_categorie_id ON products(categorie_id);
CREATE INDEX IF NOT EXISTS idx_products_genre ON products(genre);
CREATE INDEX IF NOT EXISTS idx_products_type ON products(type);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_orders_statut ON orders(statut);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_pack_items_pack_id ON pack_items(pack_id);
