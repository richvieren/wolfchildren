// main-portal.js — portal entry point. Wires the signed-out / signed-in
// regions in portal/index.html to auth.js, and (Task 13) renders the
// dashboard: grants and children fetched in parallel, grouped by
// dashboard.js, drawn with cards.js.

import { getSession, sendMagicLink, signOut } from './auth.js?v=b9374f9e';
import { getGrants, getChildren, getDownloadUrl, firstErrorMessage } from './api.js?v=a796088e';
import { grantableProducts } from './registry.js?v=99cae717';
import { groupGrants } from './dashboard.js?v=1d95e222';
import { renderCard } from './cards.js?v=560a6b82';

function section(dashboard, heading, cards, doc) {
  if (!cards.length) return;
  const h = doc.createElement('h2');
  h.textContent = heading;
  dashboard.append(h);
  for (const { product, grant } of cards) dashboard.append(renderCard(product, grant, doc));
}

function renderDashboard(dashboard, groups, doc) {
  dashboard.textContent = '';

  for (const { child, cards } of groups.byChild) section(dashboard, child.name, cards, doc);

  section(dashboard, 'Waiting for details', groups.waiting, doc);

  // C3: grants whose child has been deleted. The API anonymises them rather
  // than dropping them, so without this heading a client's paid reading had
  // nowhere to render at all.
  for (const { label, cards } of groups.removed) section(dashboard, label, cards, doc);

  section(dashboard, 'Your downloads', groups.downloads, doc);
  section(dashboard, 'Not yet yours', groups.locked, doc);
}

/**
 * C4: nothing called GET /v1/download/{grant_id}. The "Download →" link was an
 * anchor to a fragment that does not exist, so a finished reading could be
 * seen and never fetched. The URL is signed and short-lived, so it cannot be
 * baked into the href at render time — one delegated handler on #dashboard
 * asks for it at click time and then navigates.
 */
function wireDownloads(dashboard, doc) {
  dashboard.addEventListener('click', async (event) => {
    const cta = event.target && event.target.closest
      ? event.target.closest('.card-cta[data-download]')
      : null;
    if (!cta) return;
    event.preventDefault();

    const card = cta.closest('.card');
    let line = card && card.querySelector('.card-download-status');
    if (card && !line) {
      line = doc.createElement('p');
      line.className = 'card-download-status';
      card.append(line);
    }
    if (line) line.textContent = '';

    try {
      const url = await getDownloadUrl(cta.dataset.download);
      window.location.assign(url);
    } catch (err) {
      if (line) line.textContent = firstErrorMessage(err);
    }
  });
}

async function init() {
  const signedOut = document.getElementById('signed-out');
  const signedIn = document.getElementById('signed-in');
  const form = document.getElementById('sign-in-form');
  const emailInput = document.getElementById('email');
  const status = document.getElementById('status');
  const userEmail = document.getElementById('user-email');
  const signOutButton = document.getElementById('sign-out');
  const dashboard = document.getElementById('dashboard');

  // I1: wired BEFORE the session check, not inside the !session branch. The
  // catch at the foot of this function also reveals the sign-in form, and
  // that path used to reach a form with no submit handler at all — a sign-in
  // box that did nothing when a session expired.
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.textContent = '';
    const { error } = await sendMagicLink(emailInput.value);
    if (!error) {
      status.textContent = 'Check your email.';
    } else if (typeof error === 'string') {
      status.textContent = error;
    } else {
      status.textContent = 'Please enter a valid email address.';
    }
  });

  if (dashboard) wireDownloads(dashboard, document);

  const session = await getSession();

  if (!session) {
    signedOut.hidden = false;
    signedIn.hidden = true;
    return;
  }

  signedOut.hidden = true;
  signedIn.hidden = false;
  userEmail.textContent = session.user.email;

  signOutButton.addEventListener('click', () => {
    signOut();
  });

  try {
    const [grants, children] = await Promise.all([getGrants(), getChildren()]);
    const groups = groupGrants(grantableProducts(), grants, children);
    renderDashboard(dashboard, groups, document);
  } catch (err) {
    // I1: this catch used to swallow every error in silence, so a failure
    // anywhere in the dashboard looked identical to being signed out. Say
    // which of the two it is, then fall back to the sign-in view rather than
    // leaving a dead dashboard on screen.
    status.textContent = err && err.message === 'signed out'
      ? 'Your session has expired. Please sign in again.'
      : `Your dashboard could not be loaded. ${firstErrorMessage(err)}`;
    signedOut.hidden = false;
    signedIn.hidden = true;
  }
}

init();
