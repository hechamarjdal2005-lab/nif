-- 010_fix_rls_orders_full.sql
-- Date: 2026-07-17
-- Problème : le checkout (/checkout) échoue avec 403 sur
-- POST /rest/v1/orders?select=id.
-- Cause réelle : .select("id") après .insert() déclenche un SELECT sur
-- la table orders. Les policies SELECT existantes exigent is_admin()
-- ou auth.role()='authenticated', donc le rôle anon est bloqué.
-- Fix : recréer les policies INSERT (anon + authenticated) ET les policies
-- SELECT/UPDATE/DELETE (authenticated uniquement) sur orders et order_items.

-- ========================================
-- TABLE: orders
-- ========================================

-- 1. Supprimer TOUTES les policies existantes sur orders pour repartir à zéro
DROP POLICY IF EXISTS "Anyone can create orders" ON orders;
DROP POLICY IF EXISTS "Admins can read all orders" ON orders;
DROP POLICY IF EXISTS "Users can read own orders" ON orders;
DROP POLICY IF EXISTS "Admins can update orders" ON orders;

-- 2. INSERT : anonyme + authentifié peuvent créer une commande
-- WITH CHECK = condition évaluée sur la nouvelle ligne AVANT insertion.
-- auth.role() = 'anon' → visiteur non connecté (panier → checkout)
-- auth.role() = 'authenticated' → admin ou futur client avec compte
CREATE POLICY "Anyone can create orders"
  ON orders
  FOR INSERT
  WITH CHECK (auth.role() = 'anon' OR auth.role() = 'authenticated');

-- 3. SELECT : seul l'authentifié (admin) peut lire les commandes
-- USING = condition évaluée sur la ligne existante AVANT lecture.
-- Ceci empêche les anon de lire les commandes des autres.
CREATE POLICY "Authenticated users can read orders"
  ON orders
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- 4. UPDATE : seul l'authentifié (admin) peut modifier les commandes
-- USING = condition évaluée sur la ligne AVANT modification.
-- Permet au dashboard admin de changer le statut d'une commande.
CREATE POLICY "Authenticated users can update orders"
  ON orders
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- 5. DELETE : seul l'authentifié (admin) peut supprimer des commandes
CREATE POLICY "Authenticated users can delete orders"
  ON orders
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- ========================================
-- TABLE: order_items
-- ========================================

-- 6. Supprimer les policies existantes sur order_items
DROP POLICY IF EXISTS "Anyone can insert order_items" ON order_items;
DROP POLICY IF EXISTS "Admins can read all order_items" ON order_items;
DROP POLICY IF EXISTS "Users can read own order_items" ON order_items;

-- 7. INSERT : anonyme + authentifié peuvent créer les lignes d'article
-- Un client qui vient de créer une commande (orders INSERT) doit pouvoir
-- insérer les order_items associés dans la même transaction.
CREATE POLICY "Anyone can insert order_items"
  ON order_items
  FOR INSERT
  WITH CHECK (auth.role() = 'anon' OR auth.role() = 'authenticated');

-- 8. SELECT : seul l'authentifié (admin) peut lire les lignes d'article
CREATE POLICY "Authenticated users can read order_items"
  ON order_items
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- 9. UPDATE : seul l'authentifié (admin) peut modifier les lignes d'article
CREATE POLICY "Authenticated users can update order_items"
  ON order_items
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- 10. DELETE : seul l'authentifié (admin) peut supprimer les lignes d'article
CREATE POLICY "Authenticated users can delete order_items"
  ON order_items
  FOR DELETE
  USING (auth.role() = 'authenticated');
