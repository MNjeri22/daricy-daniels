# Phase 5 — Product page

## Delivered
- `/products/[slug]` resolves all nine catalog products through the catalog provider; unknown slugs use the not-found experience. Per-product titles, descriptions and canonical URLs.
- Editorial product gallery with thumbnail buttons, previous/next, arrow keys, horizontal touch-swipe handling and a native dialog lightbox with 100–200% zoom and scrollable detail.
- Burgundy brand shell, cream product canvas, and burgundy editorial collection panel. Responsive single-column product experience at narrow widths.
- Color/size combinations checked against the same variant; unavailable sizes and wholly unavailable products blocked. Size required before adding. Quantity 1–5, including combined existing bag quantity. Variant-aware share links restore color/size selections.
- Sample bag persistence with validated product/options/quantity data, shared header count and read-only summary. Storage failures report an error instead of claiming success. No payment, order or live stock reservation occurs.
- Wishlist, illustrative size chart in centimeters/inches, `/size-guide`, expandable details/materials/fit/care/shipping & returns, related products, complete-the-look and browser-local recently viewed items.
- Shop product names and quick view link to product details; homepage look previews link to the same routes. Homepage now uses the shared shop header.

## Validation
- 12 domain tests cover catalog filters, exact variant availability, malformed persisted cart data, duplicate lines, invalid quantities, combined quantity limits and recommendation boundaries.
- TypeScript and production Worker build.
- Browser checks: required size error; unavailable XS; M + quantity 2 adds matching line and $840 sample subtotal; shared count and persisted bag; centimeter/inch chart; gallery thumbnails; enlarged image 150% zoom; unavailable product; saved state and recently viewed; product links and missing slug.
- Narrow layout checked through a 390px same-origin preview frame, including size buttons and fit guide. Touch-swipe handling reviewed in source; actual touch-device gestures still need device QA.

## Content boundaries
The gallery offers three crops of existing AI artwork, explicitly labeled; these are not three separate garment photographs. No reverse view or product video is invented. Materials, garment fit, final measurement chart, manufacturing origin, stock and delivery/return policies await approved brand data. No verified customer reviews are invented.

## Next phase
Phase 6 owns full cart editing/removal, cart drawer/full page, shipping and promo display, guest/billing/shipping details, review and checkout provider boundary. Phase 7 owns authoritative price/stock, authenticated carts, inventory concurrency and real payment/order integrations. Sample bag data must be revalidated by the commerce server before any future purchase.
