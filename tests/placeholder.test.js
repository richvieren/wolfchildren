import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

// Richard, 2026-10-05. The desktop composition on mengto-skeuomorphic carries a
// star rating and three reviews that nobody wrote. They are there so the layout
// can be judged, and they read as real, which is exactly why they are dangerous.
//
// Every one of them is marked data-placeholder="review". This test fails if a
// single one reaches the page we actually sell from.

const MARK = 'data-placeholder="review"';

test('no invented review copy reaches the real Compass page', () => {
  const page = 'readings/compass/index.html';
  assert.ok(existsSync(page), `${page} must exist`);
  const html = readFileSync(page, 'utf8');
  const n = html.split(MARK).length - 1;
  assert.equal(n, 0,
    `${page} carries ${n} placeholder review element(s). These are invented ` +
    'testimonials and an invented rating. They must never ship.');
});

test('the mengto variant is allowed to carry them', () => {
  const html = readFileSync('readings/compass/mengto-skeuomorphic/index.html', 'utf8');
  assert.ok(html.includes(MARK),
    'mengto-skeuomorphic is where the placeholders live; losing them silently ' +
    'would make the test above pass for the wrong reason');
});
