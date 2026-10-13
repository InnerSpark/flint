# Flint workbench and docs

The Flint docs site and test environment, published at **flint.innersparkmedia.com**. One Storybook holds:

- **Guides:** getting started per platform, token tiers, usage rules, contributing (`src/docs/*.mdx`)
- **Foundations:** every semantic token, contrast pair, primitive, type style, size and component token, generated from `../dist`
- **Components:** Button, Input and Checkbox as MUI, shadcn and plain CSS side by side, every state, light and dark
- **Coverage:** which Figma library components are in the workbench yet

Nothing on a token page is typed by hand. It reads the Flint build, so it cannot show a value the build did not produce.

## Run it

```bash
npm ci
npm run storybook    # http://localhost:6006
```

The toolbar switches Theme (light / dark) and Density (comfortable / compact) for MUI, shadcn and plain CSS together.

## Check it

```bash
npm run build                 # rebuilds Flint (tokens, contrast, parity), then the static site
npx playwright install chromium   # once
npm run verify                # axe on every page in light and dark, plus token coverage
npm run verify -- --shots ./shots # same, and saves a screenshot of each page
```

`verify` fails on any axe violation (WCAG 2.0 to 2.2, A and AA) or on any semantic or component token without a row on its page.

## Deploy (Cloudflare Pages)

One-time setup in the Cloudflare dashboard, Workers & Pages, Create, Pages, Connect to Git:

| Setting | Value |
| --- | --- |
| Repository | `InnerSpark/flint` (grant the Cloudflare GitHub app access to it) |
| Production branch | `main` |
| Root directory | `workbench` |
| Build command | `npm ci && npm run build` |
| Build output directory | `storybook-static` |
| Environment variable | `NODE_VERSION` = `22` (also pinned in `.node-version`) |

Then Custom domains, Set up a custom domain, `flint.innersparkmedia.com`. If innersparkmedia.com's DNS is on Cloudflare, it adds the record for you. If not, add a CNAME `flint` pointing at the project's `*.pages.dev` address at your DNS host.

Every push to `main` rebuilds and redeploys. `public/_headers` sets the security headers.

## MUI next to Tailwind

MUI and Tailwind v4 share the page here, the same way an app mixing them would. MUI's styles go in a `mui` cascade layer below Tailwind's utilities (`StyledEngineProvider enableCssLayer` plus a `GlobalStyles` layer order in `.storybook/preview.jsx`). Without it, MUI's unlayered reset beats every Tailwind utility.
