// cards.js — one state machine and one renderer for every product.
// Cato's dashboard.js has five near-identical renderers. With eight products
// that shape means eight copies of every change. See spec §3.
//
// 2026-09-13: every line says what happens next (docs/portal-copy-audit-
// 2026-09-13.md). "Within 24 hours" is Richard's delivery promise: he checks
// the review queue once a day. A locked card names the product and its price
// and links to a sales page only when the registry carries one (none yet).

export function cardState(product, grant) {
  if (!grant) return 'locked';
  if (product.requiresIntake && !grant.has_intake) return 'intake';
  // 2026-09-23: the job ran out of attempts. Say so and offer the retry, rather than promise
  // 24 hours for ever (audit item 5).
  if (!grant.available_at && grant.job_status === 'failed') return 'delayed';
  // 2026-09-15, Compass instant: a profile is rendered on the server seconds after intake.
  if (!grant.available_at) return product.requiresIntake ? (product.fulfilment === 'profile' ? 'making' : 'submitted') : 'pending';
  const t = Date.parse(grant.available_at);
  if (Number.isNaN(t)) return 'pending';
  return t > Date.now() ? 'pending' : 'ready';
}

export const DELIVERY_PROMISE = 'We email you when it is ready, within 24 hours.';

export const COPY = {
  locked:    { status: '', cta: null },
  intake:    { status: 'Tell us about your child and this reading starts.', cta: 'Give the details →' },
  submitted: { status: `Your details are in. Your reading is being prepared. ${DELIVERY_PROMISE}`, cta: null },
  making:    { status: 'Your details are in. Your page is being made, usually within a minute. We email you when it is ready.', cta: null },
  delayed:   { status: 'This one did not come through. Nothing is lost and you have not been charged twice. Try again, or write to hello@wolfchildren.co and we will sort it.',
               cta: 'Try again →' },
  pending:   { status: `Your reading is being prepared. ${DELIVERY_PROMISE}`, cta: null },
  ready:     { status: 'Your reading is ready.', cta: 'Download the PDF →',
               note: 'Opens as a PDF. On a phone, use the share button to save it.' },
};

// While a card is being made the dashboard asks again every five seconds, for three minutes
// at most: long enough for the render (about nine seconds on the server) and a slow queue,
// short enough that a failed render does not poll forever. Then the parent refreshes.
// 2026-09-23: Transits is a year. A released grant carries weekly_total, weekly_week and
// weekly_off; the note itself lives in the portal, never in the email (spec §10).
export const WEEKLY_COPY = {
  week: (n, total) => `Week ${n} of ${total} is in your portal.`,
  noWeekYet: 'Your weekly notes are in your portal.',
  off: 'The weekly emails are off. Your notes are still in your portal.',
  read: 'Read this week’s note →',
  stop: 'Stop the weekly emails',
  start: 'Turn them back on',
};

export const POLL_EVERY_MS = 5000;
export const POLL_FOR_MS = 180000;

export function pollDelayMs(cards, elapsedMs) {
  if (elapsedMs >= POLL_FOR_MS) return null;
  return cards.some(({ product, grant }) => cardState(product, grant) === 'making') ? POLL_EVERY_MS : null;
}

export function priceLabel(product) {
  if (typeof product.priceCents !== 'number') return '';
  const dollars = product.priceCents / 100;
  return Number.isInteger(dollars) ? `$${dollars}` : `$${dollars.toFixed(2)}`;
}

export function renderCard(product, grant, doc = document) {
  const state = cardState(product, grant);
  const c = COPY[state];
  const el = doc.createElement('article');
  el.className = `card card-${state}`;
  el.dataset.product = product.slug;
  if (grant?.child_id) el.dataset.childId = String(grant.child_id);

  const h = doc.createElement('h3');
  h.textContent = product.name;
  el.append(h);

  const s = doc.createElement('p');
  s.className = 'card-status';
  // C3: a client can own more than one edition of the same reading for the
  // same child, and both now render. Two identical cards would be a puzzle,
  // so the edition names itself from the second one on.
  s.textContent = grant && grant.edition > 1
    ? `Edition ${grant.edition} — ${c.status}`
    : c.status;
  el.append(s);

  if (state === 'locked') {
    const price = priceLabel(product);
    if (price) {
      const p = doc.createElement('p');
      p.className = 'card-price';
      p.textContent = price;
      el.append(p);
    }
    if (product.salesUrl) {
      const a = doc.createElement('a');
      a.className = 'card-cta';
      a.textContent = 'What is in it →';
      a.href = product.salesUrl;
      el.append(a);
    }
    return el;
  }

  if (c.cta) {
    const a = doc.createElement('a');
    a.className = 'card-cta';
    a.textContent = c.cta;
    if (state === 'delayed') {
      a.href = '#';
      a.dataset.retry = String(grant.grant_id);
    } else if (state === 'intake') {
      a.href = `/portal/intake.html?product=${product.slug}&grant=${grant.grant_id}`;
    } else {
      // C4: the download URL is signed and short-lived, so it cannot be baked
      // into the href here — main-portal.js delegates a click on this
      // data-download attribute to GET /v1/download/{grant_id} and then
      // navigates. The href is a placeholder that keeps the anchor focusable.
      a.href = '#';
      a.dataset.download = String(grant.grant_id);
    }
    el.append(a);
  }
  if (c.note) {
    const n = doc.createElement('p');
    n.className = 'card-note small';
    n.textContent = c.note;
    el.append(n);
  }
  if (state === 'ready' && typeof grant.weekly_total === 'number') appendWeekly(el, grant, doc);
  return el;
}

/** The weekly-notes line and its off/on control, for a released year-long reading. */
function appendWeekly(el, grant, doc) {
  const line = doc.createElement('p');
  line.className = 'card-weekly small';
  line.textContent = grant.weekly_off ? WEEKLY_COPY.off
    : (typeof grant.weekly_week === 'number' ? WEEKLY_COPY.week(grant.weekly_week, grant.weekly_total)
                                             : WEEKLY_COPY.noWeekYet);
  el.append(line);

  const read = doc.createElement('a');
  read.className = 'card-weekly-link';
  read.textContent = WEEKLY_COPY.read;
  read.href = `/portal/weekly.html?grant=${grant.grant_id}`;
  el.append(read);

  // The click is delegated in main-portal.js: data-weekly-on carries what to ASK for.
  const toggle = doc.createElement('a');
  toggle.className = 'card-weekly-toggle small';
  toggle.href = '#';
  toggle.dataset.weekly = String(grant.grant_id);
  toggle.dataset.weeklyOn = grant.weekly_off ? 'true' : 'false';
  toggle.textContent = grant.weekly_off ? WEEKLY_COPY.start : WEEKLY_COPY.stop;
  el.append(toggle);
}
