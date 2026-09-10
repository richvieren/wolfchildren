// intake.js — portal/intake.html: one parameterised intake form for every
// generated product (Task 14). Reads ?product= and ?grant= from the URL,
// looks the product up in registry.js, and refuses to render a form for a
// product whose requiresIntake is false. Cato had a separate HTML file per
// product; this one form serves all five reading products.
//
// R53: there is no Google Maps key for Wolf Children yet, and Cato's must
// not be reused. The key lives in <meta name="wc-maps-key">, empty for now.
// R57 (fix round 1): the new-child fields are the shared child-form.js
// component, also used by children.js — see that file for the Places
// wiring.
//
// Task 7: astrocartography also needs three named places, under the child
// selector. autocomplete.js's PlaceAutocompleteElement wiring is a
// singleton for the one birth-city field on child-form.js — three
// independent fields here get their own small, self-contained mount (same
// underlying Places API, same result shape) rather than reusing that
// module's one set of hardcoded ids.

import { getSession } from './auth.js?v=b9374f9e';
import { PRODUCTS, getProduct } from './registry.js?v=05524ffe';
import { getChildren, addChild, submitIntake, firstErrorMessage } from './api.js?v=efad900d';
import { clearValidatedLocation } from './autocomplete.js?v=f397273b';
import { mountChildForm, readChildForm, setChildFormEnabled } from './child-form.js?v=b22ef946';

export const PLACE_LABELS = ['First place', 'Second place', 'Third place'];

/** Only astrocartography takes three named places at intake (spec §5). */
export function isAstrocartography(product) {
  return Boolean(product && product.slug === 'astrocartography');
}

// One module-level array, like autocomplete.js's own `_validatedLocation` —
// but three slots, one per field, reset on every mountPlaceFields() call.
let placeSelections = [null, null, null];

/** Every place chosen, and all three place_ids distinct. */
export function placesAreReady() {
  if (placeSelections.some((p) => !p)) return false;
  return new Set(placeSelections.map((p) => p.place_id)).size === 3;
}

/** The three places, in order, in the shape the API's PlaceIn expects. */
export function readPlaceFields() {
  if (!placesAreReady()) {
    throw new Error('Please choose three different places.');
  }
  return placeSelections.map((p) => ({ ...p }));
}

function updateSubmitState(submitButton) {
  if (submitButton) submitButton.disabled = !placesAreReady();
}

/**
 * Loads the Places library and turns each plain text input into a
 * PlaceAutocompleteElement, same fields (id, formattedAddress/displayName,
 * location) and the same "no id or no coordinates is no selection" guard as
 * autocomplete.js's onSelect (R69) — kept independent here because that
 * module tracks exactly one field.
 */
async function attachPlacesLibrary(inputs, status, submitButton) {
  let PlaceAutocompleteElement;
  try {
    ({ PlaceAutocompleteElement } = await google.maps.importLibrary('places'));
  } catch {
    status.textContent = 'Location search could not be loaded.';
    return;
  }
  inputs.forEach((input, i) => {
    const element = new PlaceAutocompleteElement({ includedPrimaryTypes: ['locality'] });
    element.id = input.id;
    element.required = true;
    input.replaceWith(element);

    element.addEventListener('gmp-select', async ({ placePrediction }) => {
      if (!placePrediction) {
        placeSelections[i] = null;
        updateSubmitState(submitButton);
        return;
      }
      let place;
      try {
        place = placePrediction.toPlace();
        await place.fetchFields({ fields: ['id', 'displayName', 'formattedAddress', 'location'] });
      } catch {
        placeSelections[i] = null;
        updateSubmitState(submitButton);
        return;
      }
      if (!place || !place.id || !place.location) {
        placeSelections[i] = null;
        updateSubmitState(submitButton);
        return;
      }
      placeSelections[i] = {
        place_id: place.id,
        place_name: place.formattedAddress || place.displayName,
        lat: place.location.lat(),
        lon: place.location.lng(),
      };
      updateSubmitState(submitButton);
    });
    element.addEventListener('input', () => {
      placeSelections[i] = null;
      updateSubmitState(submitButton);
    });
  });
}

/**
 * Builds the three labelled place fields into a new fieldset, inserted
 * before `anchor`, and (with a Maps key) wires them to Places. Returns the
 * fieldset so a caller can remove it if the product changes.
 */
