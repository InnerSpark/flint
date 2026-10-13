import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';

const flintRoot = fileURLToPath(new URL('..', import.meta.url));

// Flint docs, published at flint.innersparkmedia.com. Reads Flint's own build output (../dist).
export default defineConfig({
  site: 'https://flint.innersparkmedia.com',
  trailingSlash: 'always',
  // Stylesheets as files, never inline <style>, so the CSP can allow style attributes (swatches set their
  // color inline) without listing hashes that would cancel 'unsafe-inline'.
  build: { format: 'directory', inlineStylesheets: 'never' },
  // Per-page Content-Security-Policy meta tag: scripts only run if Astro hashed them at build time.
  experimental: {
    csp: {
      styleDirective: { resources: ["'self'", "'unsafe-inline'"] },
      directives: ["default-src 'self'", "img-src 'self' data:", "font-src 'self' data:", "connect-src 'self'", "object-src 'none'", "base-uri 'self'", "form-action 'self'"],
    },
  },
  vite: { server: { fs: { allow: [flintRoot] } } },
});
