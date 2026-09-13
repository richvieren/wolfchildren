// tests/signup.test.js — the moon-calendar form (docs/loops-signup-form.md):
// posts to Richard's Loops form with the user group, carries his two lines,
// fetches no external font, and handles Loops' three answers.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { signup, LOOPS, COPY } from '../src/lib/signup.mjs';
import { wireSignup } from '../assets/js/signup.js';
import { createDocument } from './helpers/dom-stub.js';

const html = String(signup({ heading: 'The 2027 moon calendar' }));

test('the form posts to the Loops endpoint with the user group and the source', () => {
  assert.match(html, /action="https:\/\/app\.loops\.so\/api\/newsletter-form\/cmtvjqaud00wt0jyxzp5aaehs"/);
  assert.match(html, /name="userGroup" value="moon-calendar-en"/);
  assert.match(html, /name="source" value="wolfchildren\.co homepage"/);
  assert.match(html, /name="email"[^>]*required/);
  assert.equal(LOOPS.formId, 'cmtvjqaud00wt0jyxzp5aaehs');
});

test('the button and the success line are Richard\'s words', () => {
  assert.ok(html.includes('>Send me the calendar</button>'));
  assert.ok(html.includes('Check your inbox. The calendar is on its way.'));
  assert.equal(COPY.button, 'Send me the calendar');
});

test('no external font, stylesheet or script: the Loops embed\'s Google Fonts import is not carried over', () => {
  assert.ok(!/fonts\.googleapis\.com|fonts\.gstatic\.com|@import|<link|<style|<script/.test(html), html);
});

function mounted() {
  const doc = createDocument();
  const section = doc.createElement('section');
  const form = doc.createElement('form');
  form.setAttribute('action', LOOPS.endpoint); form.action = LOOPS.endpoint;
  const group = doc.createElement('input'); group.name = 'userGroup'; group.value = LOOPS.userGroup; group.setAttribute('name', 'userGroup');
  const email = doc.createElement('input'); email.name = 'email'; email.value = 'p@example.com'; email.setAttribute('name', 'email');
  const button = doc.createElement('button'); button.type = 'submit'; button.setAttribute('type', 'submit');
  form.append(group, email, button);
  const status = doc.createElement('p'); status.setAttribute('data-signup-status', '');
  const success = doc.createElement('p'); success.setAttribute('data-signup-success', ''); success.hidden = true;
  section.append(form, status, success);
  return { form, status, success, button };
}

test('a 200 {success:true} hides the form and shows the success line', async () => {
  const { form, status, success } = mounted();
  const calls = [];
  wireSignup(form, { fetchFn: async (url, init) => { calls.push({ url, init }); return { ok: true, status: 200, json: async () => ({ success: true }) }; } });
  await Promise.all(form.dispatchEvent('submit'));
  assert.equal(calls[0].url, LOOPS.endpoint);
  assert.equal(calls[0].init.headers['Content-Type'], 'application/x-www-form-urlencoded');
  assert.equal(calls[0].init.body, 'userGroup=moon-calendar-en&email=p%40example.com');
  assert.equal(form.hidden, true);
  assert.equal(success.hidden, false);
  assert.equal(status.textContent, '');
});

test('a 429 and a failure each get a sentence, and the form stays', async () => {
  for (const [res, expected] of [
    [{ ok: false, status: 429, json: async () => ({}) }, /Too many signups/],
    [{ ok: false, status: 400, json: async () => ({ success: false, message: 'Invalid email' }) }, /did not go through/],
  ]) {
    const { form, status, success, button } = mounted();
    wireSignup(form, { fetchFn: async () => res });
    await Promise.all(form.dispatchEvent('submit'));
    assert.match(status.textContent, expected);
    assert.equal(form.hidden, false);
    assert.equal(success.hidden, true);
    assert.equal(button.disabled, false);
  }
});
