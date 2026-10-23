/**
 * Builds @innerspark/flint/react (ASDS-69): react/src -> react/dist/index.js, one ESM file. React, React
 * DOM and Radix stay external (optional peer dependencies), so the app's own copies are used.
 */
import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
await build({
  entryPoints: [join(here, 'src/index.js')],
  outfile: join(here, 'dist/index.js'),
  bundle: true,
  format: 'esm',
  platform: 'neutral',
  target: 'es2022',
  jsx: 'automatic',
  external: ['react', 'react/jsx-runtime', 'react-dom', '@radix-ui/*'],
  legalComments: 'none',
  banner: { js: '// @innerspark/flint/react. Built from react/src by react/build.mjs. Do not edit.' },
});
console.log('Built react/dist/index.js');
