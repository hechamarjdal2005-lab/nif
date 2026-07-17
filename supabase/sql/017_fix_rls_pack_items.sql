-- 017_fix_rls_pack_items.sql
-- Date: 2026-07-17
-- Problème : INSERT/UPDATE/DELETE sur pack_items utilisent is_admin() → 403.
-- Pas de panel admin existant pour pack_items, mais fix pour cohérence et usage futur.
-- Fix : remplacer is_admin() par auth.role() = 'authenticated'.

-- 1. Supprimer les policies cassées
DROP POLICY IF EXISTS "Admins can insert pack_items" ON pack_items;
DROP POLICY IF EXISTS "Admins can update pack_items" ON pack_items;
DROP POLICY IF EXISTS "Admins can delete pack_items" ON pack_items;

-- 2. INSERT
CREATE POLICY "Authenticated users can insert pack_items"
  ON pack_items
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- 3. UPDATE
CREATE POLICY "Authenticated users can update pack_items"
  ON pack_items
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- 4. DELETE
CREATE POLICY "Authenticated users can delete pack_items"
  ON pack_items
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- La policy SELECT existante ("Public can read pack_items" USING (true)) est inchangée.
