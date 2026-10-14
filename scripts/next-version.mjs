#!/usr/bin/env node
// `npm run release:notes` — print the latest released version and the computed next ones,
// so we never guess a tag that already exists. This bit us at v1.7.0, where a tag was cut
// and then more work landed under the same version (ASDS-46).
//
// Flint releases by git tag. GitHub Releases are read first when `gh` is available, since
// that is what consumers see; otherwise we fall back to the local tags.
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const sh = (cmd) => execSync(cmd, { stdio: ['ignore', 'pipe', 'pipe'] }).toString().trim();

let latest = '';
let source = '';
try {
  latest = sh("gh release list --limit 1 --json tagName --jq '.[0].tagName'");
  if (latest) source = 'GitHub Releases';
} catch { /* gh missing or unauthenticated; fall through to tags */ }

if (!latest) {
  try {
    sh('git fetch --tags --quiet');
  } catch { /* offline is fine, local tags still tell us most of the truth */ }
  const tags = sh('git tag -l')
    .split('\n')
    .map((t) => t.trim())
    .filter((t) => /^v\d+\.\d+\.\d+$/.test(t))
    .sort((a, b) => {
      const pa = a.slice(1).split('.').map(Number);
      const pb = b.slice(1).split('.').map(Number);
      return pa[0] - pb[0] || pa[1] - pb[1] || pa[2] - pb[2];
    });
  latest = tags[tags.length - 1] || '';
  source = 'git tags (gh unavailable, so GitHub Releases were not checked)';
}

if (!latest) {
  console.log('\n  No released version found. The first release is up to you.\n');
  process.exit(0);
}

const m = latest.match(/^v?(\d+)\.(\d+)\.(\d+)$/);
if (!m) {
  console.log(`\n  Latest: ${latest} (not semver, bump by hand).\n`);
  process.exit(0);
}

const [maj, min, pat] = m.slice(1).map(Number);
const patch = `v${maj}.${min}.${pat + 1}`;
const minor = `v${maj}.${min + 1}.0`;
const major = `v${maj + 1}.0.0`;

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')).version;
const drift = `v${pkg}` !== latest ? `  package.json is ${pkg}, which does not match the latest release. Either a release was never tagged, or a bump is already staged.` : '';

console.log('');
console.log(`  Latest release : ${latest}   (from ${source})`);
console.log(`  package.json   : v${pkg}`);
if (drift) console.log(drift);
console.log('');
console.log(`  Next patch     : ${patch}   value fix, no new token`);
console.log(`  Next minor     : ${minor}   additive, new tokens or exports`);
console.log(`  Next major     : ${major}   a token was removed or renamed`);
console.log('');
console.log('  Then, in order:');
console.log(`    npm run release:prepare ${minor}    promotes ## Unreleased and syncs package.json`);
console.log('    npm run preflight                    refuses to go on if anything disagrees');
console.log(`    git add -A && git commit -m "ASDS-NN: ${minor}" && git tag ${minor}`);
console.log('    git push && git push --tags');
console.log('');
