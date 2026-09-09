// child-form.js — the one child-details form shared by portal/intake.html
// (adding a child inline during intake) and portal/children.html (adding a
// child from the children list). Built with createElement/textContent only
// (no innerHTML). R57 (Task 14, fix round 1): before this, children.html's
// static form never filled place_id/lat/lon and always 422'd, and
// intake's new-child block only worked once a Maps key existed — there was
// no live path to add a complete child. One shared mount + one shared read
// fixes both at once.

import { initTobField, tobError } from './timefield.js?v=6e986688';
import { initPlacesAutocomplete, getValidatedLocation } from './autocomplete.js?v=f397273b';

function loadMapsScript(key) {
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&libraries=places&callback=initPlacesAutocomplete`;
  script.async = true;
  document.head.append(script);
}

/**
 * Build the child-details fields into `container`: name, dob, the timefield
 * selects (hidden #tob + #tob-selects), "birth time unknown", and the
 * Places block (#birth-city / #birth-place-id / #location-confirmation).
 * `mapsKey` empty means Places stays hidden with a status line (R53) — no
 * Maps key exists for Wolf Children yet.
 */
export function mountChildForm(container, { mapsKey }) {
  const nameLabel = document.createElement('label');
  nameLabel.htmlFor = 'name';
  nameLabel.textContent = 'Name';
  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.id = 'name';
  nameInput.name = 'name';
  nameInput.required = true;

  // Pronouns (Richard 2026-09-09, Q5): a select with a default, never required.
  // The reading is written with these; the model receives them, never the name.
  const pronounsLabel = document.createElement('label');
  pronounsLabel.htmlFor = 'pronouns';
  pronounsLabel.textContent = 'Pronouns';
  const pronounsSelect = document.createElement('select');
  pronounsSelect.id = 'pronouns';
  pronounsSelect.name = 'pronouns';
  for (const [value, text] of [['they', 'they / them'], ['she', 'she / her'], ['he', 'he / him']]) {
    const opt = document.createElement('option');
    opt.value = value;
    opt.textContent = text;
    pronounsSelect.append(opt);
  }

  const dobLabel = document.createElement('label');
  dobLabel.htmlFor = 'dob';
  dobLabel.textContent = 'Date of birth';
  const dobInput = document.createElement('input');
  dobInput.type = 'date';
  dobInput.id = 'dob';
  dobInput.name = 'dob';
  dobInput.required = true;

  const tobLabel = document.createElement('label');
  tobLabel.textContent = 'Time of birth';
  const tobHidden = document.createElement('input');
  tobHidden.type = 'hidden';
  tobHidden.id = 'tob';
  tobHidden.name = 'tob';
  const tobSelects = document.createElement('div');
  tobSelects.id = 'tob-selects';

  const tobUnknownLabel = document.createElement('label');
  tobUnknownLabel.htmlFor = 'tob-unknown';
  const tobUnknownInput = document.createElement('input');
  tobUnknownInput.type = 'checkbox';
  tobUnknownInput.id = 'tob-unknown';
  tobUnknownInput.name = 'tob_unknown';
  tobUnknownLabel.append(tobUnknownInput, ' Birth time unknown');

  // The parent's own observations (spec addendum 2026-09-09 §3). All optional.
  // They exist so the portrait can point at things the parent has already seen.
  const obs = document.createElement('fieldset');
  obs.id = 'observations';
  const obsLegend = document.createElement('legend');
  obsLegend.textContent = 'What you have noticed (optional)';
  // Richard, 2026-09-09 (option C): the parent is told, where they type, that
  // this text leaves our server. Name substitution is the only stripping.
  const obsWhy = document.createElement('p');
  obsWhy.className = 'small';
  obsWhy.id = 'obs-note';
  obsWhy.textContent = 'These help the portrait point at things you have already seen. Leave any of them blank. '
    + 'What you write here is sent to the writing model together with the chart, with your child’s name removed. '
    + 'Please don’t include other names, places, dates, or anything you would not want a third party to hold. '
    + 'Your child’s name, date of birth and birthplace never leave our server.';
  obs.append(obsLegend, obsWhy);
  const field = (id, labelText, el) => {
    const l = document.createElement('label');
    l.htmlFor = id;
    l.textContent = labelText;
    el.id = id;
    el.name = id;
    obs.append(l, el);
    return el;
  };
  const text = (id, labelText, max) => {
    const ta = document.createElement('textarea');
    ta.maxLength = max;
    ta.rows = 2;
    return field(id, labelText, ta);
  };
  // Three questions (Richard, 2026-09-10), replacing the earlier six.
  text('obs-surprises', 'What does your child do that surprises you?', 300);
  text('obs-hardest', 'Which part of the day is hardest?', 300);
  text('obs-others-wrong', 'What have other people got wrong about your child?', 300);

  const locationFields = document.createElement('div');
  locationFields.id = 'location-fields';
  const cityLabel = document.createElement('label');
  cityLabel.htmlFor = 'birth-city';
  cityLabel.textContent = 'Place of birth';
  const cityInput = document.createElement('input');
  cityInput.type = 'text';
  cityInput.id = 'birth-city';
  cityInput.name = 'birth_city';
  cityInput.autocomplete = 'off';
  cityInput.required = true;
  const placeIdHidden = document.createElement('input');
  placeIdHidden.type = 'hidden';
  placeIdHidden.id = 'birth-place-id';
  placeIdHidden.name = 'place_id';
  const confirmation = document.createElement('p');
  confirmation.id = 'location-confirmation';
  confirmation.hidden = true;
  confirmation.append('Selected: ');
  const resolvedName = document.createElement('span');
  resolvedName.id = 'location-resolved-name';
  confirmation.append(resolvedName);
  locationFields.append(cityLabel, cityInput, placeIdHidden, confirmation);

  const mapsStatus = document.createElement('p');
  mapsStatus.id = 'maps-status';

  container.append(
    nameLabel, nameInput,
    pronounsLabel, pronounsSelect,
    dobLabel, dobInput,
    tobLabel, tobHidden, tobSelects,
    tobUnknownLabel,
    locationFields,
    obs,
    mapsStatus);

  // setChildFormEnabled reads this to decide whether #birth-city may ever be
  // required: with no Maps key the location block is never shown, so it never
  // is. Recorded on the container so the caller does not have to pass the key
  // back in on every visibility change.
  container.dataset.mapsEnabled = mapsKey ? '1' : '0';

  // R58: the selects are mounted after DOMContentLoaded (this module runs on
  // demand, not at page load), so timefield.js's own guarded auto-init never
  // sees them. Wire them explicitly. timefield.js itself is unchanged.
  initTobField('tob');

  if (mapsKey) {
    // Google's callback needs a global function to call.
    window.initPlacesAutocomplete = initPlacesAutocomplete;
    loadMapsScript(mapsKey);
  } else {
    mapsStatus.textContent = 'Location search is not available yet.';
  }

  // Shown, and required, in one call — including the location block's own
  // key gate. Never set `hidden` on any of this by hand; see C1 below.
  setChildFormEnabled(container, true);
}

/**
 * Show or hide the whole child-details block, moving `required` with it.
 *
 * C1, and the reason both forms were dead on arrival: `hidden` does NOT
 * exempt an input from HTML constraint validation. Only `disabled` and
 * `type="hidden"` do. A `required` input the client cannot see therefore
 * makes form.checkValidity() false forever, and the browser cannot show its
 * "Please fill out this field" bubble on an element with no box — so the
 * submit button silently does nothing, with no error anywhere. That was the
 * state of BOTH live forms: children.html hid #location-fields whenever the
 * Maps key was empty (which it is), and intake.html hid the entire new-child
 * fieldset the moment an existing child was chosen. The two attributes must
 * move together, always, which is why this is one exported function and not
 * a `hidden = ...` at each call site.
 */
export function setChildFormEnabled(container, on) {
  container.hidden = !on;

  for (const selector of ['#name', '#dob']) {
    const input = container.querySelector(selector);
    if (input) input.required = on;
  }

  // The location block has a second gate of its own: with no Maps key it stays
  // hidden whatever `on` says, so its input is never required either.
  const mapsEnabled = container.dataset.mapsEnabled === '1';
  const locationFields = container.querySelector('#location-fields');
  const cityInput = container.querySelector('#birth-city');
  if (locationFields) locationFields.hidden = !(on && mapsEnabled);
  if (cityInput) cityInput.required = Boolean(on && mapsEnabled);
}

/**
 * Read the mounted fields back as a ChildIn-shaped payload. tob is nulled
 * when "birth time unknown" is checked. When mapsKey is empty the place
 * fields were never shown, so place_id/lat/lon stay at their defaults —
 * the server's 422 is the guard, same as before this form existed.
 */
export async function readChildForm(container, { mapsKey }) {
  const tobUnknown = container.querySelector('#tob-unknown').checked;

  // C2: an hour and a minute with no AM/PM used to be read as `tob: null,
  // tob_unknown: false` — a birth time the client had entered, thrown away in
  // silence, and a chart drawn on a time nobody chose. tobError() names the
  // missing part; the caller puts the message in the status line.
  if (!tobUnknown) {
    const message = tobError('tob');
    if (message) throw new Error(message);
  }

  // #birth-city is a plain input until the Places element replaces it, and
  // that element is not a text input, so read its value defensively. The
  // mapsKey branch below overwrites place_name from the validated selection
  // anyway — this is only the no-key fallback.
  const cityInput = container.querySelector('#birth-city');
  const typedCity = cityInput && typeof cityInput.value === 'string' ? cityInput.value : '';

  const fields = {
    name: container.querySelector('#name').value,
    dob: container.querySelector('#dob').value,
    pronouns: (container.querySelector('#pronouns') && container.querySelector('#pronouns').value) || 'they',
    observations: readObservations(container),
    tob_unknown: tobUnknown,
    tob: tobUnknown ? null : (container.querySelector('#tob').value || null),
    place_id: '',
    place_name: typedCity,
    lat: null,
    lon: null,
  };

  if (mapsKey) {
    const loc = getValidatedLocation();
    if (!loc) {
      throw new Error('Please select a birth place from the list.');
    }
    fields.place_id = loc.place_id;
    fields.place_name = loc.name;
    fields.lat = loc.lat;
    fields.lon = loc.lon;
    // No tz: the API derives it from these coordinates (timezonefinder).
    // Google's Time Zone API rejects browser keys — decided 2026-09-09.
  }

  return fields;
}

/**
 * The six optional observation fields → the API's ObservationsIn shape, or
 * null when the parent left them all blank. Free text is trimmed and capped
 * client-side as well as server-side.
 */
export function readObservations(container) {
  const q = (sel) => container.querySelector(sel);
  const val = (sel) => { const el = q(sel); return el && typeof el.value === 'string' ? el.value.trim().slice(0, 300) : ''; };
  const o = {
    surprises: val('#obs-surprises') || null,
    hardest_part: val('#obs-hardest') || null,
    others_wrong: val('#obs-others-wrong') || null,
  };
  return (o.surprises || o.hardest_part || o.others_wrong) ? o : null;
}
