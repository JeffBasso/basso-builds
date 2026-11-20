#!/usr/bin/env node
// Blocked-terms check: no third party's name, logo, files or product descriptions on the site.
//
// Every tracked file is checked: its path (image and file names) and, for text files, every line
// (page text, image alt text, captions, front matter). A term matches anywhere, ignoring case, and
// the words of a phrase match across any spacing. Any hit fails the run and names the file and line.
//
// The terms are not kept in this public repo. They come from the PCB Design kit's blocklist file
// (site/blocklist.txt there, one term per line, # for comments), which the kit's Update kit copies
// into this repo's SITE_BLOCKLIST Actions secret. Run it locally with the file itself:
//   node scripts/check-blocklist.mjs --terms <kit>\site\blocklist.txt [--dir <repo>]
// No terms at all fails closed (exit 2). In GitHub Actions a term is named by its number in the
// list, so the public check log never prints it.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

// Files that aren't site content: the npm lockfile lists package names, not page text.
const SKIP = new Set(['package-lock.json']);

export function parseTerms(text) {
  return String(text ?? '')
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l && !l.startsWith('#'));
}

function termPattern(term) {
  const words = term.split(/\s+/).map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  return new RegExp(words.join('\\s+'), 'i');
}

// files: [{ path, text }] (text null for a binary file). Hits: [{ file, line, term }]; line 0 is
// the file name, term is the index into terms.
export function findHits(terms, files) {
  const pats = terms.map(termPattern);
  const hits = [];
  for (const f of files) {
    pats.forEach((p, i) => { if (p.test(f.path)) hits.push({ file: f.path, line: 0, term: i }); });
    if (f.text == null) continue;
    f.text.split(/\r?\n/).forEach((l, n) => {
      pats.forEach((p, i) => { if (p.test(l)) hits.push({ file: f.path, line: n + 1, term: i }); });
    });
  }
  return hits;
}

function readTracked(dir) {
  const out = execFileSync('git', ['-C', dir, 'ls-files', '-z'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  return out.split('\0').filter(p => p && !SKIP.has(p)).map(path => {
    let buf;
    try { buf = readFileSync(join(dir, path)); } catch { return { path, text: null }; }   // deleted in the worktree
    const binary = buf.subarray(0, 8000).includes(0);
    return { path, text: binary ? null : buf.toString('utf8') };
  });
}

function main(argv) {
  const opt = { dir: '.', terms: '' };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--dir') opt.dir = argv[++i];
    else if (argv[i] === '--terms') opt.terms = argv[++i];
    else { console.error(`unknown argument: ${argv[i]}`); return 2; }
  }
  const terms = parseTerms(opt.terms ? readFileSync(opt.terms, 'utf8') : process.env.SITE_BLOCKLIST);
  if (!terms.length) {
    console.error('No blocklist: set SITE_BLOCKLIST (the kit\'s Update kit sets it as an Actions secret) or pass --terms <file>.');
    return 2;
  }
  const hidden = process.env.GITHUB_ACTIONS === 'true';
  const files = readTracked(opt.dir);
  const hits = findHits(terms, files);
  for (const h of hits) {
    const name = hidden ? `#${h.term + 1}` : `"${terms[h.term]}"`;
    const where = h.line ? `${h.file}:${h.line}` : `${h.file} (file name)`;
    console.log(`${where}: blocked term ${name}`);
    if (hidden) console.log(`::error file=${h.file}${h.line ? `,line=${h.line}` : ''}::Blocked term ${name}: third-party names, logos, files and product descriptions stay off the site.`);
  }
  if (hits.length) {
    console.log(`${hits.length} hit(s) in ${files.length} files. Describe the work in the kit's own terms, or leave it out.`);
    return 1;
  }
  console.log(`No blocked terms in ${files.length} files (${terms.length} terms).`);
  return 0;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) process.exitCode = main(process.argv.slice(2));
