# Flint docs

The Flint docs site, published at **flint.innersparkmedia.com**. Astro, static, styled only with Flint's own CSS variables. The workbench lives at `/workbench/`: Button, Checkbox and Input rendered live as MUI, shadcn/ui and plain CSS, from `src/workbench/` (React islands).

Every token value, contrast ratio and code sample is read from the Flint build or the workbench source. Nothing is typed by hand.

## Run it

```bash
npm ci
npm run dev       # http://localhost:4321
npm run build     # Flint build and checks, then the docs and workbench
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
| Build command | `npm ci && npm run build` |
| Deploy command | `npx wrangler deploy` |
| Path (Advanced settings) | `docs` |
| Variable | `NODE_VERSION` = `22` (also pinned in `.node-version`) |

Then the Worker, Settings, Domains & Routes, Add, Custom domain, `flint.innersparkmedia.com`. This needs innersparkmedia.com's DNS on Cloudflare.

Every push to `main` rebuilds and redeploys. `public/_headers` sets the security headers. Each page also carries a Content-Security-Policy meta tag: scripts run only if their hash is listed (`scripts/postbuild.mjs` rehashes them from the final HTML), and `verify.mjs` fails on any CSP violation. The postbuild step also writes `sitemap.xml`. 

## Adding a component

Add the plain CSS to `css/components.css` at the repo root (it ships as `@innerspark/flint/components.css`) and the shadcn version to `src/workbench/ui/`, then a bench in `src/workbench/benches.jsx` and `src/data/workbench.js`, and an entry in `src/data/components.js`. The pages, tabs and nav come from those entries.
