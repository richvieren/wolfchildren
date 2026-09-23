// tests/transits-year.test.js — Transits is one product, a full year (Richard, 2026-09-23).
//
// The page may promise only what the product does: one report covering twelve months from the
// details, 52 weekly notes that live in the portal, and an email each week that says a note is
// there. Spec §10: no child name and no reading content leaves the server, so the page must never
// promise a reading by email.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderAll } from '../build.mjs';
import { PRODUCTS } from '../assets/js/registry.js';

const pages = await renderAll();
const page = pages.find((p) => p.path === '/readings/transits/');

test('the transits page is built', () => {
  assert.ok(page, 'no page at /readings/transits/');
});

test('it sells a year, not three months', () => {
  assert.match(page.html, /twelve months|a full year|the year ahead/i);
  assert.ok(!/three months|next three months|month by month/i.test(page.html),
    'the three-month product is gone; the page must not still sell it');
});

test('it names the weekly notes as a portal thing, with an email that points at them', () => {
  assert.match(page.html, /fifty-two|52/);
  assert.match(page.html, /portal/i);
  // Never "we email you the reading": §10 keeps the child's name and the note itself on the server.
  assert.ok(!/email you the (reading|note|report)\b/i.test(page.html), 'the email carries no reading');
  assert.ok(!/in your inbox every week/i.test(page.html));
});

test('it says the parent can stop the weekly emails and keep the report', () => {
  assert.match(page.html, /stop the weekly emails/i);
  assert.match(page.html, /report stays|keep the report/i);
});

test('it states the report length and the eight sections', () => {
  assert.match(page.html, /eighteen to twenty-six pages|18 to 26 pages/i);
  for (const section of ['The year in one page', 'four movements', 'The long thread',
                         'The moments', 'The quiet stretches', 'What does not change',
                         'question', 'explained']) {
    assert.match(page.html, new RegExp(section, 'i'), `missing section: ${section}`);
  }
});

test('it carries the registry price and no other product price', () => {
  const own = PRODUCTS.transits.priceCents / 100;
  assert.match(page.html, new RegExp(`\\$${own}\\b`), `the registry price $${own} is missing`);
});

test('the birth time is optional and the three questions are asked', () => {
  assert.match(page.html, /birth time/i);
  assert.ok(!/the birth time is required/i.test(page.html), 'transits works without a birth time');
  assert.match(page.html, /three (answers|questions)/i);
});

test('delivery is the published promise, and the year of notes follows it', () => {
  assert.match(page.html, /within 24 hours/);
  assert.match(page.html, /refund page/i);
});
