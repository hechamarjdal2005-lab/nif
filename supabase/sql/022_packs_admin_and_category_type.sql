-- 022_packs_admin_and_category_type.sql
-- Date: 2026-07-25
-- Add type column to categories to distinguish product vs pack categories.

-- ========================================
-- CATEGORIES: add type column
-- ========================================
ALTER TABLE categories ADD COLUMN IF NOT EXISTS type TEXT CHECK (type IN ('product', 'pack')) NOT NULL DEFAULT 'product';

-- Mark existing "packs" category as type 'pack'
UPDATE categories SET type = 'pack' WHERE slug = 'packs';

-- Index for filtering by type
CREATE INDEX IF NOT EXISTS idx_categories_type ON categories(type);
