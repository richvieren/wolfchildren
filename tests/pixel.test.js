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

// 2026-09-24: a whole Compass for a child who does not exist, rendered by the API's own builder
// and published so the sales page can give one away (api-compass/scripts/publish_compass_sample.py).
// It is not built by build.mjs and is not hand-written, so it is listed here on purpose.
const generatedPages = ['readings/compass/sample/nora/index.html',
                        'readings/compass/sample/finn/index.html',
                        // 2026-09-24: the hero rebuilt once per design skill, for side-by-side
                        // review (hero-variants.mjs). Same copy in each, noindex, not linked.
                        'readings/compass/hero/control/index.html',
                        'readings/compass/hero/hue/index.html',
                        'readings/compass/hero/hyperframes-creative/index.html',
                        // Step 4: version one, built twice so Richard can judge whether an empty
                        // slot explains itself or stays silent.
                        'readings/compass/v1/notes/index.html',
                        'readings/compass/v1/silent/index.html',
                        // The full page in nine more design languages (variants.mjs).
                        'readings/compass/v1-original/index.html',
                        'readings/compass/high-end/index.html',
                        'readings/compass/minimalist/index.html',
                        'readings/compass/brutalist/index.html',
                        'readings/compass/gpt-taste/index.html',
                        'readings/compass/stitch/index.html',
                        'readings/compass/redesign/index.html',
                        'readings/compass/hue/index.html',
                        'readings/compass/hyperframes/index.html',
                        // 2026-09-24: fifteen more design languages from the seven new skill
                        // repos in _tools/design-skills/repo (variants2.mjs). Same copy again.
                        'readings/compass/elaya-landing/index.html',
                        'readings/compass/tastemaker/index.html',
                        'readings/compass/web-design-engineer/index.html',
                        'readings/compass/mengto-beige/index.html',
                        'readings/compass/mengto-book/index.html',
                        'readings/compass/mengto-editorial-tech/index.html',
                        'readings/compass/mengto-paper-technical/index.html',
                        'readings/compass/mengto-documentary/index.html',
                        'readings/compass/mengto-agency-grid/index.html',
                        'readings/compass/mengto-split/index.html',
                        'readings/compass/mengto-orange-paper/index.html',
                        'readings/compass/mengto-product-proof/index.html',
                        'readings/compass/mengto-wireframe/index.html',
                        'readings/compass/mengto-skeuomorphic/index.html',
                        'readings/compass/mengto-dark-blue/index.html'];

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

for (const rel of generatedPages) {
  const html = readFileSync(join(ROOT, rel), 'utf8');

  test(`${rel} loads the pixel`, () => {
    assert.match(html, /<script src="\/assets\/js\/pixel\.js\?v=[0-9a-f]{8}"><\/script>/);
  });

  test(`${rel} carries the no-script fallback`, () => {
    assert.ok(html.includes(`facebook.com/tr?id=${DATASET}`));
  });

  test(`${rel} is noindex and holds no real child`, () => {
    assert.ok(html.includes('name="robots" content="noindex'), 'a sample page stays out of search');
    assert.ok(!html.includes('file://'), 'a local path would break every asset and name this machine');
    assert.ok(/Nora|Finn|Compass/.test(html), 'a sample page, or a hero variant');
  });
}

test('every HTML file in the site is covered', () => {
  // Anything servable that is neither a built page nor a portal page would be a page with no
  // pixel and no test. There is nothing else today; this fails the day someone adds one.
  const built = new Set(pages.map((p) => join(p.path.replace(/^\//, ''), 'index.html')));
  const known = new Set([...built, ...portalPages, ...generatedPages]);
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
