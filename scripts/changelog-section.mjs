#!/usr/bin/env node
// Print one release section from CHANGELOG.md, for `gh release create --notes-file`.
//   node scripts/changelog-section.mjs            # the top (latest) version section
//   node scripts/changelog-section.mjs v1.13.0    # a specific version
// The heading itself is omitted, since the tag is the release title.
import { readFileSync } from 'node:fs';

const want = process.argv[2];
const lines = readFileSync(new URL('../CHANGELOG.md', import.meta.url), 'utf8').split('\n');

const heads = [];
lines.forEach((l, i) => { if (/^##\s+v\d+\.\d+\.\d+/.test(l)) heads.push(i); });
if (heads.length === 0) { console.error('No version sections in CHANGELOG.md. Has ## Unreleased been promoted?'); process.exit(1); }

let start;
if (want) {
  const re = new RegExp('^##\\s+' + want.replace(/^v?/, 'v').replace(/\./g, '\\.') + '(\\b|:|\\s)');
  start = lines.findIndex((l) => re.test(l));
  if (start === -1) { console.error(`Section ${want} not found in CHANGELOG.md`); process.exit(1); }
} else {
  start = heads[0];
}
const next = heads.find((i) => i > start);
const body = lines.slice(start + 1, next === undefined ? lines.length : next).join('\n').trim();
process.stdout.write(body + '\n');
