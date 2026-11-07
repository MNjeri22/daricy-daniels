# Phase 1 — Architecture
Status: storefront phases 1–6 implemented. Phase 7 foundation is implemented; external commerce activation and live acceptance gates remain pending.

## Product and experience
DARICY DANIELS is a luxury contemporary fashion storefront. The journey is landing → editorial discovery → filtered collection → product confidence → cart → checkout → confirmation → retention. Desktop uses restrained editorial compositions; mobile has its own image crops, accessible navigation, two-column browsing, and reachable purchase controls.

## Technology decision
Use Next.js with TypeScript for the customer storefront, CSS custom properties and CSS Modules for the visual system, PostgreSQL for durable commerce records, and Stripe Checkout for hosted card collection. Use a maintained commerce engine (Medusa) for products, variant inventory, carts, promotions, orders, customers and admin. Use a headless CMS (Sanity) for editorial content. The private Site uses managed identity and D1 for saved account edits/request controls; transactional commerce remains assigned to Medusa/PostgreSQL. These are implementation choices, not connected or provisioned services. Verify supported package versions and hosting compatibility before scaffolding.

This gives the owner a commerce admin and editorial studio without building custom administrative authentication and order-management tools from scratch. Keep CMS content separate from transactional inventory. The storefront communicates through server-side adapters; public product data may be cached, personal data and checkout may not. Stripe receives card details directly; the application never stores card numbers.

If hosting the frontend in Sites, evaluate its supported Worker runtime in Phase 2 before selecting framework integration; host Medusa and PostgreSQL on compatible external infrastructure. Do not assume a Node server or PostgreSQL TCP connection can run inside a Worker. A private development preview is separate from the public production storefront.

## Application boundaries
- Storefront: navigation, editorial pages, catalog, product, account, wishlist, cart.
- Commerce adapter: typed catalog, search, cart, checkout and customer interfaces. Use a fixture adapter during UI phases and a Medusa adapter in Phase 7.
- Commerce engine: authoritative prices, currencies, inventory, discounts, order state and authorization.
- Editorial CMS: campaigns, hero, collection stories, journal, FAQs and customer-care pages.
- Payment provider: hosted checkout, payment state and refunds.
- Integrations: transactional email, consent-aware analytics, newsletter and media delivery.

UI fixtures must be clearly identified as sample data. Never fabricate stock, verified reviews, shipping promises, sustainability claims or completed payments. Launch requires real products, licensed photography and approved business policies.

