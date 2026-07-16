# Maison Nif Chrif — E-commerce Parfumerie Marocaine de Luxe

Site e-commerce complet pour une parfumerie artisanale marocaine, construit avec Next.js 14, TypeScript, Tailwind CSS et Supabase.

## Stack Technique

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS (dark theme, gold accent #D4AF37)
- **Backend**: Supabase (PostgreSQL + Auth + Storage + RLS)
- **Forms**: react-hook-form + zod
- **Icons**: lucide-react
- **Fonts**: Playfair Display (titres) + Montserrat (body)

## Fonctionnalités

### Pages Publiques
- **Accueil** : Hero, Notre Histoire, Best Sellers, Nouveautés, Catégories, Pourquoi Nous Choisir, Témoignages, Instagram, Contact
- **Collection** : Tous les produits avec filtres (genre, catégorie, recherche) et pagination
- **Collection filtrée** : `/collection/homme`, `/collection/femme`, `/collection/packs`, etc.
- **Détail Produit** : Images, description, notes olfactives, rating, ajout au panier
- **Détail Pack** : Contenu du coffret, économie affichée
- **Panier** : Gestion quantités, sous-total, suppression
- **Checkout** : Formulaire livraison, code promo, paiement cash on delivery

### Admin Dashboard (`/admin`)
- **Login** : Authentification Supabase protégée (vérification `admin_users`)
- **Overview** : Statistiques (ventes, commandes, produits, messages)
- **Produits** : CRUD complet (ajout/modification/suppression)
- **Catégories** : CRUD inline
- **Commandes** : Liste, filtre par statut, changement de statut, détails
- **Code Promo** : CRUD, activation/désactivation, validation en checkout
- **Témoignages** : Approuver/rejeter/supprimer
- **Messages** : Liste avec vue détaillée, marquer lu
- **Paramètres** : Informations du site

### Système de Code Promo
- Validation en temps réel (code actif, dates valides, limite d'usage)
- Support pourcentage ou montant fixe
- Code global ou spécifique à un produit
- Réduction calculée automatiquement au checkout

## Installation

### Prérequis
- Node.js 18+
- npm ou yarn
- Compte Supabase (gratuit)

### 1. Cloner le projet

```bash
git clone <repo-url>
cd parfum
npm install
```

### 2. Configurer l'environnement

```bash
cp .env.example .env.local
```

Remplir les variables dans `.env.local` :
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Configurer Supabase

#### Option A : Supabase Local (recommandé pour dev)

```bash
# Installer Supabase CLI
npm install -g supabase

# Initialiser
supabase init

# Démarrer
supabase start
```

#### Option B : Supabase Cloud

Créer un nouveau projet sur [supabase.com](https://supabase.com).

### 4. Exécuter les migrations SQL

Exécuter les fichiers dans l'ordre via l'éditeur SQL de Supabase :

```sql
-- Onglet SQL Editor de Supabase Dashboard
-- Copier-coller chaque fichier dans l'ordre :

-- 1. Extensions
\i supabase/sql/001_extensions.sql

-- 2. Tables
\i supabase/sql/002_tables.sql

-- 3. Storage Buckets
\i supabase/sql/003_storage_buckets.sql

-- 4. RLS Policies
\i supabase/sql/004_rls_policies.sql

-- 5. Functions & Triggers
\i supabase/sql/005_functions_triggers.sql

-- 6. Seed Data (données de test)
\i supabase/sql/006_seed_data.sql
```

Ou coller directement le contenu de chaque fichier dans l'éditeur SQL de Supabase.

### 5. Créer un admin user

Dans l'éditeur SQL de Supabase :

```sql
-- D'abord, créer un user via Supabase Auth (signup ou dashboard)
-- Ensuite, l'ajouter à admin_users :
INSERT INTO admin_users (id, email, role)
VALUES ('auth-user-uuid', 'admin@maisonnifchrif.com', 'admin');
```

Ou via le dashboard Supabase : Authentication > Users > Add User, puis insérer dans `admin_users`.

### 6. Lancer le serveur de développement

```bash
npm run dev
```

Le site est disponible sur http://localhost:3000.

## Structure du Projet

```
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Accueil
│   │   ├── layout.tsx                  # Layout racine
│   │   ├── globals.css                 # Styles globaux
│   │   ├── collection/
│   │   │   ├── page.tsx                # Toute la collection
│   │   │   └── [category]/page.tsx     # Collection filtrée
│   │   ├── produit/[slug]/page.tsx     # Détail produit
│   │   ├── pack/[slug]/page.tsx        # Détail pack
│   │   ├── panier/page.tsx             # Panier
│   │   ├── checkout/page.tsx           # Checkout
│   │   ├── api/promo/validate/route.ts # API validation promo
│   │   └── admin/
│   │       ├── layout.tsx              # Layout admin
│   │       ├── page.tsx                # Dashboard overview
│   │       ├── login/page.tsx          # Login admin
│   │       ├── produits/               # CRUD produits
│   │       ├── categories/             # CRUD catégories
│   │       ├── commandes/              # Gestion commandes
│   │       ├── promo-codes/            # Gestion codes promo
│   │       ├── testimonials/           # Gestion témoignages
│   │       ├── messages/               # Messages contact
│   │       └── parametres/             # Paramètres site
│   ├── components/
│   │   ├── ui/                         # Composants UI réutilisables
│   │   ├── admin/                      # Composants admin
│   │   ├── navbar.tsx
│   │   ├── footer.tsx
│   │   ├── hero.tsx
│   │   ├── product-card.tsx
│   │   ├── collection-content.tsx
│   │   ├── product-detail.tsx
│   │   └── ...
│   ├── lib/
│   │   ├── utils.ts                    # cn(), formatPrice(), slugify()
│   │   ├── constants.ts                # Config du site
│   │   ├── types/database.ts           # Types TypeScript
│   │   ├── cart-context.tsx             # Context panier
│   │   └── supabase/
│   │       ├── client.ts               # Client browser
│   │       ├── server.ts               # Client server
│   │       └── middleware.ts           # Middleware Supabase
│   └── middleware.ts                    # Next.js middleware
├── supabase/sql/                        # Migrations SQL
│   ├── 001_extensions.sql
│   ├── 002_tables.sql
│   ├── 003_storage_buckets.sql
│   ├── 004_rls_policies.sql
│   ├── 005_functions_triggers.sql
│   └── 006_seed_data.sql
├── tailwind.config.ts
├── .env.example
└── package.json
```

## Design Tokens

| Token | Valeur |
|-------|--------|
| Background | `#0A0A0A` / `#121212` |
| Gold | `#D4AF37` |
| Font Heading | Playfair Display |
| Font Body | Montserrat |
| Effects | Glassmorphism, fade-in-up, hover-lift |

## Commandes

```bash
npm run dev        # Serveur de développement
npm run build      # Build de production
npm run start      # Démarrer en production
npm run lint       # Linter ESLint
```

## Notes

- Le panier persiste dans localStorage
- Les images produits sont gérées via Supabase Storage (buckets `product-images`, `testimonials-images`, `site-assets`)
- RLS (Row Level Security) est activé sur toutes les tables
- Le paiement est configuré en Cash on Delivery par défaut
- Les codes promo supportent pourcentage et montant fixe, global ou par produit
# nif
