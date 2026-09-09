// tests/build.test.js — the page build and its shipping gate.
//
// 1. Every page renders and matches the committed file (no drift).
// 2. A page that is indexable carries no placeholder. This is the rule that
//    keeps a "[DELIVERY TIME]" or an empty testimonial off the live site.
// 3. Every price on a page equals the registry's priceCents for that slug.
// 4. The one CTA is repeated with one label; no em dashes in copy.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { renderAll } from '../build.mjs';
import { PRODUCTS } from '../assets/js/registry.js';

const pages = await renderAll();

test('at least one page renders', () => {
  assert.ok(pages.length >= 1);
});

for (const p of pages) {
  test(`${p.path} committed output matches its source`, () => {
    assert.ok(existsSync(p.target), `${p.target} missing — run node build.mjs`);
    assert.equal(readFileSync(p.target, 'utf8'), p.html);
  });

  test(`${p.path} placeholders never ship`, () => {
    const count = (p.html.match(/data-placeholder=/g) || []).length;
    if (p.indexable) assert.equal(count, 0, `${count} placeholder(s) on an indexable page`);
    else assert.ok(p.html.includes('name="robots" content="noindex'), 'draft page must be noindex');
  });

  test(`${p.path} prices match the registry`, () => {
    const prices = [...p.html.matchAll(/\$(\d+)(?!\d)/g)].map((m) => Number(m[1]));
    assert.ok(prices.length > 0, 'no price on the page');
    const slug = p.path.split('/').filter(Boolean).pop();
    const expected = PRODUCTS[slug]?.priceCents / 100;
    for (const price of prices) assert.equal(price, expected, `price $${price} on ${p.path}`);
  });

  test(`${p.path} one CTA label, repeated`, () => {
    const labels = new Set([...p.html.matchAll(/class="btn btn-primary[^"]*"[^>]*>([^<]+)</g)].map((m) => m[1].replace(/ · \$\d+$/, '')));
    assert.equal(labels.size, 1, [...labels].join(' | '));
  });

  test(`${p.path} copy carries no em dashes`, () => {
    const body = p.html.replace(/<!--.*?-->/gs, '');
    assert.ok(!body.includes('—'), 'em dash in copy');
  });
}
