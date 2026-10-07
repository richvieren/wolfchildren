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

// ── the offer card ────────────────────────────────────────────────────────
test('tier 1 keeps the button on the Compass link, and tiers 2 and 3 cannot be chosen',
  { skip: !JSDOM && 'jsdom not installed' }, () => {
  load((win) => {
    const cta = win.document.querySelector('[data-oc-cta]');
    const href = cta.getAttribute('href');
    assert.match(href, /^https:\/\/buy\.stripe\.com\//, 'the button starts on a Stripe link');

    const radios = [...win.document.querySelectorAll('input[name="oc-tier"]')];
    assert.equal(radios.length, 3, 'three tiers');
    assert.ok(radios[0].checked, 'tier 1 is chosen on load');
    assert.ok(!radios[0].disabled, 'tier 1 is selectable');
    assert.ok(radios[1].disabled && radios[2].disabled, 'tiers 2 and 3 are not selectable');

    radios[0].dispatchEvent(new win.Event('change', { bubbles: true }));
    assert.equal(cta.getAttribute('href'), href, 'clicking tier 1 keeps the Compass link');

    // a disabled tier cannot be chosen, and even a forced change leaves the link alone
    radios[2].checked = true;
    radios[2].dispatchEvent(new win.Event('change', { bubbles: true }));
    assert.equal(cta.getAttribute('href'), href, 'a tier with no link never moves the button');
  });
});

test('a thumbnail swaps the large picture', { skip: !JSDOM && 'jsdom not installed' }, () => {
  load((win) => {
    const big = win.document.querySelector('[data-oc-shot]');
    const thumbs = [...win.document.querySelectorAll('[data-oc-thumb]')];
    assert.equal(thumbs.length, 3, 'three thumbnails');
    const first = big.getAttribute('src');
    thumbs[2].dispatchEvent(new win.MouseEvent('click', { bubbles: true }));
    assert.notEqual(big.getAttribute('src'), first, 'the large picture changed');
    assert.equal(thumbs[2].getAttribute('aria-pressed'), 'true');
    assert.equal(thumbs.filter((t) => t.getAttribute('aria-pressed') === 'true').length, 1);
  });
});

test('opening one FAQ item closes the others', { skip: !JSDOM && 'jsdom not installed' }, () => {
  load((win) => {
    const qs = [...win.document.querySelectorAll('[data-oc-q]')];
    assert.equal(qs.length, 7, 'seven questions');
    assert.equal(qs.filter((d) => d.open).length, 0, 'all closed on load');

    qs[1].open = true;
    qs[1].dispatchEvent(new win.Event('toggle'));
    qs[4].open = true;
    qs[4].dispatchEvent(new win.Event('toggle'));
    const open = qs.filter((d) => d.open);
    assert.equal(open.length, 1, 'one open at a time');
    assert.equal(open[0], qs[4]);
  });
});
