// tests/intake.test.js — Task 7: the three astrocartography place fields.
//
// intake.js self-invokes init() on import for the real page, guarded by
// `typeof window !== 'undefined'` so it stays inert here (no window global
// in node --test) — the same reason this suite tests the exported
// DOM-manipulation helpers directly rather than driving the full page flow
// (no other page-entry module — main-portal.js, children.js — has a test
// file either, for the same reason: no fetch/session stubs exist yet).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createDocument } from './helpers/dom-stub.js';
import { getProduct } from '../assets/js/registry.js';

// intake.js imports auth.js, which runs a top-level IIFE reading
// `window.location` on module load — before this suite's own init() guard
// (`typeof window !== 'undefined'`) ever gets a say. A minimal stub with an
// empty search string skips that IIFE's own auth_token branch entirely, and
// stubbed localStorage lets the auto-invoked init() resolve getSession() to
// null and redirect harmlessly, rather than throwing into an unhandled
// rejection. No test below depends on init() itself; every one drives the
// exported DOM-manipulation helpers directly.
globalThis.document = createDocument();
globalThis.window = {
  location: { search: '', pathname: '/portal/intake.html', href: '' },
  history: { replaceState: () => {} },
};
globalThis.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };

const {
  isAstrocartography, mountPlaceFields, readPlaceFields, placesAreReady, PLACE_LABELS,
} = await import('../assets/js/intake.js');

test('isAstrocartography is true only for the astrocartography product', () => {
  assert.equal(isAstrocartography(getProduct('astrocartography')), true);
  assert.equal(isAstrocartography(getProduct('transits')), false);
  assert.equal(isAstrocartography(getProduct('lunar-portrait')), false);
  assert.equal(isAstrocartography(undefined), false);
});

/**
 * A fresh document per test, and made the current global one — like
 * child-form.test.js's mountForm(). Ids ('place-1' etc.) are the same across
 * tests, so a shared document would let a later test's getElementById find
 * an earlier test's stale element instead of its own. Shape mirrors
 * portal/intake.html: select, new-child fields, submit button, status.
 */
function freshForm() {
  const doc = createDocument();
  globalThis.document = doc;
  delete globalThis.google;
  delete window.initPlacesAutocomplete;

  const form = doc.createElement('form');
  const existingSelect = doc.createElement('select');
  existingSelect.id = 'existing-child';
  const newChildFields = doc.createElement('fieldset');
  newChildFields.id = 'new-child-fields';
  const submitButton = doc.createElement('button');
  submitButton.type = 'submit';
  const status = doc.createElement('p');
  status.id = 'status';
  form.append(existingSelect, newChildFields, submitButton, status);
  doc.body.appendChild(form);
  return { doc, form, existingSelect, newChildFields, submitButton, status };
}

function fakeGoogle(doc) {
  return {
    maps: {
      importLibrary: async () => ({
        PlaceAutocompleteElement: function (options) {
          const el = doc.createElement('gmp-place-autocomplete');
          el.options = options;
          return el;
        },
      }),
    },
  };
}

test('mountPlaceFields mounts three labelled fields, in the right form order', () => {
  const { doc, form, newChildFields, submitButton, status } = freshForm();
  const fieldset = mountPlaceFields(form, submitButton, '');

  assert.equal(fieldset.id, 'places-fields');
  // select, new-child fields, places fieldset, submit, status.
  const order = form.childNodes.map((n) => n.id || n.tagName);
  const idx = (x) => order.indexOf(x);
  assert.ok(idx('existing-child') < idx('new-child-fields'));
  assert.ok(idx('new-child-fields') < idx('places-fields'));
  assert.ok(idx('places-fields') < idx('BUTTON'));
  assert.ok(idx('BUTTON') < idx('status'));

  const labels = fieldset.querySelectorAll('label');
  assert.deepEqual(labels.map((l) => l.textContent), PLACE_LABELS);
  assert.deepEqual(labels.map((l) => l.htmlFor), ['place-1', 'place-2', 'place-3']);
  for (const id of ['place-1', 'place-2', 'place-3']) {
    assert.ok(fieldset.querySelector(`#${id}`), `#${id} is mounted`);
  }
});

test('with no Maps key, the fields show a status line and submit is disabled', () => {
  const { form, submitButton } = freshForm();
  const fieldset = mountPlaceFields(form, submitButton, '');

  assert.match(fieldset.querySelector('#places-status').textContent, /not available yet/);
  assert.equal(submitButton.disabled, true);
});

test('mounting with a Maps key never touches `google` before the Places callback fires', () => {
  const { doc, form, submitButton } = freshForm();
  // No globalThis.google at all here — touching it synchronously would throw.
  assert.doesNotThrow(() => mountPlaceFields(form, submitButton, 'test-key'));
  assert.equal(doc.getElementById('places-status').textContent, '',
    'not marked as failed before the callback has run');
  assert.equal(submitButton.disabled, true, 'nothing chosen yet, and nothing attached yet either');
  assert.equal(typeof window.initPlacesAutocomplete, 'function',
    'mountPlaceFields registers a pending attach for the Maps callback to run');
});

test('the three fields attach only once window.initPlacesAutocomplete (the Maps callback) fires', async () => {
  const { doc, form, submitButton } = freshForm();
  globalThis.google = fakeGoogle(doc);

  mountPlaceFields(form, submitButton, 'test-key');
  // Still plain inputs — the callback has not fired yet.
  assert.equal(doc.getElementById('place-1').tagName, 'INPUT');

  await window.initPlacesAutocomplete();

  for (const id of ['place-1', 'place-2', 'place-3']) {
    assert.equal(doc.getElementById(id).tagName, 'GMP-PLACE-AUTOCOMPLETE');
  }
  assert.equal(doc.getElementById('places-status').textContent, '', 'not marked as failed');
});

