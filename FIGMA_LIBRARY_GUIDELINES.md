# Flint Figma Library Guidelines

Rules for anyone (person or AI) designing with the Flint library in Figma. Flint is the shared design system for AccessSpark, Inner Spark Media and sister brands.

Library file: https://www.figma.com/design/SPVtGNr2eMf2LrwV4F3VVo/Flint-Design-System
Source of truth for values: `tokens.json` in the `flint` repo. The Figma variables mirror it. If they ever disagree, the repo wins and the library gets fixed.

## 1. The non-negotiables

- **Contrast is AAA.** Body and UI text must hit 7:1 against its background, in light and dark. Large text (24px+, or 18.66px+ bold) must hit 4.5:1. Non-text UI (borders, focus rings, icons that carry meaning) must hit 3:1. Our published conformance claim is still WCAG 2.2 AA; AAA is our internal bar, not a claim.
- **Tokens only.** Every fill, stroke, text color, radius, spacing and size is bound to a variable. No raw hex. No direct Primitives in a design; use Semantic.
- **Library components first.** Use an instance of a Flint component before drawing anything. If nothing fits, file an ASDS ticket before building a new one.
- **Never rely on color alone.** Status, selection and errors always pair color with text, an icon, weight or a shape (WCAG 1.4.1).
- **Every interactive thing has every state.** Default, hover, focus, disabled, and where it applies active, selected and error.
- **Check both modes.** Every screen gets a look in Light and Dark before handoff.

## 2. Color

Use the **Semantic** collection. It has two modes, Light and Dark. Set the mode on the top frame; everything inside follows.

### Brand and platform modes

Two more collections switch the whole design, the same way Light and Dark do. Set them on the top frame.

| Collection | Modes | What changes |
|---|---|---|
| Brand | Flint, AccessSpark, Inner Spark Media, Studio | The few tokens a brand overrides: secondary action, focus ring, focus border, default text, card radius. Inner Spark Media gets its orange focus ring and an 8 card radius; Studio gets a lighter default text that still clears 7:1. |
| Platform | Web, iOS | Touch target and control height: 24 and 40 on the web, 44 and 44 on iOS. Platforms never change color. |

Don't bind to `brand/*` or `platform/*` directly. They're hidden from the pickers; Semantic and Sizing point at them. The repo has the same layers (`brands/*.json`, `platforms/*.json`), and the variables mirror them.

Illustrations use five more Semantic variables, `illustration/lit`, `face`, `shade`, `mid` and `deep`, for the faceted shard. Use them only in illustrations.

### Pairings that pass AAA

Use these pairs as-is. If you need a pair that isn't listed, measure it before you ship it.

| Text token | On surface | Light | Dark |
|---|---|---|---|
| text/heading | surface/default, page, subtle | 14:1+ | 15:1+ |
| text/default | surface/default, page, subtle | 13:1+ | 9.8:1+ |
| text/muted | surface/default, page, subtle | 9.4:1+ | 7.5:1+ |
| text/link | surface/default, subtle | 7.1:1+ | 8.4:1+ |
| text/selected | surface/selected | 7.18:1 | 7.91:1 |
| action/on-primary | action/primary | 7.8:1 | 10.5:1 |
| feedback/*/text | matching feedback/*/surface | 7:1+ | 7:1+ |
| feedback/*/on-solid | matching feedback/*/solid | 7:1+ | 7:1+ |
| text/inverse | surface/inverse | 14:1+ | 14:1+ |
| text/on-code | surface/code | 7:1+ | 7:1+ |

### Rules

- **Text on a filled surface uses its "on" token.** Labels on action/primary use action/on-primary. Labels on feedback solids use the matching on-solid. Never type white. In Dark mode the filled actions are a light fill with a near-black label, so a hardcoded white label drops to about 1.8:1.
- **Code blocks use text/on-code**, not text/inverse. Both surface/code and text/inverse flip between modes, so text/inverse on code goes to 1.09:1 in Dark.
- **Muted is for secondary text, not for anything the user must read to finish a task.**
- **Placeholders are hints, not labels.** Every field still has a visible label.
- **Feedback families stay together.** An error uses feedback/error/surface + border + text (or solid + on-solid). Don't mix families.
- **Accent/aaa (violet) is a small highlight only.** Don't use accent/aaa/surface as a large fill. It is a saturated block in Dark mode.
- **Selected state** uses surface/selected + text/selected + a second cue (SemiBold weight, a 3px action/primary bar, or a check). Color alone is not enough.
- **Focus** is a 2px action/focus-ring stroke, always visible on keyboard focus, never removed.

## 3. Typography

Font is Open Sans for everything. Use the text styles; don't set sizes by hand.

| Style | Use |
|---|---|
| display/xl, display | Marketing heroes only |
| heading/h1 (36) | One per page, the page title |
| heading/h2 (24) | Section titles |
| heading/h3 (18) | Card and panel titles |
| body/lg, body/md, body/sm | Running text. body/sm (14) is the app default |
| label/default (14) | Field labels, nav items |
| label/button (14 bold) | Buttons |
| label/caption, label/helper (12) | Helper text, metadata |
| label/kicker (12 bold, uppercase) | Section eyebrows |
| ios/nav-title-large (34), ios/nav-title (17), ios/tab-label (12) | iOS bars only: large and inline navigation titles, tab labels |

- Nothing below 12px.
- Headings follow document order (h1, then h2, then h3). Don't pick a heading level for its size.
- Keep line length under about 80 characters for body text.

## 4. Space, size and radius

