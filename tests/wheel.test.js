// tests/wheel.test.js — the browser wheel (assets/js/wheel.js) draws the same
// geometry as the API's reader/wheel.py: the fixture carries the synthetic
// stellium chart and the drawn longitudes Python's spreading produced for it.
// The Ascendant is at nine o'clock, cusps sit on sign boundaries, glyphs keep
// their separation, and no kerykeion glyph or Sun code point is used.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { CX, CY, MIN_SEPARATION, BODY_GLYPH, isotonicNonDecreasing, spread, pos, layout, COPY } from '../assets/js/wheel.js';

const fx = JSON.parse(readFileSync(new URL('./fixtures/wheel-stellium.json', import.meta.url), 'utf8'));
const diff = (a, b) => { const d = Math.abs(a - b) % 360; return Math.min(d, 360 - d); };

test('pool adjacent violators is non-decreasing and pools', () => {
  assert.deepEqual(isotonicNonDecreasing([1, 2, 3]), [1, 2, 3]);
  assert.deepEqual(isotonicNonDecreasing([3, 1, 2]), [2, 2, 2]);
  assert.deepEqual(isotonicNonDecreasing([1, 5, 2, 8]), [1, 3.5, 3.5, 8]);
});

test('spreading matches the Python wheel on the stellium chart', () => {
  const names = fx.chart.points.map((p) => p.name);
  const out = spread(fx.chart.points.map((p) => p.abs));
  names.forEach((n, i) => assert.ok(Math.abs(out[i] - fx.drawn[n]) < 1e-6, `${n}: ${out[i]} vs ${fx.drawn[n]}`));
  for (let i = 0; i < out.length; i++) for (let j = i + 1; j < out.length; j++) assert.ok(diff(out[i], out[j]) >= MIN_SEPARATION - 1e-6);
});

test('far apart points stay put; a cluster across the wrap keeps order and separation', () => {
  assert.deepEqual(spread([10, 100, 200, 300]), [10, 100, 200, 300]);
  const out = spread([0.5, 359.5, 180, 2]);
  assert.ok(Math.abs(diff(out[1], out[0]) - MIN_SEPARATION) < 1e-9);
  assert.ok(Math.abs(diff(out[0], out[3]) - MIN_SEPARATION) < 1e-9);
});

test('the Ascendant projects to exactly nine o clock', () => {
  const [x, y] = pos(214.65, 214.65, 150);
  assert.ok(Math.abs(x - (CX - 150)) < 1e-9 && Math.abs(y - CY) < 1e-9);
});

test('layout: cusps on sign boundaries from the rising sign, every body drawn, aspects between bodies and the two angles', () => {
  const L = layout(fx.chart);
  assert.equal(L.cusps.length, 12);
  L.cusps.forEach((c, h) => assert.ok(diff(c, L.risingStart + h * 30) < 1e-9));
  assert.deepEqual(L.planets.map((p) => p.name), fx.chart.points.map((p) => p.name));
  assert.ok(L.planets.every((p) => p.sun || p.name in BODY_GLYPH));
  const ends = new Set([...fx.chart.points.map((p) => p.name), 'Ascendant', 'Midheaven']);
  for (const a of L.aspects) assert.ok(ends.has(a.a) && ends.has(a.b));
  assert.equal(L.aspects.some((a) => a.type === 'conjunction'), false);
});

test('no Sun code point and no variation selectors in the glyph tables', () => {
  const all = Object.values(BODY_GLYPH).join('');
  assert.ok(!all.includes('☉') && !all.includes('︎') && !all.includes('️'));
  assert.equal(COPY.aspects(1), '1 aspect');
  assert.equal(COPY.aspects(4), '4 aspects');
});

test('aspects to the Ascendant and Midheaven are drawn; conjunctions are counted but not drawn', () => {
  const L = layout(fx.chart);
  assert.ok(L.aspects.some((a) => a.b === 'Midheaven'));
  const conj = { ...fx.chart, aspects: [...fx.chart.aspects, { a: 'Mars', b: 'Saturn', type: 'conjunction', orb: 0.6 }] };
  const C = layout(conj);
  assert.equal(C.aspects.some((a) => a.type === 'conjunction'), false);
  assert.ok(C.allAspects.some((a) => a.type === 'conjunction' && a.a === 'Mars'));
});
