// weekly.js — portal/weekly.html: the weekly notes for one year-long reading.
//
// Richard, 2026-09-23: Transits is a year, and each of its fifty-two weeks has a note. The note
// lives here, never in the email (spec §10: no child name and no reading content leaves the
// server). The weekly email only says a new one is waiting, and the card on the dashboard links
// here. Turning the emails off changes nothing on this page.

import { getSession } from './auth.js?v=c0266db9';
import { getWeekly, firstErrorMessage } from './api.js?v=9e96d9b6';

export const COPY = {
  none: 'Your first weekly note is not there yet. The first one arrives in the week after your report.',
  off: 'The weekly emails are off. Every note is still here, and new ones keep arriving each week.',
  loading: 'Reading your notes…',
  failed: 'Your notes could not be loaded. Try again in a minute, or write to hello@wolfchildren.co.',
  noGrant: 'Open this page from your readings, so we know which reading you mean.',
};

/** "12 October 2026" from "2026-10-12". */
export function formatDate(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || ''));
  if (!m) return String(iso || '');
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
                  'September', 'October', 'November', 'December'];
  return `${Number(m[3])} ${months[Number(m[2]) - 1]} ${m[1]}`;
}

/** Pure: every note already sent, newest first. A week still ahead is not shown at all. */
export function renderWeekly(doc, list, status, data) {
  list.textContent = '';
  const total = data.total || 52;
  const sent = (data.weeks || []).filter((w) => w.sent_at).sort((a, b) => b.week - a.week);
  for (const w of sent) {
    const article = doc.createElement('article');
    article.className = 'weekly-note';
    const h = doc.createElement('h2');
    h.textContent = `Week ${w.week} of ${total}: ${w.subject}`;
    const when = doc.createElement('p');
    when.className = 'small';
    when.textContent = formatDate(w.send_on);
    const body = doc.createElement('p');
    body.textContent = w.body;
    article.append(h, when, body);
    list.append(article);
  }
  status.textContent = data.weekly_off ? COPY.off : (sent.length ? '' : COPY.none);
}

async function init() {
  const list = document.getElementById('weekly-list');
  const status = document.getElementById('status');
  if (!list || !status) return;
  const session = await getSession();
  if (!session) {
    window.location.href = '/portal/';
    return;
  }
  const grant = new URLSearchParams(window.location.search).get('grant');
  if (!grant) {
    status.textContent = COPY.noGrant;
    return;
  }
  status.textContent = COPY.loading;
  try {
    renderWeekly(document, list, status, await getWeekly(grant));
  } catch (err) {
    status.textContent = `${COPY.failed} ${firstErrorMessage(err)}`;
  }
}

if (typeof document !== 'undefined' && document.getElementById('weekly-list')) init();
