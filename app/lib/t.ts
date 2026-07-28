// app/lib/t.ts
// -----------------------------------------------------------------------------
// All German UI strings live here (AI_CONTEXT.md §2.4). Components import `t`
// instead of hardcoding text, so copy changes and future locales are trivial.
// Marketing/content copy lives in Shopify admin (pages, metaobjects), not here.
// -----------------------------------------------------------------------------

export const t = {
  announcement: {
    items: [
      'NSF-zertifiziert 42 & 372',
      'Kostenloser Versand ab 99 €',
      '50+ Jahre Erfahrung',
    ],
  },

  nav: {
    home: 'Startseite',
    shop: 'Alle Produkte',
    system: 'Filtersystem',
    reviews: 'Bewertungen',
    faq: 'FAQ',
    account: 'Konto',
    signIn: 'Anmelden',
    search: 'Suche',
    cart: 'Warenkorb',
    cartCount: (count: number) => `${count} Artikel`,
    menu: 'Menü',
  },

  cta: {
    orderNow: 'Jetzt bestellen',
    addToCart: 'In den Warenkorb',
    checkout: 'ZUR KASSE',
    continueShopping: 'Weiter einkaufen',
    viewAllReviews: 'Alle Bewertungen ansehen',
    tryRiskFree: '100 Tage risikofrei testen',
  },

  cart: {
    title: 'Ihr Warenkorb',
    empty: 'Ihr Warenkorb ist leer',
    emptyPrompt: 'Sie haben noch keine Produkte hinzugefügt.',
    lineItems: 'Warenkorbpositionen',
    childLineItems: (product: string) =>
      `Zusätzliche Positionen für ${product}`,
    subtotal: 'Zwischensumme',
    remove: 'Entfernen',
    removeGiftCard: (lastCharacters: string) =>
      `Geschenkgutschein mit der Endung ${lastCharacters} entfernen`,
    quantity: 'Menge',
    freeShippingRemaining: (amount: string) =>
      `Nur noch ${amount} bis zum kostenlosen Versand!`,
    freeShippingUnlocked: 'Glückwunsch! Kostenloser Versand freigeschaltet!',
    checkoutNote: 'Inklusive schnellem, kostenlosem Versand',
  },

  price: {
    /** Rendered near every price. Link "Versand" to the shipping page. */
    taxNote: 'inkl. MwSt., zzgl.',
    taxNoteShippingWord: 'Versand',
    shippingPagePath: '/pages/versand-und-rueckgabe',
    discountBadge: (pct: number) => `−${pct}%`,
  },

  product: {
    sizeOption: 'Größe',
    soldOut: 'Ausverkauft',
    description: 'Beschreibung',
    inTheBox: 'Lieferumfang',
    shipping: 'Versand',
    addToCart: 'In den Warenkorb',
    addToCartAria: 'Produkt in den Warenkorb legen',
    quantity: 'Menge',
    trust: {
      freeShipping: 'Kostenloser Versand',
      moneyBack: '100 Tage Geld-zurück',
      certified: 'NSF-zertifiziert',
      support: 'Persönlicher Support',
    },
    accordions: {
      description: 'Beschreibung',
      specifications: 'Technische Daten',
      contents: 'Lieferumfang',
      shipping: 'Versand',
      faq: 'Häufige Fragen',
    },
    gallery: {
      imagesLabel: 'Produktbilder',
      image: (index: number) => `Bild ${index}`,
      thumbnail: (index: number) => `Vorschaubild ${index}`,
      showImage: (index: number) => `Bild ${index} anzeigen`,
      productImage: 'Produktbild',
      previous: 'Vorheriges Produktbild',
      next: 'Nächstes Produktbild',
    },
    stickyBar: {
      cta: 'Jetzt bestellen',
    },
    rating: (count: number) => `Basierend auf ${count} Bewertungen`,
    ratingLink: 'Bewertungen ansehen',
    marketBadge: 'Für deutsche Wasserbedingungen entwickelt',
    intro:
      'Reines, wohlschmeckendes Wasser ohne Strom, Installation oder festen Wasseranschluss. Das langlebige Edelstahlgehäuse und die leistungsstarken Filterelemente machen sauberes Trinkwasser im Alltag besonders einfach.',
    shippingEstimate: 'Versand innerhalb von 3–5 Werktagen',
    unavailableMessage: 'Diese Variante ist derzeit nicht verfügbar.',
    purchaseOptions: {
      heading: 'Kaufoptionen',
      oneTime: 'Einmaliger Kauf',
      note: 'Abonnements können jederzeit angepasst, pausiert oder gekündigt werden.',
    },
  },

  hero: {
    eyebrow: '50+ Jahre Erfahrung',
    headline1: 'Reines Wasser,',
    headline2: 'natürlich.',
    subline: 'Ohne Strom, ohne Anschluss. 800.000 Haushalte vertrauen uns.',
  },

  featureGrid: {
    heading: 'Konzipiert für Perfektion',
  },

  finalCta: {
    heading: 'Testen Sie es mit 100 Tagen Geld-zurück-Garantie',
    body: 'Wir glauben an die Kraft des Phoenix Schwerkraft-Wasserfilters. Deshalb bieten wir Ihnen 100 Tage Testzeit. Mehr als ein Produkt — ein Engagement für Ihr Wohlbefinden.',
  },

  impact: {
    heading: 'Weniger Plastik. Mehr reines Wasser.',
    eyebrow: 'Umwelt-Impact',
    question: 'Wie viele Personen leben in Ihrem Haushalt?',
    people: (n: number) => `${n} ${n === 1 ? 'Person' : 'Personen'}`,
    bottlesAvoided: 'Flaschen vermieden/Jahr',
    co2Avoided: 'kg CO₂ vermieden/Jahr',
    moneySaved: '€ gespart/Jahr',
    estimatedUsage: 'Geschätzter Verbrauch',
    usageValue: (litres: string) => `${litres} L/Jahr`,
    capacityLabel: 'Phoenix-Kapazität',
    capacityValue: '20.000 L oder 12 Monate',
    footnote:
      'Schätzwerte auf Basis von 180 Flaschen/Person/Jahr, 0,11 kg CO₂ pro ' +
      'Flasche und 2 L Wasser/Person/Tag. Kapazität: 20.000 L pro ' +
      'Kartuschenpaar (10.000 L je Kartusche) bzw. 12 Monate — abhängig von ' +
      'der Wasserquelle.',
    decrease: 'Weniger Personen',
    increase: 'Mehr Personen',
  },

  reviews: {
    basedOn: (count: number) => `Basierend auf ${count} Bewertungen`,
    averageLabel: (rating: string) => `Ø ${rating}/5`,
    starsAria: (rating: number) => `${rating} von 5 Sternen`,
  },

  search: {
    placeholder: 'Suchen …',
    noResults: 'Keine Ergebnisse gefunden.',
  },

  errors: {
    notFound: 'Diese Seite wurde nicht gefunden.',
    generic: 'Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.',
    backHome: 'Zur Startseite',
  },

  a11y: {
    announcement: 'Ankündigungen',
    closeDialog: 'Schließen',
    openCart: 'Warenkorb öffnen',
    mainNavigation: 'Hauptnavigation',
  },
} as const;

export type Translations = typeof t;
