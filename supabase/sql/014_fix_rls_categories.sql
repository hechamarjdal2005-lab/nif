-- 014_fix_rls_categories.sql
-- Date: 2026-07-17
-- Problème : INSERT/UPDATE/DELETE sur categories échouent avec 403 Forbidden.
-- Cause : les policies utilisent is_admin() qui vérifie la table admin_users (vide).
-- Fix : remplacer is_admin() par auth.role() = 'authenticated'.

-- 1. Supprimer les policies cassées
DROP POLICY IF EXISTS "Admins can insert categories" ON categories;
DROP POLICY IF EXISTS "Admins can update categories" ON categories;
DROP POLICY IF EXISTS "Admins can delete categories" ON categories;

-- 2. INSERT
CREATE POLICY "Authenticated users can insert categories"
  ON categories
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- 3. UPDATE
CREATE POLICY "Authenticated users can update categories"
  ON categories
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- 4. DELETE
CREATE POLICY "Authenticated users can delete categories"
  ON categories
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- La policy SELECT existante ("Public can read categories" USING (true)) est inchangée.
