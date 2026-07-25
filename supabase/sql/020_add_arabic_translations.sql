-- 020_add_arabic_translations.sql
-- Date: 2026-07-24
-- Add _ar columns for bilingual (FR/AR) support on all customer-facing text fields.
-- RLS policies already grant SELECT to public and INSERT/UPDATE to authenticated users,
-- so the new columns are automatically covered by the same policies (column-level access
-- is not enforced by Postgres RLS — row-level only). No RLS changes needed.

-- ========================================
-- PRODUCTS: nom, description, notes_olfactives
-- ========================================
ALTER TABLE products ADD COLUMN IF NOT EXISTS nom_ar TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS description_ar TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS notes_olfactives_ar TEXT;

-- ========================================
-- CATEGORIES: nom
-- ========================================
ALTER TABLE categories ADD COLUMN IF NOT EXISTS nom_ar TEXT;

-- ========================================
-- TESTIMONIALS: nom, ville, texte
-- ========================================
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS nom_ar TEXT;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS ville_ar TEXT;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS texte_ar TEXT;

-- ========================================
-- CONTACT_SOCIAL_LINKS: label
-- ========================================
ALTER TABLE contact_social_links ADD COLUMN IF NOT EXISTS label_ar TEXT;
