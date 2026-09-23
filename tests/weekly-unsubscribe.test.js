// tests/weekly-unsubscribe.test.js — the no-sign-in unsubscribe (Richard, 2026-09-23).
//
// The footer of every weekly email carries a signed link. Opening it turns the weekly emails off
// without a session and without asking for an email address. The report stays in the portal either
// way, and the page shows nothing about the child (spec §10).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderAll } from '../build.mjs';
import { createDocument } from './helpers/dom-stub.js';
import { wireUnsubscribe, COPY, ENDPOINT } from '../assets/js/weekly-unsubscribe.js';

const pages = await renderAll();
const page = pages.find((p) => p.path === '/weekly/unsubscribe/');

test('the page is built, noindex, and sells nothing', () => {
  assert.ok(page, 'no page at /weekly/unsubscribe/');
  assert.match(page.html, /name="robots" content="noindex/);
  assert.ok(!/\$\d/.test(page.html), 'no price on an unsubscribe page');
  assert.match(page.html, /id="weekly-unsubscribe-status"/);
});

function mounted(search) {
  const doc = createDocument();
  const status = doc.createElement('p');
  status.id = 'weekly-unsubscribe-status';
  doc.body.append(status);
  return { doc, status, search };
}

test('a good token turns the emails off and says the report stays', async () => {
  const { doc, status } = mounted('?token=abc.def.ghi');
  const calls = [];
  await wireUnsubscribe(doc, {
    search: '?token=abc.def.ghi',
    fetchFn: async (url, opts) => { calls.push([url, JSON.parse(opts.body)]); return { ok: true, status: 200, json: async () => ({ ok: true, already: false }) }; },
  });
  assert.deepEqual(calls, [[ENDPOINT, { token: 'abc.def.ghi' }]]);
  assert.equal(status.textContent, COPY.done);
  assert.match(COPY.done, /report stays/i);
});

test('a token that was already used says the emails were already off', async () => {
  const { doc, status } = mounted('?token=abc');
  await wireUnsubscribe(doc, {
    search: '?token=abc',
    fetchFn: async () => ({ ok: true, status: 200, json: async () => ({ ok: true, already: true }) }),
  });
  assert.equal(status.textContent, COPY.already);
});

test('a refused or broken token says so, with the support address', async () => {
  const { doc, status } = mounted('?token=bad');
  await wireUnsubscribe(doc, {
    search: '?token=bad',
    fetchFn: async () => ({ ok: false, status: 400, json: async () => ({ detail: 'that link is not valid' }) }),
  });
  assert.match(status.textContent, /hello@wolfchildren\.co/);
  assert.match(status.textContent, /not valid|did not work/i);
});

test('a link with no token asks the parent to use the one in the email', async () => {
  const { doc, status } = mounted('');
  let called = false;
  await wireUnsubscribe(doc, { search: '', fetchFn: async () => { called = true; } });
  assert.equal(called, false, 'nothing is sent without a token');
  assert.equal(status.textContent, COPY.noToken);
});

test('the network falling over is a plain sentence, not a stack trace', async () => {
  const { doc, status } = mounted('?token=abc');
  await wireUnsubscribe(doc, { search: '?token=abc', fetchFn: async () => { throw new Error('offline'); } });
  assert.match(status.textContent, /hello@wolfchildren\.co/);
});
