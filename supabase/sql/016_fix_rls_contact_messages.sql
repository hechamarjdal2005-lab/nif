-- 016_fix_rls_contact_messages.sql
-- Date: 2026-07-17
-- Problème : SELECT et UPDATE utilisent is_admin() → 403.
--   Le panel admin (/admin/messages) ne peut ni lire ni marquer les messages.
-- Fix : admin authentifié peut lire/modifier/supprimer ; visiteurs peuvent envoyer.

-- 1. Supprimer les policies cassées
DROP POLICY IF EXISTS "Admins can read contact_messages" ON contact_messages;
DROP POLICY IF EXISTS "Admins can update contact_messages" ON contact_messages;

-- 2. SELECT : admin uniquement
CREATE POLICY "Authenticated users can read contact_messages"
  ON contact_messages
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- 3. UPDATE : admin uniquement (marquer comme lu, etc.)
CREATE POLICY "Authenticated users can update contact_messages"
  ON contact_messages
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- 4. DELETE : admin uniquement
CREATE POLICY "Authenticated users can delete contact_messages"
  ON contact_messages
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- La policy INSERT existante ("Anyone can insert contact_messages" WITH CHECK (true)) est inchangée.
-- Les visiteurs du site peuvent envoyer un message via le formulaire contact.
