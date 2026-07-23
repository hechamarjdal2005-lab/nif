-- 019_contact_social_links.sql
-- Stores the contact/social links shown in the public contact section.

CREATE TABLE IF NOT EXISTS contact_social_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform TEXT UNIQUE NOT NULL CHECK (platform IN ('whatsapp', 'telephone', 'instagram', 'facebook', 'tiktok')),
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  value TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contact_social_links_active_sort
  ON contact_social_links(is_active, sort_order);

CREATE OR REPLACE FUNCTION update_contact_social_links_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_contact_social_links_updated_at ON contact_social_links;
CREATE TRIGGER set_contact_social_links_updated_at
  BEFORE UPDATE ON contact_social_links
  FOR EACH ROW
  EXECUTE FUNCTION update_contact_social_links_updated_at();

ALTER TABLE contact_social_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read active contact_social_links" ON contact_social_links;
DROP POLICY IF EXISTS "Authenticated users can insert contact_social_links" ON contact_social_links;
DROP POLICY IF EXISTS "Authenticated users can update contact_social_links" ON contact_social_links;
DROP POLICY IF EXISTS "Authenticated users can delete contact_social_links" ON contact_social_links;

CREATE POLICY "Public can read active contact_social_links"
  ON contact_social_links
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can insert contact_social_links"
  ON contact_social_links
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update contact_social_links"
  ON contact_social_links
  FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete contact_social_links"
  ON contact_social_links
  FOR DELETE
  USING (auth.role() = 'authenticated');

INSERT INTO contact_social_links (platform, label, href, value, sort_order, is_active)
VALUES
  ('whatsapp', 'WhatsApp', 'https://wa.me/212600000000', '+212 6 00 00 00 00', 1, true),
  ('telephone', 'Telephone', 'tel:+212600000000', '+212 6 00 00 00 00', 2, true),
  ('instagram', 'Instagram', 'https://instagram.com/maisonnifchrif', '@maisonnifchrif', 3, true),
  ('facebook', 'Facebook', 'https://facebook.com/maisonnifchrif', 'Maison Nif Chrif', 4, true),
  ('tiktok', 'TikTok', 'https://tiktok.com/@maisonnifchrif', '@maisonnifchrif', 5, true)
ON CONFLICT (platform) DO UPDATE SET
  label = EXCLUDED.label,
  href = EXCLUDED.href,
  value = EXCLUDED.value,
  sort_order = EXCLUDED.sort_order,
  is_active = EXCLUDED.is_active;
