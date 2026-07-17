-- 011_site_content.sql
-- Date: 2026-07-17
-- Crée la table site_content pour rendre le contenu de la page d'accueil
-- éditable depuis l'admin dashboard. Structure flexible en JSONB :
-- une ligne par section (hero, notre_histoire, pourquoi_nous_choisir).

-- ========================================
-- TABLE: site_content
-- ========================================

CREATE TABLE IF NOT EXISTS site_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section TEXT UNIQUE NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_site_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON site_content;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON site_content
  FOR EACH ROW
  EXECUTE FUNCTION update_site_content_updated_at();

-- ========================================
-- RLS POLICIES
-- ========================================

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- SELECT public : le site doit pouvoir lire le contenu pour l'afficher
CREATE POLICY "Public can read site_content"
  ON site_content
  FOR SELECT
  USING (true);

-- INSERT : réservé à l'admin authentifié
CREATE POLICY "Authenticated users can insert site_content"
  ON site_content
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- UPDATE : réservé à l'admin authentifié
CREATE POLICY "Authenticated users can update site_content"
  ON site_content
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- DELETE : réservé à l'admin authentifié
CREATE POLICY "Authenticated users can delete site_content"
  ON site_content
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- ========================================
-- SEED DATA: valeurs initiales (exactement comme en dur dans les composants)
-- ========================================

-- Hero section
INSERT INTO site_content (section, content) VALUES
('hero', '{
  "subtitle": "Parfumerie Artisanale Marocaine",
  "title": "Maison Nif Chrif",
  "description": "L''art de la parfumerie marocaine, sublimé par des créations uniques qui racontent l''histoire de notre héritage.",
  "button_primary_text": "Explore Collection",
  "button_primary_link": "/collection",
  "button_secondary_text": "Our Story",
  "button_secondary_link": "/#notre-histoire",
  "background_image_url": ""
}'::jsonb);

-- Notre Histoire section
INSERT INTO site_content (section, content) VALUES
('notre_histoire', '{
  "section_label": "Notre Histoire",
  "title": "Un Héritage de L'\''Art Parfumeur",
  "paragraphs": [
    "Fondée au cœur de Marrakech, Maison Nif Chrif perpétue la tradition millénaire de la parfumerie marocaine. Nos créations naissent de la rencontre entre les essences les plus précieuses du Royaume et un savoir-faire artisanal transmis de génération en génération.",
    "Chaque flacon raconte une histoire — celle des souks animés, des jardins secrets, et des paysages grandioses du Maroc. Nous sélectionnons méticuleusement chaque ingrédient, de l'\''oud du Souss à la rose de Kelaat M'\''Gouna, pour créer des parfums qui évoquent l'\''âme du Maroc.",
    "Notre engagement : vous offrir des fragrances d'\''exception, alliant tradition et modernité, dans le respect de l'\''artisanat et de la nature."
  ],
  "images": ["", "", "", ""]
}'::jsonb);

-- Pourquoi Nous Choisir section
INSERT INTO site_content (section, content) VALUES
('pourquoi_nous_choisir', '{
  "title": "Pourquoi Nous Choisir",
  "subtitle": "L'\''excellence à chaque étape de notre création",
  "cards": [
    {"title": "Ingrédients Nobles", "description": "Sélection rigoureuse des meilleures essences naturelles du Maroc et du monde."},
    {"title": "Savoir-Faire Artisanal", "description": "Chaque parfum est composé à la main par nos maîtres parfumeurs."},
    {"title": "Qualité Garantie", "description": "Longue tenue et sillage exceptionnel, certifié par nos experts."},
    {"title": "Héritage Marocain", "description": "Une tradition parfumière millénaire revisited avec modernité."}
  ]
}'::jsonb);

-- ========================================
-- FIX: Storage RLS pour le bucket site-assets
-- Les policies INSERT/UPDATE/DELETE utilisent is_admin() qui est cassé
-- (admin_users est vide). On les remplace par auth.role() = 'authenticated'.
-- ========================================

DROP POLICY IF EXISTS "Admins can upload site assets" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update site assets" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete site assets" ON storage.objects;

CREATE POLICY "Authenticated users can upload site assets"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'site-assets'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can update site assets"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'site-assets'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can delete site assets"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'site-assets'
    AND auth.role() = 'authenticated'
  );
