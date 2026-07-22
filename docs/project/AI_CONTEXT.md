# AI_CONTEXT.md — Phoenix Germany Hydrogen Storefront

> **Purpose of this file:** Feed this entire document to any LLM / AI coding agent
> (Claude Code, Cursor, Copilot, etc.) as project context. It contains everything
> needed to recreate, continue, or review this project without prior conversation
> history. Keep it updated as decisions change — it is the single source of truth.

---

## 1. Project summary

Build a **Shopify Hydrogen (Remix-based) headless storefront** for the German
market of Phoenix Gravity Water Filters. It must match the look, feel, and
functionality of the existing French storefront (phoenixwaterfilters.fr) — a
single-product, conversion-focused store selling a stainless-steel gravity
water filter — but with German language, German legal pages, and EUR pricing.

- **Owner:** The store owner operates the existing FR store; all brand assets
  (logo, product photos, videos, lab reports) are owned and may be reused.
- **Strategy:** Build against a **Shopify development store** first. After
  completion, re-link the same codebase to the production store. Therefore all
  code must reference **stable handles and env vars only** — never hardcoded
  store-specific IDs.
- **Stack:** Hydrogen (latest) · Remix · **TypeScript** · **Tailwind CSS** ·
  Shopify Storefront API · Oxygen hosting.
- **Locale:** `language: DE`, `country: DE`, currency EUR, `<html lang="de">`.

## 2. Non-negotiable constraints

1. TypeScript everywhere; strict mode on.
2. All Shopify data via Storefront API GraphQL from route loaders (SSR).
   No client-side secret usage. Public token only in the browser.
3. Every store-specific value lives in `.env` / Oxygen env vars or
   `app/lib/config.ts` — the dev→prod cutover must touch only those.
4. All user-facing strings in German, centralized in `app/lib/t.ts`
   (no hardcoded strings scattered in components).
5. German e-commerce compliance:
   - Footer links: **Impressum** and **Widerrufsbelehrung** (mandatory),
     Datenschutzerklärung, AGB, Versand & Rückgabe.
   - Price notes near every price: `inkl. MwSt., zzgl. Versand` (link the
     shipping word to the shipping page).
   - Cookie-consent gate before loading GTM/marketing pixels (use Shopify
     Customer Privacy API; no marketing scripts before consent).
6. Checkout is Shopify hosted checkout via `cart.checkoutUrl` — do not build
   custom checkout.
7. Do not copy marketing text verbatim from the FR site; German copy is
   written fresh (placeholders marked `TODO:copy` until final text provided).

## 3. Configuration (single source)

```ts
// app/lib/config.ts
export const config = {
  productHandle: 'the-phoenix-gravity-wasserfilter', // FIX handle now; must match prod
  collectionAllHandle: 'all-products',
  freeShippingThresholdEUR: 99,
  currency: 'EUR',
  locale: 'de-DE',
  contactEmail: 'support@PLACEHOLDER.de',          // TODO
  contactPhone: '+49 000 0000000',                 // TODO
  gtmId: '',                                        // from env: PUBLIC_GTM_ID
  reviewProvider: 'judgeme',                        // DECIDED 2026-07-17
};
```

Environment variables (pulled via `npx shopify hydrogen env pull`):
`PUBLIC_STOREFRONT_API_TOKEN`, `PUBLIC_STORE_DOMAIN`,
`PUBLIC_STOREFRONT_ID`, `SESSION_SECRET`, plus custom `PUBLIC_GTM_ID`,
`PUBLIC_CANONICAL_DOMAIN`, `JUDGEME_PRIVATE_TOKEN`, `JUDGEME_SHOP_DOMAIN`.
Optional media vars: `PUBLIC_HERO_VIDEO_URL`, `PUBLIC_HERO_POSTER_URL`.

## 4. Shopify admin data model (must exist in dev AND prod with identical handles)

### 4.1 Product
| Field | Value |
|---|---|
| Handle | `the-phoenix-gravity-wasserfilter` |
| Variants | `8L`, `12L` (option name: `Größe`) |
| Pricing | `price` + `compareAtPrice` set (drives strike-through + −% badge) |
| Media | Product gallery images (reuse existing CDN assets) |

### 4.2 Navigation menus (handles are contract — do not rename)
| Handle | Items |
|---|---|
| `main-menu` | Alle Produkte (collection), Filtersystem (product), Bewertungen (page), FAQ (page) |
| `footer-menu-1` | Shop, So funktioniert's, Über uns, Kontakt, Installation, FAQ, Händler werden |
| `footer-menu-2` | Versand & Rückgabe, Datenschutzerklärung, Freunde werben, AGB, Laborberichte (file URL), Produktregistrierung, Impressum, Widerruf, Blog |

### 4.3 Pages (type: standard Shopify pages, rendered by `pages.$handle.tsx`)
`faq`, `bewertungen`, `ueber-uns`, `kontakt`, `so-funktionierts`,
`installation`, `versand-und-rueckgabe`, `datenschutzerklaerung`, `agb`,
`impressum`, `widerrufsbelehrung`, `produktregistrierung`, `freunde-werben`.

