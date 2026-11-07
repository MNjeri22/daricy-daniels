# Phase 7 — Commerce implementation and hosting handoff

## Implemented

The deployable `commerce-backend/` service uses Medusa 2.22.4 and PostgreSQL. Medusa Admin supplies merchant product, variant, inventory, regional price, promotion, delivery and tax management. Redis is required for production locking and workflows. An additive cart-binding module associates carts with authenticated storefront customers or opaque guest sessions.

The full storefront now has a live mode: real catalog/variant prices and stock, product photography, saved bag edits with stock limits, contact and billing/shipping forms, account saved-address selection, country-specific settlement currency, server-calculated delivery/promotions/tax, checkout restoration and a review stage. Order history is connected to orders linked through these owned carts. No fake orders are created. Existing customer login, reset and saved addresses remain separate from merchant Admin.

Browser-selected prices and owner IDs never control the backend. Writes require the storefront origin, throttling and server-derived ownership. Cart creation uses persisted idempotency and a request fingerprint; repeated requests reuse the cart, changed payloads conflict, and concurrent updates use locking plus revisions. The bridge secret stays server-side. Direct native cart/payment HTTP routes are blocked. Payments/completion remain unavailable in both UI and API.

GitHub Pages remains a static design preview using sample products. It cannot run the Worker API, customer accounts, PostgreSQL or Medusa. Publishing this code to GitHub does not activate the commerce service.

## Deployment configuration

1. Host `commerce-backend/` on a Node/container service with HTTPS, PostgreSQL, Redis and durable uploads. Use its Dockerfile; configure environment variables from its safe template. Run its existing migrations as a release task, create the merchant Admin account, and establish backups and monitoring. Do not seed a production catalog.
2. Host the full storefront on its supported Cloudflare Worker/Vinext runtime, with its D1 database binding and the existing `drizzle/0000` and `0001` migrations applied. Build using `npm ci` and `npm run build`. Supply the real exact `CUSTOMER_APP_ORIGIN`, without a trailing slash.
3. Configure a verified Resend sender and server-only `RESEND_API_KEY` plus `CUSTOMER_EMAIL_FROM` for password reset. Test delivery and single-use expiry; no production email sender has been provisioned.
4. Set `MEDUSA_BACKEND_URL` to the HTTPS backend origin, `MEDUSA_PUBLISHABLE_KEY` to the correct sales-channel key, and the same random 32+ character `COMMERCE_BRIDGE_SECRET` on both services. Set `COMMERCE_MODE=live` in staging first. Keep secrets out of GitHub and browser bundles.
5. Replace concept products, sample stock/prices/delivery/zero-tax settings with merchant-approved data for Kenya, USA and UK. Publish accurate product composition, measurements, care, dispatch/returns, privacy, terms and contact information. The currency switch is an indicative display conversion; final settlement uses backend regional KES/USD/GBP prices for the delivery country. Market/price conversion is not a live FX feed.
6. Verify the deployed full application on desktop/mobile: registration/login/logout, reset email, account isolation and saved addresses; catalog and stock changes from Admin; each market checkout, promotion failures, no delivery option, stale checkout and reload recovery. Check logs, TLS, backups and Admin access before accepting customer details.
7. Complete and activate payments separately in provider sandbox before production. This code intentionally has no working payment or order-completion endpoint. Add the provider configuration, hosted payment flow, verified webhooks, idempotent completion and confirmation delivery; test payment failure/retry/refund and inventory reservation behavior.

## Validation and boundaries

Root automated tests cover the existing storefront, customer/password-reset/address isolation, native amount conversion, market validation, stock limits, ownership/CSRF, sanitized upstream failures, and Pages subpath navigation. `npm run build` checks the Worker bundle; `npm run build:pages` builds the static preview.

The backend verification runs actual PostgreSQL migrations and a real Medusa server, exercises native catalog, owned carts, retry/concurrency, stale revisions, promotions/delivery, direct-route blocking and the storefront adapter, then builds backend plus Admin. It uses disposable fixtures only. A live customer order cannot be verified until provider completion is implemented, and production services/domain/sender are not created by these tests.

This is a hosting-ready application with payment activation deliberately unfinished. It is not yet a public, production-verified boutique. Hosting alone will not remove the payment boundary or replace required merchant settings.
