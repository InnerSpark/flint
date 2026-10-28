import { IOS, IOS_ORDER, iosHref } from './iosComponents.js';
export const NAV = [
  {
    title: 'Get started',
    items: [
      ['Overview', '/get-started/'],
      ['Principles', '/principles/'],
      ['Web', '/get-started/web/'],
      ['iOS and SwiftUI', '/get-started/ios/'],
      ['Figma', '/get-started/figma/'],
    ],
  },
  {
    title: 'Foundations',
    items: [
      ['Color', '/foundations/color/'],
      ['Typography', '/foundations/typography/'],
      ['Spacing and size', '/foundations/spacing/'],
      ['Motion', '/foundations/motion/'],
      ['Elevation', '/foundations/elevation/'],
      ['Brands and platforms', '/foundations/brands/'],
      ['Illustration', '/foundations/illustration/'],
    ],
  },
  {
    title: 'Components',
    items: [
      ['Overview', '/components/'],
      ['Alert', '/components/alert/'],
      ['Badge', '/components/badge/'],
      ['Button', '/components/button/'],
      ['Checkbox', '/components/checkbox/'],
      ['Chip', '/components/chip/'],
      ['Dialog', '/components/dialog/'],
      ['Field', '/components/field/'],
      ['Icon', '/components/icon/'],
      ['Input', '/components/input/'],
      ['Link', '/components/link/'],
      ['Menu', '/components/menu/'],
      ['Radio', '/components/radio/'],
      ['Select', '/components/select/'],
      ['Skip link', '/components/skip-link/'],
      ['Switch', '/components/switch/'],
      ['Tabs', '/components/tabs/'],
      ['Toast', '/components/toast/'],
      ['Tooltip', '/components/tooltip/'],
    ],
  },
  {
    title: 'iOS components',
    items: [
      ['Overview', '/components/ios/'],
      ...IOS_ORDER.map((slug) => [IOS[slug].name, iosHref(slug)]),
    ],
  },
  {
    title: 'Guides',
    items: [
      ['Usage rules', '/guides/usage-rules/'],
      ['Contributing', '/guides/contributing/'],
    ],
  },
];
