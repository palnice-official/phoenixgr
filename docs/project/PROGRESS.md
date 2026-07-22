# PROGRESS.md — Phoenix DE Hydrogen Build

> Update this file at the end of every work session. Mark items `[x]` when done,
> add dates and notes. Any AI agent continuing the project should read
> `AI_CONTEXT.md` first, then this file to know where to resume.

**Legend:** `[ ]` todo · `[~]` in progress · `[x]` done · `[!]` blocked

**Last updated:** 2026-07-21 · **Current phase:** 8 — QA / polish; waiting on Shopify product setup

---

## Phase 0 — Decisions & prerequisites
- [ ] Shopify Partner account available
- [ ] Decide final product handle (`the-phoenix-gravity-wasserfilter`?) — LOCKED once chosen
- [x] Decide review provider: **Judge.me** (2026-07-17) → AI_CONTEXT §9a; install app on dev store + set `JUDGEME_*` env vars
- [ ] Confirm brand colors + fonts (update `AI_CONTEXT.md` §10)
- [ ] Collect German copy (or approve AI-drafted copy) for all sections
- [ ] German lab report PDFs available? (else link existing ones)
- [ ] Impressum / AGB / Widerruf / Datenschutz legal texts sourced (lawyer or generator)

## Phase 1 — Dev store setup (Shopify admin)
- [ ] Create development store (Partners → Add store), currency EUR, language DE
- [ ] Install Hydrogen sales channel, create storefront "Phoenix DE"
- [ ] Create product + 8L/12L variants + prices + compare-at + media
- [ ] Create collection `all-products`
- [ ] Create menus: `main-menu`, `footer-menu-1`, `footer-menu-2`
- [ ] Create all pages (see AI_CONTEXT §4.3) incl. Impressum + Widerruf
- [ ] Create blog `wasserqualitaet` + 1 sample article
- [ ] Create metaobject definitions (§4.5) + fill entries
- [ ] Upload files: hero video, poster, icons, lab PDFs, guarantee images

## Phase 2 — Project scaffold
- [x] `npm create @shopify/hydrogen@latest` (TypeScript + Tailwind + routes) — manual scaffold created
- [x] `hydrogen link` to dev store `Phoenix` / storefront `phonixgr`, Preview env pulled, dev server verified (2026-07-21)
- [x] Git repo initialized and pushed to GitHub (palnice-official/phoenixgr)
- [ ] Oxygen auto-deploy connected
- [x] `app/lib/config.ts` + `app/lib/t.ts` created
- [x] Tailwind tokens configured (`tailwind.config.ts`)
- [x] Locale set to DE/DE in storefront client; `<html lang="de">`

## Phase 3 — Global layout
- [x] AnnouncementBar (marquee)
- [x] Header (sticky, menu, icons, mobile aside)
- [x] Footer (menus, contact, social, payment icons, legal note)
- [x] CartAside + FreeShippingBar + trust row + empty state
- [x] SearchAside (German strings)

## Phase 4 — Homepage sections
- [x] Loader: hero product query + metaobject queries (deferred where non-critical)
- [x] HeroVideo (live pricing)
- [x] FeatureSplit ×4 wired to content (updated to match FR site — image grids, revised copy)
- [x] ProductGalleryStrip
- [x] ImpactCalculator (interactive)
- [x] ComparisonTable
- [x] ThreeSteps
- [x] GuaranteeSection
- [x] ReviewsCarousel (provider interface)
- [x] WhatsInTheBox
- [x] LabReports
- [x] FeatureGrid — "Designed for Perfection" 6-item icon grid (new)
- [x] FinalCTA — footer-area CTA with product image + guarantee + box contents (new)
- [x] Homepage section order reordered to match FR site (phoenixwaterfilters.fr)

## Phase 5 — Product page
- [x] Gallery with thumbnails (vertical desktop, horizontal mobile, click-to-select)
- [x] Buy box: variant selector, qty stepper, CartForm add → opens drawer
- [x] Price block with discount badge (−X%), struck compare-at, MwSt. note + tax link
- [x] Accordions (Beschreibung/Lieferumfang/Versand/FAQ) — ProductAccordion component
- [x] Sticky mobile buy bar (StickyMobileBuyBar, IntersectionObserver-based, mobile only)
- [x] JSON-LD Product schema
- [x] OG meta tags
- [x] 4 trust checkmarks in ProductForm

## Phase 6 — Content routes
- [x] pages.$handle styled (prose typography)
- [x] Blog index + article route styled
- [x] Collection page styled
- [x] Search results styled
- [x] Policies routes verified (route generation + production build, 2026-07-21)