### 4.4 Blog
Handle: `wasserqualitaet` (articles authored in admin).

### 4.5 Metaobject definitions
| Type | Fields | Used by |
|---|---|---|
| `announcement` | `text` (single line), `order` (int) | Announcement marquee |
| `feature_item` | `icon` (file ref), `text` (single line), `group` (`perfection` \| `trust`) | "Designed for perfection" grid; cart trust row |
| `comparison_row` | `label`, `phoenix` (bool), `other_systems` (bool), `bottled` (bool), `pitchers` (bool) | Comparison table |
| ~~`review`~~ | — | Not needed: reviews come from **Judge.me** (see §9a) |
| `step_item` | `icon` (file), `title`, `body`, `order` | 3-step section |
| `box_item` | `text` | "What's in the box" list |
| `lab_report` | `image` (file), `label`, `pdf` (file ref) | Lab reports section |

### 4.6 Files (Settings → Files)
Hero video mp4 + poster jpg, lab report PDFs (German), all section icons
(SVG), guarantee/warranty images, payment icons if static.

## 5. Route map (Remix file routes)

| Route file | Purpose |
|---|---|
| `_index.tsx` | Homepage (all sections below) |
| `products.$handle.tsx` | Product detail page |
| `collections.$handle.tsx` | Collection grid (`all-products`) |
| `pages.$handle.tsx` | CMS pages incl. legal |
| `blogs.$blogHandle._index.tsx` / `...$articleHandle.tsx` | Blog |
| `cart.tsx` | Cart route (drawer is primary UI) |
| `search.tsx` | Search |
| `policies.*` | Shopify policies |
| `account.*` | Customer accounts (skeleton default, new customer accounts) |
| `[robots.txt].tsx`, `[sitemap.xml].tsx` | SEO (skeleton default) |

## 6. Homepage section order & component spec

Render order in `_index.tsx` (each is a component in `app/components/`):

1. **`AnnouncementBar`** — infinite CSS marquee cycling short trust messages
   (NSF-zertifiziert 42 & 372 · Kostenloser Versand ab 99 € · 50+ Jahre
   Erfahrung · Sale-Banner). Duplicated track + `@keyframes` translateX;
   pauses on hover; `aria-hidden` on the duplicate.
2. **`HeroVideo`** — full-viewport background `<video autoPlay muted loop
   playsInline poster>`; overlay: eyebrow line, H1 (serif italic accent on the
   last word, matching FR style: large white headline over video), star-rating
   link to reviews page, live price block (price, struck compare-at, −% badge,
   `inkl. MwSt.` note), primary CTA → product page, checkmark trust line
   (100-Tage Geld-zurück · NSF-zertifiziert · Kostenloser Versand). Price data
   comes from a product query in the index loader — never hardcoded.
3. **`FeatureSplit`** (reusable, `imageSide: 'left' | 'right'`) — heading, rich
   body, optional CTA, image. Used ~4× (innovation, affordability, design,
   most-advanced sections).
4. **`ProductGalleryStrip`** — horizontal scroll-snap strip of product photos.
5. **`ImpactCalculator`** — interactive client component:
   - Stepper/slider: household size `people` (1–8, default 2).
   - Derived (constants in component): `litres = people*2*365`,
     `bottles = people*180`, `co2 = round(bottles*0.11)` kg,
     `savedEUR = round(bottles*0.6)`.
   - Stat cards: Flaschen vermieden/Jahr, kg CO₂ vermieden/Jahr, € gespart/Jahr,
     geschätzter Verbrauch L/Jahr vs. Kapazität (20.000 L pro Kartuschenpaar
     oder 12 Monate).
   - Footnote with the assumption disclaimer; CTA button; trust line.
6. **`ComparisonTable`** — rows from `comparison_row` metaobjects; columns:
   Phoenix / andere Systeme / Flaschenwasser / Filterkannen; check/cross SVGs;
   `overflow-x-auto` on mobile; first column sticky.
7. **`ThreeSteps`** — from `step_item` metaobjects (Aufbauen → Leitungswasser
   einfüllen → Trinken).
