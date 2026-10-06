#!/usr/bin/env node
// build-mengto.mjs — builds the Compass page at readings/compass/mengto-skeuomorphic/
// and, later, its own A/B variants (any theme named mengto-ab-*). Nothing else:
// not the other MengTo designs in variants2.mjs, not the twenty-five in
// variants.mjs. Richard, 2026-10-06: a one-page change should touch one page.
//
//   node build-mengto.mjs                  the page and every mengto-ab-* theme
//   node build-mengto.mjs <slug> [slug…]   those, and they must belong to this page
//
// The gate is the same anti-slop audit the full build runs.
import { auditShared, writeVariant } from './variants.mjs';
import { THEMES } from './variants2.mjs';

const PAGE = 'mengto-skeuomorphic';
const own = (slug) => slug === PAGE || slug.startsWith('mengto-ab');

const asked = process.argv.slice(2);
const slugs = asked.length ? asked : Object.keys(THEMES).filter(own);

for (const slug of slugs) {
  if (!THEMES[slug]) { console.error(`no such theme: ${slug}`); process.exit(1); }
  if (!own(slug)) { console.error(`${slug} is not ${PAGE} or one of its A/B variants`); process.exit(1); }
}
if (!slugs.length) { console.error('nothing to build'); process.exit(1); }

auditShared();
for (const slug of slugs) console.log(`wrote ${writeVariant(slug, THEMES[slug])}`);
