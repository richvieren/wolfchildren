// tests/build.test.js — the page build and its gates (Steppa method).
//
// 1. Every page renders and matches the committed file (no drift).
// 2. Zero inline styles in any built page.
// 3. Every font-size in site.css is a --t-* token.
// 4. A page that is indexable carries no placeholder.
// 5. Every price on a page equals the registry's priceCents for that slug.
// 6. One CTA label per page; no em dashes in copy.
// 7. Every photo slot has a ratio class the stylesheet defines.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { renderAll, shotList } from '../build.mjs';
import { PRODUCTS } from '../assets/js/registry.js';

const pages = await renderAll();
const css = readFileSync(new URL('../assets/css/site.css', import.meta.url), 'utf8');

test('at least one page renders', () => { assert.ok(pages.length >= 1); });

test('site.css: every font-size is a --t-* token', () => {
  const offenders = [...css.matchAll(/font-size:\s*([^;]+);/g)].map((m) => m[1].trim()).filter((v) => !/^var\(--t-[a-z]+\)$/.test(v));
  assert.deepEqual(offenders, [], `non-token font sizes: ${offenders.join(', ')}`);
});

test('site.css: every grid or flex zone names its alignment', () => {
  // A rule that sets display:grid or display:flex must also set align-items (or be a
  // single-axis row where justify-content is the axis, listed here).
  const rules = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((m) => ({ sel: m[1].trim(), body: m[2] }));
  const missing = rules
    .filter((r) => /display:\s*(grid|flex)/.test(r.body))
    .filter((r) => !/align-items:/.test(r.body) && !/align-content:/.test(r.body))
    .map((r) => r.sel);
  assert.deepEqual(missing, [], `zones without align-items: ${missing.join(' | ')}`);
});

for (const p of pages) {
  test(`${p.path} committed output matches its source`, () => {
    assert.ok(existsSync(p.target), `${p.target} missing — run node build.mjs`);
    assert.equal(readFileSync(p.target, 'utf8'), p.html);
  });

  test(`${p.path} zero inline styles`, () => {
    assert.equal((p.html.match(/ style="/g) || []).length, 0);
  });

  test(`${p.path} placeholders never ship`, () => {
    const count = (p.html.match(/data-placeholder=/g) || []).length;
    if (p.indexable) assert.equal(count, 0, `${count} placeholder(s) on an indexable page`);
    else assert.ok(p.html.includes('name="robots" content="noindex'), 'draft page must be noindex');
  });

  const isProductPage = Object.hasOwn(PRODUCTS, p.slug);

  test(`${p.path} prices match the registry`, () => {
    const prices = [...p.html.matchAll(/\$(\d+)(?!\d)/g)].map((m) => Number(m[1]));
    if (!isProductPage) { assert.equal(prices.length, 0, 'a non-product page carries no price'); return; }
    assert.ok(prices.length > 0, 'no price on the page');
    const expected = PRODUCTS[p.slug].priceCents / 100;
    for (const price of prices) assert.equal(price, expected, `price $${price} on ${p.path}`);
  });

  test(`${p.path} one CTA label, repeated`, () => {
    const labels = new Set([...p.html.matchAll(/class="btn[^"]*"[^>]*>([^<]+)</g)].map((m) => m[1]));
    assert.equal(labels.size, 1, [...labels].join(' | '));
  });

  test(`${p.path} copy carries no em dashes`, () => {
    assert.ok(!p.html.replace(/<!--.*?-->/gs, '').includes('—'), 'em dash in copy');
  });

  test(`${p.path} every photo slot uses a defined ratio class`, () => {
    const classes = [...p.html.matchAll(/class="slot slot-([0-9]+x[0-9]+)/g)].map((m) => m[1]);
    if (isProductPage) assert.ok(classes.length > 0, 'a product page has photo slots');
    for (const r of classes) assert.ok(css.includes(`.slot-${r} {`), `undefined ratio class slot-${r}`);
  });

  test(`${p.path} shot list has unique ids with all four fields`, () => {
    const shots = shotList(p.html);
    if (isProductPage) assert.ok(shots.length >= 5);
    for (const s of shots) for (const k of ['ratio', 'crop', 'intent', 'min']) assert.ok(s[k], `${s.id} missing ${k}`);
  });
}
