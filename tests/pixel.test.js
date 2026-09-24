// The Meta pixel is on every page, and the snippet exists exactly once.
//
// Richard, 2026-09-24: dataset 1622703732974632, every page including the portal, built into
// the template rather than pasted into each file. A page that is missed cannot be seen missing
// from a browser, so it is checked here: the built pages through src/components.mjs::document,
// the four hand-written portal pages by their own tag.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderAll } from '../build.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATASET = '1622703732974632';
const PIXEL = readFileSync(join(ROOT, 'assets/js/pixel.js'), 'utf8');
const pages = await renderAll();

const portalPages = readdirSync(join(ROOT, 'portal'))
  .filter((n) => n.endsWith('.html'))
  .map((n) => join('portal', n));

test('the pixel file initialises the dataset and tracks a pageview', () => {
  assert.ok(PIXEL.includes(`fbq('init', '${DATASET}')`), 'init with the dataset id');
  assert.ok(PIXEL.includes("fbq('track', 'PageView')"), 'PageView tracked');
  assert.ok(PIXEL.includes('connect.facebook.net/en_US/fbevents.js'), 'loader source');
});

for (const p of pages) {
  test(`${p.path} loads the pixel`, () => {
    assert.match(p.html, /<script src="\/assets\/js\/pixel\.js\?v=[0-9a-f]{8}"><\/script>/,
      'hashed pixel tag in the head');
  });

  test(`${p.path} carries the no-script fallback`, () => {
    assert.ok(p.html.includes(`facebook.com/tr?id=${DATASET}`), 'noscript pixel');
  });

  test(`${p.path} does not paste the snippet inline`, () => {
    assert.ok(!p.html.includes('fbq('), 'the snippet lives in assets/js/pixel.js, not in a page');
  });
}

for (const rel of portalPages) {
  const html = readFileSync(join(ROOT, rel), 'utf8');

  test(`${rel} loads the pixel`, () => {
    assert.match(html, /<script src="\/assets\/js\/pixel\.js\?v=[0-9a-f]{8}"><\/script>/,
      'hashed pixel tag; run bash stamp-assets.sh');
  });

  test(`${rel} carries the no-script fallback`, () => {
    assert.ok(html.includes(`facebook.com/tr?id=${DATASET}`), 'noscript pixel');
  });

  test(`${rel} does not paste the snippet inline`, () => {
    assert.ok(!html.includes('fbq('), 'the snippet lives in assets/js/pixel.js, not in a page');
  });
}

test('every HTML file in the site is covered', () => {
  // Anything servable that is neither a built page nor a portal page would be a page with no
  // pixel and no test. There is nothing else today; this fails the day someone adds one.
  const built = new Set(pages.map((p) => join(p.path.replace(/^\//, ''), 'index.html')));
  const known = new Set([...built, ...portalPages]);
  const found = [];
  const walk = (dir) => {
    for (const e of readdirSync(join(ROOT, dir), { withFileTypes: true })) {
      if (e.name === '.git' || e.name === 'node_modules' || e.name === 'snapshots') continue;
      const rel = dir === '.' ? e.name : join(dir, e.name);
      if (e.isDirectory()) walk(rel);
      else if (e.name.endsWith('.html')) found.push(rel);
    }
  };
  walk('.');
  const uncovered = found.filter((f) => !known.has(f));
  assert.deepEqual(uncovered, [], `HTML with no pixel test: ${uncovered.join(', ')}`);
});

test('the noscript fallback uses no inline style', () => {
  // `zero inline styles` is a build invariant (tests/build.test.js). Meta's snippet ships
  // style="display:none"; the hidden attribute does the same job and is still fetched.
  for (const p of pages) assert.ok(!p.html.includes(' style="'), `${p.path} has an inline style`);
});

test('the committed portal pages exist where the test looked', () => {
  for (const rel of portalPages) assert.ok(existsSync(join(ROOT, rel)), rel);
});
