-- 012_site_logo.sql
-- Date: 2026-07-17
-- Ajoute la section 'site_settings' dans la table site_content
-- pour stocker l'URL du logo du site éditable depuis l'admin dashboard.

INSERT INTO site_content (section, content)
VALUES ('site_settings', '{"logo_url": ""}'::jsonb)
ON CONFLICT (section) DO NOTHING;
