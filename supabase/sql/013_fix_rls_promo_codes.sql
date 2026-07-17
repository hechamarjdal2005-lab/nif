-- 013_fix_rls_promo_codes.sql
-- Date: 2026-07-17
-- Problème : INSERT/UPDATE/DELETE sur promo_codes échouent avec 403 Forbidden.
-- Cause : les policies utilisent is_admin() qui vérifie la table admin_users (vide).
--         L'admin est connecté via Supabase Auth (auth.users), pas dans admin_users.
-- Fix : remplacer is_admin() par auth.role() = 'authenticated'.
-- Sécurité : seuls les utilisateurs connectés via Supabase Auth peuvent modifier
-- les promo_codes. Le middleware /admin protège l'accès aux routes admin.

-- 1. Supprimer les policies cassées
DROP POLICY IF EXISTS "Admins can insert promo_codes" ON promo_codes;
DROP POLICY IF EXISTS "Admins can update promo_codes" ON promo_codes;
DROP POLICY IF EXISTS "Admins can delete promo_codes" ON promo_codes;

-- 2. INSERT : création de code promo réservée aux authentifiés
CREATE POLICY "Authenticated users can insert promo_codes"
  ON promo_codes
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- 3. UPDATE : modification réservée aux authentifiés
CREATE POLICY "Authenticated users can update promo_codes"
  ON promo_codes
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- 4. DELETE : suppression réservée aux authentifiés
CREATE POLICY "Authenticated users can delete promo_codes"
  ON promo_codes
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- La policy SELECT existante ("Public can read active promo_codes") est inchangée.
