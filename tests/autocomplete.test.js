// tests/autocomplete.test.js — the gmp-select handler (I9/R71, I4/R69).
//
// The real PlaceAutocompleteElement cannot run here, so the test supplies the
// three things the module actually touches: a stubbed document, a fake
// google.maps.importLibrary('places') that hands back a constructible element,
// and a fake placePrediction. What is under test is the handler: does a good
// selection produce the four fields the API needs, and does a place with no
// coordinates produce nothing at all rather than lat 0 / lon 0.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createDocument } from './helpers/dom-stub.js';

const doc = createDocument();
globalThis.document = doc;

// The mount target child-form.js builds.
const locationFields = doc.createElement('div');
locationFields.id = 'location-fields';
const cityInput = doc.createElement('input');
cityInput.id = 'birth-city';
cityInput.required = true;
const placeIdField = doc.createElement('input');
placeIdField.id = 'birth-place-id';
placeIdField.type = 'hidden';
const confirmation = doc.createElement('p');
confirmation.id = 'location-confirmation';
confirmation.hidden = true;
const resolvedName = doc.createElement('span');
resolvedName.id = 'location-resolved-name';
confirmation.appendChild(resolvedName);
locationFields.append(cityInput, placeIdField, confirmation);
doc.body.appendChild(locationFields);

globalThis.google = {
  maps: {
    importLibrary: async (name) => {
      assert.equal(name, 'places');
      return {
        PlaceAutocompleteElement: function (options) {
          const el = doc.createElement('gmp-place-autocomplete');
          el.options = options;
          return el;
        },
      };
    },
  },
};

const { initPlacesAutocomplete, getValidatedLocation, clearValidatedLocation } =
  await import('../assets/js/autocomplete.js');

const element = await initPlacesAutocomplete();

/** A place whose fetchFields() fills in whatever `filled` says. */
function fakePrediction(filled) {
  return {
    toPlace: () => ({
      ...filled,
      fetchFields: async ({ fields }) => {
        assert.deepEqual(fields, ['id', 'displayName', 'formattedAddress', 'location']);
      },
    }),
  };
}

const select = (prediction) =>
  Promise.all(element.dispatchEvent({ type: 'gmp-select', placePrediction: prediction }));

test('the element replaces the plain input and keeps its id and required state', () => {
  assert.equal(element.id, 'birth-city');
  assert.equal(element.required, true);
  assert.equal(doc.getElementById('birth-city'), element);
  assert.deepEqual(element.options, { includedPrimaryTypes: ['locality'] });
});

test('a selected place gives place_id, name, lat and lon', async () => {
  await select(fakePrediction({
    id: 'ChIJVXealLU_xkcRja_At0z9AGY',
    displayName: 'Amsterdam',
    formattedAddress: 'Amsterdam, Netherlands',
    location: { lat: () => 52.3675734, lng: () => 4.9041389 },
  }));

  assert.deepEqual(getValidatedLocation(), {
    place_id: 'ChIJVXealLU_xkcRja_At0z9AGY',
    name: 'Amsterdam, Netherlands',
    lat: 52.3675734,
    lon: 4.9041389,
  });
  assert.equal(doc.getElementById('birth-place-id').value, 'ChIJVXealLU_xkcRja_At0z9AGY');
  assert.equal(doc.getElementById('location-confirmation').hidden, false);
  assert.equal(doc.getElementById('location-resolved-name').textContent, 'Amsterdam, Netherlands');
});

test('R69: a place with no location is no selection, not lat 0 / lon 0', async () => {
  await select(fakePrediction({
    id: 'ChIJnowhere',
    displayName: 'Nowhere',
    formattedAddress: 'Nowhere',
    location: undefined,
  }));

  assert.equal(getValidatedLocation(), null);
  assert.equal(doc.getElementById('birth-place-id').value, '');
  assert.equal(doc.getElementById('location-confirmation').hidden, true);
});

test('R69: a place with no id is no selection either', async () => {
  await select(fakePrediction({
    id: undefined,
    displayName: 'Nowhere',
    formattedAddress: 'Nowhere',
    location: { lat: () => 1, lng: () => 2 },
  }));
  assert.equal(getValidatedLocation(), null);
});

test('editing the text after a selection clears it', async () => {
  await select(fakePrediction({
    id: 'ChIJd8BlQ2BZwokRAFUEcm_qrcA',
    displayName: 'New York',
    formattedAddress: 'New York, NY, USA',
    location: { lat: () => 40.7127753, lng: () => -74.0059728 },
  }));
  assert.equal(getValidatedLocation().place_id, 'ChIJd8BlQ2BZwokRAFUEcm_qrcA');

  element.dispatchEvent({ type: 'input' });
  assert.equal(getValidatedLocation(), null);
});

test('clearValidatedLocation resets the confirmation and the hidden field', async () => {
  await select(fakePrediction({
    id: 'ChIJdd4hrwug2EcRmSrV3Vo6llI',
    displayName: 'London',
    formattedAddress: 'London, UK',
    location: { lat: () => 51.5072178, lng: () => -0.1275862 },
  }));
  clearValidatedLocation();
  assert.equal(getValidatedLocation(), null);
  assert.equal(doc.getElementById('birth-place-id').value, '');
  assert.equal(doc.getElementById('location-resolved-name').textContent, '');
});
