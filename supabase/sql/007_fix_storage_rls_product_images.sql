-- 007_fix_storage_rls_product_images.sql
-- Date: 2026-07-17
-- Problème : les policies INSERT/UPDATE/DELETE sur le bucket product-images
-- utilisent is_admin() qui vérifie la table admin_users (vide).
-- Conséquence : tout upload échoue avec "row-level security policy".
-- Fix : remplacer is_admin() par auth.role() = 'authenticated',
-- ce qui correspond à tout utilisateur connecté via Supabase Auth.

-- 1. Supprimer les policies cassées qui dépendent de is_admin()
DROP POLICY IF EXISTS "Admins can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete product images" ON storage.objects;

-- 2. Policy INSERT : upload autorisé pour les utilisateurs authentifiés
-- auth.role() renvoie le claim "role" du JWT. Supabase Auth met
-- "authenticated" pour un user connecté, "anon" pour un visiteur anonyme.
-- bucket_id restreint la policy au seul bucket product-images.
CREATE POLICY "Authenticated users can upload product images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'product-images'
    AND auth.role() = 'authenticated'
  );

-- 3. Policy UPDATE : remplacement d'image autorisé pour les authentifiés
-- USING (pas WITH CHECK) car UPDATE lit la ligne existante puis écrit la nouvelle.
CREATE POLICY "Authenticated users can update product images"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'product-images'
    AND auth.role() = 'authenticated'
  );

-- 4. Policy DELETE : suppression d'image autorisée pour les authentifiés
CREATE POLICY "Authenticated users can delete product images"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'product-images'
    AND auth.role() = 'authenticated'
  );

-- La policy SELECT existante ("Public can view product images") est inchangée
-- car elle fonctionne déjà : USING (bucket_id = 'product-images') sans condition
-- sur l'utilisateur, ce qui rend les images publiques.
