-- 025_featured_category_images.sql
-- Date: 2026-07-25
-- Add editable home featured category background images.

ALTER TABLE categories
  ADD COLUMN IF NOT EXISTS image_url TEXT;

UPDATE categories
SET image_url = image
WHERE slug IN ('homme', 'femme', 'cadeaux', 'packs')
  AND image_url IS NULL
  AND image IS NOT NULL;

INSERT INTO storage.buckets (id, name, public)
VALUES ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'categories'
      AND policyname = 'Public can read categories'
  ) THEN
    CREATE POLICY "Public can read categories" ON categories
      FOR SELECT USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'categories'
      AND policyname = 'Authenticated users can update categories'
  ) THEN
    CREATE POLICY "Authenticated users can update categories" ON categories
      FOR UPDATE USING (auth.role() = 'authenticated');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Public can view site assets'
  ) THEN
    CREATE POLICY "Public can view site assets" ON storage.objects
      FOR SELECT USING (bucket_id = 'site-assets');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Authenticated users can upload site assets'
  ) THEN
    CREATE POLICY "Authenticated users can upload site assets" ON storage.objects
      FOR INSERT WITH CHECK (
        bucket_id = 'site-assets'
        AND auth.role() = 'authenticated'
      );
  END IF;
END $$;
