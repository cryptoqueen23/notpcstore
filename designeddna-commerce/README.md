# MARI / OBJECTS — Design DNA Commerce

This version was rebuilt directly from the Design DNA profiles in:
`github.com/cryptoqueen23/designeddna/tree/main/profiles`

See `DESIGN-DNA.md` for the exact profile blend.

## Files
- `index.html`
- `styles.css`
- `catalog.js`
- `app.js`
- `DESIGN-DNA.md`

## Product architecture
Edit only `catalog.js` to change products.

## Fulfillment
The UI is provider-agnostic. Connect Printify, Printful, Shopify, Stripe or another backend later.

For a lean Printify launch, change each product's `direct` link to its live product destination and wire the final checkout button when you choose the checkout flow.
