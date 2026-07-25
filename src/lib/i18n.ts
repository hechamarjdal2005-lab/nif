export type Locale = "fr" | "ar";

type TranslationDictionary = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: string | TranslationDictionary | any;
};

const fr: TranslationDictionary = {
  nav: {
    accueil: "Accueil",
    boutique: "Boutique",
    contact: "Contact",
  },
  hero: {
    subtitle: "Parfumerie Artisanale Marocaine",
    description:
      "L\u2019art de la parfumerie marocaine, sublimé par des créations uniques qui racontent l\u2019histoire de notre héritage.",
    btnDiscover: "Découvrir",
    btnCollection: "Voir la Collection",
  },
  home: {
    bestSellersSubtitle: "Les parfums les plus plébiscités par notre clientèle",
    newArrivals: "Nouveautés",
    newArrivalsSubtitle: "Découvrez nos dernières créations",
    packsTitle: "Nos Coffrets",
    packsSubtitle: "Des coffrets soigneusement composés pour offrir ou vous faire plaisir",
    containsProducts: "contient {count} produit(s)",
  },
  featuredCategories: {
    sectionTitle: "Découvrez Nos Univers",
    sectionSubtitle:
      "Explorez nos collections soigneusement composées pour chaque occasion",
    homme: { title: "Homme", desc: "Parfums d\u2019exception pour hommes" },
    femme: { title: "Femme", desc: "Essences raffinées pour femmes" },
    cadeaux: { title: "Cadeaux", desc: "Offres exclusives & coffrets" },
    packs: { title: "Packs", desc: "Coffrets découverte & sets" },
    explorer: "Explorer",
  },
  notreHistoire: {
    label: "Notre Histoire",
    title: "Un Héritage de L\u2019Art Parfumeur",
    p1: "Fondée au cœur de Marrakech, Maison Nif Chrif perpétue la tradition millénaire de la parfumerie marocaine. Nos créations naissent de la rencontre entre les essences les plus précieuses du Royaume et un savoir-faire artisanal transmis de génération en génération.",
    p2: "Chaque flacon raconte une histoire — celle des souks animés, des jardins secrets, et des paysages grandioses du Maroc. Nous sélectionnons méticuleusement chaque ingrédient, de l\u2019oud du Souss à la rose de Kelaat M\u2019Gouna, pour créer des parfums qui évoquent l\u2019âme du Maroc.",
    p3: "Notre engagement : vous offrir des fragrances d\u2019exception, alliant tradition et modernité, dans le respect de l\u2019artisanat et de la nature.",
  },
  whyChooseUs: {
    title: "Pourquoi Nous Choisir",
    subtitle: "L\u2019excellence à chaque étape de notre création",
    cards: [
      {
        title: "Ingrédients Nobles",
        desc: "Sélection rigoureuse des meilleures essences naturelles du Maroc et du monde.",
      },
      {
        title: "Savoir-Faire Artisanal",
        desc: "Chaque parfum est composé à la main par nos maîtres parfumeurs.",
      },
      {
        title: "Qualité Garantie",
        desc: "Longue tenue et sillage exceptionnel, certifié par nos experts.",
      },
      {
        title: "Héritage Marocain",
        desc: "Une tradition parfumière millénaire revisité avec modernité.",
      },
    ],
  },
  testimonials: {
    title: "Ce Que Disent Nos Clients",
    subtitle: "Des mots précieux de ceux qui ont découvert nos créations",
  },
  contact: {
    title: "Contactez-Nous",
    subtitle: "Une question ? Un besoin spécial ? Nous sommes à votre écoute.",
    successTitle: "Message Envoyé !",
    successBody: "Nous vous répondrons dans les plus brefs délais.",
    namePlaceholder: "Votre nom",
    emailPlaceholder: "Votre email",
    messagePlaceholder: "Votre message...",
    sending: "Envoi...",
    send: "Envoyer le Message",
    socialsTitle: "Réseaux sociaux",
    socialsSubtitle: "Contactez-nous directement sur votre canal préféré.",
    error: "Une erreur est survenue. Veuillez réessayer.",
  },
  instagram: {
    subtitle: "Suivez-nous sur Instagram",
  },
  product: {
    nouveau: "Nouveau",
    notesOlfactives: "Notes Olfactives",
    description: "Description",
    inStock: "En stock",
    outOfStock: "Rupture de stock",
    addToCart: "Ajouter au Panier",
  },
  pack: {
    coffret: "Coffret",
    save: "Économisez",
    contents: "Contenu du Coffret",
    qty: "Qté",
    addToCart: "Ajouter au Panier",
  },
  collection: {
    title: "Notre Collection",
    subtitle: "Découvrez notre sélection de parfums artisanaux",
    search: "Rechercher un parfum...",
    all: "Tout",
    homme: "Homme",
    femme: "Femme",
    mixte: "Mixte",
    allCategories: "Toutes catégories",
    results: "{count} produit(s) trouvé(s)",
    emptyTitle: "Aucun produit trouvé",
    emptyDesc: "Essayez de modifier vos filtres de recherche.",
  },
  cart: {
    title: "Mon Panier",
    emptyTitle: "Votre panier est vide",
    emptyDesc: "Découvrez notre collection et ajoutez vos parfums favoris.",
    summary: "Récapitulatif",
    articles: "Articles",
    shipping: "Livraison",
    free: "Gratuite",
    total: "Total",
    checkout: "Passer la commande",
  },
  checkout: {
    successTitle: "Commande Passée !",
    successBody: "Merci pour votre commande. Nous vous contacterons bientôt pour la livraison.",
    backHome: "Retour à l\u2019accueil",
    emptyTitle: "Votre panier est vide",
    emptyDesc: "Ajoutez des produits avant de passer commande.",
    shippingTitle: "Informations de Livraison",
    name: "Nom complet *",
    nameReq: "Nom requis",
    phone: "Téléphone *",
    phoneReq: "Téléphone requis",
    email: "Email (optionnel)",
    address: "Adresse complète *",
    addressReq: "Adresse requise",
    city: "Ville *",
    cityReq: "Ville requise",
    promoTitle: "Code Promo",
    promoPlaceholder: "Entrez votre code",
    apply: "Appliquer",
    promoSuccess: "Réduction de {amount} appliquée !",
    processing: "Traitement en cours...",
    pay: "Payer {total}",
    paymentInfo: "Paiement à la livraison (Cash on Delivery)",
    orderSummary: "Votre Commande",
    subtotal: "Sous-total",
    reduction: "Réduction",
    shippingLabel: "Livraison",
    freeShipping: "Gratuite",
    totalLabel: "Total",
    promoError: "Erreur lors de la vérification du code promo.",
    error: "Une erreur est survenue. Veuillez réessayer.",
  },
  footer: {
    description: "Parfumerie artisanale marocaine, alliant traditions ancestrales et modernité.",
    collection: "Collection",
    homme: "Homme",
    femme: "Femme",
    coffrets: "Coffrets",
    maison: "Maison",
    notreHistoire: "Notre Histoire",
    temoignages: "Témoignages",
    contact: "Contact",
    address: "Marrakech, Maroc",
    rights: "Tous droits réservés.",
    privacy: "Politique de confidentialité",
    terms: "Conditions générales",
  },
  genres: {
    homme: "Homme",
    femme: "Femme",
    mixte: "Mixte",
  },
  productTypes: {
    parfum: "Parfum",
    pack: "Pack",
  },
};

