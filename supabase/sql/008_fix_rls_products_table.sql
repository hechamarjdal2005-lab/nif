-- 008_fix_rls_products_table.sql
-- Date: 2026-07-17
-- Problème : les policies INSERT/UPDATE/DELETE sur la table products
-- utilisent is_admin() qui vérifie la table admin_users (vide).
-- Conséquence : tout INSERT ou UPDATE sur products échoue avec 403 Forbidden.
-- Fix : remplacer is_admin() par auth.role() = 'authenticated',
-- ce qui correspond à tout utilisateur connecté via Supabase Auth.

-- 1. Supprimer les policies cassées
DROP POLICY IF EXISTS "Admins can insert products" ON products;
DROP POLICY IF EXISTS "Admins can update products" ON products;
DROP POLICY IF EXISTS "Admins can delete products" ON products;

-- 2. Policy INSERT : création de produit autorisée pour les authentifiés
-- WITH CHECK = condition évaluée sur la nouvelle ligne avant insertion.
-- auth.role() renvoie le claim "role" du JWT : "authenticated" pour un user
-- connecté, "anon" pour un visiteur anonyme.
CREATE POLICY "Authenticated users can insert products"
  ON products
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- 3. Policy UPDATE : modification de produit autorisée pour les authentifiés
-- USING = condition évaluée sur la ligne existante avant modification.
CREATE POLICY "Authenticated users can update products"
  ON products
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- 4. Policy DELETE : suppression de produit autorisée pour les authentifiés
-- USING = condition évaluée sur la ligne existante avant suppression.
CREATE POLICY "Authenticated users can delete products"
  ON products
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- La policy SELECT existante ("Public can read products" USING (true))
-- est inchangée : lecture libre pour les visiteurs du site.
