# GitHub Pages design preview

The repository owner authorized making `MNjeri22/daricy-daniels` public so that GitHub Pages can publish a design preview on the account's current plan. Public visibility exposes repository source and commit history. The full server-backed storefront remains a separate deployment.

`npm run build:pages` builds the preview into ignored `pages-dist/`. It uses the same storefront components, sample catalog, artwork, burgundy tokens, local bag, local wishlist and currency display. The preview enumerates all catalog, category, collection and editorial routes as static entry files, so direct links and refreshes work. A small Pages-only JSX runtime prefixes DOM URLs and responsive image candidates with `/daricy-daniels/`; shared production components are unchanged. The Pages-only navigation adapter supports shop query filters through browser history.

Account, checkout and studio routes show an explicit backend-unavailable message. They do not collect passwords, addresses or payments, create orders, or claim to authenticate. No server code, database, credentials or real customer records are packaged. This is a non-transactional design demonstration, not a production ecommerce deployment.

## Publishing

1. In repository Settings → Pages, choose **GitHub Actions** as the build/deployment source after public visibility is confirmed.
2. The `GitHub Pages design preview` workflow builds/tests pull requests and publishes only `main` pushes or a manual run on `main`.
3. The deployment job has only Pages write and OIDC permissions; repository contents remain read-only. No personal access token or external service secret is needed.
4. Use the Pages URL returned by GitHub after the deployment succeeds. A custom domain is not required.

GitHub Pages hosts static content. Live customer accounts, inventory, checkout and orders require the separately hosted backend. GitHub's Pages usage limits also exclude using it to operate an ecommerce business or conduct sensitive transactions.

Validation: 49 automated tests, TypeScript, the existing Worker build, and the dedicated Pages build. Pages-specific tests cover internal/external/fragment URL handling, responsive image paths and non-mutation of shared props. Verify the published homepage, shop filtering, product navigation, bag, direct route reloads, and backend-unavailable pages in the browser before sharing the final link.
