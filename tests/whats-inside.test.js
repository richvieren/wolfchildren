// The phone module's rows: one pane visible at a time, the row that chose it
// marked, and only that row's tick filled. Runs the built page in jsdom, which
// executes the module's own script, so this tests what ships.
//
// jsdom is not committed (node_modules is ignored). Without it the test skips
// rather than failing the suite:  npm install jsdom --no-save
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

let JSDOM = null;
try { ({ JSDOM } = await import('jsdom')); } catch { /* not installed */ }

const PAGE = 'readings/compass/mengto-skeuomorphic/index.html';

// The page's own scripts run (that is the point), so every window is closed
// again: the recognition slideshow sets an interval that would hold the test
// process open.
function load(fn) {
  const dom = new JSDOM(readFileSync(PAGE, 'utf8'), { runScripts: 'dangerously' });
  try { fn(dom.window); } finally { dom.window.close(); }
}

const visible = (win, el) => win.getComputedStyle(el).display !== 'none';

test('the phone shows pane 01 on load and hides the rest', { skip: !JSDOM && 'jsdom not installed' }, () => {
  load((win) => {
  const panes = [...win.document.querySelectorAll('[data-pane]')];
  assert.equal(panes.length, 6, 'six panes');
  assert.ok(visible(win, panes[0]), 'pane 01 is visible on load');
  for (const p of panes.slice(1)) assert.ok(!visible(win, p), `${p.dataset.pane} is hidden on load`);
  const rows = [...win.document.querySelectorAll('.wi-row')];
  assert.equal(rows.filter((r) => r.getAttribute('aria-pressed') === 'true').length, 1, 'one row pressed');
  assert.equal(rows[0].getAttribute('aria-pressed'), 'true', 'row 01 is the pressed one');
  });
});

test('hover and click on row 03 swap the phone and move the mark', { skip: !JSDOM && 'jsdom not installed' }, () => {
  load((win) => {
  const rows = [...win.document.querySelectorAll('.wi-row')];
  const panes = [...win.document.querySelectorAll('[data-pane]')];

  rows[2].dispatchEvent(new win.MouseEvent('mouseenter', { bubbles: true }));
  assert.ok(visible(win, panes[2]), 'hover shows pane 03');

  rows[0].dispatchEvent(new win.MouseEvent('mouseenter', { bubbles: true }));   // back to 01
  rows[2].dispatchEvent(new win.MouseEvent('click', { bubbles: true }));
  assert.ok(visible(win, panes[2]), 'click shows pane 03');
  for (const [i, p] of panes.entries()) {
    if (i !== 2) assert.ok(!visible(win, p), `pane ${i + 1} is hidden`);
  }

  const pressed = rows.filter((r) => r.getAttribute('aria-pressed') === 'true');
  assert.equal(pressed.length, 1, 'exactly one row is pressed');
  assert.equal(pressed[0], rows[2], 'row 03 is the pressed one');

  const items = [...win.document.querySelectorAll('.wi-item')];
  const active = items.filter((li) => li.classList.contains('is-active'));
  assert.equal(active.length, 1, 'exactly one row is marked active');
  assert.equal(active[0], items[2], 'row 03 carries the active mark');

  // the tick: the active row's mark takes the accent fill, the others do not
  const fill = (li) => win.getComputedStyle(li.querySelector('.wi-mark svg')).fill;
  const on = fill(items[2]);
  for (const [i, li] of items.entries()) {
    if (i !== 2) assert.notEqual(fill(li), on, `row ${i + 1}'s tick is not the active fill`);
  }
  });
});

test('the phone header names the child of the pane on show', { skip: !JSDOM && 'jsdom not installed' }, () => {
  load((win) => {
  const rows = [...win.document.querySelectorAll('.wi-row')];
  const who = win.document.querySelector('[data-wi-who]');
  rows[1].dispatchEvent(new win.MouseEvent('click', { bubbles: true }));
  const pane = win.document.querySelectorAll('[data-pane]')[1];
  assert.equal(who.textContent, pane.dataset.who);
  });
});
