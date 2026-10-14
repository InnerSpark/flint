#!/usr/bin/env node
// `npm run release:prepare vX.Y.Z` — promote the "## Unreleased" section to a dated version
// heading and set package.json to match, so package.json, the CHANGELOG and the tag agree by
// construction rather than by hand (ASDS-46).
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const arg = process.argv[2];
if (!arg || !/^v?\d+\.\d+\.\d+$/.test(arg)) {
  console.error('Usage: npm run release:prepare v1.14.0\nRun `npm run release:notes` first to see which version is next.');
  process.exit(1);
}
const tag = arg.startsWith('v') ? arg : `v${arg}`;
const version = tag.slice(1);

// Refuse to reuse a tag. This is the v1.7.0 mistake.
let tags = '';
try { tags = execSync('git tag -l', { stdio: ['ignore', 'pipe', 'pipe'] }).toString(); } catch { /* not a repo */ }
if (tags.split('\n').some((t) => t.trim() === tag)) {
  console.error(`Tag ${tag} already exists. Pick a later version; see npm run release:notes.`);
  process.exit(1);
}

const clPath = new URL('../CHANGELOG.md', import.meta.url);
const cl = readFileSync(clPath, 'utf8');

if (new RegExp(`^## ${tag.replace(/\./g, '\\.')}\\b`, 'm').test(cl)) {
  console.error(`CHANGELOG.md already has a ${tag} section.`);
  process.exit(1);
}
if (!/^## Unreleased\s*$/m.test(cl)) {
  console.error('No "## Unreleased" section in CHANGELOG.md. Write the notes there first.');
  process.exit(1);
}

// The section must actually say something. An empty release is a mistake, not a release.
const body = cl.split(/^## Unreleased\s*$/m)[1].split(/^## /m)[0].trim();
if (!body) {
  console.error('The "## Unreleased" section is empty. Nothing to release.');
  process.exit(1);
}

const date = new Date().toISOString().slice(0, 10);
writeFileSync(clPath, cl.replace(/^## Unreleased\s*$/m, `## ${tag} (${date})`));

const pkgPath = new URL('../package.json', import.meta.url);
const pkgRaw = readFileSync(pkgPath, 'utf8');
writeFileSync(pkgPath, pkgRaw.replace(/^(\s*"version":\s*")[^"]+(")/m, `$1${version}$2`));

const bullets = body.split('\n').filter((l) => l.trim().startsWith('-')).length;
console.log(`\n  ${tag} prepared.`);
console.log(`  CHANGELOG   ## Unreleased -> ## ${tag} (${date}), ${bullets} entr${bullets === 1 ? 'y' : 'ies'}`);
console.log(`  package.json version -> ${version}`);
console.log('\n  Next: npm run preflight\n');
