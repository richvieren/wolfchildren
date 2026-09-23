// tests/weekly-notes.test.js — portal/weekly.html, where a year's weekly notes are read.
//
// 2026-09-23: the note never travels by email (spec §10). The email says a note is there; this page
// is where it is. Sent weeks are shown newest first; weeks still ahead are not shown at all.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createDocument } from './helpers/dom-stub.js';

// weekly.js imports auth.js, which reads window.location at module load (see intake.test.js).
globalThis.document = createDocument();
globalThis.window = { location: { search: '', pathname: '/portal/weekly.html', href: '' }, history: { replaceState: () => {} } };
globalThis.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
const { renderWeekly, COPY } = await import('../assets/js/weekly.js');

const html = readFileSync(new URL('../portal/weekly.html', import.meta.url), 'utf8');

test('the page is noindex, links back to the readings, and mounts the list', () => {
  assert.match(html, /name="robots" content="noindex/);
  assert.match(html, /href="\/portal\/"/);
  assert.match(html, /id="weekly-list"/);
  assert.match(html, /src="\/assets\/js\/weekly\.js\?v=[0-9a-f]{8}"/);
});

function mounted() {
  const doc = createDocument();
  const list = doc.createElement('div'); list.id = 'weekly-list';
  const status = doc.createElement('p'); status.id = 'status';
  doc.body.append(list, status);
  return { doc, list, status };
}

test('sent weeks render newest first, each with its week number and subject', () => {
  const { doc, list, status } = mounted();
  renderWeekly(doc, list, status, {
    total: 52, weekly_off: false,
    weeks: [
      { week: 1, send_on: '2026-10-05', subject: 'The year starts quietly', body: 'One line about week one.', sent_at: '2026-10-05T06:00:00+00:00' },
      { week: 2, send_on: '2026-10-12', subject: 'The week the talking speeds up', body: 'One line about week two.', sent_at: '2026-10-12T06:00:00+00:00' },
      { week: 3, send_on: '2026-10-19', subject: 'Not yet', body: 'Unsent.', sent_at: null },
    ],
  });
  const notes = list.querySelectorAll('.weekly-note');
  assert.equal(notes.length, 2, 'only the weeks already sent');
  assert.match(notes[0].textContent, /Week 2 of 52/);
  assert.match(notes[0].textContent, /The week the talking speeds up/);
  assert.match(notes[1].textContent, /Week 1 of 52/);
  assert.ok(!/Not yet/.test(list.textContent), 'a week still ahead is not shown');
});

test('before the first note there is a plain line, not an empty page', () => {
  const { doc, list, status } = mounted();
  renderWeekly(doc, list, status, { total: 52, weekly_off: false, weeks: [] });
  assert.equal(list.querySelectorAll('.weekly-note').length, 0);
  assert.equal(status.textContent, COPY.none);
});

test('when the emails are off the notes are still here, and the page says so', () => {
  const { doc, list, status } = mounted();
  renderWeekly(doc, list, status, {
    total: 52, weekly_off: true,
    weeks: [{ week: 4, send_on: '2026-10-26', subject: 'A quiet week', body: 'Text.', sent_at: '2026-10-26T06:00:00+00:00' }],
  });
  assert.equal(list.querySelectorAll('.weekly-note').length, 1);
  assert.match(status.textContent, /emails are off/i);
  assert.match(status.textContent, /still here|still in your portal/i);
});
