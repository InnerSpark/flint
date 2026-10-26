import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
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
      // Google Analytics (ASDS-90): gtag.js from googletagmanager.com, hits to the GA collection hosts.
      scriptDirective: { resources: ["'self'", 'https://www.googletagmanager.com'] },
      directives: ["default-src 'self'", "img-src 'self' data: https://*.google-analytics.com https://*.googletagmanager.com", "font-src 'self' data:", "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com", "object-src 'none'", "base-uri 'self'", "form-action 'self'"],
    },
  },
  // React for the workbench islands (MUI and shadcn render live); Tailwind only for the shadcn bench.
  integrations: [react()],
  // The workbench's Flint React column imports ../react/src. dedupe makes React and Radix resolve from the
  // docs install, so the page never loads a second React (hooks break) or needs react/node_modules.
  vite: {
    plugins: [tailwindcss()],
    server: { fs: { allow: [flintRoot] } },
    resolve: { dedupe: ['react', 'react-dom', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-tabs', '@radix-ui/react-toast', '@radix-ui/react-tooltip'] },
  },
});
