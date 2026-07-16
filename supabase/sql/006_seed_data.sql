-- Seed data for Maison Nif Chrif

-- Categories
INSERT INTO categories (nom, slug, image) VALUES
  ('Homme', 'homme', '/images/categories/homme.jpg'),
  ('Femme', 'femme', '/images/categories/femme.jpg'),
  ('Cadeaux', 'cadeaux', '/images/categories/cadeaux.jpg'),
  ('Packs', 'packs', '/images/categories/packs.jpg'),
  ('Nouveautés', 'nouveautes', '/images/categories/nouveautes.jpg'),
  ('Best Sellers', 'best-sellers', '/images/categories/best-sellers.jpg');

-- Products (parfums)
INSERT INTO products (nom, slug, description, notes_olfactives, prix, categorie_id, genre, type, images, stock, rating_avg, is_bestseller, is_new) VALUES
  ('Oud Suprême', 'oud-supreme', 'Un parfum d''exception aux notes boisées et orientales, sublimé par la richesse de l''oud.', 'Bois d''oud, Safran, Ambre', 1290.00, (SELECT id FROM categories WHERE slug = 'homme'), 'homme', 'parfum', ARRAY['/images/products/oud-supreme-1.jpg', '/images/products/oud-supreme-2.jpg'], 25, 4.80, true, false),
  ('Rose du Désert', 'rose-desert', 'Une fragrance florale délicate qui évoque les jardins secrets du désert.', 'Rose de Damas, Musc Blanc, Vanille', 980.00, (SELECT id FROM categories WHERE slug = 'femme'), 'femme', 'parfum', ARRAY['/images/products/rose-desert-1.jpg', '/images/products/rose-desert-2.jpg'], 30, 4.70, true, false),
  ('Ambre Noir', 'ambre-noir', 'Un parfum profond et envoûtant, incarnant la sensualité de l''ambre noir.', 'Ambre, Cèdre, Poivre Noir', 1150.00, (SELECT id FROM categories WHERE slug = 'homme'), 'homme', 'parfum', ARRAY['/images/products/ambre-noir-1.jpg'], 20, 4.60, false, true),
  ('Jasmin Royal', 'jasmin-royal', 'Un elixir floral royal, où le jasmin s''exprime dans toute sa splendeur.', 'Jasmin, Ylang-Ylang, Santal', 1050.00, (SELECT id FROM categories WHERE slug = 'femme'), 'femme', 'parfum', ARRAY['/images/products/jasmin-royal-1.jpg', '/images/products/jasmin-royal-2.jpg'], 35, 4.90, true, true),
  ('Santal d''Or', 'santal-or', 'Un voyage olfactif au cœur du santal, où le cuir et le tabac créent une harmonie unique.', 'Santal, Cuir, Tabac', 1350.00, (SELECT id FROM categories WHERE slug = 'homme'), 'homme', 'parfum', ARRAY['/images/products/santal-or-1.jpg'], 15, 4.75, false, false),
  ('Fleur d''Oranger', 'fleur-oranger', 'Une celebration de la fleur d''oranger, emplie de douceur et de charme oriental.', 'Fleur d''oranger, Miel, Patchouli', 890.00, (SELECT id FROM categories WHERE slug = 'femme'), 'femme', 'parfum', ARRAY['/images/products/fleur-oranger-1.jpg', '/images/products/fleur-oranger-2.jpg'], 40, 4.50, false, true),
  ('Musk Intense', 'musk-intense', 'Un parfum unisexe aux accents musqués, pour ceux qui osent l''audace.', 'Musc, Iris, Ambergris', 1100.00, (SELECT id FROM categories WHERE slug = 'homme'), 'mixte', 'parfum', ARRAY['/images/products/musk-intense-1.jpg'], 28, 4.65, false, false),
  ('Bois Sacré', 'bois-sacre', 'Un parfum mystique aux notes boisées et encensées, une odeur à la spiritualité olfactive.', 'Bois de santal, Encens, Vétiver', 1250.00, (SELECT id FROM categories WHERE slug = 'homme'), 'homme', 'parfum', ARRAY['/images/products/bois-sacre-1.jpg'], 22, 4.85, true, false);

