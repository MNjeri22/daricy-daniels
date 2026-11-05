# Phased delivery plan
The requested order is architecture → design system → homepage → shop → product page → cart/checkout → backend. Build and validate one phase at a time. Do not generate the whole application as a single change.

| Phase | Deliverable | Acceptance gate | Status |
| --- | --- | --- | --- |
| 1 — Architecture | Boundaries, stack decisions, routes, data model, security and delivery strategy | All requested features assigned an owner and phase; commerce invariants explicit | Complete |
| 2 — Design system | Burgundy/cream/tan tokens, Playfair Display/Montserrat typography, spacing, responsive shell and component showcase | Contrast, keyboard focus, reduced motion, mobile navigation; real component states | Next |
| 3 — Homepage | Campaign hero, collection feature, signature products, brand statement, editorial, categories, journal and newsletter | Distinct editorial rhythm; mobile crops; responsive images; honest signup behavior | Pending |
| 4 — Shop | Dynamic categories/collections, search, filters, sorting, pagination, wishlist and quick view | URL-preserved state, empty/loading/error results, accessible mobile filters | Pending |
| 5 — Product page | Gallery, zoom, variant stock, size guide, quantity, add-to-cart, details and recommendations | Correct variant selection; unavailable combinations blocked; keyboard and mobile gallery checks | Pending |
| 6 — Cart / checkout | Drawer/full cart, quantity/remove/save, shipping/promo display, guest details, billing/shipping, order review and provider boundary | Persisted cart, recoverable errors, no fake payment success; sandbox flow when configured | Pending |
| 7 — Backend | Medusa/PostgreSQL adapter, Stripe integration, customer auth, admin, CMS, email and analytics | Inventory concurrency, signed/idempotent webhooks, ownership tests, full staging purchase/refund/failure journey | Pending |

## Related pages
- Phase 3: About, journal layouts and customer-care page shell.
- Phase 4: New Arrivals, Collections, Ready-to-Wear, Abundance, all categories, Best Sellers and wishlist browsing.
- Phase 5: Size guide, garment detail content and recently viewed items.
- Phase 6: Checkout and confirmation UI; account entry screens.
- Phase 7: Functional account dashboard, saved addresses, order history/details, password management through auth provider, CMS-published FAQs/legal/care content, promotions and retention integration.

## Phase handoff requirements
Record what changed, checks performed, known limitations and next phase. Commit phase-specific work separately. Fixture products, prices, availability and photography must remain visibly designated as development samples until replaced. Never call a UI prototype a production-ready store.

## Brand constraints
Only Playfair Display and Montserrat. Dominant burgundy supported by cream and tan; restrained decoration, generous whitespace, editorial asymmetry, quiet movement. Reuse components without making every content section identical.

## Launch inputs to collect when needed
- Real catalog, SKUs, size/color variants, prices, stock and licensed product/editorial images.
- Selling regions, settlement currency, shipping rates, returns window and tax approach.
- Brand story, business contact, social profiles and approved legal policies.
- Merchant/payment account, commerce/CMS hosting, customer authentication, sender domain and production domain.

Do not block architecture and design work on launch inputs. Do not invent them or silently activate paid accounts.