const ar: TranslationDictionary = {
  nav: {
    accueil: "الرئيسية",
    boutique: "المتجر",
    contact: "اتصل بنا",
  },
  hero: {
    subtitle: "عطور مغربية حرفية",
    description:
      "فن العطور المغربية، مُعلَّى بإبداعات فريدة تحكي قصة تراثنا.",
    btnDiscover: "اكتشف",
    btnCollection: "عرض المجموعة",
  },
  home: {
    bestSellersSubtitle: "العطور الأكثر طلباً من عملائنا",
    newArrivals: "وصل حديثاً",
    newArrivalsSubtitle: "اكتشف آخر إبداعاتنا",
    packsTitle: "حِزمنا",
    packsSubtitle: "حِزم منتقاة بعناية للإهداء أو الاستمتاع",
    containsProducts: "يحتوي على {count} منتج(منتجات)",
  },
  featuredCategories: {
    sectionTitle: "اكتشف عوالمنا",
    sectionSubtitle: "استكشف مجموعاتنا المُعدّة بعناية لكل مناسبة",
    homme: { title: "رجال", desc: "عطور استثنائية للرجال" },
    femme: { title: "نساء", desc: "عطور أنيقة للنساء" },
    cadeaux: { title: "هدايا", desc: "عروض حصرية وحِزم" },
    packs: { title: "حِزم", desc: "حِزم اكتشاف ومجموعات" },
    explorer: "استكشف",
  },
  notreHistoire: {
    label: "قصتنا",
    title: "إرث فن العطور",
    p1: "تأسست في قلب مراكش، تستمر Maison Nif Chrif في الحفاظ على التقليد العريق للعطور المغربية. تولد إبداعاتنا من اللقاء بين أثمن روائح المملكة وحرفية متوارثة من جيل إلى آخر.",
    p2: "كل زجاجة تروي قصة — قصة الأسواق النابضة بالحياة، والحدائق السرية، والمناظر الطبيعية الخلابة للمغرب. نختار بعناية كل مكوّن، من عود سوس إلى ورد قلعة مغونة، لإنشاء عطور تستحضر روح المغرب.",
    p3: "التزامنا: تقديم عطور استثنائية تجمع بين الأصالة والحداثة، مع احتر الحرفيين والطبيعة.",
  },
  whyChooseUs: {
    title: "لماذا تختارنا",
    subtitle: "التميز في كل مرحلة من مراحل إبداعنا",
    cards: [
      {
        title: "مكونات نبيلة",
        desc: "اختيار دقيق لأجود الروائح الطبيعية من المغرب والعالم.",
      },
      {
        title: "حرفية تقليدية",
        desc: "كل عطر يُصنع يدوياً من قبل خبراء العطور.",
      },
      {
        title: "جودة مضمونة",
        desc: "ثبات طويل ورائحة استثنائية، معتمدة من خبرائنا.",
      },
      {
        title: "تراث مغربي",
        desc: "تقليد عطري عريق مُحدَّث بلمسة عصرية.",
      },
    ],
  },
  testimonials: {
    title: "ماذا يقول عملاؤنا",
    subtitle: "كلمات ثمينة من أولئك الذين اكتشفوا إبداعاتنا",
  },
  contact: {
    title: "اتصل بنا",
    subtitle: "لديك سؤال أو طلب خاص؟ نحن هنا لمساعدتك.",
    successTitle: "تم إرسال الرسالة!",
    successBody: "سنرد عليك في أقرب وقت ممكن.",
    namePlaceholder: "اسمك",
    emailPlaceholder: "بريدك الإلكتروني",
    messagePlaceholder: "رسالتك...",
    sending: "جاري الإرسال...",
    send: "إرسال الرسالة",
    socialsTitle: "وسائل التواصل الاجتماعي",
    socialsSubtitle: "تواصل معنا مباشرة على قناتك المفضلة.",
    error: "حدث خطأ. يرجى المحاولة مرة أخرى.",
  },
  instagram: {
    subtitle: "تابعنا على انستغرام",
  },
  product: {
    nouveau: "جديد",
    notesOlfactives: "النوتات العطرية",
    description: "الوصف",
    inStock: "متوفر",
    outOfStock: "غير متوفر",
    addToCart: "أضف إلى السلة",
  },
  pack: {
    coffret: "حِزمة",
    save: "وفّر",
    contents: "محتويات الحِزمة",
    qty: "الكمية",
    addToCart: "أضف إلى السلة",
  },
  collection: {
    title: "مجموعتنا",
    subtitle: "اكتشف مجموعتنا المختارة من العطور المغربية",
    search: "ابحث عن عطر...",
    all: "الكل",
    homme: "رجال",
    femme: "نساء",
    mixte: "mixed",
    allCategories: "جميع الفئات",
    results: "{count} منتج(منتجات) موجودة",
    emptyTitle: "لا توجد منتجات",
    emptyDesc: "حاول تعديل معايير البحث.",
  },
  cart: {
    title: "سلة التسوق",
    emptyTitle: "سلة التسوق فارغة",
    emptyDesc: "اكتشف مجموعتنا وأضف عطرك المفضل.",
    summary: "ملخص الطلب",
    articles: "المنتجات",
    shipping: "الشحن",
    free: "مجاني",
    total: "المجموع",
    checkout: "إتمام الطلب",
  },
  checkout: {
    successTitle: "تم تأكيد الطلب!",
    successBody: "شكراً لطلبك. سنتواصل معك قريباً للتسليم.",
    backHome: "العودة إلى الرئيسية",
    emptyTitle: "سلة التسوق فارغة",
    emptyDesc: "أضف منتجات قبل إتمام الطلب.",
    shippingTitle: "معلومات الشحن",
    name: "الاسم الكامل *",
    nameReq: "الاسم مطلوب",
    phone: "الهاتف *",
    phoneReq: "الهاتف مطلوب",
    email: "البريد الإلكتروني (اختياري)",
    address: "العنوان الكامل *",
    addressReq: "العنوان مطلوب",
    city: "المدينة *",
    cityReq: "المدينة مطلوبة",
    promoTitle: "كود الخصم",
    promoPlaceholder: "أدخل الكود",
    apply: "تطبيق",
    promoSuccess: "تم تطبيق خصم بقيمة {amount}!",
    processing: "جاري المعالجة...",
    pay: "ادفع {total}",
    paymentInfo: "الدفع عند الاستلام",
    orderSummary: "ملخص طلبك",
    subtotal: "المجموع الفرعي",
    reduction: "الخصم",
    shippingLabel: "الشحن",
    freeShipping: "مجاني",
    totalLabel: "المجموع",
    promoError: "خطأ في التحقق من كود الخصم.",
    error: "حدث خطأ. يرجى المحاولة مرة أخرى.",
  },
  footer: {
    description: "عطور مغربية حرفية تجمع بين التقاليد العريقة والحداثة.",
    collection: "المجموعة",
    homme: "رجال",
    femme: "نساء",
    coffrets: "الحِزم",
    maison: "الماركة",
    notreHistoire: "قصتنا",
    temoignages: "آراء العملاء",
    contact: "اتصل بنا",
    address: "مراكش، المغرب",
    rights: "جميع الحقوق محفوظة.",
    privacy: "سياسة الخصوصية",
    terms: "الشروط والأحكام",
  },
  genres: {
    homme: "رجال",
    femme: "نساء",
    mixte: "unisexe",
  },
  productTypes: {
    parfum: "عطر",
    pack: "حِزمة",
  },
};

const dictionaries: Record<Locale, TranslationDictionary> = { fr, ar };

export function getTranslation(locale: Locale, key: string): string {
  const keys = key.split(".");
  let result: string | TranslationDictionary = dictionaries[locale];

  for (const k of keys) {
    if (typeof result === "object" && result !== null && k in result) {
      result = result[k];
    } else {
      return key;
    }
  }

  return typeof result === "string" ? result : key;
}

export function getLocalizedField<T extends Record<string, unknown>>(
  obj: T,
  field: string,
  locale: Locale,
): string {
  if (locale === "ar") {
    const arField = `${field}_ar` as keyof T;
    const val = obj[arField];
    if (val && typeof val === "string" && val.trim()) return val;
  }
  const val = obj[field as keyof T];
  return typeof val === "string" ? val : "";
}
