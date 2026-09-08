// api.js — every call to the portal API. No DOM, no product names.
// One getGrants() replaces Cato's six per-product grant calls.

const API_BASE = 'https://api.wolfchildren.co';

function authHeaders() {
  const token = localStorage.getItem('wc_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...(options.headers || {}),
    },
  });
  if (res.status === 401) {
    localStorage.removeItem('wc_token');
    localStorage.removeItem('wc_user');
    throw new Error('signed out');
  }
  if (!res.ok) throw new Error(`${path} failed: ${res.status}`);
  return res.json();
}

export const getGrants   = () => request('/v1/grants');
export const getChildren = () => request('/v1/children');

export const addChild = (fields) =>
  request('/v1/children', { method: 'POST', body: JSON.stringify(fields) });

export const submitIntake = (grantId, fields) =>
  request('/v1/intake', {
    method: 'POST',
    body: JSON.stringify({ grant_id: grantId, ...fields }),
  });

export const getDownloadUrl = (grantId) =>
  request(`/v1/download/${grantId}`).then((r) => `${API_BASE}${r.url}`);
