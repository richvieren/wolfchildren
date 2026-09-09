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

export const submitIntake = (grantId, fields) =>
  request('/v1/intake', {
    method: 'POST',
    body: JSON.stringify({ grant_id: grantId, ...fields }),
  });

export const getDownloadUrl = (grantId) =>
  request(`/v1/download/${grantId}`).then((r) => `${API_BASE}${r.url}`);

/**
 * The message to put in front of a client for a thrown request error.
 * FastAPI's 422 detail is a list of {loc, msg, type}; its other errors put a
 * plain string there. Everything else falls back to the Error's own message.
 *
 * Lives here, next to the thrower, because every caller needs it: children.js
 * used to render api.js's internal "/v1/children failed: 422" straight into
 * the page (I5), while intake.js had its own private copy of this function.
 */
export function firstErrorMessage(err) {
  const detail = err && err.detail;
  if (Array.isArray(detail) && detail.length && detail[0] && detail[0].msg) return detail[0].msg;
  if (typeof detail === 'string' && detail) return detail;
  return (err && err.message) || 'Something went wrong.';
}