test('mountPlaceFields extends an existing window.initPlacesAutocomplete rather than replacing it', async () => {
  const { doc, form, submitButton } = freshForm();
  globalThis.google = fakeGoogle(doc);

  const calls = [];
  window.initPlacesAutocomplete = async () => { calls.push('previous'); return 'previous-result'; };

  mountPlaceFields(form, submitButton, 'test-key');
  const result = await window.initPlacesAutocomplete();

  assert.deepEqual(calls, ['previous'], 'the callback child-form.js installed still runs');
  assert.equal(result, 'previous-result', 'its return value is preserved');
  assert.equal(doc.getElementById('place-1').tagName, 'GMP-PLACE-AUTOCOMPLETE', 'and this fieldset also attached');
});

test('a failed Places load after the callback fires marks the status, not before', async () => {
  const { doc, form, submitButton } = freshForm();
  globalThis.google = { maps: { importLibrary: async () => { throw new Error('network'); } } };

  mountPlaceFields(form, submitButton, 'test-key');
  assert.equal(doc.getElementById('places-status').textContent, '', 'no failure before the callback runs');

  await window.initPlacesAutocomplete();
  assert.match(doc.getElementById('places-status').textContent, /could not be loaded/);
});

test('disables the submit button until three distinct places are chosen', async () => {
  const { doc, form, submitButton } = freshForm();
  globalThis.google = fakeGoogle(doc);

  mountPlaceFields(form, submitButton, 'test-key');
  await window.initPlacesAutocomplete();

  assert.equal(submitButton.disabled, true, 'nothing chosen yet');
  assert.equal(placesAreReady(), false);

  const elements = ['place-1', 'place-2', 'place-3'].map((id) => doc.getElementById(id));

  const select = (el, filled) => Promise.all(el.dispatchEvent({
    type: 'gmp-select',
    placePrediction: {
      toPlace: () => ({
        ...filled,
        fetchFields: async () => {},
      }),
    },
  }));

  await select(elements[0], {
    id: 'p1', displayName: 'Emmen', formattedAddress: 'Emmen, Netherlands',
    location: { lat: () => 52.7529, lng: () => 6.9525 },
  });
  assert.equal(submitButton.disabled, true, 'only one of three chosen');

  await select(elements[1], {
    id: 'p2', displayName: 'Lisbon', formattedAddress: 'Lisbon, Portugal',
    location: { lat: () => 38.7223, lng: () => -9.1393 },
  });
  assert.equal(submitButton.disabled, true, 'only two of three chosen');

  await select(elements[2], {
    id: 'p3', displayName: 'Cape Town', formattedAddress: 'Cape Town, South Africa',
    location: { lat: () => -33.9249, lng: () => 18.4241 },
  });
  assert.equal(submitButton.disabled, false, 'all three chosen and distinct');
  assert.equal(placesAreReady(), true);

  const places = readPlaceFields();
  assert.equal(places.length, 3);
  assert.deepEqual(places[0], { place_id: 'p1', place_name: 'Emmen, Netherlands', lat: 52.7529, lon: 6.9525 });
  assert.deepEqual(places[1], { place_id: 'p2', place_name: 'Lisbon, Portugal', lat: 38.7223, lon: -9.1393 });
  assert.deepEqual(places[2], { place_id: 'p3', place_name: 'Cape Town, South Africa', lat: -33.9249, lon: 18.4241 });

  // R69, mirrored from autocomplete.js: choosing the same place twice must
  // not read as three distinct places.
  await select(elements[2], {
    id: 'p1', displayName: 'Emmen', formattedAddress: 'Emmen, Netherlands',
    location: { lat: () => 52.7529, lng: () => 6.9525 },
  });
  assert.equal(placesAreReady(), false, 'the same place chosen twice is not three distinct places');
  assert.equal(submitButton.disabled, true);
  assert.throws(() => readPlaceFields(), /three different places/);
});

test('R69 mirrored: a place with no coordinates clears that slot, not lat 0 / lon 0', async () => {
  const { doc, form, submitButton } = freshForm();
  globalThis.google = fakeGoogle(doc);

  mountPlaceFields(form, submitButton, 'test-key');
  await window.initPlacesAutocomplete();

  const element = doc.getElementById('place-1');
  await Promise.all(element.dispatchEvent({
    type: 'gmp-select',
    placePrediction: {
      toPlace: () => ({
        id: 'nowhere', displayName: 'Nowhere', formattedAddress: 'Nowhere', location: undefined,
        fetchFields: async () => {},
      }),
    },
  }));
  assert.equal(placesAreReady(), false);
});

test('mounting a fresh form resets the three selections', async () => {
  const first = freshForm();
  globalThis.google = fakeGoogle(first.doc);
  mountPlaceFields(first.form, first.submitButton, 'test-key');
  await window.initPlacesAutocomplete();
  const el = first.doc.getElementById('place-1');
  await Promise.all(el.dispatchEvent({
    type: 'gmp-select',
    placePrediction: {
      toPlace: () => ({
        id: 'p1', displayName: 'Emmen', formattedAddress: 'Emmen, Netherlands',
        location: { lat: () => 52.7529, lng: () => 6.9525 }, fetchFields: async () => {},
      }),
    },
  }));

  // A second product page mount (e.g. astrocartography chosen again after
  // navigating away and back) must not carry the previous selection over.
  const second = freshForm();
  mountPlaceFields(second.form, second.submitButton, '');
  assert.equal(placesAreReady(), false);
  assert.throws(() => readPlaceFields(), /three different places/);
});
