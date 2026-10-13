import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming/create';
import { semantic, fontFamily } from '../../dist/index.js';

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'Flint workbench',
    brandUrl: '/',
    brandImage: 'flint-icon.svg',
    brandTarget: '_self',
    fontBase: fontFamily.sans,
    colorPrimary: semantic.light.action.primary,
    colorSecondary: semantic.light.action.primary,
    textColor: semantic.light.text.default,
    textMutedColor: semantic.light.text.muted,
  }),
});
