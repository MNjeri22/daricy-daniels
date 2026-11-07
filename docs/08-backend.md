# Phase 7 — Backend foundation and activation gate

Status: foundation implemented; live commerce activation and the complete Phase 7 acceptance gate remain pending. This is not a production-ready commerce launch.

## Implemented and published
- Managed Site identity powers private account sign-in. The owner control room at `/studio` checks the gateway-verified email against a runtime secret derived from the existing Site owner's access record. The owner email is not committed or exposed to the browser. User-owned database records use the per-Site identity subject, not email.
- D1 provides durable account bag/wishlist storage, version conflict checks, request budgets and a deduplicated payment-event audit ledger. D1 supplements the private storefront account layer; it does not replace the planned Medusa/PostgreSQL commerce engine.
- `/account` saves this device's sample edit to the signed-in account, restores it, refreshes its revision, and reports storage/conflict failures. No delivery address, card data or contact form fields are stored in account edits.
- `/api/backend/quote` recomputes sample unit prices and stock eligibility on the server. Client price/total fields cannot set the result. Kenya/USA/UK and KES/USD/GBP are validated. The response is explicitly preview-only and cannot create an order.
- Server-only Medusa Store API catalog adapter uses a configured HTTPS origin, publishable key, fixed endpoint, bounded response, timeout and country/currency context. It never accepts an arbitrary proxy URL or forwards an Admin token to a client.
- Stripe raw-body HMAC verification, timestamp tolerance and event-ID deduplication. Verified audit events remain `pending_reconciliation`; receipt of an event does not mark any order paid or trigger fulfillment.
- Private/no-store API responses, authentication, owner authorization, same-origin mutation checks, bounded JSON bodies, input validation, rate limits and sanitized failure messages.

## API contract
| Method and endpoint | Behavior |
| --- | --- |
| GET `/api/backend/status` | Safe configuration flags and activation requirements; no keys, user data or promise of service health |
| GET `/api/backend/account` | Signed-in user's own saved edit and revision |
| PUT `/api/backend/account` | Same-origin `{version, bag, wishlist}`; atomic compare-and-swap; 409 for stale revision |
| POST `/api/backend/quote` | Signed-in, same-origin sample bag/currency/country/method/promo; no contact/address fields; preview-only response |
| GET `/api/backend/catalog?country=KE` | Owner-only Medusa catalog read; 503 when service configuration is absent |
| POST `/api/backend/stripe-events` | Raw signed Stripe event audit intake; 503 without signing secret, 400 for invalid/expired signature; duplicate receipts are safe |

The private Site gate applies before these endpoints. A production Stripe callback must terminate on the public Medusa payment provider integration; do not expose this private Site merely to receive callbacks. The optional audit endpoint requires a compatible authenticated ingress and does not replace Medusa's payment lifecycle.

## Validation
- 36 tests, including actual SQLite migration execution, account isolation, atomic concurrent-save conflicts, request budgets, untrusted totals/options, origin/JSON/size checks, sanitized Medusa HTTP mocks, Stripe payload/signature/age checks, deduplicated event receipts and payment-disabled readiness.
- TypeScript and Worker production build.
- Local D1 migration applied once through Wrangler; migration SQL and Drizzle snapshots tracked.
- Local running-app HTTP checks through a temporary local-only UI harness: readiness, anonymous rejection, fixture identity, database-backed save, private cache headers, stale save rejection, account isolation, server recomputation and missing-secret webhook rejection. The harness was removed before packaging; no mock identity or bypass route ships.
- Production merchant database, stock reservations, real payment/refund/cancellation/email journeys and restore backups have not been tested because those services are not provisioned.

## Runtime configuration
Use the hosting service's environment/secret controls; never put values in source, hosting.json or client bundles.
| Key | Purpose |
| --- | --- |
| STORE_OWNER_EMAIL | Existing verified Site owner authorization; configured as a secret |
| MEDUSA_BACKEND_URL | HTTPS Medusa origin, without path, credentials or query |
| MEDUSA_PUBLISHABLE_KEY | Store API publishable key scoped to the correct sales channel |
| STRIPE_WEBHOOK_SECRET | Optional audit endpoint signing secret; separate from Medusa's payment provider secret |
| SANITY_PROJECT_ID | CMS configuration readiness only; editorial content still uses approved local preview content |
| TRANSACTIONAL_EMAIL_PROVIDER | Email readiness only; no messages are sent by this foundation |

A configured flag is not a successful connection or completed integration. No Stripe API key, Medusa service, CMS or email credentials were supplied in this session.

## Complete live activation next
1. Deploy the official Medusa v2 application with PostgreSQL and Redis, server/worker processes and its Admin dashboard. Run its migrations and create the merchant's admin through the provider's supported flow. The Sites Worker cannot host this Node/PostgreSQL stack. Current reference: Medusa 2.22.4 documentation.
2. Configure real products, variant SKUs, inventory locations and sales channel. Create approved Kenya/KES, USA/USD and UK/GBP region prices, shipping/tax settings and policies. Display currency remains independent; actual Medusa cart settlement currency must match its region. Do not pass sample IDs or browser-converted totals as live prices.
3. Complete the storefront-to-Medusa cart/customer/order bridge with the actual service's schemas, stock and price lists. Wire its payment collection/session/completion workflow and Stripe provider; verify signed payment events on the commerce backend. Never treat a redirect or this audit ledger as evidence of payment.
4. Connect the CMS and verified email sender/provider, then replace local editorial/account-order placeholders with their authoritative data. Keep customer ownership and secrets server-side.
5. Run staging purchase, failed payment, retry/idempotency, concurrent last-item purchase, cancellation/refund, webhook replay/out-of-order, customer ownership and database restore tests. Only then enable live purchasing and truthful confirmation/order history.

## Primary references
- https://docs.medusajs.com/learn/deployment/general
- https://docs.medusajs.com/resources/storefront-development/cart/create
- https://docs.medusajs.com/api/store
- https://docs.medusajs.com/resources/storefront-development/checkout/payment
- https://docs.stripe.com/webhooks/signature

## Rollback and data
Publishing applies schema migrations before Worker deployment. Do not edit already applied migrations. A code rollback must remain compatible with these added tables; roll forward with an additive migration if needed. Account edits can be replaced by saving empty selections. No real order or inventory records are created here. Add merchant-approved retention/export/deletion and tested database backups before customer launch.
