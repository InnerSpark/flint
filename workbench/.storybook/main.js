import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';

const flintRoot = fileURLToPath(new URL('../..', import.meta.url));

/**
 * Flint workbench (ASDS-42), published at flint.innersparkmedia.com/workbench/. The written docs live in ../docs.
 * Reads Flint straight from ../dist, so it always shows the current build.
 */
export default {
  stories: ['../src/stories/**/*.stories.jsx'],
  staticDirs: ['../public'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-a11y', 'storybook-addon-pseudo-states'],
  framework: { name: '@storybook/react-vite', options: {} },
  core: { disableTelemetry: true },
  async viteFinal(config) {
    config.plugins = [...(config.plugins || []), tailwindcss()];
    config.esbuild = { ...(config.esbuild || {}), jsx: 'automatic' };
    config.server = { ...(config.server || {}), fs: { ...(config.server?.fs || {}), allow: [flintRoot] } };
    return config;
  },
};
