// tests/child-form.test.js — readChildForm's payload shaping. mapsKey: ''
// keeps this test DOM-free: readChildForm never calls getValidatedLocation()
// unless mapsKey is truthy, so a plain object
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
  assert.ok(!('tz' in fields), 'tz is derived by the API, never sent');
  assert.equal(fields.place_name, 'Some City');
});

// ─── With a stubbed DOM ──────────────────────────────────────────────────────
// The tests above are DOM-free on purpose. The three below cannot be: C1 is a
// question about form.checkValidity() and C2 about the mounted timefield
// selects, so both need a document. tests/helpers/dom-stub.js provides the
// smallest one that implements the real constraint-validation rule.

import { createDocument } from './helpers/dom-stub.js';

async function mountForm({ mapsKey = '' } = {}) {
  const doc = createDocument();
  globalThis.document = doc;
  const form = doc.createElement('form');
  const container = doc.createElement('div');
  form.appendChild(container);
  doc.body.appendChild(form);
  const mod = await import('../assets/js/child-form.js');
  mod.mountChildForm(container, { mapsKey });
  return { doc, form, container, mod };
}

test('C1: a hidden child-form block does not block submission', async () => {
  const { form, container, mod } = await mountForm();

  // Everything visible and empty: the form is correctly invalid.
  assert.equal(form.checkValidity(), false);

  // Intake hides the whole fieldset when an existing child is picked.
  mod.setChildFormEnabled(container, false);
  assert.equal(container.hidden, true);
  assert.equal(form.checkValidity(), true,
    'a hidden required input still blocks checkValidity in a real browser');

  // ...and comes back with its constraints intact.
  mod.setChildFormEnabled(container, true);
  assert.equal(form.checkValidity(), false);
});

test('C1: with no Maps key, nothing outside a visible block is required', async () => {
  const { form, container } = await mountForm({ mapsKey: '' });

  // The location block is hidden because there is no key to search with.
  assert.equal(container.querySelector('#location-fields').hidden, true);
  assert.equal(container.querySelector('#birth-city').required, false);

  // The sanity probe: no required control sits inside a hidden ancestor.
  for (const el of form.querySelectorAll('input')) {
    if (!el.required) continue;
    for (let node = el; node; node = node.parentNode) {
      assert.equal(node.hidden !== true, true,
        `#${el.id} is required inside a hidden ${node.tagName}`);
    }
  }

  // And the visible fields still do their job.
  form.querySelector('#name').value = 'Ada';
  form.querySelector('#dob').value = '2020-01-01';
  assert.equal(form.checkValidity(), true);
});

test('C2: an incomplete birth time is refused, not silently nulled', async () => {
  const { container, mod } = await mountForm();
  container.querySelector('#name').value = 'Ada';
  container.querySelector('#dob').value = '2020-01-01';

  // Hour and minute chosen, AM/PM left blank.
  document.getElementById('tob-h').value = '7';
  document.getElementById('tob-m').value = '15';
  document.getElementById('tob-ap').value = '';

  await assert.rejects(
    () => mod.readChildForm(container, { mapsKey: '' }),
    /missing the AM or PM/,
  );

  // Completing it clears the error and the canonical time is stored.
  document.getElementById('tob-ap').value = 'AM';
  document.getElementById('tob-ap').dispatchEvent({ type: 'change' });
  const fields = await mod.readChildForm(container, { mapsKey: '' });
  assert.equal(fields.tob, '07:15');
  assert.equal(fields.tob_unknown, false);
});
