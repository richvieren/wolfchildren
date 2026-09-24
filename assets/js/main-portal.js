// main-portal.js — portal entry point. Wires the signed-out / signed-in
// regions in portal/index.html to auth.js, and (Task 13) renders the
// dashboard: grants and children fetched in parallel, grouped by
// dashboard.js, drawn with cards.js.
//
// 2026-09-13, the sign-in rewrite (docs/portal-copy-audit-2026-09-13.md,
// Richard's decisions). A first-time visitor has no account and no password,
// so the page follows the passwordless pattern every established product
// uses: the button says what will happen, the sent screen names the address
// and offers "send it again" and "use a different address", an expired link
// gets its own sentence with the form right there, and a support address is
// published so a parent who cannot get in can ask instead of refunding.

import { getSession, sendMagicLink, signOut, takeSignInNotice } from './auth.js?v=c0266db9';
import { getGrants, getChildren, getDownloadUrl, retryGrant, setWeekly, firstErrorMessage } from './api.js?v=9e96d9b6';
import { grantableProducts } from './registry.js?v=4366c446';
import { groupGrants } from './dashboard.js?v=0e225e15';
import { renderCard, pollDelayMs, WEEKLY_COPY } from './cards.js?v=4dabae0a';

export const SUPPORT = 'hello@wolfchildren.co';

export const NOTICES = {
  expired: 'That link has expired or was already used. Enter your email and we send a fresh one.',
  'signed-out': 'You were signed out. Enter your email for a new link.',
};

export const EMPTY_DASHBOARD = 'Nothing here yet. A purchase can take a minute to arrive; refresh this page in a moment. '
  + 'If you bought with a different email address, sign out and use that one.';

const SECTIONS = {
  waiting: 'Needs your child’s details',
  downloads: 'Your downloads',
  locked: 'Also available',
};

function section(dashboard, heading, cards, doc) {
  if (!cards.length) return;
  const h = doc.createElement('h2');
  h.textContent = heading;
  dashboard.append(h);
  for (const { product, grant } of cards) dashboard.append(renderCard(product, grant, doc));
}

/** True when the account owns nothing yet: only the "also available" list would render. */
/** Every {product, grant} card in a groupGrants() result, whatever section it sits in. */
export function allCards(groups) {
  const out = [];
  for (const section of Object.values(groups || {})) {
    for (const entry of Array.isArray(section) ? section : []) {
      if (entry && Array.isArray(entry.cards)) out.push(...entry.cards);
      else if (entry && entry.product) out.push(entry);
    }
  }
  return out;
}

export function isEmpty(groups) {
  return groups.byChild.every((g) => g.cards.every((c) => !c.grant))
    && groups.waiting.length === 0 && groups.removed.length === 0 && groups.downloads.length === 0;
}

export function renderDashboard(dashboard, groups, doc) {
  dashboard.textContent = '';

  if (isEmpty(groups)) {
    const p = doc.createElement('p');
    p.className = 'notice';
    p.textContent = EMPTY_DASHBOARD;
    dashboard.append(p);
  }

  for (const { child, cards } of groups.byChild) section(dashboard, child.name, cards, doc);

  section(dashboard, SECTIONS.waiting, groups.waiting, doc);

  // C3: grants whose child has been deleted. The API anonymises them rather
  // than dropping them, so without this heading a client's paid reading had
  // nowhere to render at all.
  for (const { label, cards } of groups.removed) section(dashboard, label, cards, doc);

  section(dashboard, SECTIONS.downloads, groups.downloads, doc);
  section(dashboard, SECTIONS.locked, groups.locked, doc);
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
    if (line) line.textContent = 'Preparing your download…';

    try {
      const url = await getDownloadUrl(cta.dataset.download);
      if (line) line.textContent = '';
      window.location.assign(url);
    } catch (err) {
      if (line) line.textContent = `The download could not be prepared. Try again in a minute. ${firstErrorMessage(err)}`;
    }
  });
}

/**
 * 2026-09-23: a reading whose job failed carries "Try again" instead of a promise. The click puts
 * the job back in the queue and re-reads the dashboard, so the card moves on by itself.
 */
export function wireRetries(dashboard, doc, retry = retryGrant, reload = null) {
  dashboard.addEventListener('click', async (event) => {
    const cta = event.target && event.target.closest ? event.target.closest('.card-cta[data-retry]') : null;
    if (!cta) return;
    event.preventDefault();
    const card = cta.closest('.card');
    let line = card && card.querySelector('.card-retry-status');
    if (card && !line) {
      line = doc.createElement('p');
      line.className = 'card-retry-status';
      card.append(line);
    }
    cta.hidden = true;
    if (line) line.textContent = 'Putting it back in the queue…';
    try {
      await retry(cta.dataset.retry);
      if (line) line.textContent = 'It is back in the queue. This usually takes a few minutes, and we email you when it is ready.';
      if (reload) await reload();
    } catch (err) {
      cta.hidden = false;
      if (line) line.textContent = `That did not work. ${firstErrorMessage(err)} If it keeps happening, write to ${SUPPORT}.`;
    }
  });
}

/**
 * 2026-09-23: the weekly emails off and on, from the card. The notes stay in the portal whatever
 * this says; the switch only decides whether an email tells the parent a new one is there.
 */
