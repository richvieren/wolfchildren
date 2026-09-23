// weekly-unsubscribe.js — the link in the footer of every weekly email.
//
// Richard, 2026-09-23: the link needs no sign-in. It carries a signed token, and this page hands
// that token to the API and says what happened. Nothing about the child is on this page, no email
// address is asked for, and the report stays in the portal either way (spec §10).

const API_BASE = 'https://api.wolfchildren.co';
export const ENDPOINT = `${API_BASE}/v1/weekly/unsubscribe`;
const SUPPORT = 'hello@wolfchildren.co';

export const COPY = {
  working: 'One moment…',
  done: 'The weekly emails are off. Your report stays in your portal, and so does every note.',
  already: 'The weekly emails were already off. Your report stays in your portal.',
  noToken: `This link is missing its code. Open the link in the email itself, or write to ${SUPPORT} and we will turn them off for you.`,
  failed: `That link did not work. It may have been replaced by a newer email. Write to ${SUPPORT} and we will turn them off for you.`,
};

export async function wireUnsubscribe(doc, { search = '', fetchFn = fetch } = {}) {
  const status = doc.getElementById('weekly-unsubscribe-status');
  if (!status) return;
  const token = new URLSearchParams(search).get('token');
  if (!token) {
    status.textContent = COPY.noToken;
    return;
  }
  status.textContent = COPY.working;
  try {
    const res = await fetchFn(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    let data = {};
    try { data = await res.json(); } catch { data = {}; }
    if (!res.ok || data.ok !== true) {
      status.textContent = COPY.failed;
      return;
    }
    status.textContent = data.already ? COPY.already : COPY.done;
  } catch {
    status.textContent = COPY.failed;
  }
}

if (typeof document !== 'undefined' && document.getElementById('weekly-unsubscribe-status')) {
  wireUnsubscribe(document, { search: window.location.search });
}