export function mountPlaceFields(form, anchor, mapsKey, submitButton) {
  placeSelections = [null, null, null];
  updateSubmitState(submitButton);

  const fieldset = document.createElement('fieldset');
  fieldset.id = 'places-fields';
  const legend = document.createElement('legend');
  legend.textContent = 'Three places';
  fieldset.append(legend);

  const status = document.createElement('p');
  status.id = 'places-status';

  const inputs = PLACE_LABELS.map((text, i) => {
    const id = `place-${i + 1}`;
    const label = document.createElement('label');
    label.htmlFor = id;
    label.textContent = text;
    const input = document.createElement('input');
    input.type = 'text';
    input.id = id;
    input.autocomplete = 'off';
    input.required = true;
    fieldset.append(label, input);
    return input;
  });
  fieldset.append(status);
  // Mounted directly above `anchor` (the child-details fieldset): detach it,
  // append the new fieldset, then restore it straight after. Plain
  // append()/remove() rather than insertBefore() — the same result in a real
  // browser, and it needs nothing from the DOM but what append() already does.
  anchor.remove();
  form.append(fieldset, anchor);

  if (!mapsKey) {
    status.textContent = 'Location search is not available yet.';
    return fieldset;
  }
  attachPlacesLibrary(inputs, status, submitButton);
  return fieldset;
}

async function init() {
  const params = new URLSearchParams(window.location.search);
  const productSlug = params.get('product');
  const grantId = params.get('grant');

  const message = document.getElementById('message');
  const form = document.getElementById('intake-form');

  function showMessage(text) {
    message.textContent = text;
    message.hidden = false;
    form.hidden = true;
  }

  const session = await getSession();
  if (!session) {
    window.location.href = '/portal/';
    return;
  }

  // registry.js is generated, and its getProduct() is a bare PRODUCTS[slug]
  // lookup, so a slug like "constructor" or "__proto__" in the query string
  // returns an Object.prototype member instead of undefined. The registry
  // cannot be edited here (it is generated by the API repo), so the guard
  // lives at the consumer: ask whether the registry actually owns the key.
  const product = productSlug && Object.hasOwn(PRODUCTS, productSlug)
    ? getProduct(productSlug)
    : undefined;
  if (!product) {
    showMessage('This product could not be found.');
    return;
  }
  if (!product.requiresIntake) {
    showMessage('This product needs no details.');
    return;
  }
  if (!grantId) {
    showMessage('This link is missing its grant. Please return to your dashboard.');
    return;
  }

  document.getElementById('product-name').textContent = product.name;
  message.hidden = true;
  form.hidden = false;

  const mapsKeyMeta = document.querySelector('meta[name="wc-maps-key"]');
  const mapsKey = (mapsKeyMeta && mapsKeyMeta.content) || '';

  const existingSelect = document.getElementById('existing-child');
  const newChildFields = document.getElementById('new-child-fields');
  const status = document.getElementById('status');
  const submitButton = form.querySelector('button[type="submit"]');

  mountChildForm(newChildFields, { mapsKey });

  const isAstro = isAstrocartography(product);
  if (isAstro) {
    mountPlaceFields(form, newChildFields, mapsKey, submitButton);
  }

  // I2: unguarded, a thrown "signed out" here (an expired token, which
  // api.js has already cleared) escaped init() and left a page with a form
  // that could never be filled in and no way back.
  let children;
  try {
    children = await getChildren();
  } catch {
    window.location.href = '/portal/';
    return;
  }

  for (const child of children) {
    const option = document.createElement('option');
    option.value = String(child.id);
    option.textContent = child.name;
    existingSelect.append(option);
  }

  // C1: setChildFormEnabled, never `newChildFields.hidden = ...`. Hiding this
  // fieldset while #name/#dob stayed `required` made the Continue button do
  // nothing at all the moment an existing child was picked — the one path
  // through this page that should have been the easy one.
  function syncNewChildVisibility() {
    setChildFormEnabled(newChildFields, existingSelect.value === '');
  }
  existingSelect.addEventListener('change', () => {
    syncNewChildVisibility();
    if (existingSelect.value !== '') clearValidatedLocation();
  });
  syncNewChildVisibility();

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.textContent = '';

    let places;
    if (isAstro) {
      try {
        places = readPlaceFields();
      } catch (err) {
        status.textContent = err.message;
        return;
      }
    }

    let childId = existingSelect.value ? Number(existingSelect.value) : null;

    if (!childId) {
      try {
        const fields = await readChildForm(newChildFields, { mapsKey });
        const child = await addChild(fields);
        childId = child.id;
      } catch (err) {
        status.textContent = firstErrorMessage(err);
        return;
      }
    }

    try {
      const fields = isAstro ? { child_id: childId, places } : { child_id: childId };
      await submitIntake(Number(grantId), fields);
      window.location.href = '/portal/';
    } catch (err) {
      status.textContent = firstErrorMessage(err);
    }
  });
}

if (typeof window !== 'undefined') {
  init();
}
