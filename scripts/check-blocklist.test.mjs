// Tests for check-blocklist.mjs: node --test scripts/
// The fixture term is made up; real terms never appear in this repo.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { parseTerms, findHits } from './check-blocklist.mjs';

const script = join(import.meta.dirname, 'check-blocklist.mjs');

test('parseTerms skips blank lines and # comments, trims, keeps phrases', () => {
  assert.deepEqual(parseTerms('# header\r\n\r\n  Zorblax  \nAcme Widget Pro\n#x\n'), ['Zorblax', 'Acme Widget Pro']);
});

test('findHits matches anywhere, ignoring case, and names file and line', () => {
  const hits = findHits(['Zorblax'], [
    { path: 'src/content/chapters/kit/a.md', text: 'one\nWe compared it with zorblax.\nthree' },
    { path: 'src/ok.md', text: 'nothing here' },
  ]);
  assert.deepEqual(hits, [{ file: 'src/content/chapters/kit/a.md', line: 2, term: 0 }]);
});

test('findHits checks file names (line 0) as well as text', () => {
  const hits = findHits(['zorblax'], [{ path: 'public/images/kit/ZORBLAX-logo.png', text: null }]);
  assert.deepEqual(hits, [{ file: 'public/images/kit/ZORBLAX-logo.png', line: 0, term: 0 }]);
});

test('findHits catches alt text and captions, and a phrase split by any spacing', () => {
  const hits = findHits(['Acme Widget Pro'], [
    { path: 'a.md', text: '![the acme  widget\tpro logo](/images/x.jpg)' },
    { path: 'b.md', text: 'caption: "Acme Widget Pro view"' },
    { path: 'c.md', text: 'Acme Widget alone is fine' },
  ]);
  assert.deepEqual(hits.map(h => h.file), ['a.md', 'b.md']);
});

function fixtureRepo(withTerm) {
  const dir = mkdtempSync(join(tmpdir(), 'blocklist-'));
  const git = (...a) => execFileSync('git', ['-C', dir, ...a], { stdio: 'pipe' });
  git('init', '-q');
  mkdirSync(join(dir, 'src', 'content'), { recursive: true });
  writeFileSync(join(dir, 'src', 'content', 'page.md'), withTerm ? 'title\nInspired by Zorblax.\n' : 'title\nThe kit checks its own work.\n');
  writeFileSync(join(dir, 'package-lock.json'), '{"name": "zorblax"}');   // lockfiles aren't site text
  git('add', '-A');
  return dir;
}

function run(dir, env) {
  return spawnSync(process.execPath, [script, '--dir', dir], { env: { ...process.env, GITHUB_ACTIONS: '', ...env }, encoding: 'utf8' });
}

test('a fixture site with a blocklisted term fails, naming file and line', () => {
  const r = run(fixtureRepo(true), { SITE_BLOCKLIST: 'Zorblax' });
  assert.equal(r.status, 1, r.stdout + r.stderr);
  assert.match(r.stdout, /src\/content\/page\.md:2: blocked term "Zorblax"/);
});

test('the same fixture without the term passes', () => {
  const r = run(fixtureRepo(false), { SITE_BLOCKLIST: 'Zorblax' });
  assert.equal(r.status, 0, r.stdout + r.stderr);
});

test('in GitHub Actions the term is named by its number, not its text', () => {
  const r = run(fixtureRepo(true), { SITE_BLOCKLIST: '# c\nOther\nZorblax', GITHUB_ACTIONS: 'true' });
  assert.equal(r.status, 1);
  assert.match(r.stdout, /src\/content\/page\.md:2: blocked term #2/);
  assert.doesNotMatch(r.stdout + r.stderr, /Zorblax/);
});

test('--terms reads a blocklist file', () => {
  const dir = fixtureRepo(true);
  const f = join(dir, '..', `terms-${Date.now()}.txt`);
  writeFileSync(f, '# one term per line\nzorblax\n');
  const r = spawnSync(process.execPath, [script, '--dir', dir, '--terms', f], { env: { ...process.env, SITE_BLOCKLIST: '', GITHUB_ACTIONS: '' }, encoding: 'utf8' });
  assert.equal(r.status, 1, r.stdout + r.stderr);
});

test('no blocklist at all fails closed', () => {
  const r = run(fixtureRepo(false), { SITE_BLOCKLIST: '' });
  assert.equal(r.status, 2);
  assert.match(r.stderr, /no blocklist/i);
});
