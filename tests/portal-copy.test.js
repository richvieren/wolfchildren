// tests/portal-copy.test.js — the wording a parent sees, per
// docs/portal-copy-audit-2026-09-13.md and Richard's decisions that day:
// the passwordless sign-in states, the delivery promise, the confirmation
// step, the remove-child confirmation, and refusals turned into sentences.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createDocument } from './helpers/dom-stub.js';

globalThis.window = globalThis.window || { location: { search: '', pathname: '/portal/' }, history: { replaceState() {} } };
globalThis.localStorage = globalThis.localStorage || { getItem: () => null, setItem() {}, removeItem() {} };

function signInPage() {
  const doc = createDocument();
  const mk = (tag, id) => { const el = doc.createElement(tag); el.id = id; doc.body.appendChild(el); return el; };
  const form = mk('form', 'sign-in-form');
  const email = mk('input', 'email'); email.type = 'email';
  const button = mk('button', 'send-link'); button.textContent = 'Email me a sign-in link';
  form.append(email, button);
  mk('p', 'status'); mk('div', 'signin-ask'); const sent = mk('div', 'link-sent'); sent.hidden = true;
  mk('strong', 'sent-to'); mk('p', 'resend-status'); mk('button', 'send-again'); mk('button', 'change-address');
  return { doc, form, email, button, sent };
}

test('the sign-in button names what happens, and the sent screen names the address', async () => {
  const { wireSignIn } = await import('../assets/js/main-portal.js');
  const { doc, form, email, button, sent } = signInPage();
  const sends = [];
  wireSignIn(doc, async (e) => { sends.push(e); return {}; });
  assert.equal(button.textContent, 'Email me a sign-in link');
  email.value = 'parent@example.com';
  await Promise.all(form.dispatchEvent('submit'));
  assert.deepEqual(sends, ['parent@example.com']);
  assert.equal(sent.hidden, false);
  assert.equal(doc.getElementById('signin-ask').hidden, true);
  assert.equal(doc.getElementById('sent-to').textContent, 'parent@example.com');
  assert.equal(button.disabled, false);
  assert.equal(button.textContent, 'Email me a sign-in link', 'the label comes back after "Sending…"');
});

test('"Send it again" resends to the same address; "Use a different address" brings the form back', async () => {
  const { wireSignIn } = await import('../assets/js/main-portal.js');
  const { doc, form, email, sent } = signInPage();
  const sends = [];
  wireSignIn(doc, async (e) => { sends.push(e); return {}; });
  email.value = 'parent@example.com';
  await Promise.all(form.dispatchEvent('submit'));
  await Promise.all(doc.getElementById('send-again').dispatchEvent('click'));
  assert.deepEqual(sends, ['parent@example.com', 'parent@example.com']);
  assert.match(doc.getElementById('resend-status').textContent, /Sent again to parent@example.com/);
  doc.getElementById('change-address').dispatchEvent('click');
  assert.equal(sent.hidden, true);
  assert.equal(doc.getElementById('signin-ask').hidden, false);
  assert.equal(email.value, '');
});

test('a non-address never reaches the API; a refused send is shown in words', async () => {
  const { wireSignIn } = await import('../assets/js/main-portal.js');
  const { doc, form, email, sent } = signInPage();
  const sends = [];
  wireSignIn(doc, async (e) => { sends.push(e); return { error: 'The sign-in email could not be sent. Please try again in a minute.' }; });
  email.value = 'not an address';
  await Promise.all(form.dispatchEvent('submit'));
  assert.equal(sends.length, 0);
  assert.match(doc.getElementById('status').textContent, /does not look like an email address/);
  email.value = 'parent@example.com';
  await Promise.all(form.dispatchEvent('submit'));
  assert.equal(sent.hidden, true, 'a failed send does not show the sent screen');
  assert.match(doc.getElementById('status').textContent, /could not be sent/);
});

test('the expired-link and signed-out notices are sentences a parent can act on', async () => {
  const { NOTICES } = await import('../assets/js/main-portal.js');
  assert.equal(NOTICES.expired, 'That link has expired or was already used. Enter your email and we send a fresh one.');
  assert.equal(NOTICES['signed-out'], 'You were signed out. Enter your email for a new link.');
});

test('too many links is a sentence, not the API detail (2026-09-13)', async () => {
  const { sendMagicLink, TOO_MANY_LINKS } = await import('../assets/js/auth.js');
  const realFetch = globalThis.fetch;
  globalThis.fetch = async () => ({ ok: false, status: 429, text: async () => JSON.stringify({ detail: 'too many sign-in links — try again later' }) });
  try { assert.equal((await sendMagicLink('p@example.com')).error, TOO_MANY_LINKS); }
  finally { globalThis.fetch = realFetch; }
  assert.match(TOO_MANY_LINKS, /try again in an hour/);
});

