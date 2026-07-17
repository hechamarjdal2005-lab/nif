-- 015_fix_rls_testimonials.sql
-- Date: 2026-07-17
-- Problème 1 : SELECT affiche uniquement les testimonials approuvés (is_approved = true).
--   Le panel admin (/admin/testimonials) ne peut pas voir les témoignages en attente.
-- Problème 2 : UPDATE et DELETE utilisent is_admin() → 403.
-- Fix : admin authentifié peut tout lire ; les visiteurs ne voient que les approuvés.

-- 1. Supprimer les policies cassées
DROP POLICY IF EXISTS "Public can read approved testimonials" ON testimonials;
DROP POLICY IF EXISTS "Admins can update testimonials" ON testimonials;
DROP POLICY IF EXISTS "Admins can delete testimonials" ON testimonials;

-- 2. SELECT : admin voit tous les testimonials, public ne voit que les approuvés
CREATE POLICY "Authenticated users can read all testimonials"
  ON testimonials
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Public can read approved testimonials"
  ON testimonials
  FOR SELECT
  USING (is_approved = true);

-- 3. UPDATE : admin uniquement
CREATE POLICY "Authenticated users can update testimonials"
  ON testimonials
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- 4. DELETE : admin uniquement
CREATE POLICY "Authenticated users can delete testimonials"
  ON testimonials
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- La policy INSERT existante ("Anyone can insert testimonials" WITH CHECK (true)) est inchangée.
-- Les visiteurs du site peuvent soumettre un témoignage.
