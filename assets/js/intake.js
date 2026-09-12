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
//
// Task 9: parent-child needs the parent's own birth details (once per
// account) and three questions about the two of them. Both live in
// parent-form.js; this file only decides when to mount them and what the
// submit sends.

import { getSession } from './auth.js?v=b9374f9e';
import { PRODUCTS, getProduct } from './registry.js?v=99cae717';
import { getChildren, addChild, submitIntake, getParent, saveParent, firstErrorMessage } from './api.js?v=a796088e';
import { clearValidatedLocation, resolveSelectedPlace } from './autocomplete.js?v=d3fe94de';
import { mountObservations, readObservations } from './observations.js?v=994b0b40';
import { mountChildForm, readChildForm, setChildFormEnabled } from './child-form.js?v=f4dcddfa';
import {
  isParentChild, needsParentForm, mountParentForm, readParentForm,
  mountRelationshipQuestions, readRelationship,
} from './parent-form.js?v=05bc64d4';

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

/**
 * The POST /v1/intake body beyond grant_id: the child, plus whatever this
 * product takes. Each product-specific key goes with exactly one product and
 * the API refuses it on any other (422), so the shape is decided here rather
 * than at the fetch.
 */
export function intakeFields(product, childId, { places, relationship, observations } = {}) {
  const fields = { child_id: childId };
  if (isAstrocartography(product)) fields.places = places;
  if (isParentChild(product)) fields.relationship = relationship;
  if (observations !== undefined) fields.observations = observations;
  return fields;
}

function updateSubmitState(submitButton) {
  if (submitButton) submitButton.disabled = !placesAreReady();
}

/**
 * Turns each plain text input into a PlaceAutocompleteElement, using the
 * same `google.maps.importLibrary('places')` and the same resolved-place
 * shape as autocomplete.js's own singleton field. Only ever called from
 * inside `window.initPlacesAutocomplete` (see mountPlaceFields below) — by
 * the time this runs, the Maps script has already loaded and called back,
 * so `google` is safe to touch.
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
      const resolved = await resolveSelectedPlace(placePrediction);
      placeSelections[i] = resolved
        ? { place_id: resolved.place_id, place_name: resolved.name, lat: resolved.lat, lon: resolved.lon }
        : null;
      updateSubmitState(submitButton);
    });
    // Editing the text after a selection invalidates it — same rule as
    // autocomplete.js's own field.
    element.addEventListener('input', () => {
      placeSelections[i] = null;
      updateSubmitState(submitButton);
    });
  });
}

/**
 * Builds the three labelled place fields into a new fieldset, inserted
 * right before `submitButton` (after the existing-child select and the
 * new-child fields, so the submit button and status line stay last). With a
 * Maps key, extends `window.initPlacesAutocomplete` — the callback
 * child-form.js's loaded script tag will call once Places is actually ready
 * (`&callback=initPlacesAutocomplete`) — so this fieldset's own
 * `google.maps.importLibrary` call runs in that same callback, never before
 * it. mountChildForm() must run first, so this wraps whatever callback it
 * just installed (autocomplete.js's own initPlacesAutocomplete, mounting
 * the birth-city field) rather than replacing it.
 *
 * Fix round 1: `google` used to be touched synchronously, one line after
 * child-form.js kicked off the (async, network-bound) Maps script — always
 * before the script could possibly have loaded, so the try/catch below
 * always caught a ReferenceError and the fields never attached.
 */
