# DARICY DANIELS commerce service

Pinned Medusa 2.22.4 backend with PostgreSQL, inventory, regional prices, native delivery/promotions/tax calculation, and the Medusa Admin dashboard. The storefront uses a private ownership-enforcing bridge; native `/store/carts` and `/store/payment-collections` HTTP access is blocked. Payments and order completion intentionally return 503.

## Development

Use Node 24. Run `npm ci`, copy `.env.example` to `.env`, and supply local database, Redis, JWT/cookie and bridge secrets. `docker compose up -d` starts local infrastructure when Docker and `POSTGRES_PASSWORD` are provided. Database URL must match those values; Redis uses `redis://127.0.0.1:6379`.

Run `npx medusa db:migrate` before `npm run dev`. Create the merchant Admin through `npx medusa user` using your own account details; use the CLI help and avoid recording passwords in shared logs/history. Admin opens at `/app` on the backend origin. Merchant authentication is separate from storefront customer accounts.

Optional **disposable development data only**: `ALLOW_SAMPLE_SEED=true npm run seed`. Seeding refuses production, skips an already-populated catalog, and never resets existing stock. Fixtures include 9 concept products, 3 countries/currencies, sample delivery, zero sample tax, stock and `DEMO10`. These are not approved launch settings. Never run the sample seed against a merchant database.

## Verification

`npm run typecheck` checks backend TypeScript. `npm run verify` creates its own temporary embedded PostgreSQL database, migrates it, seeds twice to verify preservation, starts the real HTTP service, exercises the storefront adapter, and builds both backend and Admin. It uses generated test secrets and reserved example addresses; it never uses the configured merchant database. Do not run two verification processes on the same machine at once (ports 54329, 9000 and 9001). Logs and fixture state are temporary outside the project.

Verification covers native prices/stock, bridge authentication, persisted cart ownership, identical request retries and concurrency, changed-request conflict, rejected browser totals, promotion/delivery calculations, stale revisions, blocked direct native carts, isolated order reads, and disabled payments. Customer account/reset/address tests run from the repository root with `npm test`.

## Production handoff

Build with this Dockerfile from this directory. Deploy behind HTTPS with persistent PostgreSQL and Redis, set all `.env.example` requirements in the host secret manager, and use a persistent `static/` upload volume for a single-server deployment or configure a durable object-storage file provider. Configure file URLs for the public backend origin. Restrict Admin access, set backups and restore checks, and configure monitoring. The container runs as `node`.

Run `npx medusa db:migrate` **once as a release task** before the service starts; make a database backup before upgrades. Do not generate migrations on production. Production startup fails if required origins, database/Redis URLs or JWT/cookie secrets are missing. A shared process is the default; larger deployments can use server/worker modes with the same Redis and database. HTTP-only local infrastructure compose is not a production hosting configuration.

Create real products/variants, USD/KES/GBP prices, inventory, sales-channel publishable API key, regions/country coverage, fulfillment options and tax settings through Admin. The storefront requires a USD region containing USA for catalog discovery and country-matched Kenya/KES, USA/USD, UK/GBP regions for checkout. Product metadata can set `dd_category`, `dd_collection`, `dd_featured`, `dd_new_arrival`, `dd_rank`, `dd_materials`, `dd_fit`, `dd_care`, and `dd_shipping`; remove `dd_demo` and use real HTTPS images for launch. Category/collection handles should match the storefront taxonomy until a dynamic taxonomy feature is added.

Set the storefront `MEDUSA_BACKEND_URL`, sales-channel `MEDUSA_PUBLISHABLE_KEY`, and matching server-only `COMMERCE_BRIDGE_SECRET`. Activate `COMMERCE_MODE=live` only after staging validation. Frontend customer IDs are scoped server-side into cart bindings; native Medusa customer passwords are not used. Guest carts expire after 7 days and do not transfer into an account automatically. Guest checkout must be restarted after signing in. Existing merchant orders created outside this bridge do not automatically appear in these customer accounts.

Payments remain a separate implementation/activation: install and configure the chosen provider, hosted payment UI, provider-signed webhooks, idempotent completion, inventory reservation and order confirmation; then test success, declines, abandonment, retries, refunds and reconciliation in provider sandbox. Do not enable purchasing by changing a label or removing the disabled button.

See [full activation instructions](../docs/11-commerce-backend.md).
