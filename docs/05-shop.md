# Phase 4 — Shop

Status: implemented with sample catalog data. Purchasing remains unavailable.

## Delivered
- /shop, five dynamic category routes, /collections and its collection routes, /new-arrivals, /best-sellers, /ready-to-wear, and /wishlist.
- Category, collection, size, color, price and availability filters. Active chips and clear-all recovery.
- Product/category/collection/color search, five sort orders, six-item pagination and result counts.
- URL-preserved filter/search/sort/page state, reload and browser Back restoration through framework navigation with immediate control feedback.
- Quick view with size selection, unavailable size states, color/price information and saved-piece control.
- Responsive filter drawer, native modal focus/Escape behavior, result announcements, empty/loading/error views.
- Browser-local wishlist shared with the existing homepage. Home navigation, collection CTAs and category discovery now open the shop routes.

## Data boundary
lib/commerce/catalog.ts defines the catalog provider interface, fixture adapter, typed products/variants, filter normalization and deterministic pagination. Product amounts use integer minor units. Size, color and availability must match the same variant. Category/collection route context cannot be overridden by query filters.

Nine sample pieces demonstrate all five categories. All USD prices, sizing and availability are fictional fixtures and explicitly labeled. Generated concept imagery is not actual product photography. The best-sellers route is titled Signature favorites and does not claim sales performance. No orders, inventory reservations, customer data or payments are created.

The additional six-look concept sheet is compressed to approximately 80KB WebP. Cards use CSS positioning to display individual panels without altering the source artwork. Final product image galleries, descriptions, measurements and accurate prices must come from the actual catalog.

## Validation
- Seven domain tests: combined facets; same-variant availability; minor-unit price/sorting; category context isolation; pagination clamping; malformed URL normalization; wishlist isolation.
- TypeScript and production build.
- Desktop filter/sort, reload/Back, pagination, quick-view size state and saving.
- Saved piece survives reload and appears on /wishlist.
- Phone frames at 390px and 320px: two-column product grid, filter drawer, combined category/color/availability, empty result recovery and no page-width overflow.
- Search, dynamic category and collection navigation, and sample price visibility.

## Remaining
Phase 5 adds full product detail pages. Cart/checkout is Phase 6; live catalog, CMS/admin, auth and payments are Phase 7. Newsletter remains a local preview. Original SVG logo and actual catalog inputs remain outstanding.

GitHub synchronization is pending because the GitHub connection was not active during this phase. Source is preserved in the Site repository; synchronize this phase after reconnection without replacing the existing repository or earlier commits.
