// parent-form.js — the parent's OWN birth details, and the three questions
// about the two of them. Parent-child only (Task 9, spec §6).
//
// Two things live here because they appear together and nowhere else:
//
//   1. The parent's birth details. Same three components as a child's (date,
//      the timefield selects with "unknown", a Places birthplace), minus
//      name, pronouns and observations — the reading needs a second chart,
//      not a second child. Saved once per ACCOUNT through PUT /v1/parent, so
//      it is asked for on the first parent-child intake and never again.
//   2. The three relationship questions, per grant, under the same disclosure
//      note the child's four observations carry.
//
// Why not reuse child-form.js's Places wiring: autocomplete.js is a singleton
// for the one #birth-city field, and the child form is on this same page. Two
// callers of one singleton would overwrite each other's selection. This file
// mounts its own field the way intake.js's three astrocartography fields do —
// same Places API, same resolved shape, its own small piece of state.

import { initTobField, tobError } from './timefield.js?v=6e986688';
import { resolveSelectedPlace } from './autocomplete.js?v=d3fe94de';

/** Only parent-child asks for the parent's own chart (spec §6). */
export function isParentChild(product) {
  return Boolean(product && product.slug === 'parent-child');
}

/**
 * Whether to show the parent form at all: parent-child, and only while the
 * account has no profile. `profile` is what GET /v1/parent returned — null
 * for a 404, which is the API's way of saying "not given yet".
 */
export function needsParentForm(product, profile) {
  return isParentChild(product) && !profile;
}

// The three questions, in the spec's order, with the API key each answer is
// sent under. The wording is Richard's, from spec §6.
export const RELATIONSHIP_QUESTIONS = [
  ['rel-easy-hard', 'easy_hard',
   'Tell me about the two of you. What is easy between you, and what is not.'],
  ['rel-goes-wrong', 'goes_wrong',
   'When things go wrong between you, what does that usually look like?'],
  ['rel-wish-understood', 'wish_understood',
   'What do you wish you understood better about them?'],
];

const MAX_ANSWER = 300;

// One module-level selection, like autocomplete.js's own — reset on every
// mountParentForm() call, so a re-mount never inherits a stale place.
let parentPlace = null;

/**
 * Turns the plain #parent-birth-city input into a PlaceAutocompleteElement.
 * Only ever called from inside window.initPlacesAutocomplete (see below), so
 * `google` has already loaded by the time this runs.
 */
async function attachPlacesLibrary(input, status) {
  let PlaceAutocompleteElement;
  try {
    ({ PlaceAutocompleteElement } = await google.maps.importLibrary('places'));
  } catch {
    status.textContent = 'Location search could not be loaded.';
    return;
  }
  const element = new PlaceAutocompleteElement({ includedPrimaryTypes: ['locality'] });
  element.id = input.id;
  element.required = true;
  input.replaceWith(element);

  element.addEventListener('gmp-select', async ({ placePrediction }) => {
    const resolved = await resolveSelectedPlace(placePrediction);
    parentPlace = resolved
      ? { place_id: resolved.place_id, place_name: resolved.name, lat: resolved.lat, lon: resolved.lon }
      : null;
  });
  // Editing the text after a selection invalidates it — the same rule the
  // birth-city field and the three astrocartography fields both follow.
  element.addEventListener('input', () => { parentPlace = null; });
}

function label(doc, forId, text) {
  const l = doc.createElement('label');
  l.htmlFor = forId;
  l.textContent = text;
  return l;
}

/**
 * Build the parent's birth-detail fields into a new fieldset, inserted right
 * before `submitButton`. Returns the fieldset.
 *
 * `mapsKey` empty means the Places block is shown but never required (R53:
 * Wolf Children has no Maps key yet), the same gate child-form.js applies —
 * a `required` field the client cannot complete would make the form
 * unsubmittable with no error anywhere (C1).
 */
