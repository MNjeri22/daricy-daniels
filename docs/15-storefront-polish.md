# Storefront copy and mobile polish

Remove the requested AI, DD name prefixes, sample/concept/preview notices and campaign credits from customer-facing pages, dialogs, image descriptions and metadata. Keep image asset paths, saved selections, the brand logo and internal environment modes stable. Payment and customer-account actions remain gated by the existing integrations; contextual coming-soon messages describe those actions without global development banners. Newsletter signup stays disabled while the email service is inactive.

Use the shared storefront navigation on editorial pages. The burgundy navigation stays at the top while scrolling. At phone widths, keep the logo and full Daricy Daniels name above an accessible utility row containing currency, search, sign-in, saved pieces and bag controls. Retain subtle control borders and 44px touch targets. Reduce the mobile menu links to 24px.

Product pages use one column below 900px, wrap thumbnails and long titles, and stack purchase controls on small phones. Native image-panel dimensions now preserve the entire clothing silhouette instead of clipping the bottom of the sprite image. Bag images retain their full image panels and color-specific galleries. The desktop gallery and catalog filters clear the sticky navigation.

Validation: existing domain tests, TypeScript, Worker and Pages builds; browser checks at a roughly 337px content width using normal browser zoom, including all utility controls, menu text, gallery views, purchase widths, no horizontal overflow and sticky navigation at top zero. Device emulation is unavailable in this environment. No production payment or account services are activated.
