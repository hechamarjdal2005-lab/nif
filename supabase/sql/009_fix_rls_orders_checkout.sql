-- 009_fix_rls_orders_checkout.sql
-- Date: 2026-07-17
-- Problème : le checkout public (/checkout) échoue avec 401 sur
-- POST /rest/v1/orders alors que les clients sont anonymes (non connectés).
-- Les policies INSERT existantes ("Anyone can create orders" et
-- "Anyone can insert order_items") utilisent WITH CHECK (true) mais
-- ne fonctionnent pas, probablement non appliquées ou corrompues.
-- Fix : DROP puis recreation des policies INSERT pour orders et order_items,
-- en autorisant explicitement les rôles anon et authenticated.

-- ========================================
-- TABLE: orders
-- ========================================

-- 1. Supprimer les policies INSERT existantes sur orders
-- On droppe toutes les policies INSERT possibles (anciens noms) pour être sûr
DROP POLICY IF EXISTS "Anyone can create orders" ON orders;

-- 2. Policy INSERT sur orders
-- WITH CHECK = condition évaluée sur la ligne AVANT insertion.
-- auth.role() renvoie le claim "role" du JWT :
--   - "anon" pour un visiteur non connecté (clé publique, pas de session)
--   - "authenticated" pour un utilisateur connecté via Supabase Auth
-- OR = l'un OU l'autre suffit → les deux types d'utilisateurs peuvent commander.
CREATE POLICY "Anyone can create orders"
  ON orders
  FOR INSERT
  WITH CHECK (auth.role() = 'anon' OR auth.role() = 'authenticated');

-- ========================================
-- TABLE: order_items
-- ========================================

-- 3. Supprimer les policies INSERT existantes sur order_items
DROP POLICY IF EXISTS "Anyone can insert order_items" ON order_items;

-- 4. Policy INSERT sur order_items
-- Même logique : un client anonyme qui vient de créer une commande
-- doit pouvoir insérer les lignes d'article associées.
CREATE POLICY "Anyone can insert order_items"
  ON order_items
  FOR INSERT
  WITH CHECK (auth.role() = 'anon' OR auth.role() = 'authenticated');

-- ========================================
-- POLICIES NON MODIFIÉES (restent en place)
-- ========================================
-- orders SELECT (admin) : "Admins can read all orders" USING (is_admin()) → cassé mais pas bloquant pour le checkout
-- orders SELECT (user)  : "Users can read own orders" USING (auth.role()='authenticated' AND ...) → fonctionne
-- orders UPDATE         : "Admins can update orders" USING (is_admin()) → cassé mais pas bloquant pour le checkout
-- order_items SELECT    : policies existantes inchangées
