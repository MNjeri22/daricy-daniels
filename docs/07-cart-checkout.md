# Phase 6 — Cart / checkout

## Delivered
- `/cart`: sample line images, names, size/color, unit and line prices, editable size/quantity, remove, undo and save-for-later. Matching variant edits merge within the five-per-variant cap; unavailable sizes and stale edits are rejected.
- Shared mini-cart drawer supports the same editing and saved-piece actions without leaving the product/shop/homepage. Full bag and checkout links, empty/loading feedback, local persistence, normalization warnings and recoverable storage errors.
- Sample order summary with standard ($12) and express ($25) US delivery illustrations; PREVIEW10 tests a 10% discount. Unknown codes show an error. Discount and total formatting preserves cents. Tax remains unknown and estimated totals explicitly exclude it.
- `/checkout`: guest details and shipping/billing addresses, delivery selection, promo, review, edit/back paths and a payment-provider boundary. Invalid/missing address/email/ZIP or unconfigured destination prevents progression. Separate billing validated only when chosen.
- Checkout fields remain in memory and clear on reload. Only sample bag IDs/options/quantities persist; promo and shipping selection travel to checkout as nonpersonal URL parameters. No address, email, card or order data is sent to an API or stored.
- Review reflects current bag contents. If another same-origin tab changes the bag, review returns to delivery with a notice; payment feedback is cleared. Empty bag prevents the checkout flow.
- `/account`: guest entry and explicit unavailable sign-in state. `/checkout/confirmation`: honest no-order state, never an invented success, order number, email or tracking record.

## Validation
- 20 domain tests: catalog/variant rules, persistence validation, edit merging and quantity limits, stale keys, exact minor-unit quote arithmetic, fractional-dollar display, address/billing/destination validation and a provider that cannot report a successful order.
- TypeScript and production Worker build.
- Browser QA: quantity and size edits; invalid/valid promo; required guest fields; sample details → delivery → review; separate billing errors; unavailable payment response; remove/undo; save-for-later; mini-cart editing; empty bag; 390px checkout layout and progression.

## Boundaries / next phase
All prices, delivery options, promotional eligibility and stock are fixtures. Only a US sample destination is configured, not an approved selling region. No delivery date, actual shipping rate, tax amount or final payable total is promised. No payment SDK, credentials, account authentication, customer record, order API or confirmation email is provisioned.

`CheckoutProvider.prepare()` is deliberately unconfigured and returns `PROVIDER_NOT_CONFIGURED` while preserving the bag. Phase 7 must replace it with a server-created hosted checkout session after authoritative product, variant, region, price, tax, promo and stock validation. Never trust browser totals. Add inventory reservations, idempotency, signed payment webhooks, authenticated account/cart ownership, verified confirmation data and staging purchase/refund/failure tests before enabling purchasing. This milestone has no live or sandbox payment integration.
