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
  const { byChild, waiting, removed, downloads, locked } = groupGrants(
    [transits, presets, bundle],
    [],
    [{ id: 1, name: 'Ada' }]
  );
  const allCards = [
    ...byChild.flatMap((g) => g.cards),
    ...waiting,
    ...removed.flatMap((g) => g.cards),
    ...downloads,
    ...locked,
  ];
  assert.ok(!allCards.some((c) => c.product.slug === 'bundle-readings'));
});

test('no children + no grants -> every ACTIVE product in locked (I7)', () => {
  const { byChild, waiting, removed, downloads, locked } = groupGrants(grantableProducts(), [], []);
  assert.equal(byChild.length, 0);
  assert.equal(waiting.length, 0);
  assert.equal(removed.length, 0);
  assert.equal(downloads.length, 0);
  const active = grantableProducts().filter((p) => p.active);
  assert.equal(locked.length, active.length);
  assert.equal(locked.length, 6);   // eight grantable, less photo-course and retreat
  for (const { grant } of locked) assert.equal(grant, null);
});

test('I7: an inactive product is never advertised as "Not yet yours"', () => {
  const { locked } = groupGrants(grantableProducts(), [], []);
  const slugs = locked.map((c) => c.product.slug);
  assert.ok(!slugs.includes('photo-course'), 'photo-course is active: false');
  assert.ok(!slugs.includes('retreat'), 'retreat is active: false');
});

test('I7: an inactive product still renders when a grant exists', () => {
  const retreat = getProduct('retreat');
  const grants = [
    { grant_id: 7, product: 'retreat', child_id: null, child_name: null, edition: 1, available_at: null, has_intake: false },
  ];
  const { downloads, locked } = groupGrants([retreat], grants, []);
  assert.equal(downloads.length, 1);
  assert.equal(downloads[0].grant.grant_id, 7);
  assert.equal(locked.length, 0);
});

test('C3: two editions of one reading for one child are two cards', () => {
  const lunar = getProduct('north-star');
  const past = new Date(Date.now() - 86400e3).toISOString();
  const children = [{ id: 1, name: 'Ada' }];
  const grants = [
    { grant_id: 11, product: 'north-star', child_id: 1, child_name: 'Ada', edition: 1, available_at: past, has_intake: true },
    { grant_id: 12, product: 'north-star', child_id: 1, child_name: 'Ada', edition: 2, available_at: past, has_intake: true },
  ];
  const { byChild, locked } = groupGrants([lunar], grants, children);
  assert.equal(byChild.length, 1);
  assert.deepEqual(byChild[0].cards.map((c) => c.grant.grant_id), [11, 12]);
  assert.equal(locked.length, 0);
});

test('C3: a child with no grant for a product still gets one locked card', () => {
  const lunar = getProduct('north-star');
  const { byChild } = groupGrants([lunar, transits], [], [{ id: 1, name: 'Ada' }]);
  assert.equal(byChild[0].cards.length, 2);
  for (const card of byChild[0].cards) assert.equal(card.grant, null);
});

test('C3: a grant for a removed child lands in `removed`, not `locked`', () => {
  const lunar = getProduct('north-star');
  const past = new Date(Date.now() - 86400e3).toISOString();
  const grants = [
    { grant_id: 21, product: 'north-star', child_id: 99, child_name: null, edition: 1, available_at: past, has_intake: true },
  ];
  const { removed, locked, waiting, byChild } = groupGrants([lunar], grants, []);
  assert.equal(byChild.length, 0);
  assert.equal(waiting.length, 0);
  assert.equal(removed.length, 1);
  assert.equal(removed[0].label, 'Removed child');
  assert.deepEqual(removed[0].cards.map((c) => c.grant.grant_id), [21]);
  assert.equal(locked.length, 0, 'the product must not also read "Not yet yours"');
});

test('C3: a removed child keeps its name when the API still has one', () => {
  const lunar = getProduct('north-star');
  const grants = [
    { grant_id: 22, product: 'north-star', child_id: 99, child_name: 'Bo', edition: 1, available_at: null, has_intake: true },
    { grant_id: 23, product: 'transits', child_id: 99, child_name: 'Bo', edition: 1, available_at: null, has_intake: true },
  ];
  const { removed } = groupGrants([lunar, transits], grants, []);
  assert.equal(removed.length, 1, 'one group per removed child, not per grant');
  assert.equal(removed[0].label, 'Bo');
  assert.deepEqual(removed[0].cards.map((c) => c.grant.grant_id), [22, 23]);
});

test('every grant of an instant product renders, one card per edition', () => {
  const past = new Date(Date.now() - 86400e3).toISOString();
  const grants = [
    { grant_id: 1, product: 'presets', child_id: null, child_name: null, edition: 1, available_at: past, has_intake: false },
    { grant_id: 2, product: 'presets', child_id: null, child_name: null, edition: 2, available_at: past, has_intake: false },
  ];
  const g = groupGrants([presets], grants, []);
  assert.deepEqual(g.downloads.map((d) => d.grant.grant_id), [1, 2]);
  assert.equal(g.locked.length, 0);
});
