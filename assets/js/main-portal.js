// main-portal.js — portal entry point. Wires the signed-out / signed-in
// regions in portal/index.html to auth.js. Task 13 extends this file with
// grants and children rendering into #dashboard.

import { getSession, sendMagicLink, signOut } from './auth.js';

async function init() {
  const signedOut = document.getElementById('signed-out');
  const signedIn = document.getElementById('signed-in');
  const form = document.getElementById('sign-in-form');
  const emailInput = document.getElementById('email');
  const status = document.getElementById('status');
  const userEmail = document.getElementById('user-email');
  const signOutButton = document.getElementById('sign-out');

  const session = await getSession();

  if (!session) {
    signedOut.hidden = false;
    signedIn.hidden = true;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      status.textContent = '';
      const { error } = await sendMagicLink(emailInput.value);
      status.textContent = error ? error : 'Check your email.';
    });
  } else {
    signedOut.hidden = true;
    signedIn.hidden = false;
    userEmail.textContent = session.user.email;

    signOutButton.addEventListener('click', () => {
      signOut();
    });
  }
}

init();