export function mountPlaceFields(form, submitButton, mapsKey) {
  placeSelections = [null, null, null];
  updateSubmitState(submitButton);

  const fieldset = document.createElement('fieldset');
  fieldset.id = 'places-fields';
  const legend = document.createElement('legend');
  legend.textContent = 'Three places';
  fieldset.append(legend);
  // Richard, 2026-09-12: relocated angles track longitude, so a place near the
  // birthplace's longitude reads almost the same as home (Mallorca came out
  // identical to Bonheiden). Said here, before the parent commits the places.
  const note = document.createElement('p');
  note.id = 'places-note';
  note.textContent = 'Places at a similar longitude to the birthplace show almost no change, because the parts of the chart that move with place follow longitude. A place well to the east or west of where your child was born gives the reading the most to say.';
  fieldset.append(note);

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
  form.insertBefore(fieldset, submitButton);

  if (!mapsKey) {
    status.textContent = 'Location search is not available yet.';
    return fieldset;
  }

  const previousCallback = window.initPlacesAutocomplete;
  window.initPlacesAutocomplete = async (...args) => {
    const result = previousCallback ? await previousCallback(...args) : undefined;
    await attachPlacesLibrary(inputs, status, submitButton);
    return result;
  };
  return fieldset;
}

/**
 * Mount every field this product needs, in page order, with NO await between
 * them. Returns the parent fieldset (or null) for the submit path.
 *
 * Why this is one synchronous function and not three calls in init(). Fix
 * round 1: mountChildForm() injects the Maps script tag carrying
 * `&callback=initPlacesAutocomplete`, and every field on this page attaches
 * by WRAPPING that one global — the astrocartography places fieldset and the
 * parent's birthplace both chain whatever callback is already installed. An
 * await anywhere between the injection and the last wrapper is a race the
 * script can win: it resolves, Google calls the callback, and a wrapper
 * installed afterwards never runs at all. #parent-birth-city then stays a
 * plain text input and the parent can never choose a birthplace. Declaring
 * this function non-async is the guarantee: nothing inside it can yield, so
 * every wrapper is in place before control returns to init().
 *
 * `profile` is what GET /v1/parent returned (null for its 404), read by the
 * caller before this runs.
 */
export function mountProductFields({ form, newChildFields, submitButton, mapsKey, product, profile }) {
  mountChildForm(newChildFields, { mapsKey });
  // The product's own questions, outside the child block so they are asked
  // for an existing child too (Richard, 2026-09-11).
  mountObservations(form, submitButton, product.intakeQuestions);
  if (isAstrocartography(product)) {
    mountPlaceFields(form, submitButton, mapsKey);
  }
  let parentFields = null;
  if (isParentChild(product)) {
    // The parent's details are asked for once per ACCOUNT, so only when there
    // is no profile yet. The three questions are per grant: always.
    if (needsParentForm(product, profile)) {
      parentFields = mountParentForm(form, submitButton, mapsKey);
    }
    mountRelationshipQuestions(form, submitButton);
  }
  return { parentFields };
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

  // The parent's own profile is read BEFORE anything mounts. Fix round 1:
  // this await used to sit between mountChildForm() and mountParentForm(),
  // which is a race the Maps script can win — see mountProductFields below.
  // A failed read is treated as "not given yet": the API refuses the intake
  // anyway if that is wrong.
  const isPair = isParentChild(product);
  let profile = null;
  if (isPair) {
    try {
      profile = await getParent();
    } catch { /* signed-out is handled by getChildren() below */ }
  }

  const isAstro = isAstrocartography(product);
  const { parentFields } = mountProductFields(
    { form, newChildFields, submitButton, mapsKey, product, profile });

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

    // The profile goes first: without it the API refuses the intake with
    // 409 "add your own birth details first", and a child created just
    // before that refusal would be a row the parent never asked for.
    if (parentFields) {
      try {
        await saveParent(await readParentForm(parentFields, { mapsKey }));
      } catch (err) {
        status.textContent = firstErrorMessage(err);
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
      const relationship = isPair ? readRelationship(form) : undefined;
      const observations = readObservations(form, product.intakeQuestions);
      await submitIntake(Number(grantId), intakeFields(product, childId, { places, relationship, observations }));
      window.location.href = '/portal/';
    } catch (err) {
      status.textContent = firstErrorMessage(err);
    }
  });
}

if (typeof window !== 'undefined') {
  init();
}
