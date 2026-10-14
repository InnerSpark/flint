#!/usr/bin/env node
// `npm run preflight` — the one gate before tagging a release. Every check here exists
// because its absence caused a real problem (ASDS-46):
//   - package.json, the top CHANGELOG version and the tag could disagree silently
//   - a version could be committed and never tagged (v1.6.1)
//   - a tag could already exist (v1.7.0)
//   - dist/ could be stale, so consumers get different values than tokens.json says
//   - the contrast, usage, density and parity gates only ran if someone remembered
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const sh = (cmd) => execSync(cmd, { stdio: ['ignore', 'pipe', 'pipe'] }).toString().trim();
const problems = [];
const ok = [];

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const version = pkg.version;
const tag = `v${version}`;

// 1. The CHANGELOG's top version section must match package.json, and Unreleased must be promoted.
const cl = readFileSync(new URL('../CHANGELOG.md', import.meta.url), 'utf8');
const firstHeading = (cl.match(/^## .*$/m) || [''])[0];
if (/^## Unreleased/.test(firstHeading)) {
  problems.push(`CHANGELOG.md still starts with "## Unreleased". Run: npm run release:prepare ${tag}`);
} else {
  const m = firstHeading.match(/^## (v\d+\.\d+\.\d+)/);
  if (!m) problems.push(`CHANGELOG.md's first section is "${firstHeading.trim()}", which is not a version heading.`);
  else if (m[1] !== tag) problems.push(`CHANGELOG.md's top section is ${m[1]} but package.json is ${version}. They must match.`);
  else ok.push(`CHANGELOG top section is ${tag}, matching package.json`);
}

// 2. The tag must not already exist.
let tags = [];
try { tags = sh('git tag -l').split('\n').map((t) => t.trim()); } catch { problems.push('Not a git repository?'); }
if (tags.includes(tag)) problems.push(`Tag ${tag} already exists. Pick a later version; see npm run release:notes.`);
else ok.push(`${tag} is free`);

// 3. dist/ must match tokens.json. A stale dist means consumers get values the source does not claim.
try {
  sh('npm run build');
  ok.push('build green: contrast, usage, density and parity all pass');
} catch (e) {
  const out = (e.stdout?.toString() || '') + (e.stderr?.toString() || '');
  const fails = out.split('\n').filter((l) => /^FAIL|failure\(s\)/.test(l.trim())).slice(0, 6);
  problems.push('npm run build failed:\n    ' + (fails.join('\n    ') || 'see npm run build'));
}

// 4. The tree must be clean, so the tag points at exactly what was verified.
//    Run after the build, since the build legitimately rewrites dist/.
let dirty = '';
try { dirty = sh('git status --porcelain'); } catch { /* reported above */ }
const dirtyFiles = dirty.split('\n').map((l) => l.trim()).filter(Boolean).filter((l) => !/\.fuse_hidden/.test(l));
if (dirtyFiles.length) {
  problems.push(`Working tree is dirty, so the tag would not match what was verified. Commit first:\n    ${dirtyFiles.slice(0, 8).join('\n    ')}`);
} else {
  ok.push('working tree clean');
}

console.log('');
for (const o of ok) console.log(`  PASS  ${o}`);
for (const p of problems) console.log(`  FAIL  ${p}`);
console.log('');
if (problems.length) {
  console.log(`  ${problems.length} problem(s). Not ready to tag.\n`);
  process.exit(1);
}
console.log(`  Ready. Tag with:\n    git tag ${tag} && git push && git push --tags\n`);
