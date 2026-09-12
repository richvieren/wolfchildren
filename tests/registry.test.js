// tests/registry.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PRODUCTS, getProduct, productsByLine, grantableProducts } from '../assets/js/registry.js';

test('all eleven products are present', () => {
  assert.deepEqual(Object.keys(PRODUCTS).sort(), [
    'astrocartography', 'bundle-readings', 'compass', 'north-star', 'numerology',
    'parent-child',
    'photo-course', 'presets', 'retreat', 'solar-return', 'transits',
  ]);
});

test('every product has a valid fulfilment type', () => {
  for (const p of Object.values(PRODUCTS)) {
    assert.ok(['instant', 'generated', 'manual', 'bundle', 'profile'].includes(p.fulfilment),
      `${p.slug} has fulfilment ${p.fulfilment}`);
  }
});

test('prices match the decision of 2026-09-08, in USD cents', () => {
  const expected = {
    'north-star': 19900, 'transits': 9900, 'astrocartography': 19900,
    'solar-return': 9900, 'numerology': 9900, 'bundle-readings': 49900,
    'presets': 4900, 'photo-course': null, 'retreat': null,
  };
  for (const [slug, cents] of Object.entries(expected)) {
    assert.equal(getProduct(slug).priceCents, cents, slug);
    assert.equal(getProduct(slug).currency, 'usd', slug);
  }
});

test('unpriced products are inactive; a priced one can be held inactive until it exists', () => {
  for (const p of Object.values(PRODUCTS)) {
    if (p.priceCents === null) assert.equal(p.active, false, p.slug);
    else if (p.slug === 'compass') assert.equal(p.active, false, 'compass is priced but not built (2026-09-12)');
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
  assert.equal(grantableProducts().length, 10);   // + parent-child (generated, inactive until priced) + compass (profile, inactive until built)
});

test('generated products require intake and have a child subject', () => {
  for (const p of Object.values(PRODUCTS)) {
    if (p.fulfilment === 'generated') {
      assert.equal(p.requiresIntake, true, `${p.slug}`);
      assert.equal(p.subject, 'child', `${p.slug}`);
    }
  }
});

test('instant products need no intake and have no subject', () => {
  for (const p of Object.values(PRODUCTS)) {
    if (p.fulfilment === 'instant') {
      assert.equal(p.requiresIntake, false, `${p.slug}`);
      assert.equal(p.subject, null, `${p.slug}`);
    }
  }
});

test('instant products name an asset path', () => {
  for (const p of Object.values(PRODUCTS)) {
    if (p.fulfilment === 'instant') assert.ok(p.assetPath, `${p.slug}`);
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

test('productsByLine groups all eleven', () => {
  const g = productsByLine();
  assert.equal(g.readings.length, 8);   // five readings + the bundle + parent-child + compass
  assert.equal(g.photography.length, 2);
  assert.equal(g.retreats.length, 1);
});
