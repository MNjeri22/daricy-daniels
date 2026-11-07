# DARICY DANIELS

Luxury contemporary fashion ecommerce, built in seven reviewable phases.

**Current milestone: Phase 7 — Backend foundation implemented; live activation pending.** The shop, collection/category routes, filters, search, sorting, quick view and saved pieces are implemented with sample catalog data. Product details and sample bag selection are complete. Editable bag, guest details, delivery and review are implemented as a private checkout preview. Private account sign-in, durable saved edits, server validation and integration boundaries are implemented. Medusa commerce, payment, CMS, email and verified order flows require external service setup and staging validation.

1. Architecture — complete; see [architecture](docs/01-architecture.md).
2. Design system — complete; see [design system](docs/03-design-system.md).
3. Homepage — complete; see [homepage handoff](docs/04-homepage.md).
4. Shop — complete; see [shop handoff](docs/05-shop.md).
5. Product page — complete; see [product page handoff](docs/06-product-page.md).
6. Cart / checkout — complete; see [checkout handoff](docs/07-cart-checkout.md).
7. Backend — foundation implemented; [activation and remaining acceptance gates](docs/08-backend.md).

See the [delivery plan and acceptance gates](docs/02-phase-plan.md) and [original brand brief](docs/brand-brief.md).

## Direction

Quiet luxury, editorial composition, burgundy, cream and tan. Playfair Display headings and Montserrat interface typography.

## Planned architecture

TypeScript storefront, reusable design components, provider adapters, a commerce engine with PostgreSQL, hosted payment collection and an editorial CMS. Infrastructure and credentials are not provisioned. See the architecture decision and runtime constraints before scaffolding.

## Development rules

Implement one phase at a time, commit separately, and document validation. Keep sample data explicit. Never commit secrets or real customer data. Live payment, tax, shipping, email and inventory require configured services and staging verification.


## Run locally

Use Node >=22.13 and the supplied lockfile. Run `npm ci`, `npm run dev`, `npx tsc --noEmit`, and `npm run build`. The homepage uses the Next.js App Router API through Vinext for the Sites Worker runtime. The standalone design lab is retained at `/design-system/index.html`.

Catalog domain checks: `node --experimental-strip-types --test tests/catalog.test.ts tests/product.test.ts tests/checkout.test.ts tests/currency.test.ts tests/backend.test.ts`.

Country choices: Kenya, USA and UK. Display currencies: KES, USD and GBP, remembered in this browser independently of the selected country. Converted sample prices use a clearly dated reference snapshot; live settlement prices and country-specific delivery rates remain part of the backend phase.
