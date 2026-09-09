// tests/child-form.test.js — readChildForm's payload shaping. mapsKey: ''
// keeps this test DOM-free: readChildForm never calls getValidatedLocation()
// or resolveTimezone() (network) unless mapsKey is truthy, so a plain object
// exposing querySelector() is enough to stand in for the mounted fields.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readChildForm } from '../assets/js/child-form.js';

function fakeContainer(fields) {
  return { querySelector: (sel) => fields[sel.slice(1)] };
}

test('readChildForm nulls tob when birth time is unknown', async () => {
  const container = fakeContainer({
    name: { value: 'Kid' },
    dob: { value: '2020-01-01' },
    'tob-unknown': { checked: true },
    tob: { value: '07:15' },
    'birth-city': { value: '' },
  });
  const fields = await readChildForm(container, { mapsKey: '' });
  assert.equal(fields.tob_unknown, true);
  assert.equal(fields.tob, null);
});

test('readChildForm keeps tob when birth time is known', async () => {
  const container = fakeContainer({
    name: { value: 'Kid' },
    dob: { value: '2020-01-01' },
    'tob-unknown': { checked: false },
    tob: { value: '07:15' },
    'birth-city': { value: '' },
  });
  const fields = await readChildForm(container, { mapsKey: '' });
  assert.equal(fields.tob_unknown, false);
  assert.equal(fields.tob, '07:15');
});

test('readChildForm omits place fields when mapsKey is empty', async () => {
  const container = fakeContainer({
    name: { value: 'Kid' },
    dob: { value: '2020-01-01' },
    'tob-unknown': { checked: false },
    tob: { value: '' },
    'birth-city': { value: 'Some City' },
  });
  const fields = await readChildForm(container, { mapsKey: '' });
  assert.equal(fields.place_id, '');
  assert.equal(fields.lat, null);
  assert.equal(fields.lon, null);
  assert.equal(fields.tz, '');
  assert.equal(fields.place_name, 'Some City');
});
