#!/usr/bin/env node
// build-mengto.mjs — builds the Compass pages assembled from modules: the live
// page and its A/B variants, each from its config in src/page/pages/. Nothing
// else: not the other MengTo designs in variants2.mjs, not the twenty-five in
// variants.mjs. Richard, 2026-10-06: a one-page change should touch one page.
//
//   node build-mengto.mjs                 every config in src/page/pages/
//   node build-mengto.mjs <id> [id…]      those configs
//
// The gate is the same anti-slop audit the full build runs.
import { readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { auditShared } from './variants.mjs';
import { render } from './src/page/render.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const PAGES = join(ROOT, 'src/page/pages');

const asked = process.argv.slice(2);
const ids = asked.length ? asked : readdirSync(PAGES).filter((f) => f.endsWith('.mjs')).map((f) => f.slice(0, -4)).sort();

auditShared();
for (const id of ids) {
  const config = (await import(join(PAGES, `${id}.mjs`))).default;
  if (config.id !== id) throw new Error(`${id}.mjs declares id ${config.id}`);
  const html = await render(config);
  mkdirSync(join(ROOT, config.url), { recursive: true });
  writeFileSync(join(ROOT, config.url, 'index.html'), html);
  console.log(`wrote /${config.url}/`);
}
