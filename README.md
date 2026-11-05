# DARICY DANIELS

Luxury contemporary fashion ecommerce, built in seven reviewable phases.

**Current milestone: Phase 3 — Homepage complete.** The responsive editorial storefront and linked brand/journal/care pages are implemented. Shop, product, checkout and backend phases follow.

1. Architecture — complete; see [architecture](docs/01-architecture.md).
2. Design system — complete; see [design system](docs/03-design-system.md).
3. Homepage — complete; see [homepage handoff](docs/04-homepage.md).
4. Shop — next.
5. Product page.
6. Cart / checkout.
7. Backend.

See the [delivery plan and acceptance gates](docs/02-phase-plan.md) and [original brand brief](docs/brand-brief.md).

## Direction

Quiet luxury, editorial composition, burgundy, cream and tan. Playfair Display headings and Montserrat interface typography.

## Planned architecture

TypeScript storefront, reusable design components, provider adapters, a commerce engine with PostgreSQL, hosted payment collection and an editorial CMS. Infrastructure and credentials are not provisioned. See the architecture decision and runtime constraints before scaffolding.

## Development rules

Implement one phase at a time, commit separately, and document validation. Keep sample data explicit. Never commit secrets or real customer data. Live payment, tax, shipping, email and inventory require configured services and staging verification.


## Run locally

Use Node >=22.13 and the supplied lockfile. Run `npm ci`, `npm run dev`, `npx tsc --noEmit`, and `npm run build`. The homepage uses the Next.js App Router API through Vinext for the Sites Worker runtime. The standalone design lab is retained at `/design-system/index.html`.
