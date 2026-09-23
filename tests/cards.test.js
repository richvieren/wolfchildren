// tests/cards.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cardState } from '../assets/js/cards.js';
import { getProduct } from '../assets/js/registry.js';

const future = () => new Date(Date.now() + 86400e3).toISOString();
const past   = () => new Date(Date.now() - 86400e3).toISOString();
const gen    = getProduct('transits');
const inst   = getProduct('photo-course');   // manual: released at purchase, like the instant kind that went with presets (2026-09-13)
const man    = getProduct('retreat');

test('no grant is locked, for every fulfilment type', () => {
  for (const p of [gen, inst, man]) assert.equal(cardState(p, null), 'locked');
});

test('generated: owned but no intake asks for intake', () => {
  assert.equal(cardState(gen, { has_intake: false, available_at: null }), 'intake');
});

test('generated: intake done but nothing released is submitted', () => {
  assert.equal(cardState(gen, { has_intake: true, available_at: null }), 'submitted');
});

test('generated: released in the future is pending', () => {
  assert.equal(cardState(gen, { has_intake: true, available_at: future() }), 'pending');
});

test('generated: released in the past is ready', () => {
  assert.equal(cardState(gen, { has_intake: true, available_at: past() }), 'ready');
});

test('manual: owned is immediately ready, and never asks for intake', () => {
  assert.equal(cardState(inst, { has_intake: false, available_at: past() }), 'ready');
});

test('manual: owned but not yet released is pending, not intake', () => {
  assert.equal(cardState(inst, { has_intake: false, available_at: null }), 'pending');
});

test('manual: owned and released is ready', () => {
  assert.equal(cardState(man, { has_intake: false, available_at: past() }), 'ready');
});

test('a manual product never enters the intake state', () => {
  const states = [
    { has_intake: false, available_at: null },
    { has_intake: false, available_at: past() },
    { has_intake: true,  available_at: past() },
  ].map((g) => cardState(inst, g));
  assert.ok(!states.includes('intake'));
});

test('two children on one product produce two independent cards', () => {
  const a = { child_id: 1, has_intake: true, available_at: past() };
  const b = { child_id: 2, has_intake: false, available_at: null };
  assert.equal(cardState(gen, a), 'ready');
  assert.equal(cardState(gen, b), 'intake');
});

test('a malformed available_at fails closed to pending, never ready', () => {
  for (const bad of ['not-a-date', '', '2026-13-45', 'null']) {
    const expectedGen = bad === '' ? 'submitted' : 'pending';
    assert.equal(cardState(gen,  { has_intake: true,  available_at: bad }), expectedGen, bad);
    assert.equal(cardState(inst, { has_intake: false, available_at: bad }), 'pending', bad);
  }
});

// ─── renderCard, with a stubbed document ─────────────────────────────────────

import { renderCard } from '../assets/js/cards.js';
import { createDocument } from './helpers/dom-stub.js';

const past2 = () => new Date(Date.now() - 86400e3).toISOString();

test('C4: the ready CTA carries data-download, not a dead fragment href', () => {
  const doc = createDocument();
  const grant = { grant_id: 42, edition: 1, has_intake: false, available_at: past2() };
  const card = renderCard(inst, grant, doc);
  const cta = card.querySelector('.card-cta');
  assert.equal(cta.textContent, 'Download the PDF →');
  assert.equal(cta.dataset.download, '42');
  assert.equal(cta.href, '#');
});

test('the intake CTA links to the intake page and carries no data-download', () => {
  const doc = createDocument();
  const grant = { grant_id: 43, edition: 1, has_intake: false, available_at: null };
  const cta = renderCard(gen, grant, doc).querySelector('.card-cta');
  assert.equal(cta.href, '/portal/intake.html?product=transits&grant=43');
  assert.equal(cta.dataset.download, undefined);
});

test('C3: edition 2 names itself in the status, edition 1 does not', () => {
  const doc = createDocument();
  const ready = (edition) => renderCard(inst, { grant_id: 1, edition, has_intake: false, available_at: past2() }, doc)
    .querySelector('.card-status').textContent;
  assert.equal(ready(1), 'Your reading is ready.');
  assert.equal(ready(2), 'Edition 2 — Your reading is ready.');
});

test('a product name reaches the DOM as text, never as markup', () => {
  const doc = createDocument();
  const hostile = { slug: 'x', name: '<img src=x onerror="alert(1)">', requiresIntake: false, active: true };
  const card = renderCard(hostile, null, doc);
  const h = card.querySelector('h3');
  assert.equal(h.textContent, '<img src=x onerror="alert(1)">');
  assert.equal(h.childNodes.length, 1);
  assert.equal(h.childNodes[0].nodeType, 3, 'a text node, not a parsed element');
  assert.equal(card.querySelector('img'), null);
});

// Compass instant (2026-09-15): the page renders on the server in about ten seconds, so a
// Compass card that is in but not released says it is being made, never "within 24 hours".
import { COPY, pollDelayMs } from '../assets/js/cards.js';
const compass = getProduct('compass');

test('compass: owned but no intake asks for intake', () => {
  assert.equal(cardState(compass, { has_intake: false, available_at: null }), 'intake');
});