-- Pack products
INSERT INTO products (nom, slug, description, notes_olfactives, prix, categorie_id, genre, type, images, stock, rating_avg, is_bestseller, is_new) VALUES
  ('Coffret Signature Homme', 'coffret-signature-homme', 'Le coffret ultime pour l''homme raffiné, contenant nos meilleurs parfums masculins.', 'Selection de parfums homme', 2490.00, (SELECT id FROM categories WHERE slug = 'packs'), 'homme', 'pack', ARRAY['/images/products/coffret-homme-1.jpg', '/images/products/coffret-homme-2.jpg'], 10, 4.90, true, false),
  ('Coffret Découverte Femme', 'coffret-decouverte-femme', 'Un coffret élégant pour découvrir les fragrances les plus emblématiques de la maison.', 'Selection de parfums femme', 1790.00, (SELECT id FROM categories WHERE slug = 'packs'), 'femme', 'pack', ARRAY['/images/products/coffret-femme-1.jpg'], 12, 4.80, false, true);

-- Pack items for Coffret Signature Homme
INSERT INTO pack_items (pack_id, produit_id, quantite) VALUES
  ((SELECT id FROM products WHERE slug = 'coffret-signature-homme'), (SELECT id FROM products WHERE slug = 'oud-supreme'), 1),
  ((SELECT id FROM products WHERE slug = 'coffret-signature-homme'), (SELECT id FROM products WHERE slug = 'ambre-noir'), 1),
  ((SELECT id FROM products WHERE slug = 'coffret-signature-homme'), (SELECT id FROM products WHERE slug = 'santal-or'), 1);

-- Pack items for Coffret Découverte Femme
INSERT INTO pack_items (pack_id, produit_id, quantite) VALUES
  ((SELECT id FROM products WHERE slug = 'coffret-decouverte-femme'), (SELECT id FROM products WHERE slug = 'rose-desert'), 1),
  ((SELECT id FROM products WHERE slug = 'coffret-decouverte-femme'), (SELECT id FROM products WHERE slug = 'jasmin-royal'), 1),
  ((SELECT id FROM products WHERE slug = 'coffret-decouverte-femme'), (SELECT id FROM products WHERE slug = 'fleur-oranger'), 1);

-- Promo codes
INSERT INTO promo_codes (code, type_reduction, valeur, date_debut, date_fin, actif, usage_max, usage_count, produit_id) VALUES
  ('BIENVENUE10', 'pourcentage', 10.00, now(), now() + interval '1 year', true, NULL, 0, NULL),
  ('MAISON200', 'montant_fixe', 200.00, now(), now() + interval '1 year', true, 100, 0, NULL);

-- Testimonials
INSERT INTO testimonials (nom, ville, texte, rating, image, is_approved) VALUES
  ('Fatima Zahra', 'Casablanca', 'Les parfums de Maison Nif Chrif sont d''une qualité exceptionnelle. L''Oud Suprême est devenu mon parfum signature. Service client impeccable !', 5, '/images/testimonials/fatima.jpg', true),
  ('Mohammed Alami', 'Marrakech', 'J''ai commandé le Coffret Signature Homme pour mon mariage. Chaque parfum est une oeuvre d''art olfactive. Je recommande vivement !', 5, '/images/testimonials/mohammed.jpg', true),
  ('Amina Benali', 'Rabat', 'La Rose du Désert m''a conquise. Un parfum délicat mais persistant, parfait pour toutes les occasions. Merci Maison Nif Chrif !', 4, '/images/testimonials/amina.jpg', true),
  ('Youssef Tazi', 'Fès', 'Service rapide et parfums de grande qualité. Le Santal d''Or est absolument divin. Une maison de confiance.', 5, '/images/testimonials/youssef.jpg', true);