export function wireWeekly(dashboard, doc, set = setWeekly) {
  dashboard.addEventListener('click', async (event) => {
    const toggle = event.target && event.target.closest ? event.target.closest('.card-weekly-toggle[data-weekly]') : null;
    if (!toggle) return;
    event.preventDefault();
    const card = toggle.closest('.card');
    const line = card && card.querySelector('.card-weekly');
    let status = card && card.querySelector('.card-weekly-status');
    if (card && !status) {
      status = doc.createElement('p');
      status.className = 'card-weekly-status small';
      card.append(status);
    }
    const wantOn = toggle.dataset.weeklyOn === 'true';
    if (status) status.textContent = wantOn ? 'Turning them back on…' : 'Turning them off…';
    try {
      await set(toggle.dataset.weekly, wantOn);
      toggle.dataset.weeklyOn = wantOn ? 'false' : 'true';
      toggle.textContent = wantOn ? WEEKLY_COPY.stop : WEEKLY_COPY.start;
      if (line) line.textContent = wantOn ? WEEKLY_COPY.noWeekYet : WEEKLY_COPY.off;
      if (status) status.textContent = '';
    } catch (err) {
      if (status) status.textContent = `That did not work. ${firstErrorMessage(err)} If it keeps happening, write to ${SUPPORT}.`;
    }
  });
}

/**
 * The sign-in screen's three states on one form: asking, sending, sent.
 * Exported so the DOM stub can drive it in tests.
 */
export function wireSignIn(doc, send) {
  const form = doc.getElementById('sign-in-form');
  const emailInput = doc.getElementById('email');
  const button = doc.getElementById('send-link');
  const status = doc.getElementById('status');
  const ask = doc.getElementById('signin-ask');
  const sent = doc.getElementById('link-sent');
  const sentTo = doc.getElementById('sent-to');
  const resendStatus = doc.getElementById('resend-status');
  let lastEmail = '';

  async function request(email, line) {
    line.textContent = '';
    button.disabled = true;
    const label = button.textContent;
    button.textContent = 'Sending…';
    const { error } = await send(email);
    button.disabled = false;
    button.textContent = label;
    if (error) { line.textContent = error; return false; }
    return true;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = String(emailInput.value || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      status.textContent = 'That does not look like an email address. Check it and try again.';
      return;
    }
    if (await request(email, status)) {
      lastEmail = email;
      sentTo.textContent = email;
      ask.hidden = true;
      sent.hidden = false;
    }
  });

  doc.getElementById('send-again').addEventListener('click', async () => {
    if (await request(lastEmail, resendStatus)) resendStatus.textContent = `Sent again to ${lastEmail}.`;
  });

  doc.getElementById('change-address').addEventListener('click', () => {
    sent.hidden = true;
    ask.hidden = false;
    resendStatus.textContent = '';
    emailInput.value = '';
    if (emailInput.focus) emailInput.focus();
  });
}

function showNotice(doc, key) {
  const notice = doc.getElementById('signin-notice');
  if (!notice || !NOTICES[key]) return;
  notice.textContent = NOTICES[key];
  notice.hidden = false;
}

async function init() {
  const signedOut = document.getElementById('signed-out');
  const signedIn = document.getElementById('signed-in');
  const userEmail = document.getElementById('user-email');
  const signOutButton = document.getElementById('sign-out');
  const dashboard = document.getElementById('dashboard');
  const dashboardStatus = document.getElementById('dashboard-status');

  // I1: wired BEFORE the session check, not inside the !session branch. The
  // catch at the foot of this function also reveals the sign-in form, and
  // that path used to reach a form with no submit handler at all — a sign-in
  // box that did nothing when a session expired.
  wireSignIn(document, sendMagicLink);

  // An expired or used link: auth.js could only log it before, so the parent
  // saw a bare sign-in form with nothing said.
  const notice = takeSignInNotice();
  if (notice) showNotice(document, notice);

  if (dashboard) { wireDownloads(dashboard, document); wireRetries(dashboard, document); wireWeekly(dashboard, document); }

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
    // 2026-09-15, Compass instant: while a page is being made, ask again until it is released.
    const started = Date.now();
    const poll = async () => {
      try {
        const g = groupGrants(grantableProducts(), await getGrants(), children);
        renderDashboard(dashboard, g, document);
        const next = pollDelayMs(allCards(g), Date.now() - started);
        if (next) setTimeout(poll, next);
      } catch { /* a failed poll stops polling; the parent can refresh */ }
    };
    const first = pollDelayMs(allCards(groups), 0);
    if (first) setTimeout(poll, first);
  } catch (err) {
    // I1: this catch used to swallow every error in silence, so a failure
    // anywhere in the dashboard looked identical to being signed out. Say
    // which of the two it is, then fall back to the sign-in view rather than
    // leaving a dead dashboard on screen.
    if (err && err.message === 'signed out') {
      showNotice(document, 'signed-out');
    } else {
      dashboardStatus.textContent = `Your readings could not be loaded. ${firstErrorMessage(err)} If it keeps happening, write to ${SUPPORT}.`;
      return;
    }
    signedOut.hidden = false;
    signedIn.hidden = true;
  }
}

if (typeof document !== 'undefined' && document.getElementById('sign-in-form')) {
  init();
}
