// child-form.js — the one child-details form shared by portal/intake.html
// (adding a child inline during intake) and portal/children.html (adding a
// child from the children list). Built with createElement/textContent only
// (no innerHTML). R57 (Task 14, fix round 1): before this, children.html's
// static form never filled place_id/lat/lon/tz and always 422'd, and
// intake's new-child block only worked once a Maps key existed — there was
// no live path to add a complete child. One shared mount + one shared read
// fixes both at once.

import { initTobField } from './timefield.js?v=5b5948bd';
import { initPlacesAutocomplete, getValidatedLocation } from './autocomplete.js?v=20ebbbda';

function loadMapsScript(key) {
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&libraries=places&callback=initPlacesAutocomplete`;
  script.async = true;
  document.head.append(script);
}

/**
 * Timezone for a validated, autocomplete-selected coordinate pair, via
 * Google's Time Zone API on the SAME key already loaded for Places. This is
 * a lookup on the coordinates the client already confirmed by picking a
 * place from the list — never a second, independent geocode of a typed
 * city name (CLAUDE.md: use what you validated).
 */
async function resolveTimezone(lat, lon, key) {
  const url = `https://maps.googleapis.com/maps/api/timezone/json` +
    `?location=${lat},${lon}&timestamp=${Math.floor(Date.now() / 1000)}` +
    `&key=${encodeURIComponent(key)}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.status !== 'OK' || !data.timeZoneId) throw new Error('timezone lookup failed');
  return data.timeZoneId;
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
    dobLabel, dobInput,
    tobLabel, tobHidden, tobSelects,
    tobUnknownLabel,
    locationFields,
    mapsStatus);

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
    locationFields.hidden = true;
  }
}

/**
 * Read the mounted fields back as a ChildIn-shaped payload. tob is nulled
 * when "birth time unknown" is checked. When mapsKey is empty the place
 * fields were never shown, so place_id/lat/lon/tz stay at their defaults —
 * the server's 422 is the guard, same as before this form existed.
 */
export async function readChildForm(container, { mapsKey }) {
  const tobUnknown = container.querySelector('#tob-unknown').checked;
  const fields = {
    name: container.querySelector('#name').value,
    dob: container.querySelector('#dob').value,
    tob_unknown: tobUnknown,
    tob: tobUnknown ? null : (container.querySelector('#tob').value || null),
    place_id: '',
    place_name: container.querySelector('#birth-city').value,
    lat: null,
    lon: null,
    tz: '',
  };

  if (mapsKey) {
    const loc = getValidatedLocation();
    if (!loc) {
      throw new Error('Please select a birth place from the list.');
    }
    let tz;
    try {
      tz = await resolveTimezone(loc.lat, loc.lon, mapsKey);
    } catch {
      throw new Error('Could not determine the timezone for that location. Please try selecting it again.');
    }
    fields.place_id = loc.place_id;
    fields.place_name = loc.display;
    fields.lat = loc.lat;
    fields.lon = loc.lon;
    fields.tz = tz;
  }

  return fields;
}
