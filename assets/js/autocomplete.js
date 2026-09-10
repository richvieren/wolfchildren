/* autocomplete.js — birth-place selection through PlaceAutocompleteElement,
   Google's web component for the Places API (New).

   R71 (2026-09-09). What this file was: a lift of Cato's widget built on
   google.maps.places.Autocomplete, plus Cato's astrocartography multi-city
   fields (city-1..city-5) and its profile field id (f-city), neither of which
   exists on any Wolf Children page. What it is now: one control, for one
   field, on the current API.

   Why it had to change. Google's Places migration guidance marks the legacy
   Autocomplete widget as not available to new customers: a Cloud project
   created from 2025-03-01 cannot call it at all. Wolf Children has no Maps
   key yet (see child-form.js and <meta name="wc-maps-key">), so its project
   will be a new one, and the legacy widget would have failed on the first
   real key. The documented replacement is PlaceAutocompleteElement:
   https://developers.google.com/maps/documentation/javascript/place-autocomplete-new

   Shape of the control. PlaceAutocompleteElement is its own input, so it
   REPLACES the plain #birth-city text input inside #location-fields and takes
   that id over. <label for="birth-city"> therefore still points at the control
   the client types into.

   No API key lives here. child-form.js loads the Maps script (or does not,
   when no key is configured) and exposes window.initPlacesAutocomplete for the
   script tag's &callback= to call; this module is unaware of the key either
   way. */

let _validatedLocation = null;
let _element = null;

export function getValidatedLocation() {
  return _validatedLocation;
}

export function clearValidatedLocation() {
  _validatedLocation = null;
  const conf = document.getElementById('location-confirmation');
  if (conf) conf.hidden = true;
  const resolved = document.getElementById('location-resolved-name');
  if (resolved) resolved.textContent = '';
  const placeIdField = document.getElementById('birth-place-id');
  if (placeIdField) placeIdField.value = '';
}

function showConfirmation(location) {
  const placeIdField = document.getElementById('birth-place-id');
  if (placeIdField) placeIdField.value = location.place_id;
  const resolved = document.getElementById('location-resolved-name');
  if (resolved) resolved.textContent = location.name;
  const conf = document.getElementById('location-confirmation');
  if (conf) conf.hidden = false;
}

/**
 * Turns a gmp-select event's placePrediction into `{place_id, name, lat,
 * lon}`, or null when it is not a usable selection. Pure — touches no
 * module state (not `_validatedLocation`, not the DOM) — so both this
 * module's own singleton field (birth place) and intake.js's three
 * independent astrocartography fields (Task 7 fix round 1) share the one
 * guard instead of carrying two copies of it.
 *
 * R69: a place that comes back with no id or no coordinates is not a usable
 * selection. The old code let that case fall through to lat 0 / lon 0 — a
 * point in the Gulf of Guinea, stored and charted as the child's birthplace.
 * An invalid selection must read as no selection.
 */
export async function resolveSelectedPlace(placePrediction) {
  if (!placePrediction) return null;

  let place;
  try {
    place = placePrediction.toPlace();
    await place.fetchFields({
      fields: ['id', 'displayName', 'formattedAddress', 'location'],
    });
  } catch {
    return null;
  }

  if (!place || !place.id || !place.location) return null;

  return {
    place_id: place.id,
    name: place.formattedAddress || place.displayName,
    lat: place.location.lat(),
    lon: place.location.lng(),
  };
}

/**
 * gmp-select handler for this module's own singleton (birth-city) field.
 */
async function onSelect({ placePrediction }) {
  const resolved = await resolveSelectedPlace(placePrediction);
  if (!resolved) {
    clearValidatedLocation();
    return;
  }
  _validatedLocation = resolved;
  showConfirmation(_validatedLocation);
}

/**
 * Google Maps callback — called by &callback=initPlacesAutocomplete on the
 * script tag child-form.js injects. Mounts the element into #location-fields.
 */
export async function initPlacesAutocomplete() {
  const host = document.getElementById('location-fields');
  if (!host || _element) return _element;

  const existing = document.getElementById('birth-city');

  let PlaceAutocompleteElement;
  try {
    ({ PlaceAutocompleteElement } = await google.maps.importLibrary('places'));
  } catch {
    const status = document.getElementById('maps-status');
    if (status) status.textContent = 'Location search could not be loaded.';
    return null;
  }

  // includedPrimaryTypes is a documented constructor option; 'locality' is a
  // Place type from table A. A birth place is a town or a city, never a shop.
  const element = new PlaceAutocompleteElement({ includedPrimaryTypes: ['locality'] });
  element.id = 'birth-city';
  // Carry the plain input's required state onto its replacement, so the
  // hidden/required pairing set up by child-form.js survives the swap (C1).
  element.required = Boolean(existing && existing.required);

  if (existing) existing.replaceWith(element);
  else host.append(element);

  element.addEventListener('gmp-select', onSelect);
  // Editing the text after a selection invalidates it: the stored coordinates
  // belong to the place that was picked, not to whatever is in the box now.
  element.addEventListener('input', () => { clearValidatedLocation(); });

  _element = element;
  clearValidatedLocation();
  return element;
}
