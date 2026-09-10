// tests/parent-form.test.js — Task 9: the parent's own birth details and the
// three relationship questions, on portal/intake.html for parent-child only.
//
// Same shape as tests/intake.test.js: the page-entry module self-invokes, so
// these tests drive the exported helpers directly against the stub DOM.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createDocument } from './helpers/dom-stub.js';
import { getProduct } from '../assets/js/registry.js';
import {
  isParentChild, needsParentForm, mountParentForm, readParentForm,
  mountRelationshipQuestions, readRelationship, RELATIONSHIP_QUESTIONS,
} from '../assets/js/parent-form.js';

// intake.js self-invokes init() on import. The same three stubs
// tests/intake.test.js installs keep that inert here (no session, so init()
// redirects and returns); every test below drives an exported helper.
globalThis.document = createDocument();
globalThis.window = {
  location: { search: '', pathname: '/portal/intake.html', href: '' },
  history: { replaceState: () => {} },
};
globalThis.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };

const { intakeFields } = await import('../assets/js/intake.js');

function freshForm() {
  const doc = createDocument();
  globalThis.document = doc;
  const form = doc.createElement('form');
  form.id = 'intake-form';
  const submitButton = doc.createElement('button');
  submitButton.type = 'submit';
  form.append(submitButton);
  doc.body.appendChild(form);
  return { doc, form, submitButton };
}

// ─── when it mounts ─────────────────────────────────────────────────────────

test('isParentChild is true only for the parent-child product', () => {
  assert.equal(isParentChild(getProduct('parent-child')), true);
  assert.equal(isParentChild(getProduct('astrocartography')), false);
  assert.equal(isParentChild(getProduct('lunar-portrait')), false);
  assert.equal(isParentChild(undefined), false);
});

test('the parent form is needed for parent-child with no profile', () => {
  assert.equal(needsParentForm(getProduct('parent-child'), null), true);
});

test('the parent form is not needed once a profile exists', () => {
  const profile = { dob: '1982-06-29', tob: '16:43', tob_unknown: false, place_name: 'A Town' };
  assert.equal(needsParentForm(getProduct('parent-child'), profile), false);
});

test('the parent form is never needed for another product', () => {
  assert.equal(needsParentForm(getProduct('transits'), null), false);
  assert.equal(needsParentForm(getProduct('astrocartography'), null), false);
});

// ─── the fields ─────────────────────────────────────────────────────────────

test('mountParentForm builds date, time and birthplace fields before the button', () => {
  const { form, submitButton } = freshForm();
  const fieldset = mountParentForm(form, submitButton, '');
  assert.ok(fieldset.querySelector('#parent-dob'), 'a date of birth');
  assert.ok(fieldset.querySelector('#parent-tob'), 'the canonical hidden time input');
  assert.ok(fieldset.querySelector('#parent-tob-selects'), 'the three time selects mount');
  assert.ok(fieldset.querySelector('#parent-tob-unknown'), 'birth time unknown');
  assert.ok(fieldset.querySelector('#parent-birth-city'), 'the birthplace field');
  assert.equal(form.children.indexOf(fieldset) < form.children.indexOf(submitButton), true);
});

test('mountParentForm asks for no name and no pronouns', () => {
  const { form, submitButton } = freshForm();
  const fieldset = mountParentForm(form, submitButton, '');
  assert.equal(fieldset.querySelector('#parent-name'), null);
  assert.equal(fieldset.querySelector('#parent-pronouns'), null);
});

test('with no Maps key the birthplace is not required and says so', () => {
  const { form, submitButton } = freshForm();
  const fieldset = mountParentForm(form, submitButton, '');
  assert.equal(fieldset.querySelector('#parent-birth-city').required, false);
  assert.match(fieldset.querySelector('#parent-places-status').textContent, /not available/i);
  assert.equal(form.checkValidity(), false, 'the date of birth is still required and empty');
});

