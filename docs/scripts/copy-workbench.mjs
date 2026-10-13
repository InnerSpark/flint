// Puts the Storybook workbench at /workbench/ inside the docs build.
import { cpSync, existsSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const from = fileURLToPath(new URL('../../workbench/storybook-static', import.meta.url));
const to = fileURLToPath(new URL('../dist/workbench', import.meta.url));
if (!existsSync(from)) { console.error('Workbench build missing: run `npm --prefix ../workbench run build:storybook`.'); process.exit(1); }
rmSync(to, { recursive: true, force: true });
cpSync(from, to, { recursive: true });
console.log('Copied the workbench to dist/workbench/');
