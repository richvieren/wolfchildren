// tests/registry.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PRODUCTS, getProduct, productsByLine, grantableProducts } from '../assets/js/registry.js';

test('all ten products are present', () => {
  assert.deepEqual(Object.keys(PRODUCTS).sort(), [
    'astrocartography', 'bundle-readings', 'compass', 'north-star', 'numerology',
    'parent-child',
    'photo-course', 'retreat', 'solar-return', 'transits',
  ]);
});

test('every product has a valid fulfilment type', () => {
  for (const p of Object.values(PRODUCTS)) {
    assert.ok(['generated', 'manual', 'bundle', 'profile'].includes(p.fulfilment),
      `${p.slug} has fulfilment ${p.fulfilment}`);
  }
});

test('prices match the decision of 2026-09-12, in USD cents', () => {
  // Transits moved from 9900 to 19700 on 2026-09-23: one product, a year, one report and
  // fifty-two weekly notes. The three-month reading is gone rather than sold beside it.
  const expected = {
    'compass': 2700, 'north-star': 19900, 'transits': 19900, 'astrocartography': 9900,
    'solar-return': 19900, 'numerology': 9900, 'parent-child': 9900, 'bundle-readings': 49900,
    'photo-course': null, 'retreat': null,
  };
  for (const [slug, cents] of Object.entries(expected)) {
    assert.equal(getProduct(slug).priceCents, cents, slug);
    assert.equal(getProduct(slug).currency, 'usd', slug);
  }
});

test('unpriced products are inactive; a priced one can be held inactive until it exists', () => {
  for (const p of Object.values(PRODUCTS)) {
    if (p.priceCents === null) assert.equal(p.active, false, p.slug);
    else assert.equal(p.active, true, p.slug);
  }
});

test('the bundle includes exactly the five readings and is never grantable', () => {
  const b = getProduct('bundle-readings');
  assert.equal(b.fulfilment, 'bundle');
  assert.deepEqual([...b.includes].sort(), [
    'astrocartography', 'north-star', 'numerology', 'solar-return', 'transits',
  ]);
  for (const slug of b.includes) assert.equal(getProduct(slug).fulfilment, 'generated', slug);
  assert.ok(!grantableProducts().some((p) => p.slug === 'bundle-readings'));
  assert.equal(grantableProducts().length, 9);   // + parent-child (generated, inactive until priced) + compass (profile, active 2026-09-15)
});

test('generated products require intake and have a child subject', () => {
  for (const p of Object.values(PRODUCTS)) {
    if (p.fulfilment === 'generated') {
      assert.equal(p.requiresIntake, true, `${p.slug}`);
      assert.equal(p.subject, 'child', `${p.slug}`);
    }
  }
});

test('the five reading products are generated', () => {
  const readings = ['north-star', 'transits', 'astrocartography',
                    'solar-return', 'numerology'];
  for (const slug of readings) {
    assert.equal(getProduct(slug).fulfilment, 'generated', slug);
  }
});

test('getProduct returns undefined for an unknown slug', () => {
  assert.equal(getProduct('nope'), undefined);
});

test('productsByLine groups all ten', () => {
  const g = productsByLine();
  assert.equal(g.readings.length, 8);   // five readings + the bundle + parent-child + compass
  assert.equal(g.photography.length, 1);
  assert.equal(g.retreats.length, 1);
});

// Compass instant (2026-09-15): intake accepts Compass, so the portal must send its card there.
test('compass, a profile product, requires intake for a child', () => {
  const c = getProduct('compass');
  assert.equal(c.fulfilment, 'profile');
  assert.equal(c.requiresIntake, true);
  assert.equal(c.subject, 'child');
  assert.deepEqual(c.intakeQuestions, []);
});

// 2026-09-15 audit: 7 of 7 locked portal cards had no action (no salesUrl in the registry), and
// the product URLs 404'd. Every active priced product now has a page, and the registry links it.
import { readdirSync } from 'node:fs';
const pagesDir = new URL('../src/pages/', import.meta.url);
const pagePaths = new Set(await Promise.all(readdirSync(pagesDir).filter((f) => f.endsWith('.mjs'))
  .map(async (f) => (await import(new URL(f, pagesDir).href)).path)));
test('every active priced product has a salesUrl, and a page in src/pages serves that path', () => {
  const paths = pagePaths;
  for (const p of Object.values(PRODUCTS)) {
    if (p.priceCents === null || !p.active) continue;
    assert.equal(p.salesUrl, `/readings/${p.slug}/`, p.slug);
    assert.ok(paths.has(p.salesUrl), `no page for ${p.salesUrl}`);
  }
  assert.ok(paths.has('/readings/'), 'the readings index');
});