8. **`GuaranteeSection`** — image + copy for the 100-day money-back trial.
9. **`ReviewsCarousel`** — aggregate rating header ("4,62/5 aus 935
   Bewertungen" — pull numbers from metaobject or review app, not hardcoded),
   swipeable cards, link to reviews page. Provider behind an interface:
   `getReviews(): Promise<Review[]>` so metaobjects ↔ Judge.me are swappable.
10. **`WhatsInTheBox`** — checklist from `box_item` + warranty image + CTA.
11. **`LabReports`** — three cards from `lab_report` metaobjects linking PDFs.
12. **`Footer`** — logo + tagline, two menu columns, social icons, contact
    block (phone, email), legal note, payment icons, copyright.

## 7. Global UI

- **`Header`** — sticky; logo left; `main-menu` center/left; icons right:
  account (`/account`), search (opens search aside), cart button with count
  (opens cart aside). Mobile: hamburger → menu aside. Shadow appears on scroll.
- **`CartAside` (drawer)** — skeleton `Aside` extended with:
  - **`FreeShippingBar`**: threshold from config (99 €).
    `remaining = max(0, threshold - subtotal)`;
    text: `Nur noch €X bis zum kostenlosen Versand!` → on unlock:
    `Glückwunsch! Kostenloser Versand freigeschaltet!`; animated progress bar.
  - Trust icon row (50+ Jahre · 99,99 % Filterung · 800.000+ Kunden) from
    `feature_item` group `trust`.
  - Line items with quantity steppers + remove; subtotal; big CTA
    `ZUR KASSE` → `cart.checkoutUrl`; note about fast free shipping.
  - Empty state: message + "Weiter einkaufen" link to collection.
- **`SearchAside`** — skeleton predictive search, German placeholder text.

## 8. Product page spec (`products.$handle.tsx`)

- Two-column desktop: gallery (thumbnails + main image, zoom optional) left;
  buy box right: title, rating link, price block with compare-at + `inkl.
  MwSt., zzgl. Versand`, variant selector (Größe: 8L/12L) via
  `getProductOptions`/`VariantSelector`, quantity stepper, `CartForm`
  LinesAdd (opens cart drawer on success), trust checkmarks, accordions
  (Beschreibung / Lieferumfang / Versand / FAQ) using `descriptionHtml`.
- Sticky mobile buy bar (price + Add-to-cart) after scrolling past buy box.
- JSON-LD `Product` structured data with offer, rating.

## 9a. Reviews — Judge.me integration (DECIDED)

- Install the **Judge.me** app on the store (dev first, prod at cutover).
- Server-side provider: `app/lib/reviews.server.ts` with `getReviews(env)` and
  `getReviewSummary(env)` calling the Judge.me REST API
  (`https://judge.me/api/v1/...`) using env vars:
  `JUDGEME_PRIVATE_TOKEN` (server-only, never in the client bundle) and
  `JUDGEME_SHOP_DOMAIN` (myshopify domain of the *currently linked* store —
  changes at cutover).
- Fail soft: on any API error return `[]` / `null`; the reviews section hides
  itself. **Never render fabricated ratings or counts.**
- Aggregate numbers (Ø rating, total count) feed both the reviews header and
  the product JSON-LD `aggregateRating`.
- Homepage loader fetches reviews + summary in parallel with product/metaobject
  queries; pass plain data to `<ReviewsCarousel/>` (client-safe component).

## 9. Analytics, SEO, consent

- `Analytics.Provider` (Hydrogen built-in) wired in `root.tsx` with cart data.
- GTM loaded **only after consent** via Customer Privacy API; container id from
  `PUBLIC_GTM_ID` env var (different ids for dev/prod).
- `getSeoMeta` per route; German titles/descriptions; OG image; canonical to
  final production domain from env `PUBLIC_CANONICAL_DOMAIN`.
- `robots.txt` + `sitemap.xml` from skeleton.

## 10. Design tokens (Tailwind)

```
Colors:  brand-dark   #0B1B2B   (deep navy — headers/footer background)
         brand-blue   #1F6FEB   (primary CTA)  TODO: confirm exact brand hex
         brand-gold   #C9A24B   (accents, stars) TODO: confirm
         surface      #F7F9FB, white
Type:    Headings: serif (e.g. 'Playfair Display' or brand font) with italic
         accent words; Body: clean sans (e.g. 'Inter').
Radius:  buttons pill (9999px) or 8px — match FR look. Buttons uppercase,
         letter-spacing wide.
```
Extend `tailwind.config.ts` with these tokens; never use raw hex in components.

## 11. Commands

```bash
# scaffold
npm create @shopify/hydrogen@latest -- --template skeleton   # TS + Tailwind
# link to DEV store (Hydrogen sales channel must be installed on the store)
npx shopify hydrogen link && npx shopify hydrogen env pull
npm run dev                      # http://localhost:3000
npm run build && npm run preview # production build check
npx shopify hydrogen deploy      # deploy to Oxygen
# CUTOVER to production store later:
npx shopify hydrogen unlink && npx shopify hydrogen link   # pick prod storefront
npx shopify hydrogen env pull && npm run dev               # smoke test
npx shopify hydrogen deploy
```

## 12. Definition of done (acceptance checklist)

- [ ] Homepage matches FR structure section-for-section, fully in German.
- [ ] Lighthouse: Performance ≥ 90 mobile, SEO ≥ 95, a11y ≥ 95.
- [ ] Add to cart → drawer opens → free-shipping bar updates → checkout
      reachable with correct EUR totals.
- [ ] Variant switch updates price, compare-at, image, URL param.
- [ ] All legal pages reachable from footer; consent banner blocks GTM until
      accepted; prices show MwSt. note.
- [ ] No hardcoded store domain/ids anywhere (`grep -r "myshopify" app/` clean
      except env usage).
- [ ] Works after re-linking to a different store with same handles (tested).

## 13. Current status

See `PROGRESS.md`. Update both files when decisions change.
