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
 * an earlier test's stale element instead of its own.
 */
function freshForm() {
  const doc = createDocument();
  globalThis.document = doc;
  const form = doc.createElement('form');
  const anchor = doc.createElement('fieldset');
  anchor.id = 'new-child-fields';
  form.appendChild(anchor);
  doc.body.appendChild(form);
  return { doc, form, anchor };
}

test('mountPlaceFields mounts three labelled fields, in order, before the child fields', () => {
  const { form, anchor } = freshForm();
  const fieldset = mountPlaceFields(form, anchor, '', null);

  assert.equal(fieldset.id, 'places-fields');
  // Mounted before the child-details fieldset ("under the child selector").
  assert.equal(form.childNodes.indexOf(fieldset) < form.childNodes.indexOf(anchor), true);

  const labels = fieldset.querySelectorAll('label');
  assert.deepEqual(labels.map((l) => l.textContent), PLACE_LABELS);
  assert.deepEqual(labels.map((l) => l.htmlFor), ['place-1', 'place-2', 'place-3']);
  for (const id of ['place-1', 'place-2', 'place-3']) {
    assert.ok(fieldset.querySelector(`#${id}`), `#${id} is mounted`);
  }
});

test('with no Maps key, the fields show a status line and submit is disabled', () => {
  const { form, anchor } = freshForm();
  const submitButton = createDocument().createElement('button');
  const fieldset = mountPlaceFields(form, anchor, '', submitButton);

  assert.match(fieldset.querySelector('#places-status').textContent, /not available yet/);
  assert.equal(submitButton.disabled, true);
});

test('mountPlaceFields disables the submit button until three distinct places are chosen', async () => {
  const { doc, form, anchor } = freshForm();
  const submitButton = doc.createElement('button');

  globalThis.google = {
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

  mountPlaceFields(form, anchor, 'test-key', submitButton);
  // attachPlacesLibrary is async; let its importLibrary() promise settle.
  await new Promise((resolve) => setTimeout(resolve, 0));

  assert.equal(submitButton.disabled, true, 'nothing chosen yet');
  assert.equal(placesAreReady(), false);

  const elements = ['place-1', 'place-2', 'place-3'].map((id) => doc.getElementById(id));
  assert.equal(elements.every((el) => el && el.tagName === 'GMP-PLACE-AUTOCOMPLETE'), true,
    'the plain inputs were replaced by Places elements');

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
  const { doc, form, anchor } = freshForm();
  const submitButton = doc.createElement('button');

  globalThis.google = {
    maps: {
      importLibrary: async () => ({
        PlaceAutocompleteElement: function () {
          return doc.createElement('gmp-place-autocomplete');
        },
      }),
    },
  };

  mountPlaceFields(form, anchor, 'test-key', submitButton);
  await new Promise((resolve) => setTimeout(resolve, 0));

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
  const firstButton = first.doc.createElement('button');
  globalThis.google = {
    maps: {
      importLibrary: async () => ({
        PlaceAutocompleteElement: function () { return first.doc.createElement('gmp-place-autocomplete'); },
      }),
    },
  };
  mountPlaceFields(first.form, first.anchor, 'test-key', firstButton);
  await new Promise((resolve) => setTimeout(resolve, 0));
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
  mountPlaceFields(second.form, second.anchor, '', null);
  assert.equal(placesAreReady(), false);
  assert.throws(() => readPlaceFields(), /three different places/);
});