## Route map
| Route | Purpose |
| --- | --- |
| / | Editorial homepage |
| /shop | Searchable, filterable catalog |
| /new-arrivals, /best-sellers | Catalog presets |
| /ready-to-wear | Catalog preset |
| /categories/[slug] | Dresses, tops, bottoms, outerwear, accessories |
| /collections, /collections/[slug] | Collection index and editorial/catalog view, including Abundance |
| /products/[slug] | Variant-aware product page |
| /about, /journal, /journal/[slug] | Brand and editorial |
| /contact, /faq, /size-guide | Customer care |
| /shipping, /returns, /privacy, /terms | Approved business policies |
| /wishlist, /cart | Saved products and shopping bag |
| /checkout, /order/confirmation | Checkout handoff and verified confirmation |
| /account/* | Authenticated profile, addresses and order history |

Search, filter and sort state belongs in URL parameters. Categories and collections come from data, not separate duplicated product arrays. Canonicals exclude filter combinations unless deliberately curated.

## Data model
| Entity | Key fields and rules |
| --- | --- |
| Product | UUID, unique slug, title, short description, description, category IDs, collection IDs, materials, fit, care, media, featured/new flags, SEO, publication state |
| Variant | UUID, product ID, unique SKU, option combination (size/color), weight, dimensions, purchasable state; unique product/options combination |
| Price | Variant ID, currency code, integer minor-unit amount, optional regional price, sale amount and validity; never floating point |
| Inventory | Variant/location, on-hand, reserved; atomic reservation, release and decrement; no negative saleable stock |
| Media | Asset ID, URL, width, height, alt text, role, focal point, ordering, rights provenance |
| Collection / Category | UUID, unique slug, name, description, CMS reference, ordered products |
| Cart / CartLine | Opaque ID, region/currency, expiry, version, variant ID, quantity; prices recalculated server-side |
| Customer / Address | Auth subject, email, profile; customer-scoped addresses and order access |
| Order / OrderLine | Unique number, customer/guest reference, immutable purchased SKU/options/price/tax/address snapshots, currency, totals and fulfillment state |
| Payment / WebhookEvent | Provider reference, amount, currency, status, unique event ID for idempotency |
| Wishlist | Customer or anonymous reference, product/variant references, timestamps |
| Promotion | Eligibility, date window, usage constraints; server-side evaluation |
| CMS document | Campaign, page, journal, FAQ, banner; draft/published versions and localized fields |
| Consent / IntegrationEvent | Consent purpose/time/version; deduplicated delivery state; no payment or address data in analytics |

Model region, currency, shipping zones and tax explicitly. Default region and currency remain business decisions. Do not imply multi-currency capability by relabeling one price.

## Source layout
- app/: page routes, layouts, loading/error boundaries and server endpoints
- components/ui/: buttons, inputs, dialogs, accordions, typography
- components/commerce/: product cards, filters, gallery, variant picker, cart
- components/editorial/: campaign, story, category feature, journal
- styles/: tokens, global CSS and typography
- lib/commerce/: interface, fixture adapter, provider adapter
- lib/cms/: schemas, queries and content adapter
- lib/payments/: checkout and webhook boundary
- lib/auth/: sessions and ownership guards
- lib/analytics/: consent-aware events
- fixtures/: visibly labeled demonstration catalog
- tests/: commerce domain checks and critical journey tests
- docs/: architecture, phase plan, design system and launch checklist

## Commerce invariants
1. Client totals and variant IDs are untrusted; validate quantity, price, region and inventory on the server.
2. Cart mutations are versioned; concurrent updates do not silently lose items.
3. Checkout revalidates inventory and promotions; sold-out items produce a recoverable message.
4. Payment redirect does not mark an order paid. Verify signed provider webhooks, amount/currency and order reference.
5. Deduplicate payment events and checkout retries; handle out-of-order events.
6. Fulfillment follows verified payment, with explicit refund/cancellation transitions.
7. Enforce customer ownership on every account/order request, including guest order links.
8. Use secure HttpOnly session cookies, origin/CSRF protection for mutations, validation, rate limits and secrets outside source.
9. Cache public catalog only; exclude account, cart, checkout and addresses from shared caches and logs.
10. Newsletter signup must receive a real provider result before showing success.

## SEO, accessibility and performance
Provide semantic HTML, logical headings, visible focus, accessible validation, keyboard-operated dialogs/menus, focus restoration, reduced motion and 44px touch targets. Test WCAG 2.2 AA contrast and behavior, rather than treating ARIA attributes as proof.
Use responsive image sizing and focal points, fixed image aspect ratios, font subsetting, lazy non-hero media and minimal client JavaScript. Render useful catalog content on the server.
Add route metadata, canonical URLs, Open Graph, published-page sitemap, robots rules and truthful Organization/Product/Breadcrumb/Article structured data. Product offers must reflect real backend currency and availability. Never add fabricated ratings.

## Delivery and operational gates
Each phase is a separate reviewable change with a phase summary and relevant checks. No paid services, production credentials or public commerce launch are implied by repository creation.
Use environment examples without values, dependency lockfiles, CI type/build checks, a separate staging environment and a rollback procedure. Back up the commerce database and test restore before launch.
Live checkout requires merchant configuration, tax/shipping decisions, approved policies, email sender setup, inventory data, webhook verification, sandbox payment tests and refund/failure tests.

