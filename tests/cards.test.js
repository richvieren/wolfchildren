// tests/cards.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cardState } from '../assets/js/cards.js';
import { getProduct } from '../assets/js/registry.js';

const future = () => new Date(Date.now() + 86400e3).toISOString();
const past   = () => new Date(Date.now() - 86400e3).toISOString();
const gen    = getProduct('transits');
const inst   = getProduct('presets');
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

test('instant: owned is immediately ready, and never asks for intake', () => {
  assert.equal(cardState(inst, { has_intake: false, available_at: past() }), 'ready');
});

test('instant: owned but not yet released is pending, not intake', () => {
  assert.equal(cardState(inst, { has_intake: false, available_at: null }), 'pending');
});

test('manual: owned and released is ready', () => {
  assert.equal(cardState(man, { has_intake: false, available_at: past() }), 'ready');
});

test('an instant product never enters the intake state', () => {
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
  assert.equal(cta.textContent, 'Download →');
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
  assert.equal(ready(1), 'Ready to download');
  assert.equal(ready(2), 'Edition 2 — Ready to download');
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
