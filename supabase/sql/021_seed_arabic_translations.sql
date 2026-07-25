-- 021_seed_arabic_translations.sql
-- Date: 2026-07-24
-- Populate Arabic translation fields for all seed data.
-- Run AFTER 020_add_arabic_translations.sql has been applied.

-- ========================================
-- CATEGORIES
-- ========================================
UPDATE categories SET nom_ar = 'رجال' WHERE slug = 'homme';
UPDATE categories SET nom_ar = 'نساء' WHERE slug = 'femme';
UPDATE categories SET nom_ar = 'هدايا' WHERE slug = 'cadeaux';
UPDATE categories SET nom_ar = 'حِزم' WHERE slug = 'packs';
UPDATE categories SET nom_ar = 'وصل حديثاً' WHERE slug = 'nouveautes';
UPDATE categories SET nom_ar = 'الأكثر مبيعاً' WHERE slug = 'best-sellers';

-- ========================================
-- PRODUCTS (parfums)
-- ========================================
UPDATE products SET
  nom_ar = 'عود سوبريم',
  description_ar = 'عطر استثنائي بنوتات خشبية وشرقية، يرتقي بثروة العود.',
  notes_olfactives_ar = 'خشب العود، الزعفران، العنبر'
WHERE slug = 'oud-supreme';

UPDATE products SET
  nom_ar = 'وردة الصحراء',
  description_ar = 'عطر زهري رقيق يستحضر حدائق الصحراء السرية.',
  notes_olfactives_ar = 'وردة دمشق، المسك الأبيض، الفانيليا'
WHERE slug = 'rose-desert';

UPDATE products SET
  nom_ar = 'عنبر أسود',
  description_ar = 'عطر عميق وساحر يجسد جمالية العنبر الأسود.',
  notes_olfactives_ar = 'العنبر، الأرز، الفلفل الأسود'
WHERE slug = 'ambre-noir';

UPDATE products SET
  nom_ar = 'ياسمين ملكي',
  description_ar = 'lixir زهري ملكي حيث يتألق الياسمين بأبهى صورة.',
  notes_olfactives_ar = 'الياسمين، الإيلانغ الإيلانغ، الصندل'
WHERE slug = 'jasmin-royal';

UPDATE products SET
  nom_ar = 'صندل ذهبي',
  description_ar = 'رحلة عطرية في قلب الصندل حيث يخلق الجلد والتبغ تناغماً فريداً.',
  notes_olfactives_ar = 'الصندل، الجلد، التبغ'
WHERE slug = 'santal-or';

UPDATE products SET
  nom_ar = 'زهرة البرتقال',
  description_ar = 'احتفال بزهرة البرتقال، مليئة بالنعمة والجاذبية الشرقية.',
  notes_olfactives_ar = 'زهرة البرتقال، العسل، الباتشولي'
WHERE slug = 'fleur-oranger';

UPDATE products SET
  nom_ar = 'مسك قوي',
  description_ar = 'عطر unisexe بلمسات مسكية، لأولئك الذين يجرؤون على المغامرة.',
  notes_olfactives_ar = 'المسك، الإريس، العنبر البحري'
WHERE slug = 'musk-intense';

UPDATE products SET
  nom_ar = 'خشب مقدس',
  description_ar = 'عطر صوفي بنوتات خشبية وبخورية، رائحة الروحانية العطرية.',
  notes_olfactives_ar = 'خشب الصندل، البخور، الفيتيفر'
WHERE slug = 'bois-sacre';

-- ========================================
-- PRODUCTS (packs)
-- ========================================
UPDATE products SET
  nom_ar = 'حِزمة سيغنتشر رجالي',
  description_ar = 'الحِزمة المثالية للرجل الرقيق، تحتوي على أفضل عطورنا الرجالية.',
  notes_olfactives_ar = 'مجموعة مختارة من عطور الرجال'
WHERE slug = 'coffret-signature-homme';

UPDATE products SET
  nom_ar = 'حِزمة اكتشاف نسائية',
  description_ar = 'حِزمة أنيقة لاكتشاف أشهر عطور الماركة.',
  notes_olfactives_ar = 'مجموعة مختارة من عطور النساء'
WHERE slug = 'coffret-decouverte-femme';

