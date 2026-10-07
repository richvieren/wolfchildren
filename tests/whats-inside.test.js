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

// ── the offer block (offer-v2) ────────────────────────────────────────────
test('all three tiers are selectable, and a tier with no link turns the button off',
  { skip: !JSDOM && 'jsdom not installed' }, () => {
  load((win) => {
    const cta = win.document.querySelector('[data-ov-cta]');
    const live = cta.getAttribute('href');
    assert.match(live, /^https:\/\/buy\.stripe\.com\//, 'the button starts on the Compass link');
    assert.equal(cta.getAttribute('aria-disabled'), null, 'the button starts on');

    const radios = [...win.document.querySelectorAll('input[name="ov-tier"]')];
    assert.equal(radios.length, 3, 'three tiers');
    assert.equal(win.document.querySelectorAll('.ov-tier input:disabled').length, 0,
      'every tier is selectable');
    assert.ok(radios[0].checked, 'tier 1 is chosen on load');
    assert.ok(!/Coming soon/i.test(win.document.querySelector('.offer-v2-s').textContent),
      'no "coming soon" text anywhere in the section');

    // a tier with no checkout link: the button loses its target
    radios[2].checked = true;
    radios[2].dispatchEvent(new win.Event('change', { bubbles: true }));
    assert.equal(cta.getAttribute('href'), null, 'no target while the tier has no link');
    assert.equal(cta.getAttribute('aria-disabled'), 'true', 'the button is off');
    assert.match(cta.textContent, /\$54$/, 'the label still carries the chosen price');

    // back to the live tier: the button comes back on, on the Compass link
    radios[0].checked = true;
    radios[0].dispatchEvent(new win.Event('change', { bubbles: true }));
    assert.equal(cta.getAttribute('href'), live, 'the Compass link is back');
    assert.equal(cta.getAttribute('aria-disabled'), null, 'the button is on again');
  });
});

test('the split is two halves, the photograph left and the buy box right',
  { skip: !JSDOM && 'jsdom not installed' }, () => {
  load((win) => {
    const left = win.document.querySelector('.ov-left');
    const right = win.document.querySelector('.ov-right');
    assert.ok(left && right, 'both halves exist');
    const imgs = [...left.querySelectorAll('img')];
    assert.equal(imgs.length, 1, 'one photograph on the left');
    assert.match(imgs[0].getAttribute('src'), /compass2\/offer\.webp$/);
    assert.equal(win.document.querySelectorAll('[data-ov-thumb]').length, 0, 'no thumbnails');
    assert.ok(right.querySelector('.ov-box .ov-cta'), 'the buy box holds the button');
    assert.ok(right.querySelector('.ov-box .ov-faq'), 'and the FAQ');
    // the Inter stylesheet the buy box asks for
    const fonts = [...win.document.querySelectorAll('link[rel="stylesheet"]')]
      .map((l) => l.getAttribute('href'));
    assert.ok(fonts.some((h) => /fonts\.googleapis\.com.*Inter:wght@400;600/.test(h)),
      'Inter 400 and 600 are requested');
  });
});

test('each tier carries its per-child line, and two carry a saving chip',
  { skip: !JSDOM && 'jsdom not installed' }, () => {
  load((win) => {
    const boxes = [...win.document.querySelectorAll('.ov-tier-box')];
    assert.equal(boxes.length, 3, 'three tier boxes');
    assert.equal(boxes[0].querySelectorAll('.ov-save').length, 0, 'tier 1 has no chip');
    assert.equal(boxes[1].querySelector('.ov-save').textContent, 'Save $7');
    assert.equal(boxes[2].querySelector('.ov-save').textContent, 'Save $27');
    assert.match(boxes[1].querySelector('.ov-each').textContent, /\$23\.50 each/);
    assert.match(boxes[2].querySelector('.ov-each').textContent, /\$18 each/);
    assert.equal(boxes[2].querySelector('.ov-note').textContent,
      'Keep one as a gift, or for later');
    boxes.forEach((b) => assert.equal(b.querySelectorAll('.ov-more li').length, 3,
      'each box holds the three ticks'));
  });
});

test('opening one FAQ item closes the others', { skip: !JSDOM && 'jsdom not installed' }, () => {
  load((win) => {
    const qs = [...win.document.querySelectorAll('[data-ov-q]')];
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

// ── the transition (a page setting, not module code) ──────────────────────
test('no pin on whats-inside, no wave-1 in the order, and the wave is offer-v2\'s edge',
  { skip: !JSDOM && 'jsdom not installed' }, () => {
  load((win) => {
    const secs = [...win.document.querySelectorAll('section.s')];
    const ids = secs.map((s) => (s.className.match(/\b([a-z0-9-]+)-s\b/) || [])[1]);
    assert.ok(!ids.includes('wave-1'), `wave-1 is out of the order: ${ids}`);
    assert.equal(ids.indexOf('offer-v2'), ids.indexOf('whats-inside') + 1,
      'offer-v2 follows whats-inside directly');

    // 1 — the pin is gone: nothing sets position sticky on whats-inside
    const pinned = win.document.querySelector('.whats-inside-s');
    assert.notEqual(win.getComputedStyle(pinned).position, 'sticky', 'no sticky pin');
    assert.ok(!/sticky/.test(pinned.getAttribute('style') || ''), 'no inline pin either');

    // the parallax comes from the config, and the shared script reads the speed
    assert.ok(pinned.classList.contains('wc-parallax'), 'the section is marked for parallax');
    assert.equal(pinned.getAttribute('data-parallax'), '0.5', 'half the scroll speed');

    // 3 and 5 — the wave is offer-v2's edge, set by the page, drawn by the shared layer
    const offer = win.document.querySelector('.offer-v2-s');
    assert.ok(offer.classList.contains('wc-edge-wave'), 'offer-v2 carries the wave edge');
    const css = [...win.document.querySelectorAll('style')].map((x) => x.textContent).join('');
    assert.match(css, /\.wc-edge-wave\{[^}]*mask-image:url\(\/assets\/img\/frames\/wave-edge\.png\)/);
    assert.match(css, /\.wc-edge-wave\{[^}]*margin-top:calc\(var\(--wc-edge-h\) \* -1\)/);
    assert.ok(!/\.wave-1-band/.test(css), 'wave-1 brings no CSS to this page');

    // 4 — the gradient and the light card
    assert.match(css, /--ov-gradient:linear-gradient\(90deg,#CDB494,#D9A15A,#DA4635\)/);
    assert.match(css, /\.ov-box\{[^}]*background:var\(--b-paper\)[^}]*border-radius:16px/);
  });
});
