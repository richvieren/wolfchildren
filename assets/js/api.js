// api.js — every call to the portal API. No DOM, no product names.
// One getGrants() replaces Cato's six per-product grant calls.

const API_BASE = 'https://api.wolfchildren.co';

function authHeaders() {
  const token = localStorage.getItem('wc_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, options = {}) {
  // Content-Type only when there IS a body. A GET or a bodiless DELETE that
  // declares application/json is not a simple request, so the browser fires a
  // CORS preflight for it — a second round trip, on every read, for a header
  // describing a body that does not exist.
  const headers = { ...authHeaders(), ...(options.headers || {}) };
  if (options.body !== undefined && headers['Content-Type'] === undefined) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (res.status === 401) {
    localStorage.removeItem('wc_token');
    localStorage.removeItem('wc_user');
    throw new Error('signed out');
  }
  if (!res.ok) {
    // Carry the response body's `detail` on the thrown Error so a caller can
    // render FastAPI's 422 validation detail readably (Task 14) instead of
    // just "/v1/children failed: 422". Existing callers that only read
    // `.message` are unaffected.
    let detail;
    try { detail = (await res.json()).detail; } catch { /* no JSON body */ }
    const err = new Error(`${path} failed: ${res.status}`);
    err.detail = detail;
    // Task 9: getParent() has to tell a 404 ("no profile yet", a normal
    // state) from every other failure, and the message string is not
    // something to branch on.
    err.status = res.status;
    throw err;
  }
  return res.json();
}

export const getGrants   = () => request('/v1/grants');
export const getChildren = () => request('/v1/children');

export const addChild = (fields) =>
  request('/v1/children', { method: 'POST', body: JSON.stringify(fields) });

export const deleteChild = (id) =>
  request(`/v1/children/${id}`, { method: 'DELETE' });

/**
 * The account holder's own birth details, or null when they have not given
 * them yet. A 404 here is not an error: it is how the API says "ask for
 * them" (Task 9, parent-child).
 */
export const getParent = () =>
  request('/v1/parent').catch((err) => {
    if (err && err.status === 404) return null;
    throw err;
  });

export const saveParent = (fields) =>
  request('/v1/parent', { method: 'PUT', body: JSON.stringify(fields) });

export const submitIntake = (grantId, fields) =>
  request('/v1/intake', {
    method: 'POST',
    body: JSON.stringify({ grant_id: grantId, ...fields }),
  });

export const getDownloadUrl = (grantId) =>
  request(`/v1/download/${grantId}`).then((r) => `${API_BASE}${r.url}`);

// 2026-09-23: the parent's own retry for a reading whose job ran out of attempts (audit item 5).
export const retryGrant = (grantId) =>
  request(`/v1/grants/${grantId}/retry`, { method: 'POST' });

// 2026-09-23: the weekly emails for a year-long reading, off and on. The notes themselves stay in
// the portal either way; this only decides whether an email says a new one is there.
export const setWeekly = (grantId, on) =>
  request(`/v1/grants/${grantId}/weekly`, { method: 'POST', body: JSON.stringify({ on }) });

// One week's note, read from the portal (never sent by email: spec §10).
export const getWeekly = (grantId) => request(`/v1/grants/${grantId}/weekly`);

/**
 * The message to put in front of a client for a thrown request error.
 * FastAPI's 422 detail is a list of {loc, msg, type}; its other errors put a
 * plain string there. Everything else falls back to the Error's own message.
 *
 * Lives here, next to the thrower, because every caller needs it: children.js
 * used to render api.js's internal "/v1/children failed: 422" straight into
 * the page (I5), while intake.js had its own private copy of this function.
 */
const FIELD_NAMES = {
  name: 'the child’s name', dob: 'the date of birth', tob: 'the time of birth', pronouns: 'boy or girl',
  place_id: 'the place of birth', place_name: 'the place of birth', lat: 'the place of birth', lon: 'the place of birth',
  email: 'the email address', places: 'the three places', observations: 'your answers', relationship: 'your answers',
};

export function firstErrorMessage(err) {
  if (err && err.message === 'signed out') return 'You were signed out. Go back to your readings and sign in again.';
  const detail = err && err.detail;
  if (Array.isArray(detail) && detail.length && detail[0] && detail[0].msg) {
    // FastAPI's 422 detail: {loc: ['body', 'dob'], msg: 'Field required'}. The
    // field is named in words and the reason kept, so the parent knows what
    // to fix without reading a schema.
    const loc = Array.isArray(detail[0].loc) ? detail[0].loc.filter((x) => typeof x === 'string' && x !== 'body') : [];
    const field = FIELD_NAMES[loc[loc.length - 1]] || (loc.length ? loc[loc.length - 1] : '');
    const reason = String(detail[0].msg).replace(/^Value error, /, '');
    return field ? `Something is wrong with ${field}: ${reason}.` : `${reason}.`;
  }
  if (typeof detail === 'string' && detail) return detail;
  return (err && err.message) || 'Something went wrong. Try again in a minute.';
}
