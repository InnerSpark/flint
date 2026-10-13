# Flint workbench

The Flint test environment. It ships inside the docs site at **flint.innersparkmedia.com/workbench/** (the docs build in `../docs` builds it and copies it in). One Storybook holds:

- **Foundations:** every semantic token, contrast pair, primitive, type style, size and component token, generated from `../dist`
- **Components:** Button, Input and Checkbox as MUI, shadcn and plain CSS side by side, every state, light and dark
- **Coverage:** which Figma library components are in the workbench yet

Nothing on a token page is typed by hand. It reads the Flint build, so it cannot show a value the build did not produce. Usage guidance and code live in the docs site, not here.

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
npm run verify                # axe on every story in light and dark, plus token coverage
npm run verify -- --shots ./shots # same, and saves a screenshot of each story
```

`verify` fails on any axe violation (WCAG 2.0 to 2.2, A and AA) or on any semantic or component token without a row on its page.

## Deploy

Deployed as part of the docs site. See `../docs/README.md`.

## MUI next to Tailwind

MUI and Tailwind v4 share the page here, the same way an app mixing them would. MUI's styles go in a `mui` cascade layer below Tailwind's utilities (`StyledEngineProvider enableCssLayer` plus a `GlobalStyles` layer order in `.storybook/preview.jsx`). Without it, MUI's unlayered reset beats every Tailwind utility.
