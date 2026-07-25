-- 024_pack_items_description.sql
-- Date: 2026-07-25
-- Add a pack-specific explanation for each product included in a pack.

ALTER TABLE pack_items
  ADD COLUMN IF NOT EXISTS description TEXT;

