import test from 'node:test';
import assert from 'node:assert/strict';
// auth.js reads window.location at import (the ?auth_token= handoff); a bare stub is enough here.
globalThis.window = { location: { search: '', pathname: '/portal/' }, history: { replaceState() {} } };
globalThis.localStorage = { getItem: () => null, setItem() {}, removeItem() {} };

test('sendMagicLink turns a non-JSON server error into a plain sentence (2026-09-13: a 500 with a text body)', async () => {
  const { sendMagicLink } = await import('../assets/js/auth.js');
  const realFetch = globalThis.fetch;
  globalThis.fetch = async () => ({ ok: false, status: 500, text: async () => 'Internal Server Error' });
  try {
    const { error } = await sendMagicLink('p@example.com');
    assert.equal(error, 'The sign-in email could not be sent (500). Please try again in a minute.');
  } finally { globalThis.fetch = realFetch; }
});

test('sendMagicLink keeps the API\'s own detail when there is one', async () => {
  const { sendMagicLink } = await import('../assets/js/auth.js');
  const realFetch = globalThis.fetch;
  globalThis.fetch = async () => ({ ok: false, status: 429, text: async () => JSON.stringify({ detail: 'too many sign-in links — try again later' }) });
  try { assert.equal((await sendMagicLink('p@example.com')).error, 'too many sign-in links — try again later'); }
  finally { globalThis.fetch = realFetch; }
});
