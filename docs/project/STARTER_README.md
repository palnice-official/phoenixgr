# Phoenix DE — Starter Code Files

Drop-in TypeScript files for the Hydrogen skeleton. Copy the `app/` folder
into your scaffolded project root (paths already match Hydrogen's structure).

## Contents

| File | Purpose |
|---|---|
| `app/lib/config.ts` | Single source of store-specific values + `formatEUR` helper + custom Env typing |
| `app/lib/t.ts` | All German UI strings |
| `app/lib/reviews.server.ts` | Judge.me provider: `getReviews()` + `getReviewSummary()` (server-only, fails soft) |
| `app/components/AnnouncementBar.tsx` | Infinite marquee, hover-pause, reduced-motion safe |
| `app/components/FreeShippingBar.tsx` | Cart-drawer progress toward €99 free shipping |
| `app/components/ImpactCalculator.tsx` | Interactive household impact widget |
| `app/components/ReviewsCarousel.tsx` | Scroll-snap reviews section fed by Judge.me data |

## Integration steps

1. **Tailwind tokens** — add to `tailwind.config.ts`:
   ```ts
   theme: {
     extend: {
       colors: {
         'brand-dark': '#0B1B2B',   // TODO confirm exact brand hex
         'brand-blue': '#1F6FEB',   // TODO
         'brand-gold': '#C9A24B',   // TODO
         surface: '#F7F9FB',
       },
       fontFamily: {
         display: ['"Playfair Display"', 'serif'], // TODO confirm brand font
       },
     },
   },
   ```
2. **Env vars** — add to `.env` and the Hydrogen channel (per environment):
   ```
   PUBLIC_GTM_ID=
   PUBLIC_CANONICAL_DOMAIN=
   JUDGEME_PRIVATE_TOKEN=      # Judge.me → Settings → API (private token)
   JUDGEME_SHOP_DOMAIN=phoenix-de-dev.myshopify.com
   ```
   Install the Judge.me app on the store (dev now, prod later) and update
   `JUDGEME_SHOP_DOMAIN` + token at cutover.
3. **Announcement bar** — query `announcement` metaobjects in the root loader,
   sort by `order`, pass `messages` to `<AnnouncementBar/>` above the header.
4. **Cart drawer** — inside the skeleton's cart aside, render
   `<FreeShippingBar subtotal={Number(cart?.cost?.subtotalAmount?.amount ?? 0)}/>`
   above the line items.
5. **Homepage** — in `_index.tsx` loader fetch reviews + summary
   (see comment header in `ReviewsCarousel.tsx`), render
   `<ImpactCalculator/>` and `<ReviewsCarousel/>` in the section order from
   `AI_CONTEXT.md` §6.
6. Run `npm run typecheck` — the `declare global Env` block in `config.ts`
   registers the custom env vars; if your skeleton uses `env.d.ts`, move it
   there instead.

## Notes

- `reviews.server.ts` must only be imported in loaders/server code
  (`.server.` suffix enforces this in Remix).
- Never render fabricated review numbers: if Judge.me returns nothing, the
  reviews section hides itself.
- All UI strings route through `t.ts`; add new keys there rather than inline.
