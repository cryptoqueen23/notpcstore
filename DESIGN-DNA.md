# Design DNA blend used

This storefront is deliberately composed from the user's Design DNA profiles.

## Shopify profile — structural base
- Pure black cinematic marketing track.
- White / cream transactional track.
- Aloe `#c1fbd4` and pistachio `#d4f9e0` only on light commerce surfaces.
- Thin display hierarchy.
- Inter UI tier.
- Pill-button grammar.
- Stacked tiny shadows on light transactional cards.
- Full-bleed editorial product storytelling.

## Apple profile — premium product presentation
- Product-first UI that recedes.
- Alternating light / near-black full-bleed product tiles.
- Very low UI density in hero product moments.
- Soft product-only shadow rather than decorative chrome.
- Persistent compact commerce controls.

## Stripe profile — money and checkout clarity
- Tabular figures for price / totals.
- Tighter transactional hierarchy.
- Cream / soft-white commerce bands.
- One decisive primary CTA per action zone.
- Subtle gradient-mesh treatment reserved for one financial/checkout band.

## Pinterest profile — product discovery
- Warm neutral browse surfaces.
- Dense masonry product grid.
- Generous 16–20px rounding on discovery cards.
- Photography/product-art first.
- Search as a primary browse tool.
- Minimal shadows in the discovery grid.

## Architecture
`catalog.js` is the single source of truth for products. `app.js` is content-blind and renders products generically.