test('compass: intake done but not released is making, with no 24-hour promise', () => {
  assert.equal(cardState(compass, { has_intake: true, available_at: null }), 'making');
  assert.ok(!/24 hours/.test(COPY.making.status));
  assert.equal(COPY.making.cta, null);
});

test('compass: released is ready at once', () => {
  assert.equal(cardState(compass, { has_intake: true, available_at: past() }), 'ready');
});

test('the dashboard polls only while a card is being made, and stops after three minutes', () => {
  const making = [{ product: compass, grant: { has_intake: true, available_at: null } }];
  const settled = [{ product: gen, grant: { has_intake: true, available_at: null } }];
  assert.equal(pollDelayMs(making, 0), 5000);
  assert.equal(pollDelayMs(making, 180000), null);
  assert.equal(pollDelayMs(settled, 0), null);
  assert.equal(pollDelayMs([], 0), null);
});

test('a locked card links to its product page', () => {
  for (const slug of ['compass', 'north-star', 'transits', 'astrocartography', 'solar-return', 'numerology', 'parent-child']) {
    const card = renderCard(getProduct(slug), null, createDocument());
    const a = card.querySelector('a.card-cta');
    assert.ok(a, `${slug}: no link on the locked card`);
    assert.equal(a.href, `/readings/${slug}/`);
  }
});

// 2026-09-23 audit item 5: a reading whose job failed showed "within 24 hours" for ever and the
// parent had no way back. The card says what happened and offers the retry.
test('a failed job is a delayed card with a retry, for a reading and for compass', () => {
  for (const p of [gen, compass]) {
    assert.equal(cardState(p, { has_intake: true, available_at: null, job_status: 'failed' }), 'delayed');
  }
  assert.ok(!/24 hours/.test(COPY.delayed.status));
  assert.equal(COPY.delayed.cta, 'Try again →');
  const card = renderCard(gen, { grant_id: 11, edition: 1, has_intake: true, available_at: null, job_status: 'failed' }, createDocument());
  const a = card.querySelector('.card-cta');
  assert.equal(a.dataset.retry, '11');
  assert.equal(a.href, '#');
});

test('a queued or running job still reads as being prepared, not delayed', () => {
  for (const s of ['queued', 'running', 'pending_review', 'delivered', null]) {
    const state = cardState(gen, { has_intake: true, available_at: null, job_status: s });
    assert.equal(state, 'submitted', `job_status ${s}`);
  }
  assert.equal(cardState(compass, { has_intake: true, available_at: null, job_status: 'queued' }), 'making');
});

test('a released grant is ready whatever the job says', () => {
  assert.equal(cardState(gen, { has_intake: true, available_at: past(), job_status: 'failed' }), 'ready');
});

// 2026-09-23: Transits is a year. A released grant carries the weekly fields, so the card says
// which week is waiting in the portal and lets the parent turn the weekly emails off and on.
// Products without those fields are untouched.
const transits = getProduct('transits');
const readyWeekly = (extra = {}) => ({ grant_id: 12, edition: 1, has_intake: true, available_at: past(),
                                       weekly_total: 52, weekly_week: 7, weekly_off: false, ...extra });

test('a released transits card names this week and links to it in the portal', () => {
  const card = renderCard(transits, readyWeekly(), createDocument());
  const line = card.querySelector('.card-weekly');
  assert.ok(line, 'no weekly line on the card');
  assert.match(line.textContent, /Week 7 of 52/);
  const link = card.querySelector('.card-weekly-link');
  assert.equal(link.href, '/portal/weekly.html?grant=12');
});

test('the card offers to turn the weekly emails off, and says so when they are off', () => {
  const on = renderCard(transits, readyWeekly(), createDocument());
  const offControl = on.querySelector('.card-weekly-toggle');
  assert.equal(offControl.dataset.weekly, '12');
  assert.equal(offControl.dataset.weeklyOn, 'false');       // clicking asks for off
  assert.match(offControl.textContent, /stop the weekly emails/i);

  const off = renderCard(transits, readyWeekly({ weekly_off: true }), createDocument());
  assert.match(off.querySelector('.card-weekly').textContent, /weekly emails are off/i);
  assert.match(off.querySelector('.card-weekly').textContent, /still in your portal/i);
  const onControl = off.querySelector('.card-weekly-toggle');
  assert.equal(onControl.dataset.weeklyOn, 'true');
  assert.match(onControl.textContent, /turn them back on/i);
});

test('before the first week there is no week number, only the state', () => {
  const card = renderCard(transits, readyWeekly({ weekly_week: null }), createDocument());
  assert.ok(!/Week \d+ of/.test(card.querySelector('.card-weekly').textContent));
  assert.ok(card.querySelector('.card-weekly-toggle'));
});

test('a product with no weekly fields renders exactly as before', () => {
  const card = renderCard(getProduct('north-star'), { grant_id: 3, edition: 1, has_intake: true, available_at: past() }, createDocument());
  assert.equal(card.querySelector('.card-weekly'), null);
  assert.equal(card.querySelector('.card-weekly-toggle'), null);
});

test('the weekly line only shows once the report is released', () => {
  const card = renderCard(transits, { grant_id: 12, edition: 1, has_intake: true, available_at: null, weekly_total: 52, weekly_week: null, weekly_off: false }, createDocument());
  assert.equal(card.querySelector('.card-weekly'), null);
});
