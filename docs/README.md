# Flint docs

The Flint docs site, published at **flint.innersparkmedia.com**. Astro, static, styled only with Flint's own CSS variables. Each component has one page with a live side-by-side of MUI, shadcn/ui, plain CSS and Flint React under Code, from `src/workbench/` (React islands that load when that section opens).

Every token value, contrast ratio and code sample is read from the Flint build or the workbench source. Nothing is typed by hand.

Token explorer (`/foundations/tokens/`): a view-only directory of every token, built from tokens.json and each brand's build. The browser script is `public/token-explorer.js`.

Analytics: Google Analytics, the same GA4 property as innersparkmedia.com (`G-9XNG65F6HM`), loaded in `src/layouts/Docs.astro`. In GA, filter by Hostname `flint.innersparkmedia.com`. The CSP in `astro.config.mjs` allows googletagmanager.com and the GA collection hosts; add any new outside host there too, or the browser blocks it.

## Word budget

`scripts/verify.mjs` fails when a page goes over its word budget in `word-budget.json`. New pages get 800 words. If a page needs more, cut first; if it really does, run `node scripts/verify.mjs --write-budget` (each page's words plus 15%) and commit the file with the change that needed it.

## Run it

```bash
npm ci
npm run dev       # http://localhost:4321
npm run build     # Flint build and checks, then the docs
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

## Component pages (ASDS-94, ASDS-95)

Every component is one page (`src/pages/components/[name]/index.astro`): Example, When to use, Accessibility, States, Code. When an iOS component points at it (`web:` in `src/data/iosComponents.js`), the page gets a Web / iOS switch and the iOS page folds into it (`?platform=ios`); iOS components without a web twin keep their own page under `/components/ios/`. The benches from `src/data/workbench.js` and the Density switch sit in a collapsed section under Code. The old tab, workbench and iOS twin URLs 301 from `public/_redirects`.

## Adding a component

Add the plain CSS to `css/components.css` at the repo root (it ships as `@innerspark/flint/components.css`) and the shadcn version to `src/workbench/ui/`, then a bench in `src/workbench/benches.jsx` and `src/data/workbench.js`, and an entry in `src/data/components.js`. The page and nav come from those entries.
