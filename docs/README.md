# Flint docs

The Flint docs site, published at **flint.innersparkmedia.com**. Astro, static, styled only with Flint's own CSS variables. The workbench (`../workbench`) is built and copied in at `/workbench/`.

Every token value, contrast ratio and code sample is read from the Flint build or the workbench source. Nothing is typed by hand.

## Run it

```bash
npm ci
npm --prefix ../workbench ci
npm run dev       # http://localhost:4321 (no workbench in dev)
npm run build     # Flint build and checks, workbench, docs, then copies the workbench into dist/
```

## Check it

```bash
npx playwright install chromium   # once
node scripts/verify.mjs           # every page: axe in light and dark, no sideways scroll at 375px, focus management
node scripts/verify.mjs --shots ./shots
```

Focus checks sample `document.activeElement` over 700ms: the skip link, an "On this page" link, and loading a URL with a hash must all land and stay on the heading.

## Deploy (Cloudflare Pages)

One-time setup in the Cloudflare dashboard, Workers & Pages, Create, Pages, Connect to Git:

| Setting | Value |
| --- | --- |
| Repository | `InnerSpark/flint` (grant the Cloudflare GitHub app access to it) |
| Production branch | `main` |
| Root directory | `docs` |
| Build command | `npm ci && npm --prefix ../workbench ci && npm run build` |
| Build output directory | `dist` |
| Environment variable | `NODE_VERSION` = `22` (also pinned in `.node-version`) |

Then Custom domains, Set up a custom domain, `flint.innersparkmedia.com`. If innersparkmedia.com's DNS is on Cloudflare, it adds the record for you. If not, add a CNAME `flint` pointing at the project's `*.pages.dev` address.

Every push to `main` rebuilds and redeploys. `public/_headers` sets the security headers.

## Adding a component

Add it to the workbench first (stories plus `src/styles/plain.css`), then add an entry to `src/data/components.js`. The page, its four tabs and the nav come from that entry.