export function mountParentForm(form, submitButton, mapsKey) {
  const doc = form.ownerDocument;
  parentPlace = null;

  const fieldset = doc.createElement('fieldset');
  fieldset.id = 'parent-fields';
  const legend = doc.createElement('legend');
  legend.textContent = 'Your own birth details';
  const why = doc.createElement('p');
  why.className = 'small';
  why.id = 'parent-note';
  why.textContent = 'This reading is drawn from both charts, so it needs yours as well as your child’s. '
    + 'You give these once. Your birth details never leave our server: the chart is worked out here, '
    + 'and only the positions go to the writing model.';
  fieldset.append(legend, why);

  const dobInput = doc.createElement('input');
  dobInput.type = 'date';
  dobInput.id = 'parent-dob';
  dobInput.name = 'parent_dob';
  dobInput.required = true;

  const tobHidden = doc.createElement('input');
  tobHidden.type = 'hidden';
  tobHidden.id = 'parent-tob';
  tobHidden.name = 'parent_tob';
  const tobSelects = doc.createElement('div');
  tobSelects.id = 'parent-tob-selects';

  const tobUnknownLabel = doc.createElement('label');
  tobUnknownLabel.htmlFor = 'parent-tob-unknown';
  const tobUnknownInput = doc.createElement('input');
  tobUnknownInput.type = 'checkbox';
  tobUnknownInput.id = 'parent-tob-unknown';
  tobUnknownInput.name = 'parent_tob_unknown';
  tobUnknownLabel.append(tobUnknownInput, ' Birth time unknown');

  const cityInput = doc.createElement('input');
  cityInput.type = 'text';
  cityInput.id = 'parent-birth-city';
  cityInput.autocomplete = 'off';
  cityInput.required = Boolean(mapsKey);

  const status = doc.createElement('p');
  status.id = 'parent-places-status';

  fieldset.append(
    label(doc, 'parent-dob', 'Your date of birth'), dobInput,
    label(doc, 'parent-tob', 'Your time of birth'), tobHidden, tobSelects,
    tobUnknownLabel,
    label(doc, 'parent-birth-city', 'Your place of birth'), cityInput,
    status);
  form.insertBefore(fieldset, submitButton);

  // Mounted after DOMContentLoaded, so timefield.js's own guarded auto-init
  // never sees these selects — wire them explicitly, as child-form.js does.
  initTobField('parent-tob');

  if (!mapsKey) {
    status.textContent = 'Location search is not available yet.';
    return fieldset;
  }
  // Wrap whatever callback is already installed (child-form.js's, and
  // intake.js's places wrapper) rather than replacing it: the Maps script tag
  // calls exactly one global, and every field on this page waits on it.
  const previousCallback = window.initPlacesAutocomplete;
  window.initPlacesAutocomplete = async (...args) => {
    const result = previousCallback ? await previousCallback(...args) : undefined;
    await attachPlacesLibrary(cityInput, status);
    return result;
  };
  return fieldset;
}

/**
 * Read the mounted fields back as the API's ParentIn shape. No name, no
 * pronouns, no tz: the server derives the zone from the coordinates.
 */
export async function readParentForm(container, { mapsKey }) {
  const tobUnknown = container.querySelector('#parent-tob-unknown').checked;
  if (!tobUnknown) {
    // C2: an hour and a minute with no AM/PM is a birth time the client
    // entered and we would otherwise throw away in silence.
    const message = tobError('parent-tob');
    if (message) throw new Error(message);
  }

  const cityInput = container.querySelector('#parent-birth-city');
  const typedCity = cityInput && typeof cityInput.value === 'string' ? cityInput.value : '';

  const fields = {
    dob: container.querySelector('#parent-dob').value,
    tob_unknown: tobUnknown,
    tob: tobUnknown ? null : (container.querySelector('#parent-tob').value || null),
    place_id: '',
    place_name: typedCity,
    lat: null,
    lon: null,
  };

  if (mapsKey) {
    if (!parentPlace) {
      throw new Error('Please select your birth place from the list.');
    }
    fields.place_id = parentPlace.place_id;
    fields.place_name = parentPlace.place_name;
    fields.lat = parentPlace.lat;
    fields.lon = parentPlace.lon;
  }

  return fields;
}

/**
 * Build the three relationship questions into a new fieldset before
 * `submitButton`, under the same disclosure note the child's observations
 * carry: the parent is told, where they type, that this text leaves our
 * server (Richard, 2026-09-09, option C).
 */
export function mountRelationshipQuestions(form, submitButton) {
  const doc = form.ownerDocument;
  const fieldset = doc.createElement('fieldset');
  fieldset.id = 'relationship-fields';
  const legend = doc.createElement('legend');
  legend.textContent = 'The two of you (optional)';
  const note = doc.createElement('p');
  note.className = 'small';
  note.id = 'relationship-note';
  note.textContent = 'These help the reading point at things you have already lived. Leave any of them blank. '
    + 'What you write here is sent to the writing model together with both charts, with your child’s name removed. '
    + 'Please don’t include other names, places, dates, or anything you would not want a third party to hold. '
    + 'Your child’s name, date of birth and birthplace never leave our server.';
  fieldset.append(legend, note);

  for (const [id, , question] of RELATIONSHIP_QUESTIONS) {
    const textarea = doc.createElement('textarea');
    textarea.id = id;
    textarea.name = id;
    textarea.rows = 2;
    textarea.maxLength = MAX_ANSWER;
    fieldset.append(label(doc, id, question), textarea);
  }
  form.insertBefore(fieldset, submitButton);
  return fieldset;
}

/**
 * The three answers in the API's RelationshipIn shape. Trimmed and capped
 * client-side as well as server-side; a blank answer is null, and all three
 * blank is still an object — the object is what parent-child requires, not
 * any one answer.
 */
export function readRelationship(container) {
  const answers = {};
  for (const [id, key] of RELATIONSHIP_QUESTIONS) {
    const el = container.querySelector(`#${id}`);
    const value = el && typeof el.value === 'string' ? el.value.trim().slice(0, MAX_ANSWER) : '';
    answers[key] = value || null;
  }
  return answers;
}
