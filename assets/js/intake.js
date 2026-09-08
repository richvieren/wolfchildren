// intake.js — portal/intake.html: one parameterised intake form for every
// generated product (Task 14). Reads ?product= and ?grant= from the URL,
// looks the product up in registry.js, and refuses to render a form for a
// product whose requiresIntake is false. Cato had a separate HTML file per
// product; this one form serves all five reading products.
//
// R53: there is no Google Maps key for Wolf Children yet, and Cato's must
// not be reused. The key lives in <meta name="wc-maps-key">, empty for now.
// When it is empty, the Maps script is never loaded, the place fields stay
// hidden, and a status line says so — that is not an error state. Richard
// adds the key in a later commit.

import { getSession } from './auth.js?v=96b93ff5';
import { getProduct } from './registry.js?v=b323975a';
import { getChildren, addChild, submitIntake } from './api.js?v=c3ed6e8e';
import { initTobField } from './timefield.js?v=5b5948bd';
import { initPlacesAutocomplete, getValidatedLocation, clearValidatedLocation } from './autocomplete.js?v=20ebbbda';

// Google's Maps script callback (&callback=initPlacesAutocomplete) needs a
// global function to call — autocomplete.js only exports a module binding.
window.initPlacesAutocomplete = initPlacesAutocomplete;

/** FastAPI's 422 detail is a list of {loc, msg, type}; render the first msg. */
function firstErrorMessage(err) {
  const detail = err && err.detail;
  if (Array.isArray(detail) && detail.length && detail[0] && detail[0].msg) return detail[0].msg;
  if (typeof detail === 'string' && detail) return detail;
  return (err && err.message) || 'Something went wrong.';
}

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

  const product = productSlug ? getProduct(productSlug) : undefined;
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

  // Maps key loader (R53) — no key means no script, no place fields.
  const mapsKeyMeta = document.querySelector('meta[name="wc-maps-key"]');
  const mapsKey = (mapsKeyMeta && mapsKeyMeta.content) || '';
  const mapsStatus = document.getElementById('maps-status');
  const locationFields = document.getElementById('location-fields');
  if (mapsKey) {
    loadMapsScript(mapsKey);
  } else {
    mapsStatus.textContent = 'Location search is not available yet.';
    locationFields.hidden = true;
  }

  const existingSelect = document.getElementById('existing-child');
  const newChildFields = document.getElementById('new-child-fields');
  const status = document.getElementById('status');

  const children = await getChildren();
  for (const child of children) {
    const option = document.createElement('option');
    option.value = String(child.id);
    option.textContent = child.name;
    existingSelect.append(option);
  }

  function syncNewChildVisibility() {
    newChildFields.hidden = existingSelect.value !== '';
  }
  existingSelect.addEventListener('change', () => {
    syncNewChildVisibility();
    if (existingSelect.value !== '') clearValidatedLocation();
  });
  syncNewChildVisibility();

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.textContent = '';

    let childId = existingSelect.value ? Number(existingSelect.value) : null;

    if (!childId) {
      const nameField = document.getElementById('name');
      const dobField = document.getElementById('dob');
      const tobUnknown = document.getElementById('tob-unknown').checked;
      const tobField = document.getElementById('tob');
      const birthCity = document.getElementById('birth-city');

      const fields = {
        name: nameField.value,
        dob: dobField.value,
        tob_unknown: tobUnknown,
        tob: tobUnknown ? null : (tobField.value || null),
        place_id: '',
        place_name: birthCity.value,
        lat: null,
        lon: null,
        tz: '',
      };

      if (mapsKey) {
        const loc = getValidatedLocation();
        if (!loc) {
          status.textContent = 'Please select a birth place from the list.';
          return;
        }
        let tz;
        try {
          tz = await resolveTimezone(loc.lat, loc.lon, mapsKey);
        } catch {
          status.textContent = 'Could not determine the timezone for that location. Please try selecting it again.';
          return;
        }
        fields.place_id = loc.place_id;
        fields.place_name = loc.display;
        fields.lat = loc.lat;
        fields.lon = loc.lon;
        fields.tz = tz;
      }

      try {
        const child = await addChild(fields);
        childId = child.id;
      } catch (err) {
        status.textContent = firstErrorMessage(err);
        return;
      }
    }

    try {
      await submitIntake(Number(grantId), { child_id: childId });
      window.location.href = '/portal/';
    } catch (err) {
      status.textContent = firstErrorMessage(err);
    }
  });
}

init();
