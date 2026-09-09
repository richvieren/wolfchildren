// auth.js — VPS auth via /v1/auth/ API (SQLite + JWT)

const API_BASE = 'https://api.wolfchildren.co';

// On page load, check for magic-link token in URL
(function handleAuthToken() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('auth_token');
  if (!token) return;

  // R70: strip the token from the URL BEFORE the verify call, not after it.
  // A live magic-link token in the address bar is a token in the browser
  // history, in the Referer header of every subresource the page loads next,
  // and in whatever the client copies out of the bar. Doing it afterwards
  // leaves it there for the whole round trip, and forever if verify fails.
  window.history.replaceState(null, '', window.location.pathname);

  // Verify the token and get a JWT session
  fetch(`${API_BASE}/v1/auth/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  })
    .then(r => r.json())
    .then(data => {
      if (data.ok && data.access_token) {
        localStorage.setItem('wc_token', data.access_token);
        localStorage.setItem('wc_user', JSON.stringify(data.user));
        window.location.reload();
      } else {
        console.error('Auth verify failed:', data);
      }
    })
    .catch(err => console.error('Auth verify error:', err));
})();

/** Get current session (JWT + user). Returns null if not logged in. */
export async function getSession() {
  const token = localStorage.getItem('wc_token');
  const userJson = localStorage.getItem('wc_user');
  if (!token || !userJson) return null;

  // Validate the token is still good
  try {
    const res = await fetch(`${API_BASE}/v1/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) {
      // Token expired or invalid — clear and return null
      localStorage.removeItem('wc_token');
      localStorage.removeItem('wc_user');
      return null;
    }
    const data = await res.json();
    // Return a session-like object matching the shape the portal expects
    return {
      access_token: token,
      user: data.user,
    };
  } catch {
    return null;
  }
}

/** Send magic link via the VPS auth API. */
export async function sendMagicLink(email) {
  try {
    const res = await fetch(`${API_BASE}/v1/auth/send-magic-link`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.detail || 'Failed to send magic link' };
    return {};
  } catch (err) {
    return { error: err.message };
  }
}

/** Sign out — revoke server sessions and clear local storage. */
export async function signOut() {
  const token = localStorage.getItem('wc_token');
  if (token) {
    // Awaited (I6). Un-awaited, the reload below could cancel the request in
    // flight, so the server-side session survives a sign-out that told the
    // client it had worked.
    await fetch(`${API_BASE}/v1/auth/sign-out`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    }).catch(() => {});
  }
  localStorage.removeItem('wc_token');
  localStorage.removeItem('wc_user');
  window.location.reload();
}
