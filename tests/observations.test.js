// The product's own intake questions (Richard, 2026-09-11): mounted on the
// intake page for a new or an existing child, read into the intake body.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createDocument } from './helpers/dom-stub.js';
import { getProduct } from '../assets/js/registry.js';
import { mountObservations, readObservations } from '../assets/js/observations.js';

// Same stubs as intake.test.js: intake.js imports auth.js, whose top-level
// code reads window.location on module load.
globalThis.document = createDocument();
globalThis.window = {
  location: { search: '', pathname: '/portal/intake.html', href: '' },
  history: { replaceState: () => {} },
};
globalThis.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
const { intakeFields, mountProductFields } = await import('../assets/js/intake.js');

function freshForm() {
  const doc = createDocument();
  globalThis.document = doc;
  const form = doc.createElement('form');
  const newChildFields = doc.createElement('fieldset');
  newChildFields.id = 'new-child-fields';
  const submitButton = doc.createElement('button');
  form.append(newChildFields, submitButton);
  doc.body.append(form);
  return { doc, form, newChildFields, submitButton };
}

test('the portrait mounts its four questions outside the child block, before the submit button', () => {
  const { doc, form, newChildFields, submitButton } = freshForm();
  mountProductFields({ form, newChildFields, submitButton, mapsKey: '', product: getProduct('lunar-portrait'), profile: null });
  const obs = doc.getElementById('observations');
  assert.ok(obs, 'the questions mount');
  assert.notEqual(obs.parentNode, newChildFields, 'outside the child block, so an existing child still gets them');
  assert.equal(form.childNodes.indexOf(obs), form.childNodes.indexOf(submitButton) - 1, 'right before the submit button');
  assert.deepEqual(['surprises', 'hardest_part', 'others_wrong', 'returns_to'].map((k) => !!doc.getElementById(`obs-${k}`)), [true, true, true, true]);
  assert.match(doc.getElementById('obs-note').textContent, /sent to the writing model/);
});

test('a product with no child questions mounts nothing and sends no observations key', () => {
  // parent-child asks its three relationship questions through its own block;
  // its child-question list is empty by design (Richard, 2026-09-12).
  const { doc, form, newChildFields, submitButton } = freshForm();
  const product = getProduct('parent-child');
  assert.deepEqual(product.intakeQuestions, []);
  mountProductFields({ form, newChildFields, submitButton, mapsKey: '', product, profile: { dob: '1980-01-01', tob: null, tob_unknown: true, place_name: 'A Town' } });
  assert.equal(doc.getElementById('observations'), null, 'no #observations block');
  const observations = readObservations(form, product.intakeQuestions);
  assert.equal(observations, undefined);
  assert.equal('observations' in intakeFields(product, 7, { observations }), false);
});

test('answers are trimmed, capped and keyed; blank throughout is an empty object, still sent', () => {
  const { form, submitButton } = freshForm();
  const q = getProduct('lunar-portrait').intakeQuestions;
  mountObservations(form, submitButton, q);
  form.querySelector('#obs-surprises').value = '  Sits with a jigsaw for an hour.  ';
  form.querySelector('#obs-returns_to').value = 'x'.repeat(400);
  const out = readObservations(form, q);
  assert.deepEqual(Object.keys(out), ['surprises', 'returns_to']);
  assert.equal(out.surprises, 'Sits with a jigsaw for an hour.');
  assert.equal(out.returns_to.length, 300);
  for (const el of form.querySelectorAll('textarea')) el.value = '';
  assert.deepEqual(readObservations(form, q), {});
  assert.deepEqual(intakeFields(getProduct('lunar-portrait'), 7, { observations: {} }), { child_id: 7, observations: {} });
});
