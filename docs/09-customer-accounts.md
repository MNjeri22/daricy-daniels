# Separate customer accounts — GitHub application

The public storefront account area uses its own email/password identity. ChatGPT sign-in is retained only for the managed studio and saved studio edit at `/studio/account`. Customer sessions never grant studio access, even when email addresses match. This change is for the GitHub application; it does not publish a new private Sites version.

## Routes and behavior

- `/account/login`: email/password sign-in; `/account/register`: account creation.
- `/account/forgot-password`: email reset request; `/account/reset-password`: new password form.
- `/account`: customer overview; `/account/orders`: owned order history; `/account/addresses`: add, edit and remove up to ten saved addresses.
- Address validation supports Kenya, USA and UK. The existing currency selector remains independent. Order totals display their original charged currency; historical totals are never converted at current sample rates.
- Customer APIs live at `/api/customer/:action`, independent of managed `/api/backend/account`.

Passwords use native Node-compatible scrypt (N=16384, r=8, p=5, random per-password salt; OWASP parameter set). Sessions use random 256-bit tokens, stored only as SHA-256 digests. Production cookies are `__Host-`, Secure, HttpOnly, SameSite=Lax and expire after seven days. Writes require the configured store origin and an Origin header, bounded JSON, and durable throttling. Edge IP throttling trusts only CF-Connecting-IP, never client-supplied X-Forwarded-For.

Reset tokens are random 256-bit secrets stored only as digests, expire after 30 minutes, and are single-use. A single atomic SQL update changes the password, consumes the token and increments the password version. Every session checks that version, invalidating all previous sessions even under concurrent reset attempts. A newer request replaces the previous link. Tokens travel in the link fragment, are removed from browser history on load, and are never put in the query string. Unknown-email requests use the same generic response; provider failures are logged without addresses or tokens. Delivery errors do not disclose account existence.

## Standalone deployment setup

1. Deploy the GitHub Worker application with a real D1 `DB` binding, nodejs_compat, HTTPS, and adequate CPU allowance for scrypt. The repository's placeholder database ID is local-only. Preserve the existing database; apply `0000_perfect_kulan_gath.sql` if not previously applied, then the appended `0001_lucky_harpoon.sql` migration. Do not re-run an already applied migration.
2. Set `CUSTOMER_APP_ORIGIN` to the exact deployed HTTPS origin, without a trailing slash. This setting is required; account routes fail closed if absent. For local QA only, `http://127.0.0.1:4173` is allowed and uses a non-Secure local cookie.
3. Configure Resend with a verified sending domain, set `RESEND_API_KEY` as a runtime secret and `CUSTOMER_EMAIL_FROM` to the verified sender. Reset requests return an explicit unavailable error when email is unconfigured. No email keys or sender are provisioned by this commit. Do not commit `.env` or `.dev.vars` values.
4. Run migrations on the actual deployment database and verify signup, sign-in, sign-out, reset delivery/expiry/reuse, session revocation, and address persistence against staging. GitHub Actions validates code; it does not deploy a production Worker or configure runtime secrets.
5. Before public launch, add provider-level abuse controls and verify email ownership before any verified-email-dependent behavior. New account emails are unverified. Never link an existing order or grant privileges merely because its email matches a new signup.

## Orders and checkout boundary

The order-history read path and database are implemented, including customer ownership. New accounts show a real empty state. There are no fabricated orders and no browser endpoint that creates an order or sets its price/status. A future trusted commerce/payment reconciliation service must write verified `customer_orders` snapshots using the authenticated customer ID captured at order creation. Neither commerce nor payment activation is included. Guest checkout remains a sample preview; signed-in customers can explicitly apply a saved address to checkout. The current session and owned address are refreshed before applying. Checkout edits never overwrite the saved address, billing details remain independent, and account failures leave manual guest entry available. This does not make checkout live.

Order snapshot payload: `{id, number, placedAt (ISO), status, currency (KES|USD|GBP), totalMinor (integer), items: [{name, quantity, variant}]}`. Never store card details. The API returns the latest 100 owned orders, in reverse chronological order.

## Validation

`npm test` runs 45 tests, including nine customer-account tests using real SQLite migrations and a captured reset-mail transport. Coverage includes hashing, registration/login/logout, cookie flags, invalid/expired/forged sessions, CSRF, throttling, reset expiry/replay/concurrency and global session revocation, replaced reset links, absent mail configuration, Resend request construction, address CRUD/ownership/limits/country validation, and empty/owned order history with no public order mutation.

TypeScript and the production Worker build also pass. Local browser QA verifies registration, authenticated overview, persisted address management, empty order history, sign-out and sign-in, and honest unavailable reset email. Real email delivery and production deployment require the configuration above.


## Checkout connection

The account panel in checkout loads the current customer and their saved addresses with private, uncached requests. Applying an address is an explicit action; it never silently overwrites typed contact or shipping fields. A changed session or deleted address cancels application with a recoverable message. Manual entry remains available throughout. Two additional domain tests cover address copying, excluded account metadata, preserved billing/delivery state, validation and non-mutation. The suite now contains 47 tests.
