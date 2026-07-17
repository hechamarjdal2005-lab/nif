-- 018_fix_rls_storage_testimonials_images.sql
-- Date: 2026-07-17
-- Problème : INSERT/UPDATE/DELETE sur le bucket testimonials-images
-- utilisent is_admin() → 403.
-- Fix : remplacer is_admin() par auth.role() = 'authenticated'.

-- 1. Supprimer les policies cassées
DROP POLICY IF EXISTS "Admins can upload testimonial images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update testimonial images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete testimonial images" ON storage.objects;

-- 2. INSERT
CREATE POLICY "Authenticated users can upload testimonial images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'testimonials-images'
    AND auth.role() = 'authenticated'
  );

-- 3. UPDATE
CREATE POLICY "Authenticated users can update testimonial images"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'testimonials-images'
    AND auth.role() = 'authenticated'
  );

-- 4. DELETE
CREATE POLICY "Authenticated users can delete testimonial images"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'testimonials-images'
    AND auth.role() = 'authenticated'
  );

-- La policy SELECT existante ("Public can view testimonial images") est inchangée.
