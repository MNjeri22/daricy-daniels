# Newsletter and email offers

The inner-circle section now includes explicit consent for collection news, atelier stories and occasional offers, email validation, a signup acknowledgement, newsletter/offer design previews and a dedicated `/newsletter` page. GitHub Pages always uses preview mode: no requests, subscriptions, storage or emails. The preview clears the entered address after acknowledgement. No real discounts or campaigns are active.

The hosted application uses a separate `NEWSLETTER_MODE` gate. A valid live configuration enables double opt-in: the server sends a confirmation email with a 24-hour, hashed, single-use token. Opening the link alone does not subscribe anyone; the recipient must press **Confirm my subscription**. The token is carried in the URL fragment, removed from history after capture and submitted only in a same-origin POST. Anonymous newsletter consent does not create a customer account or opt in customers automatically.

Confirmation adds an eligible contact to a dedicated Resend marketing segment. Resend is the source of truth for campaign membership, bounces, suppressions and unsubscribe preferences. Existing global opt-outs are retained; this integration never PATCHes them back to subscribed. A repeat confirmation does not re-enroll the address. Existing unsubscribed contacts should use Resend's preference flow or client services to manage a requested rejoin. Do not manually override an opt-out to market to someone.

## Activation after hosting

1. Apply the additive `drizzle/0002_early_loki.sql` migration along with the existing migrations. The schema includes pending requests, versioned consent receipts, hourly email cooldowns and short-lived confirmation claims. Expired unconfirmed requests are removed during signup. Set an appropriate retention policy for confirmed consent receipts and cooldown hashes before launch.
2. Configure `CUSTOMER_APP_ORIGIN` with the exact public HTTPS origin, `RESEND_API_KEY` as a server-only secret with contact/segment and sending permissions, and `NEWSLETTER_EMAIL_FROM` as a verified sender. Keep `NEWSLETTER_MODE=preview` until staging passes.
3. In Resend create a dedicated **DARICY DANIELS Inner Circle** segment and put its UUID in `NEWSLETTER_SEGMENT_ID`. Use a dedicated store account/project; do not mix unrelated contact lists or import unconfirmed addresses into this segment. The integration uses current `/contacts` and `/contacts/{id}/segments/{segment_id}` endpoints, not the deprecated Audience API.
4. Set `NEWSLETTER_MODE=live` on staging. Check valid signup, unchecked consent, duplicate/cooldown requests, email delivery, invalid/expired token, concurrent confirmation, repeat confirmation, provider failure/retry and a previously unsubscribed contact. Confirm only verified addresses enter the segment. Unit tests use SQLite and stubbed provider HTTP, not a real Resend account; live provider staging verification remains required.
5. Compose collection newsletters and offer campaigns in **Resend Broadcasts**, selecting only this dedicated segment. The website does not automatically create or send Broadcasts. Use Resend's unsubscribe footer/preference link, your approved business postal address and accurate promotion terms, dates and links. No store address, discount or offer dates were invented here.
6. Send a campaign test to your own approved test address from Resend before sending to customers. Verify rendering, storefront links, suppression handling and unsubscribe. An unsubscribe in Resend governs future Broadcasts; local confirmation receipts do not assert current subscription status.

`newsletter-offer-template.html` is an editable starting point for the merchant's Resend Broadcast editor. Replace every `{{...}}` placeholder except `{{{RESEND_UNSUBSCRIBE_URL}}}` (Resend expands that one). Replace the illustrative copy and add the real offer terms; do not send unresolved placeholders.

## Checks

Automated tests cover configuration fail-closed behavior, consent/CSRF/honeypot, normalized addresses, cooldown/deduplication, hashed tokens, failed-mail cleanup, expiry, concurrent/single-use confirmation, claim release after provider failures, retained opt-outs and sanitized Resend API contracts. No actual emails, contacts or campaigns are created by tests.

Reference contracts: https://resend.com/docs/api-reference/contacts/create-contact, https://resend.com/docs/api-reference/contacts/get-contact, https://resend.com/docs/api-reference/contacts/add-contact-to-segment and https://resend.com/docs/api-reference/broadcasts/create-broadcast.
