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
const WAVE_PAGE = 'readings/compass/wave-test/index.html';

// The page's own scripts run (that is the point), so every window is closed
// again: the recognition slideshow sets an interval that would hold the test
// process open.
function load(fn, page = PAGE) {
  const dom = new JSDOM(readFileSync(page, 'utf8'), { runScripts: 'dangerously' });
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

// ── the live page carries no transition ───────────────────────────────────
test('the live page has no wave edge, no parallax and no gradient section',
  { skip: !JSDOM && 'jsdom not installed' }, () => {
  load((win) => {
    const ids = [...win.document.querySelectorAll('section.s')]
      .map((s) => (s.className.match(/\b([a-z0-9-]+)-s\b/) || [])[1]);
    assert.deepEqual(ids, ['recognition', 'whats-inside', 'offer-v2'], `the order: ${ids}`);
    const html = win.document.documentElement.outerHTML;
    assert.ok(!/wave-edge\.png/.test(html), 'no wave mask anywhere');
    assert.ok(!/wc-parallax|wc-edge-wave/.test(html), 'no edge or parallax layer');
    assert.ok(!/--ov-gradient/.test(html), 'no gradient ground on the offer');
    // the split is back: the green half and the paper half
    const css = [...win.document.querySelectorAll('style')].map((x) => x.textContent).join('');
    assert.match(css, /\.ov-left\{background:var\(--b-green\)/);
    assert.match(css, /\.ov-right\{background:var\(--b-paper\)/);
  });
});

// ── the bench: readings/compass/wave-test ─────────────────────────────────
test('the wave is its own layer, and no mask touches a section or its content',
  { skip: !JSDOM && 'jsdom not installed' }, () => {
  load((win) => {
    const secs = [...win.document.querySelectorAll('section.s')];
    const ids = secs.map((s) => (s.className.match(/\b([a-z0-9-]+)-s\b/) || [])[1]);
    assert.deepEqual(ids, ['whats-inside', 'wave-demo'], `the order: ${ids}`);

    // the one ground under test
    assert.equal(secs[1].getAttribute('style'),
      '--wd-gradient:linear-gradient(90deg,#495543,#CDB494)');

    const css = [...win.document.querySelectorAll('style')].map((x) => x.textContent).join('');
    // every rule that carries a mask, and the selector it carries it on
    const masked = [...css.matchAll(/([^{}]*)\{([^}]*)\}/g)]
      .filter((m) => /mask-image/.test(m[2]))
      .map((m) => m[1].trim().split('\n').pop().trim());
    assert.deepEqual(masked, ['.wd-wave'], `only the decorative layer is masked: ${masked}`);
    assert.match(css, /\.wd-wave\{[^}]*bottom:calc\(100% - 2px\)/,
      'the layer sits above the section, lapping 2px over it');
    assert.match(css, /\.wd-wave\{[^}]*mask-size:200% auto/, 'the swoop is drawn at 200%');
    assert.match(css, /\.wd\{[^}]*z-index:1/, 'the wave section paints above the one before it');

    // the section above moves at half speed, clipped, and cannot paint out of itself
    const above = win.document.querySelector('.whats-inside-s');
    assert.ok(above.classList.contains('wc-parallax'));
    assert.equal(above.getAttribute('data-parallax'), '0.5');
    assert.match(css, /\.wc-parallax\{[^}]*isolation:isolate[^}]*overflow:hidden/);
  }, WAVE_PAGE);
});

test('the lag starts when the wave\'s top edge reaches the bottom of the window',
  { skip: !JSDOM && 'jsdom not installed' }, async () => {
  // jsdom has no layout, so the rectangles are supplied: a 2400px tall section
  // passing a 768px window, and the wave layer at its used height, 197px.
  const dom = new JSDOM(readFileSync(WAVE_PAGE, 'utf8'),
    { runScripts: 'dangerously', pretendToBeVisual: true });
  const win = dom.window;
  try {
    const sec = win.document.querySelector('.wc-parallax');
    const wave = win.document.querySelector('[data-cover]');
    const WAVE = 197;
    wave.getBoundingClientRect = () => ({ top: 0, bottom: WAVE, height: WAVE,
      left: 0, right: 1440, width: 1440 });
    win.innerHeight = 768;

    // 1 — one wrapper holds both children, so their stacking is untouched
    assert.equal(sec.children.length, 1, 'the section has one child');
    assert.equal(sec.firstElementChild.className, 'wc-move');
    assert.deepEqual([...sec.firstElementChild.children].map((c) => c.className),
      ['wi-photo', 'wrap'], 'the photograph and the content are inside it');
    assert.ok(sec.querySelector('.wc-move .wrap .wi .wi-text .wi-phone'),
      'the phone still sits inside the content, above the photograph');

    const seen = [];
    for (const bottom of [2000, 1200, 965, 900, 800, 600, 300, 0]) {
      sec.getBoundingClientRect = () => ({ top: bottom - 2400, bottom, height: 2400,
        left: 0, right: 1440, width: 1440 });
      win.dispatchEvent(new win.Event('scroll'));
      await new Promise((r) => win.requestAnimationFrame(r));   // let the frame run
      const moved = [...sec.querySelectorAll('*')].filter((e) => e.style.transform);
      assert.equal(moved.length, 1, `one element moves: ${moved.map((e) => e.className)}`);
      assert.equal(moved[0].className, 'wc-move');
      seen.push(Number((moved[0].style.transform.match(/,([-\d.]+)px/) || [0, 0])[1]));
    }
    // nothing until the wave's top edge (section bottom minus 197) reaches 768
    assert.deepEqual(seen.slice(0, 3), [0, 0, 0], `still at normal speed: ${seen}`);
    assert.deepEqual(seen.slice(3), [32.5, 82.5, 182.5, 332.5, 482.5], `half speed after: ${seen}`);
  } finally { win.close(); }
});

test('the wave layer covers the swoop and laps over the section',
  { skip: !JSDOM && 'jsdom not installed' }, () => {
  load((win) => {
    const css = [...win.document.querySelectorAll('style')].map((x) => x.textContent).join('');
    assert.match(css, /--wd-wave-h:calc\(var\(--wd-swoop\) \+ 40px\)/, 'the swoop plus 40px');
    assert.match(css, /--wd-swoop:10\.875vw/, 'the swoop is 87 source rows at 200%');
    assert.match(css, /--wd-mask-y:-22\.375vw/, 'the mask is pushed up to the swoop');
    assert.match(css, /\.wd-wave\{[^}]*bottom:calc\(100% - 2px\)/, 'a 2px lap, no seam');
    assert.match(css, /\.wc-parallax > \.wc-move\{[^}]*padding-bottom:calc\(var\(--s-space-section\) \+ var\(--wd-wave-h\)\)/,
      'the section above keeps the wave\'s height clear at the bottom');
    assert.ok(!/--wd-wave-h:45vw/.test(css), 'the old 45vw layer is gone');
  }, WAVE_PAGE);
});