## Phase 7 — Compliance, SEO, analytics
- [x] Consent banner via Customer Privacy API; GTM gated behind analytics + marketing consent
- [x] German public-route meta, product OG data, global canonical from `PUBLIC_CANONICAL_DOMAIN`
- [x] robots.txt + sitemap route generation verified in production build
- [~] Analytics.Provider wired for page/product/collection/search/cart events; browser-network verification pending
- [x] Price notes `inkl. MwSt., zzgl. Versand` at storefront sales prices and cart subtotal

## Phase 8 — QA
- [ ] Full purchase flow on dev store (Bogus Gateway)
- [ ] Mobile (375px) + desktop (1440px) visual pass on all routes
- [ ] Lighthouse targets met (see AI_CONTEXT §12)
- [~] Accessibility pass: aside focus trap/Escape/focus return and labels completed; full visual audit pending
- [x] 404 / error boundary user-safe and German
- [x] Grep check: no hardcoded store IDs/domains in runtime code (env-domain comments only)

## Phase 9 — Production cutover
- [ ] Production store seeded (Matrixify export/import from dev), handles verified
- [ ] Payments + shipping zones + taxes configured in prod admin
- [ ] `hydrogen unlink` → `link` to prod storefront → `env pull` → smoke test
- [ ] Prod env vars set (GTM id, canonical domain)
- [ ] Deploy to Oxygen, assign domain, SSL verified
- [ ] Post-launch checks: checkout live payment test, analytics firing, Search Console

---

## Session log
| Date | Who | Work done | Next step |
|---|---|---|---|
| 2026-07-17 | — | Docs created, plan finalized | Start Phase 0 decisions |
| 2026-07-17 | — | Review provider = Judge.me; starter code generated (config, t, reviews.server, AnnouncementBar, FreeShippingBar, ImpactCalculator, ReviewsCarousel) | Create dev store (Phase 1), scaffold project, drop in starter files |
| 2026-07-17 | — | Full project scaffold created: all components (Header, Footer, CartAside, SearchAside, HeroVideo, FeatureSplit, ComparisonTable, ThreeSteps, GuaranteeSection, WhatsInTheBox, LabReports), all routes (_index, products.$handle, collections.$handle, pages.$handle, blogs, search), root.tsx, tailwind config, env template | Link to dev store, test locally, add sticky mobile buy bar |

| 2026-07-21 | Codex | Moved project docs into `docs/project`; integrated the reusable `phoenix-de/app` storefront sections into the React Router 7 scaffold; added Tailwind, Judge.me provider, DE locale, announcement bar, and free-shipping progress; typecheck, lint, and production build verified | Add Shopify content/metaobjects and upload hero/section media |

| 2026-07-21 | Codex | Connected Shopify account `palnice.official@gmail.com`; linked dev store `Phoenix` and Hydrogen storefront `phonixgr`; pulled Preview environment; verified homepage HTTP 200 locally | Populate Shopify product, menus, pages, metaobjects, and media |

| 2026-07-21 | Opencode | Homepage rewritten to match FR site: new FeatureGrid + FinalCTA components, sections reordered, FeatureSplit updated with image grids. Product page: gallery, price with discount badge, quantity stepper, ProductAccordion, StickyMobileBuyBar, trust checkmarks, JSON-LD, OG meta. Added ~350 lines CSS. Fixed pre-existing ProductItem.tsx type error (removed phantom RecommendedProductFragment). typecheck = 0 errors, lint = 0 errors, build passes | User: create proper product in Shopify Admin (handle `the-phoenix-gravity-wasserfilter`, 8L/12L variants, EUR prices, inventory > 0) |
| 2026-07-21 | Codex | Completed remaining code-side compliance/QA: live homepage metaobject query, media fallbacks, two footer menus + legal fallbacks, consent-gated GTM, canonical/German SEO, price disclosures, German cart/search/policies, accessible aside focus management, safe error UI. Codegen, typecheck, lint, and production build pass. | Populate Shopify product/content/media and supply legal/contact/brand values; then run browser purchase/Lighthouse QA |

## Open questions / blockers
- **[BLOCKER]** Product in Shopify dev store: all variants `availableForSale: false` — product shows "Ausverkauft". User must create proper product with handle `the-phoenix-gravity-wasserfilter`, option `Größe` (8L / 12L), EUR prices, inventory > 0, status Active. Then update `app/lib/config.ts` handle back from test product.
- No Admin API access (token lacks `read_products` scope) — cannot create/modify products via API.
- Final brand hex colors + font licenses to confirm (placeholders in config/tailwind).
- Legal texts (Impressum, Widerruf, AGB, Datenschutz) pending — launch blockers.
- Hero video/poster and product images need to be uploaded to Shopify Files + URLs updated in config.
- Metaobjects (comparison rows, steps, box items, lab reports) need to be created in admin.
- Judge.me private token + shop domain to be set in .env once dev store exists.