test('an empty account is told what to do; sections are named for a parent', async () => {
  const { renderDashboard, EMPTY_DASHBOARD, isEmpty } = await import('../assets/js/main-portal.js');
  const { groupGrants } = await import('../assets/js/dashboard.js');
  const { getProduct } = await import('../assets/js/registry.js');
  const doc = createDocument();
  const dash = doc.createElement('div');
  const groups = groupGrants([getProduct('north-star')], [], []);
  assert.equal(isEmpty(groups), true);
  renderDashboard(dash, groups, doc);
  assert.equal(dash.querySelector('.notice').textContent, EMPTY_DASHBOARD);
  assert.match(EMPTY_DASHBOARD, /different email address/);
  assert.equal(dash.querySelector('h2').textContent, 'Also available');
  const owned = groupGrants([getProduct('north-star')], [{ grant_id: 1, product: 'north-star', child_id: null, edition: 1, has_intake: false, available_at: null }], []);
  assert.equal(isEmpty(owned), false);
  dash.textContent = '';
  renderDashboard(dash, owned, doc);
  assert.equal(dash.querySelector('.notice'), null);
  assert.equal(dash.querySelector('h2').textContent, 'Needs your child’s details');
});

test('every card state says what happens next, with the 24-hour promise', async () => {
  const { COPY, DELIVERY_PROMISE, renderCard, priceLabel } = await import('../assets/js/cards.js');
  const { getProduct } = await import('../assets/js/registry.js');
  assert.equal(DELIVERY_PROMISE, 'We email you when it is ready, within 24 hours.');
  assert.ok(COPY.submitted.status.endsWith(DELIVERY_PROMISE));
  assert.ok(COPY.pending.status.endsWith(DELIVERY_PROMISE));
  assert.equal(COPY.intake.cta, 'Give the details →');
  assert.equal(COPY.ready.cta, 'Download the PDF →');
  const doc = createDocument();
  const locked = renderCard(getProduct('north-star'), null, doc);
  assert.equal(locked.querySelector('.card-price').textContent, '$199');
  assert.equal(locked.querySelector('.card-cta').href, '/readings/north-star/', 'a sales page exists (2026-09-15), so the locked card links it');
  assert.equal(priceLabel({ priceCents: null }), '');
  const ready = renderCard(getProduct('retreat'), { grant_id: 5, edition: 1, has_intake: false, available_at: new Date(Date.now() - 1000).toISOString() }, doc);
  assert.match(ready.querySelector('.card-note').textContent, /share button/);
});

test('the confirmation rows show the child as a parent reads them', async () => {
  const { confirmRows, formatTob, formatDob, successLine } = await import('../assets/js/intake.js');
  assert.equal(formatTob('16:43'), '4:43 PM');
  assert.equal(formatTob('00:05'), '12:05 AM');
  assert.equal(formatTob(''), 'Not given');
  assert.equal(formatDob('1982-06-29'), '29 June 1982');
  const rows = confirmRows({
    child: { name: 'Noor', pronouns: 'she', dob: '2019-04-02', tob: '07:15', tob_unknown: false, place_name: 'Emmen, Netherlands' },
    existing: false, observations: { surprises: 'Sits with a jigsaw for an hour.' },
    questions: [{ key: 'surprises', label: 'What surprises you about her?' }, { key: 'returns_to', label: 'What does she return to?' }],
  });
  assert.deepEqual(rows, [
    ['Child', 'Noor'], ['Boy or girl', 'Girl'], ['Date of birth', '2 April 2019'], ['Time of birth', '7:15 AM'],
    ['Place of birth', 'Emmen, Netherlands'], ['What surprises you about her?', 'Sits with a jigsaw for an hour.'],
  ]);
  const existing = confirmRows({ child: { name: 'Noor' }, existing: true, places: [{ place_name: 'Da Nang' }, { place_name: 'Mallorca' }, { place_name: 'Cape Town' }] });
  assert.deepEqual(existing, [['Child', 'Noor'], ['First place', 'Da Nang'], ['Second place', 'Mallorca'], ['Third place', 'Cape Town']]);
  assert.equal(successLine('Noor', 'p@example.com'), 'Noor’s details are in. We email p@example.com when the reading is ready, within 24 hours.');
});

test('the remove-child confirmation says what the API does', async () => {
  const { removeConfirmText, formatDate } = await import('../assets/js/children.js');
  assert.equal(removeConfirmText('Noor'), 'Remove Noor? The birth details are deleted. Readings already made stay on your dashboard, without the name. This cannot be undone.');
  assert.equal(formatDate('2019-04-02'), '2 April 2019');
});

test('a 422 detail becomes a sentence naming the field in words', async () => {
  const { firstErrorMessage } = await import('../assets/js/api.js');
  const err = new Error('/v1/children failed: 422');
  err.detail = [{ loc: ['body', 'dob'], msg: 'Field required', type: 'missing' }];
  assert.equal(firstErrorMessage(err), 'Something is wrong with the date of birth: Field required.');
  err.detail = [{ loc: ['body', 'tob'], msg: 'Value error, not a time', type: 'value_error' }];
  assert.equal(firstErrorMessage(err), 'Something is wrong with the time of birth: not a time.');
  assert.equal(firstErrorMessage(new Error('signed out')), 'You were signed out. Go back to your readings and sign in again.');
});

test('the birth-time message is about the child and names the checkbox as labelled', async () => {
  const { tobError } = await import('../assets/js/timefield.js');
  const doc = createDocument();
  globalThis.document = doc;
  try {
    for (const [suffix, value] of [['h', '4'], ['m', ''], ['ap', '']]) {
      const el = doc.createElement('select'); el.id = `tob-${suffix}`; el.value = value; doc.body.appendChild(el);
    }
    assert.equal(tobError('tob'), 'The birth time is missing the minutes and AM or PM. Fill in all three, or tick "I do not know the birth time".');
  } finally { delete globalThis.document; }
});