test('readParentForm reads the birth details, with no tz', async () => {
  const { form, submitButton } = freshForm();
  const fieldset = mountParentForm(form, submitButton, '');
  fieldset.querySelector('#parent-dob').value = '1982-06-29';
  fieldset.querySelector('#parent-tob').value = '16:43';
  const fields = await readParentForm(fieldset, { mapsKey: '' });
  assert.equal(fields.dob, '1982-06-29');
  assert.equal(fields.tob, '16:43');
  assert.equal(fields.tob_unknown, false);
  assert.ok(!('tz' in fields), 'tz is derived by the API, never sent');
  assert.ok(!('name' in fields), 'the parent has no name field');
});

test('readParentForm nulls the time when the parent does not know it', async () => {
  const { form, submitButton } = freshForm();
  const fieldset = mountParentForm(form, submitButton, '');
  fieldset.querySelector('#parent-dob').value = '1982-06-29';
  fieldset.querySelector('#parent-tob').value = '16:43';
  fieldset.querySelector('#parent-tob-unknown').checked = true;
  const fields = await readParentForm(fieldset, { mapsKey: '' });
  assert.equal(fields.tob, null);
  assert.equal(fields.tob_unknown, true);
});

// ─── the three questions ────────────────────────────────────────────────────

test('the three relationship questions mount under the same disclosure note', () => {
  const { form, submitButton } = freshForm();
  const fieldset = mountRelationshipQuestions(form, submitButton);
  const note = fieldset.querySelector('#relationship-note');
  assert.ok(note, 'the disclosure note is there');
  assert.match(note.textContent, /sent to the writing model/);
  assert.match(note.textContent, /never leave our server/);
  assert.equal(RELATIONSHIP_QUESTIONS.length, 3);
  for (const id of ['rel-easy-hard', 'rel-goes-wrong', 'rel-wish-understood']) {
    const ta = fieldset.querySelector(`#${id}`);
    assert.ok(ta, id);
    assert.equal(ta.maxLength, 300);
    assert.equal(ta.required, false, 'each answer is optional on its own');
  }
});

test('readRelationship returns the three answers, trimmed and capped', () => {
  const { form, submitButton } = freshForm();
  const fieldset = mountRelationshipQuestions(form, submitButton);
  fieldset.querySelector('#rel-easy-hard').value = '  Bedtime is easy. Mornings are not.  ';
  fieldset.querySelector('#rel-goes-wrong').value = 'x'.repeat(400);
  const answers = readRelationship(fieldset);
  assert.equal(answers.easy_hard, 'Bedtime is easy. Mornings are not.');
  assert.equal(answers.goes_wrong.length, 300);
  assert.equal(answers.wish_understood, null);
});

test('readRelationship returns an object even when every answer is blank', () => {
  const { form, submitButton } = freshForm();
  const fieldset = mountRelationshipQuestions(form, submitButton);
  const answers = readRelationship(fieldset);
  assert.deepEqual(answers, { easy_hard: null, goes_wrong: null, wish_understood: null });
});

// ─── the intake payload ─────────────────────────────────────────────────────

test('the payload carries relationship for parent-child only', () => {
  const relationship = { easy_hard: 'Bedtime is easy.', goes_wrong: null, wish_understood: null };
  assert.deepEqual(
    intakeFields(getProduct('parent-child'), 7, { relationship }),
    { child_id: 7, relationship });
  assert.deepEqual(
    intakeFields(getProduct('transits'), 7, { relationship }),
    { child_id: 7 });
});

test('the payload still carries places for astrocartography only', () => {
  const places = [{ place_id: 'a' }, { place_id: 'b' }, { place_id: 'c' }];
  const relationship = { easy_hard: 'x', goes_wrong: null, wish_understood: null };
  assert.deepEqual(
    intakeFields(getProduct('astrocartography'), 7, { places, relationship }),
    { child_id: 7, places });
  assert.deepEqual(
    intakeFields(getProduct('lunar-portrait'), 7, { places }),
    { child_id: 7 });
});
