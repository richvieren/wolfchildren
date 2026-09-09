// intake.js — portal/intake.html: one parameterised intake form for every
// generated product (Task 14). Reads ?product= and ?grant= from the URL,
// looks the product up in registry.js, and refuses to render a form for a
// product whose requiresIntake is false. Cato had a separate HTML file per
// product; this one form serves all five reading products.
//
// R53: there is no Google Maps key for Wolf Children yet, and Cato's must
// not be reused. The key lives in <meta name="wc-maps-key">, empty for now.
// R57 (fix round 1): the new-child fields are the shared child-form.js
// component, also used by children.js — see that file for the Places/tz
// wiring.

import { getSession } from './auth.js?v=96b93ff5';
import { getProduct } from './registry.js?v=b323975a';
import { getChildren, addChild, submitIntake } from './api.js?v=c3ed6e8e';
import { clearValidatedLocation } from './autocomplete.js?v=20ebbbda';
import { mountChildForm, readChildForm } from './child-form.js?v=ff8752de';

/** FastAPI's 422 detail is a list of {loc, msg, type}; render the first msg. */
function firstErrorMessage(err) {
  const detail = err && err.detail;
  if (Array.isArray(detail) && detail.length && detail[0] && detail[0].msg) return detail[0].msg;
  if (typeof detail === 'string' && detail) return detail;
  return (err && err.message) || 'Something went wrong.';
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

  const mapsKeyMeta = document.querySelector('meta[name="wc-maps-key"]');
  const mapsKey = (mapsKeyMeta && mapsKeyMeta.content) || '';

  const existingSelect = document.getElementById('existing-child');
  const newChildFields = document.getElementById('new-child-fields');
  const status = document.getElementById('status');

  mountChildForm(newChildFields, { mapsKey });

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
      await submitIntake(Number(grantId), { child_id: childId });
      window.location.href = '/portal/';
    } catch (err) {
      status.textContent = firstErrorMessage(err);
    }
  });
}

init();
