import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';

const flintRoot = fileURLToPath(new URL('..', import.meta.url));

// Flint docs, published at flint.innersparkmedia.com. Reads Flint's own build output (../dist).
export default defineConfig({
  site: 'https://flint.innersparkmedia.com',
  trailingSlash: 'always',
  build: { format: 'directory' },
  vite: { server: { fs: { allow: [flintRoot] } } },
});
