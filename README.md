# DARICY DANIELS

Luxury contemporary fashion ecommerce, built in seven reviewable phases.

**Current milestone: Phase 2 — Design system complete.** The private component showcase is implemented; shopping and backend integration follow in later phases.

1. Architecture — complete; see [architecture](docs/01-architecture.md).
2. Design system — complete; see [design system](docs/03-design-system.md).
3. Homepage — next.
4. Shop.
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

