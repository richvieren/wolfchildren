// main-portal.js — portal entry point. Wires the signed-out / signed-in
// regions in portal/index.html to auth.js, and (Task 13) renders the
// dashboard: grants and children fetched in parallel, grouped by
// dashboard.js, drawn with cards.js.

import { getSession, sendMagicLink, signOut } from './auth.js?v=96b93ff5';
import { getGrants, getChildren } from './api.js?v=cebdc3da';
import { grantableProducts } from './registry.js?v=b323975a';
import { groupGrants } from './dashboard.js?v=74289b98';
import { renderCard } from './cards.js?v=e7644ccb';

function renderDashboard(dashboard, groups, doc) {
  dashboard.textContent = '';

  for (const { child, cards } of groups.byChild) {
    const h = doc.createElement('h2');
    h.textContent = child.name;
    dashboard.append(h);
    for (const { product, grant } of cards) dashboard.append(renderCard(product, grant, doc));
  }

  if (groups.waiting.length) {
    const h = doc.createElement('h2');
    h.textContent = 'Waiting for details';
    dashboard.append(h);
    for (const { product, grant } of groups.waiting) dashboard.append(renderCard(product, grant, doc));
  }

  if (groups.downloads.length) {
    const h = doc.createElement('h2');
    h.textContent = 'Your downloads';
    dashboard.append(h);
    for (const { product, grant } of groups.downloads) dashboard.append(renderCard(product, grant, doc));
  }

  if (groups.locked.length) {
    const h = doc.createElement('h2');
    h.textContent = 'Not yet yours';
    dashboard.append(h);
    for (const { product, grant } of groups.locked) dashboard.append(renderCard(product, grant, doc));
  }
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

  const session = await getSession();

  if (!session) {
    signedOut.hidden = false;
    signedIn.hidden = true;

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
  } catch {
    // An expired token surfaces here as a thrown "signed out" error from
    // api.js (which has already cleared wc_token/wc_user). Fall back to the
    // sign-in view rather than leaving a dead dashboard on screen.
    signedOut.hidden = false;
    signedIn.hidden = true;
  }
}

init();
