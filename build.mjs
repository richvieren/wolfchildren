#!/usr/bin/env node
// build.mjs — assembles every page in src/pages/ into static HTML.
//
//   node build.mjs             write each page to its path (e.g. readings/lunar-portrait/index.html)
//   node build.mjs --check     exit 1 if any written page differs from what the sources produce
//   node build.mjs --sections  also write one HTML file per section to snapshots/sections/
//                              (for snap.sh: one section at a time, Steppa method)
//   node build.mjs --shots     print the shot list: every photo slot with ratio, crop, intent, min
//
// The output is committed: GitHub Pages serves the repo root as-is. The
// pre-push hook runs --check so a page can never drift from its source.

import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { document } from './src/components.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const check = argv.includes('--check');

const css = readFileSync(join(ROOT, 'assets/css/site.css'));
const cssHash = createHash('md5').update(css).digest('hex').slice(0, 8);

export async function renderAll() {
  const out = [];
  for (const f of readdirSync(join(ROOT, 'src/pages')).filter((n) => n.endsWith('.mjs')).sort()) {
    const page = await import(pathToFileURL(join(ROOT, 'src/pages', f)).href);
    const sections = page.sections().map(([name, html]) => ({ name, html: String(html) }));
    const body = sections.map((s) => s.html).join('\n');
    const html = document({ title: page.title, description: page.description, path: page.path, body, indexable: page.indexable === true, cssHash });
    const slug = page.path.split('/').filter(Boolean).pop();
    out.push({ file: f, slug, path: page.path, target: join(ROOT, page.path.replace(/^\//, ''), 'index.html'), html, sections, indexable: page.indexable === true });
  }
  return out;
}

export function shotList(html) {
  const re = /data-slot="([^"]+)" data-placeholder="[^"]*" data-ratio="([^"]+)" data-crop="([^"]+)" data-intent="([^"]+)" data-min="([^"]+)"/g;
  const seen = new Map();
  for (const m of html.matchAll(re)) if (!seen.has(m[1])) seen.set(m[1], { id: m[1], ratio: m[2], crop: m[3], intent: m[4], min: m[5] });
  return [...seen.values()];
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const pages = await renderAll();
  let stale = 0;
  for (const p of pages) {
    const current = existsSync(p.target) ? readFileSync(p.target, 'utf8') : null;
    if (check) {
      if (current !== p.html) { console.error(`STALE: ${p.path} (run node build.mjs)`); stale++; }
      continue;
    }
    mkdirSync(dirname(p.target), { recursive: true });
    writeFileSync(p.target, p.html);
    console.log(`${current === p.html ? 'unchanged' : 'wrote'} ${p.path}`);
    if (argv.includes('--sections')) {
      const dir = join(ROOT, 'snapshots/sections');
      mkdirSync(dir, { recursive: true });
      p.sections.forEach((s, i) => {
        const n = String(i + 1).padStart(2, '0');
        writeFileSync(join(dir, `${p.slug}--${n}-${s.name}.html`), document({ title: `${s.name}`, description: '', path: p.path, body: s.html, indexable: false, cssHash }));
      });
      console.log(`  ${p.sections.length} section files → snapshots/sections/`);
    }
    if (argv.includes('--shots')) {
      console.log(`\nShot list — ${p.path}`);
      for (const s of shotList(p.html)) console.log(`  ${s.id.padEnd(13)} ${s.ratio.padEnd(5)} min ${s.min.padEnd(10)} ${s.crop} — ${s.intent}`);
    }
  }
  if (check) { console.log(stale ? `Build check: ${stale} stale` : 'Build check: OK'); process.exit(stale ? 1 : 0); }
}
