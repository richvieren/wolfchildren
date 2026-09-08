// tests/dashboard.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { groupGrants } from '../assets/js/dashboard.js';
import { getProduct, grantableProducts } from '../assets/js/registry.js';

const transits = getProduct('transits');
const presets = getProduct('presets');

test('two children x one generated product -> two cards with the right grants', () => {
  const children = [{ id: 1, name: 'Ada' }, { id: 2, name: 'Bo' }];
  const grants = [
    { grant_id: 1, product: 'transits', child_id: 1, child_name: 'Ada', edition: 1, available_at: null, has_intake: true },
    { grant_id: 2, product: 'transits', child_id: 2, child_name: 'Bo', edition: 1, available_at: null, has_intake: true },
  ];
  const { byChild } = groupGrants([transits], grants, children);
  assert.equal(byChild.length, 2);
  assert.equal(byChild[0].child.name, 'Ada');
  assert.equal(byChild[0].cards.length, 1);
  assert.equal(byChild[0].cards[0].grant.grant_id, 1);
  assert.equal(byChild[1].cards[0].grant.grant_id, 2);
});

test('an un-started reading grant lands in waiting', () => {
  const grants = [
    { grant_id: 5, product: 'transits', child_id: null, child_name: null, edition: null, available_at: null, has_intake: false },
  ];
  const { waiting, byChild, locked } = groupGrants([transits], grants, []);
  assert.equal(waiting.length, 1);
  assert.equal(waiting[0].grant.grant_id, 5);
  assert.equal(byChild.length, 0);
  assert.equal(locked.length, 0);
});

test('an instant grant lands in downloads', () => {
  const grants = [
    { grant_id: 9, product: 'presets', child_id: null, child_name: null, edition: null, available_at: '2020-01-01T00:00:00Z', has_intake: false },
  ];
  const { downloads, locked } = groupGrants([presets], grants, []);
  assert.equal(downloads.length, 1);
  assert.equal(downloads[0].grant.grant_id, 9);
  assert.equal(locked.length, 0);
});

test('a bundle never appears', () => {
  const bundle = getProduct('bundle-readings');
  const { byChild, waiting, downloads, locked } = groupGrants(
    [transits, presets, bundle],
    [],
    [{ id: 1, name: 'Ada' }]
  );
  const allCards = [
    ...byChild.flatMap((g) => g.cards),
    ...waiting,
    ...downloads,
    ...locked,
  ];
  assert.ok(!allCards.some((c) => c.product.slug === 'bundle-readings'));
});

test('no children + no grants -> everything in locked', () => {
  const { byChild, waiting, downloads, locked } = groupGrants(grantableProducts(), [], []);
  assert.equal(byChild.length, 0);
  assert.equal(waiting.length, 0);
  assert.equal(downloads.length, 0);
  assert.equal(locked.length, grantableProducts().length);
  for (const { grant } of locked) assert.equal(grant, null);
});
