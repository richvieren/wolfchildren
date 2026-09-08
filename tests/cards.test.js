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