Use the **Sizing** variables for padding, gaps, radius and control sizes.

- **Spacing scale:** 0, 2, 4, 8, 12, 16, 24, 32, 40, 48, 64. Nothing off-scale.
- **Inset (padding):** space/inset/sm, md, lg, xl. **Gap:** space/gap/sm, md, lg.
- **Radius:** radius/control (8) for inputs, buttons and nav items. radius/card for cards and panels. radius/card-lg for dialogs. radius/pill for chips and avatars.
- **Controls:** size/control/sm (32) and md (40).
- **Touch targets:** at least 24 by 24 on the web (size/target/min). Aim for 40 on anything used often. In the iOS platform mode size/target/min is 44.
- **Icons:** size/icon/sm 16, md 20, lg 24.
- **Shadows:** use the effect styles (shadow/card, popover, dialog, raised) and their shadow/dark/* versions in Dark mode.

## 5. Components

Use these before building anything new. Pick variants with properties; don't detach.

| Need | Use |
|---|---|
| Actions | Button (primary, secondary, text, destructive), Split button |
| Forms | Form field (label, helper, error built in), Input, Textarea, Select, Checkbox, Radio, Toggle |
| Status | Chip, Badge, Severity chip, Status pill (VPAT conformance), Alert, Toast |
| Navigation | Tab, Pagination, Link, Skip link, Menu item (site nav) |
| Containers | Dialog, Drawer, Menu and Menu item (dropdown), Empty state, Tooltip |
| Data | Table cell (header, text, number, status), Progress, Score card, Score donut |
| Product patterns | Issue card, Comparison card, CTA band, Step card, Conformance row, Conformance stat card, Verification method, Icon tile |
| Chrome | Footer. App headers and sidebars are product-specific and live in each product's file, not here |
| Illustration | 18 spot illustrations on the Illustration page, decorative only |

Rules:

- **One primary button per view.** Everything else is secondary or text.
- **Destructive actions** use the destructive variant and a confirm step.
- **Forms use Form field**, not a bare Input, so the label, helper and error wiring come with it.
- **Errors:** the field shows the error state, the message replaces the helper text, and focus moves to the first errored field.
- **Dialogs and drawers** sit over overlay/scrim, trap focus, close on Esc and return focus to what opened them.
- **Don't detach instances.** If an instance can't do what you need, that's an ASDS ticket.

### iOS components

The **iOS components** page has the SwiftUI components from the Swift package: Tab bar, Navigation bar, Bar button, Toolbar, List row and List header, Sheet, Glass button, Notice, Tag, Card, Switch, Toggle row, Choice picker, Stepper, Stat tile and Empty state. The page is set to the iOS platform mode. Buttons are the web Button, which is 44pt tall in that mode.

- Bars come in two styles. **Solid** is iOS 16 to 25. **Glass** is Liquid Glass on iOS 26 and later, drawn with Figma's glass effect over content. On a device the system draws the glass, Reduce Transparency and Increase Contrast; Flint only sets fonts and the selected tint.
- Keep glass on the navigation layer: bars, sheets and floating buttons. Never on cards, lists or notices.
- Icons on that page are decorative stroke icons (`iOS icon/*`) that match the docs. In SwiftUI use the matching SF Symbol.

## 6. Icons

- Use the **Icon** component and pick the glyph with the Name property (Material Icons, filled).
- Icons that sit next to a text label are decorative (aria-hidden). Icon-only buttons need an accessible name in the annotation.
- Icon color follows the text next to it (text/muted, text/default or text/selected).
- Missing a glyph? File ASDS. Don't import a different icon set.

## 7. Accessibility annotations

Every new screen or component ships with notes engineering can build from without guessing:

- Landmarks: header, nav (with a label), main, footer.
- Accessible names for icon-only controls.
- Selected and current state: aria-current="page" for nav, aria-selected for tabs and options, aria-pressed for toggles.
- Expanded state: aria-expanded on anything that opens a menu, drawer or disclosure.
- Live regions: role="status" for progress and counts, role="alert" for errors. Live regions stay in the DOM, empty when unused.
- Focus order and where focus goes when something opens or closes.
- Reduced motion: name any animation and what it becomes under prefers-reduced-motion.

The test: can a blind user finish this flow with VoiceOver or NVDA alone?

## 8. Content and demo data

- Demo screens use the Sam Carter persona (avatar "SC", sam@example.com) and example.com domains.
- Never show real personal data or another company's site or brand.
- Copy is plain and direct. No em dashes.

## 9. Publishing and updates

Changing a variable in the library does nothing for other files until it is published and accepted.

1. **Change the library:** edit the variable or component in place. Don't create a second variable with the same name; consumers bound to the old one keep the old value silently.
2. **Publish:** Assets panel, library icon, Publish. Write what changed and the version.
3. **Accept in every consumer file:** open the file, accept "Library updates available", Update all.
4. **Verify:** spot-check contrast in a consumer file in Light and Dark.

Version rules match the repo: breaking token or component change is a major, new tokens or components are a minor, fixes are a patch. Log every publish in the Guidelines page changelog and the repo CHANGELOG.

## 10. Contributing

1. File an ASDS ticket describing the need.
2. Reuse first. Only build if no token or component fits.
3. Build token-first with every state and an accessibility note.
4. Review: AAA contrast in both modes, no raw hex, no Primitives, no detached instances.
5. Publish, bump the version, add a changelog entry.

To retire something, mark it Deprecated, name the replacement and the removal version. It keeps working for one minor cycle, then goes in the next major.
