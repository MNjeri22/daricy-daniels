# Phase 2 — Design system
Status: implemented as a standalone component showcase.

## Scope and runtime decision
The static HTML/CSS/ES module component lab runs without a framework build. It is a design reference, not the storefront application. Keep the tokens and behaviors portable when creating the typed storefront in Phase 3; confirm current Worker/framework integration at that point. Medusa, PostgreSQL, CMS and Stripe remain unconfigured.
Source is in dist/. Sites publishes these static assets privately. GitHub retains the same source plus project documentation. No customer data is captured.

## Color tokens
| Token | Value | Use |
| --- | --- | --- |
| Primary | #651D32 | Identity and primary actions |
| Primary hover | #481423 | Action hover |
| Secondary | #D2B99E | Tan accents |
| Background | #F8F4ED | Main canvas |
| Surface | #EFE7DC | Cream panels |
| Text | #302525 | Main text |
| Muted | #74645E | Supporting copy |
| Border | #D9CCBD | Decorative separators |
| Control border | #8E7C6D | Input, icon button and size boundaries |
| Success | #315B43 | Confirmed feedback |
| Warning | #80551B | Notices |
| Error | #A02E38 | Validation |
Use on-primary cream for text over burgundy. Do not use decorative separator borders as the only boundary of an interactive input.

## Typography, spacing and proportion
Playfair Display regular/italic for display/headings; Montserrat 400/500/600 for body/interface. Fonts load from Google Fonts with swap; self-host licensed font files during storefront production hardening.
Fluid display: 56–128px. H1: 44–80px. H2: 32–56px. H3: 24–32px. Base body: 14px. Supporting labels: 10–11px; small atelier captions use 8–9px only outside purchase-critical flows. Storefront shipping, errors and checkout information should stay comfortably readable.
Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128px. Page gutter: fluid 20px–96px. Portrait product media: 3:4.
Layouts stack at 700px; secondary adjustment at 1000px. Controls remain at least 44px; primary buttons and size controls 48px.

## Reusable patterns
- Primary, outlined, disabled and text-action buttons.
- Header, mobile navigation dialog, footer and editorial section headings.
- Input, error/helper text and positive validation feedback.
- Exclusive size toggle group with unavailable state.
- Native disclosure accordions.
- Product-card layout, color indicators and accessible wishlist toggle.
- Native dialogs, Escape dismissal, focus containment/return, backdrop dismissal.
- Polite live-region toast; prefers-reduced-motion CSS.

The supplied Daricy Daniels logo replaces the exploratory DD monogram in the header, identity panel, mobile menu, footer and favicon. The original PNG is retained byte-for-byte in dist/assets/daricy-daniels-logo.png, with its proportions preserved. CSS multiply blending integrates its white background with the cream canvas; the source file is not edited or recolored. The material panel remains an exploratory CSS study, not a product photograph. Product prices and measurements remain TBC; sample availability is labeled. Sample form data stays in memory and is not transmitted or persisted.

## Validation performed
- JavaScript syntax check.
- Desktop visual inspection at approximately 1348px and mobile iframe inspection at a 390px frame (375px content viewport after scrollbar); no horizontal overflow.
- Mobile menu open, section-link navigation and close.
- Size-guide modal open and initial focus; Escape dismissal.
- Size selection updates exclusive pressed state and announced label.
- Empty-email validation with focus/error association; valid-format success message.
- Wishlist pressed state, accessible name and toast.
- Contrast calculation: primary/background 10.79:1; text/background 13.52:1; muted/surface 4.60:1. Semantic text colors exceed 4.5:1 on cream. Control borders exceed 3:1 on cream/background.
This is targeted verification, not a full WCAG audit or multi-browser certification. Test real device touch, assistive technology and production performance during storefront phases.

## Next
Phase 3: build the homepage with this visual language, a typed reusable storefront shell, campaign imagery and the editorial sequence. Preserve this lab under /design-system when the homepage takes over the root.

