// Which principles each page follows (ASDS-92). The layout shows them as a "Why" line under the lead,
// linking to each principle's page; each principle page lists the pages that follow it (ASDS-101).
import { PRINCIPLE_GROUPS } from './principles.js';

const MAP = {
  // Foundations
  '/foundations/color/': ['content-leads', 'one-action-color', 'red-means-danger', 'accessible-primitives'],
  '/foundations/typography/': ['accessible-primitives', 'content-leads'],
  '/foundations/spacing/': ['accessible-primitives'],
  '/foundations/motion/': ['motion-steps-aside'],
  '/foundations/elevation/': ['content-leads', 'legible-any-background'],
  '/foundations/brands/': ['one-source', 'accessible-primitives'],
  '/foundations/illustration/': ['content-leads', 'plain-words'],
  '/foundations/tokens/': ['one-source'],
  // Web components
  '/components/': ['accessible-primitives', 'one-source'],
  '/components/alert/': ['red-means-danger', 'plain-words'],
  '/components/badge/': ['content-leads', 'accessible-primitives'],
  '/components/button/': ['one-main-action', 'name-the-action', 'red-means-danger'],
  '/components/checkbox/': ['accessible-primitives', 'forms-one-column'],
  '/components/chip/': ['accessible-primitives', 'keyboard-and-reader'],
  '/components/dialog/': ['keyboard-and-reader', 'name-the-action'],
  '/components/field/': ['forms-one-column', 'plain-words'],
  '/components/icon/': ['accessible-primitives', 'no-sparkle'],
  '/components/input/': ['forms-one-column', 'accessible-primitives'],
  '/components/link/': ['one-action-color', 'name-the-action'],
  '/components/menu/': ['keyboard-and-reader', 'red-means-danger'],
  '/components/radio/': ['forms-one-column', 'keyboard-and-reader'],
  '/components/select/': ['native-before-custom', 'forms-one-column'],
  '/components/skip-link/': ['keyboard-and-reader'],
  '/components/switch/': ['accessible-primitives', 'keyboard-and-reader'],
  '/components/tabs/': ['keyboard-and-reader', 'content-leads'],
  '/components/toast/': ['plain-words', 'motion-steps-aside'],
  '/components/tooltip/': ['keyboard-and-reader', 'plain-words'],
  // iOS components
  '/components/ios/': ['native-before-custom', 'legible-any-background'],
  '/components/ios/navigation-bar/': ['native-before-custom', 'legible-any-background'],
  '/components/ios/toolbar/': ['native-before-custom', 'name-the-action'],
  '/components/ios/list/': ['native-before-custom', 'red-means-danger'],
  '/components/ios/sheet/': ['native-before-custom', 'keyboard-and-reader'],
  '/components/ios/glass-button/': ['legible-any-background', 'one-main-action'],
  '/components/ios/card/': ['content-leads'],
  '/components/ios/stepper/': ['keyboard-and-reader', 'accessible-primitives'],
  '/components/ios/stat-tile/': ['content-leads', 'plain-words'],
  '/components/ios/empty-state/': ['plain-words', 'one-main-action'],
};

const TITLES = Object.fromEntries(PRINCIPLE_GROUPS.flatMap((g) => g.items.map((p) => [p.id, p.title])));
for (const ids of Object.values(MAP)) for (const id of ids) if (!TITLES[id]) throw new Error(`principleLinks: unknown principle "${id}"`);

/** [{ id, title }] for a page path. */
export function principlesFor(pathname) {
  const path = pathname.endsWith('/') ? pathname : pathname + '/';
  return (MAP[path] || []).map((id) => ({ id, title: TITLES[id] }));
}

export const PRINCIPLE_PAGES = Object.keys(MAP);

/** The docs pages that follow a principle, in map order. */
export const pagesFor = (id) => Object.keys(MAP).filter((path) => MAP[path].includes(id));
