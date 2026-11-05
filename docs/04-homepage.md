# Phase 3 — Homepage

Status: implemented as the root storefront; Phase 4 is next.

## Experience delivered
Responsive campaign hero with burgundy copy panel and cream logo; signature concept looks; brand statement; Abundance collection feature; category discovery; atelier editorial; two journal stories; newsletter preview and customer-care footer. The Phase 2 design system remains at /design-system/index.html.

Header search filters the concept looks and journal. Look previews open accessible native dialogs. Saved looks persist locally in the browser and can be removed. Bag and account entry points explain their preview status. No orders, payments, customer accounts or subscriptions are created.

About, journal index, journal articles, contact, FAQ, size-guide, shipping, returns, privacy and terms routes are present. Policy/contact shells intentionally do not fabricate business details or commercial promises. Unknown routes use a branded not-found page.

## Runtime decision
Moved the component lab under public/design-system and adopted the supplied Sites Vinext starter: React/TypeScript, Next-compatible App Router, CSS tokens, and a Cloudflare Worker entrypoint. This honors the architecture's typed storefront while fitting the Sites hosting runtime. Preserve the starter's sites() integration, Worker and connector boundaries. Medusa/PostgreSQL/CMS/Stripe remain future integrations on compatible infrastructure.

Source manifest keeps the existing project_id and audience and removes the obsolete static directory declaration. dist/ is now generated output, not source. public/ holds deployment assets.

## Assets and content
- Cream logo rendered from the previously reviewed transparent cleanup; original uploaded logo retained unchanged for reference.
- Three generated fashion/atelier concept images, compressed to WebP. Homepage image assets total approximately 560KB, plus logo and font assets; repeated image references reuse cached files.
- Campaign image has a smaller responsive source. Non-hero media is lazy-loaded and uses fixed aspect ratios. The three concept portraits share one image with CSS panel positioning.
- Generated fashion imagery and look names are explicitly illustrative. Replace them with approved photography, verified product information and prices before public launch.
- Editorial copy describes a visual point of view, without invented founder history, manufacturing practices, reviews, materials or sustainability claims.
- No Product offers, fabricated review schema or launch sitemap. The private preview remains noindex with robots disallow until production content is approved.
- Newsletter validates input locally and states that no address was saved or sent. Search and saved looks also stay local. No analytics or marketing scripts were added.

## Validation
- TypeScript no-emit check and production Worker build.
- Browser review at desktop and 390px/320px phone frames, with no horizontal overflow at 375px/305px effective content widths.
- Mobile navigation opens, follows collection anchors and closes; native dialogs provide modal focus and Escape dismissal.
- Look preview opens, saves and restores saved state after reload; saved removal works.
- Search matching, empty results and recovery suggestions.
- Newsletter invalid input/focus and valid-format preview notice.
- Linked About, Journal/article and FAQ pages reviewed.
- Keyboard focus CSS and reduced-motion support retained. These checks are not a full accessibility audit or production performance benchmark.

## Next phase
Shop: typed catalog/provider adapter, URL-preserved filters, sorting, pagination, categories and collections. Current homepage navigation points to on-page discovery sections until those routes exist. Move product-level measurements and purchasing controls to the product/cart phases when real data is available.