-- ========================================
-- TESTIMONIALS
-- ========================================
UPDATE testimonials SET
  nom_ar = 'فاطمة الزهراء',
  ville_ar = 'الدار البيضاء',
  texte_ar = 'عطور Maison Nif Chrif بجودة استثنائية. أصبح عود سوبريم عطرني المميز. خدمة عملاء ممتازة!'
WHERE nom = 'Fatima Zahra';

UPDATE testimonials SET
  nom_ar = 'محمد علمي',
  ville_ar = 'مراكش',
  texte_ar = 'طلبت حِزمة سيغنتشر رجالي لزفافي. كل عطر تحفة فنية عطرية. أنصح بشدة!'
WHERE nom = 'Mohammed Alami';

UPDATE testimonials SET
  nom_ar = 'أمينة بنعلي',
  ville_ar = 'الرباط',
  texte_ar = 'وردة الصحراء فاتتني. عطر رقيق لكنه持久، مناسب لكل المناسبات. شكراً Maison Nif Chrif!'
WHERE nom = 'Amina Benali';

UPDATE testimonials SET
  nom_ar = 'يوسف تازي',
  ville_ar = 'فاس',
  texte_ar = 'خدمة سريعة وعطور بجودة عالية. الصندل الذهبي مذهل絕對اً. ماركة موثوقة.'
WHERE nom = 'Youssef Tazi';

-- ========================================
-- SITE_CONTENT (JSONB) — Arabic keys
-- ========================================

-- Hero
UPDATE site_content SET content = content || '{
  "subtitle_ar": "عطور مغربية حرفية",
  "title_ar": " maison nif chrif",
  "description_ar": "فن العطور المغربية، مُعلَّى بإبداعات فريدة تحكي قصة تراثنا.",
  "button_primary_text_ar": "اكتشف",
  "button_secondary_text_ar": "عرض المجموعة"
}' WHERE section = 'hero';

-- Notre Histoire
UPDATE site_content SET content = content || '{
  "section_label_ar": "قصتنا",
  "title_ar": "إرث فن العطور",
  "paragraphs_ar": [
    "تأسست في قلب مراكش، تستمر Maison Nif Chrif في الحفاظ على التقليد العريق للعطور المغربية. تولد إبداعاتنا من اللقاء بين أثمن روائح المملكة وحرفية متوارثة من جيل إلى آخر.",
    "كل زجاجة تروي قصة — قصة الأسواق النابضة بالحياة، والحدائق السرية، والمناظر الطبيعية الخلابة للمغرب. نختار بعناية كل مكوّن، من عود سوس إلى ورد قلعة مغونة، لإنشاء عطور تستحضر روح المغرب.",
    "التزامنا: تقديم عطور استثنائية تجمع بين الأصالة والحداثة، مع احترام الحرفيين والطبيعة."
  ]
}' WHERE section = 'notre_histoire';

-- Pourquoi Nous Choisir
UPDATE site_content SET content = content || '{
  "title_ar": "لماذا تختارنا",
  "subtitle_ar": "التميز في كل مرحلة من مراحل إبداعنا",
  "cards_ar": [
    {"title": "مكونات نبيلة", "description": "اختيار دقيق لأجود الروائح الطبيعية من المغرب والعالم."},
    {"title": "حرفية تقليدية", "description": "كل عطر يُصنع يدوياً من قبل خبراء العطور."},
    {"title": "جودة مضمونة", "description": "ثبات طويل ورائحة استثنائية، معتمدة من خبرائنا."},
    {"title": "تراث مغربي", "description": "تقليد عطري عريق مُحدَّث بلمسة عصرية."}
  ]
}' WHERE section = 'pourquoi_nous_choisir';

-- ========================================
-- CONTACT_SOCIAL_LINKS
-- ========================================
UPDATE contact_social_links SET label_ar = 'واتساب' WHERE platform = 'whatsapp';
UPDATE contact_social_links SET label_ar = 'الهاتف' WHERE platform = 'telephone';
UPDATE contact_social_links SET label_ar = 'انستغرام' WHERE platform = 'instagram';
UPDATE contact_social_links SET label_ar = 'فيسبوك' WHERE platform = 'facebook';
UPDATE contact_social_links SET label_ar = 'تيك توك' WHERE platform = 'tiktok';
