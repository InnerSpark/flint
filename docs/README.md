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

## Deploy (Cloudflare Workers)

Static assets on a Worker, configured in `wrangler.jsonc`. One-time setup in the Cloudflare dashboard, Workers & Pages, Create, Import a repository:

| Setting | Value |
| --- | --- |
| Repository | `InnerSpark/flint` |
| Project name | `flint-docs` (must match `name` in `wrangler.jsonc`) |
| Build command | `npm ci && npm --prefix ../workbench ci && npm run build` |
| Deploy command | `npx wrangler deploy` |
| Path (Advanced settings) | `docs` |
| Variable | `NODE_VERSION` = `22` (also pinned in `.node-version`) |

Then the Worker, Settings, Domains & Routes, Add, Custom domain, `flint.innersparkmedia.com`. This needs innersparkmedia.com's DNS on Cloudflare.

Every push to `main` rebuilds and redeploys. `public/_headers` sets the security headers.

## Adding a component

Add it to the workbench first (stories plus `src/styles/plain.css`), then add an entry to `src/data/components.js`. The page, its four tabs and the nav come from that entry.
