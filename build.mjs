#!/usr/bin/env node
// build.mjs — assembles every page in src/pages/ into static HTML.
//
//   node build.mjs          write each page to its path (e.g. readings/lunar-portrait/index.html)
//   node build.mjs --check  exit 1 if any written page differs from what the sources produce
//
// The output is committed: GitHub Pages serves the repo root as-is. The
// pre-push hook runs --check so a page can never drift from its source.
// The stylesheet link carries a content hash so a CSS change busts the cache.

import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { document } from './src/components.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const check = process.argv.includes('--check');

const css = readFileSync(join(ROOT, 'assets/css/site.css'));
const cssHash = createHash('md5').update(css).digest('hex').slice(0, 8);

export async function renderAll() {
  const out = [];
  for (const f of readdirSync(join(ROOT, 'src/pages')).filter((n) => n.endsWith('.mjs')).sort()) {
    const page = await import(pathToFileURL(join(ROOT, 'src/pages', f)).href);
    const html = document({
      title: page.title, description: page.description, path: page.path,
      body: page.body(), indexable: page.indexable === true, cssHash,
    });
    out.push({ file: f, path: page.path, target: join(ROOT, page.path.replace(/^\//, ''), 'index.html'), html, indexable: page.indexable === true });
  }
  return out;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const pages = await renderAll();
  let stale = 0;
  for (const p of pages) {
    const current = existsSync(p.target) ? readFileSync(p.target, 'utf8') : null;
    if (check) {
      if (current !== p.html) { console.error(`STALE: ${p.path} (run node build.mjs)`); stale++; }
    } else {
      mkdirSync(dirname(p.target), { recursive: true });
      writeFileSync(p.target, p.html);
      console.log(`${current === p.html ? 'unchanged' : 'wrote'} ${p.path}`);
    }
  }
  if (check) { console.log(stale ? `Build check: ${stale} stale` : 'Build check: OK'); process.exit(stale ? 1 : 0); }
}
