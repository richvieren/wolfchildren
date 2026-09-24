// wheel.js — the Compass wheel in the browser: the geometry of the API's
// reader/wheel.py (same radii, same projection, same isotonic spreading, so a
// server render and a browser render draw the same wheel), with the one thing
// taken from Cato's chart wheel (Richard, 2026-09-15): tap a planet, its aspect
// lines light up while the rest fade, and the placement reads out in the centre.
//
// No D3: a small helper around createElementNS builds the SVG. No font glyphs
// from anywhere but our own subset (family "Wheel Glyphs", declared by the
// page's CSS from /assets/fonts/wheel-glyphs.woff2). The Sun is a circle and a
// dot; retrograde is a small R. Orange is for the Ascendant only.
//
// 2026-09-15 (Cato's audit fault, found here too): the wheel turns on the START of the rising
// sign, like the cusps, so house 1 and the rising sign sit wholly below the horizon at every
// degree. Turning on the exact Ascendant put up to 30 degrees of house 1 above it. The AC marker
// stands on the horizon with the exact degree under it; a small tick marks the true Ascendant.
//
// Input: the chart JSON the API stores at intake (points, angles, aspects).
// layout(chart) is pure and testable; renderWheel(container, chart, opts)
// draws it and wires the interaction.

export const CX = 300, CY = 300;
export const R_ZODIAC_OUT = 292, R_ZODIAC_IN = 252, R_TICK_IN = 246;
export const R_TETHER_OUT = 246, R_TETHER_IN = 228;
export const R_GLYPH = 212, R_DEGREE = 190, R_HIT = 16;
export const R_HOUSE_OUT = 172, R_HOUSE_IN = 150, R_ANGLE_LABEL = 138, R_ASPECT = 148;
export const R_AC_LABEL = 128, R_AC_TICK_IN = 140;
export const MIN_SEPARATION = 8;

export const GREEN = '#495543', TAN = '#CDB494', ORANGE = '#DA4635', CREAM = '#DFD7C3';
export const TAN_SOFT = 'rgba(205,180,148,.45)';
// The fallbacks stay here and are deliberately absent from the server twin (reader/wheel.py):
// in a browser a missing web font should still draw a glyph, and nothing is embedded. In the PDF
// the same fallback got embedded and tripped the brand-font guard (2026-09-24).
const GLYPH_FONT = "'Wheel Glyphs', 'Noto Sans Symbols', 'Apple Symbols', sans-serif";
const MONO_FONT = "'IBM Plex Mono', ui-monospace, Menlo, monospace";

export const SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
export const SIGN_GLYPH = Object.fromEntries(SIGNS.map((s, i) => [s, '♈♉♊♋♌♍♎♏♐♑♒♓'[i]]));
export const BODY_GLYPH = { Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂', Jupiter: '♃', Saturn: '♄',
  Uranus: '♅', Neptune: '♆', Pluto: '♇', Chiron: '⚷', 'North Node': '☊', 'South Node': '☋' };
export const ASPECT_COLOR = { opposition: GREEN, square: GREEN, trine: TAN, sextile: TAN };
const ORDINAL = ['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth'];

export const COPY = {
  captionTap: 'Tap a planet to see its aspects.',
  captionHover: 'Hover or tap a planet to see its aspects.',
  aspects: (n) => n === 1 ? '1 aspect' : `${n} aspects`,
};

// ---------------------------------------------------------------- geometry

export function pos(lon, asc, r) {
  const a = (180 + (lon - asc)) * Math.PI / 180;
  return [CX + r * Math.cos(a), CY - r * Math.sin(a)];
}

export function isotonicNonDecreasing(values) {
  const blocks = [];
  for (const v of values) {
    blocks.push([v, 1]);
    while (blocks.length > 1 && blocks[blocks.length - 2][0] / blocks[blocks.length - 2][1] > blocks[blocks.length - 1][0] / blocks[blocks.length - 1][1]) {
      const [s, c] = blocks.pop();
      blocks[blocks.length - 1][0] += s;
      blocks[blocks.length - 1][1] += c;
    }
  }
  const out = [];
  for (const [s, c] of blocks) for (let i = 0; i < c; i++) out.push(s / c);
  return out;
}

// Drawn longitudes: at least minSep apart, order kept, total movement minimised,
// a cluster centred on its true middle. The circle is cut at its widest empty gap.
export function spread(lons, minSep = MIN_SEPARATION) {
  const n = lons.length;
  if (n < 2) return lons.slice();
  const order = [...lons.keys()].sort((i, j) => (lons[i] - lons[j]) || (i - j));
  const s = order.map((i) => ((lons[i] % 360) + 360) % 360);
  const gaps = s.map((v, k) => (((s[(k + 1) % n] - v) % 360) + 360) % 360);
  let k0 = 0;
  for (let k = 1; k < n; k++) if (gaps[k] > gaps[k0]) k0 = k;
  const start = (k0 + 1) % n;
  const seq = [...Array(n).keys()].map((j) => s[(start + j) % n]);
  const un = [seq[0]];
  for (let j = 1; j < n; j++) { let v = seq[j]; while (v < un[un.length - 1]) v += 360; un.push(v); }
  const fit = isotonicNonDecreasing(un.map((v, j) => v - j * minSep));
  const out = new Array(n);
  for (let j = 0; j < n; j++) out[order[(start + j) % n]] = (((fit[j] + j * minSep) % 360) + 360) % 360;
  return out;
}

export function layout(chart) {
  const asc = chart.angles.find((a) => a.name === 'Ascendant').abs;
  const mc = chart.angles.find((a) => a.name === 'Midheaven').abs;
  const risingStart = Math.floor(asc / 30) * 30;
  const points = chart.points.filter((p) => p.name === 'Sun' || p.name in BODY_GLYPH);
  const drawn = spread(points.map((p) => p.abs));
  const by = Object.fromEntries(chart.points.map((p) => [p.name, p.abs]));
  by.Ascendant = asc; by.Midheaven = mc;           // aspects to the two angles are drawn (Calijn: Pluto square Midheaven, 0.04)
  const aspects = chart.aspects
    .filter((a) => ASPECT_COLOR[a.type] && a.a in by && a.b in by)
    .map((a) => ({ a: a.a, b: a.b, type: a.type, orb: a.orb, color: ASPECT_COLOR[a.type], width: a.orb <= 2 ? 1.6 : 0.8 }));
  return {
    asc, mc, risingStart, anchor: risingStart,
    ascDegree: chart.angles.find((a) => a.name === 'Ascendant').degree,
    cusps: [...Array(12).keys()].map((h) => (risingStart + h * 30) % 360),
    planets: points.map((p, i) => ({ name: p.name, sign: p.sign, house: p.house, degree: p.degree, abs: p.abs,
      retrograde: !!p.retrograde, drawn: drawn[i], sun: p.name === 'Sun' })),
    aspects,
    // every aspect in the chart, conjunctions included: the readout counts these and lights their partners
    allAspects: chart.aspects.filter((a) => a.a in by && a.b in by).map((a) => ({ a: a.a, b: a.b, type: a.type })),
  };
}

// ---------------------------------------------------------------- drawing

const NS = 'http://www.w3.org/2000/svg';
function el(tag, attrs = {}, parent = null) {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) if (v !== null && v !== undefined) e.setAttribute(k, String(v));
  if (parent) parent.appendChild(e);
  return e;
}
function txt(parent, x, y, str, attrs = {}) {
  const t = el('text', { x: x.toFixed(2), y: y.toFixed(2), 'text-anchor': 'middle', 'dominant-baseline': 'central', ...attrs }, parent);
  t.textContent = str;
  return t;
}
function lineEl(parent, [x1, y1], [x2, y2], attrs = {}) {
  return el('line', { x1: x1.toFixed(2), y1: y1.toFixed(2), x2: x2.toFixed(2), y2: y2.toFixed(2), ...attrs }, parent);
}
function arcPath(lon0, lon1, r0, r1, asc) {
  const [x0, y0] = pos(lon0, asc, r1), [x1, y1] = pos(lon1, asc, r1), [x2, y2] = pos(lon1, asc, r0), [x3, y3] = pos(lon0, asc, r0);
  return `M${x0.toFixed(2)},${y0.toFixed(2)} A${r1},${r1} 0 0,0 ${x1.toFixed(2)},${y1.toFixed(2)} L${x2.toFixed(2)},${y2.toFixed(2)} A${r0},${r0} 0 0,1 ${x3.toFixed(2)},${y3.toFixed(2)} Z`;
}

export function renderWheel(container, chart, opts = {}) {
  const L = layout(chart);
  const P = (lon, r) => pos(lon, L.anchor, r);          // turns on the start of the rising sign
  const hover = typeof matchMedia === 'function' && matchMedia('(hover: hover)').matches;
  const fade = 'opacity .35s, stroke .35s, stroke-width .35s, fill .35s';
  container.textContent = '';

  const svg = el('svg', { class: 'wheel', viewBox: '0 0 600 600', role: 'img',
    'aria-label': opts.ariaLabel || 'The birth chart, the Ascendant on the left',
    style: 'display:block;width:100%;height:auto;font-family:' + MONO_FONT }, container);

  // sign ring
  SIGNS.forEach((sign, i) => el('path', { class: 'sign', d: arcPath(i * 30, i * 30 + 30, R_ZODIAC_IN, R_ZODIAC_OUT, L.anchor),
    fill: i % 2 === 0 ? TAN_SOFT : 'none', stroke: TAN, 'stroke-width': 1 }, svg));
  SIGNS.forEach((sign, i) => {
    const [x, y] = P(i * 30 + 15, (R_ZODIAC_OUT + R_ZODIAC_IN) / 2);
    txt(svg, x, y, SIGN_GLYPH[sign], { class: 'sign-glyph', 'font-family': GLYPH_FONT, 'font-size': 18, fill: GREEN });
  });
  for (let d = 0; d < 360; d += 5) lineEl(svg, P(d, d % 10 === 0 ? R_TICK_IN : R_TICK_IN + 3), P(d, R_ZODIAC_IN), { class: 'tick', stroke: TAN, 'stroke-width': 1 });

  // house ring, Whole Sign cusps on sign boundaries from the rising sign
  el('circle', { cx: CX, cy: CY, r: R_HOUSE_OUT, fill: 'none', stroke: TAN, 'stroke-width': 1 }, svg);
  el('circle', { cx: CX, cy: CY, r: R_HOUSE_IN, fill: 'none', stroke: TAN, 'stroke-width': 1 }, svg);
  L.cusps.forEach((cusp, h) => {
    lineEl(svg, P(cusp, R_HOUSE_IN), P(cusp, R_ZODIAC_IN), { class: 'cusp', stroke: TAN, 'stroke-width': 1 });
    const [x, y] = P(cusp + 15, (R_HOUSE_OUT + R_HOUSE_IN) / 2);
    txt(svg, x, y, String(h + 1), { class: 'house-number', 'font-size': 10, fill: GREEN });
  });

  // aspects, then the hub the readout sits on
  const byAbs = { ...Object.fromEntries(chart.points.map((p) => [p.name, p.abs])), Ascendant: L.asc, Midheaven: L.mc };
  const aspectLines = L.aspects.map((a) => ({ ...a,
    line: lineEl(svg, P(byAbs[a.a], R_ASPECT), P(byAbs[a.b], R_ASPECT),
      { class: 'aspect', stroke: a.color, 'stroke-width': a.width, opacity: 0.9, style: 'transition:' + fade }) }));
  const halo = { stroke: CREAM, 'stroke-width': 4, 'stroke-linejoin': 'round', 'paint-order': 'stroke' };
  const card = el('rect', { class: 'hub-card', rx: 6, fill: CREAM, 'fill-opacity': 0.94, opacity: 0 }, svg);
  const title = txt(svg, CX, CY - 16, opts.name || '', { class: 'hub-title', 'font-family': 'Montserrat, sans-serif', 'font-weight': 900, 'font-size': 17, fill: GREEN, ...halo });
  const line2 = txt(svg, CX, CY + 6, '', { class: 'hub-sub', 'font-size': 11, fill: GREEN, ...halo });
  const line3 = txt(svg, CX, CY + 22, '', { class: 'hub-sub', 'font-size': 11, fill: GREEN, ...halo });

  // the angles: AC in orange (the page's one orange) on the horizon, with the exact degree and a tick
  // at the true Ascendant; MC in green at its longitude
  lineEl(svg, P(L.anchor, R_HOUSE_IN), P(L.anchor, R_ZODIAC_IN), { class: 'ac', stroke: ORANGE, 'stroke-width': 2 });
  lineEl(svg, P(L.asc, R_AC_TICK_IN), P(L.asc, R_HOUSE_IN), { class: 'ac-tick', stroke: ORANGE, 'stroke-width': 2 });
  const [ax, ay] = P(L.anchor, R_AC_LABEL);
  txt(svg, ax, ay - 7, 'AC', { class: 'ac-label', 'font-size': 11, 'font-weight': 700, fill: ORANGE, ...halo });
  txt(svg, ax, ay + 7, `${Math.floor(L.ascDegree)}°`, { class: 'ac-degree', 'font-size': 9, 'font-weight': 700, fill: ORANGE, ...halo });
  lineEl(svg, P(L.mc, R_HOUSE_IN), P(L.mc, R_ZODIAC_IN), { class: 'mc', stroke: GREEN, 'stroke-width': 2 });
  const [mx, my] = P(L.mc, R_ANGLE_LABEL);
  txt(svg, mx, my, 'MC', { class: 'mc-label', 'font-size': 11, 'font-weight': 700, fill: GREEN, ...halo });

  // planets: glyph and degree at the spread position, a tether from the true one, a hit disc for the interaction
  const nodes = L.planets.map((p) => {
    const g = el('g', { class: 'planet', 'data-name': p.name, role: 'button', tabindex: 0,
      'aria-label': `${p.name} in ${p.sign}, ${ORDINAL[p.house]} house`, style: 'cursor:pointer;outline:none;transition:' + fade }, svg);
    lineEl(g, P(p.abs, R_TETHER_OUT), P(p.drawn, R_TETHER_IN), { class: 'tether', stroke: TAN, 'stroke-width': 1 });
    const [gx, gy] = P(p.drawn, R_GLYPH);
    const disc = el('circle', { class: 'hit', cx: gx.toFixed(2), cy: gy.toFixed(2), r: R_HIT, fill: CREAM, 'fill-opacity': 0,
      stroke: GREEN, 'stroke-opacity': 0, 'stroke-width': 1.5, style: 'transition:' + fade }, g);
    if (p.sun) {
      el('circle', { class: 'glyph', cx: gx.toFixed(2), cy: gy.toFixed(2), r: 7, fill: 'none', stroke: GREEN, 'stroke-width': 1.6, 'pointer-events': 'none' }, g);
      el('circle', { cx: gx.toFixed(2), cy: gy.toFixed(2), r: 1.8, fill: GREEN, 'pointer-events': 'none' }, g);
    } else {
      txt(g, gx, gy, BODY_GLYPH[p.name], { class: 'glyph', 'font-family': GLYPH_FONT, 'font-size': 19, fill: GREEN, 'pointer-events': 'none' });
    }
    const [dx, dy] = P(p.drawn, R_DEGREE);
    const deg = txt(g, dx, dy, `${Math.floor(p.degree)}°`, { class: 'degree', 'font-size': 9, fill: GREEN, 'pointer-events': 'none' });
    if (p.retrograde) { const r = el('tspan', { 'font-size': 7, 'font-weight': 700, dx: 1 }, deg); r.textContent = 'R'; }
    return { ...p, g, disc };
  });

  // ---- the interaction: one planet lit, its aspects lit, the rest faded, the placement in the hub
  let pinned = null, shown = null;
  const related = (name) => new Set(L.allAspects.flatMap((a) => (a.a === name ? [a.b] : a.b === name ? [a.a] : [])));
  const countFor = (name) => L.allAspects.filter((a) => a.a === name || a.b === name).length;
  function show(name) {
    shown = name;
    const rel = name ? related(name) : null;
    for (const n of nodes) {
      const on = n.name === name, near = !name || on || rel.has(n.name);
      n.g.setAttribute('opacity', near ? 1 : 0.3);
      n.disc.setAttribute('fill-opacity', on ? 1 : 0);
      n.disc.setAttribute('fill', on ? TAN_SOFT : CREAM);
      n.disc.setAttribute('stroke-opacity', on ? 1 : 0);
    }
    for (const a of aspectLines) {
      const on = name && (a.a === name || a.b === name);
      a.line.setAttribute('opacity', !name ? 0.9 : on ? 1 : 0.08);
      a.line.setAttribute('stroke', on ? GREEN : a.color);
      a.line.setAttribute('stroke-width', on ? 2 : a.width);
    }
    const p = name && nodes.find((n) => n.name === name);
    title.textContent = p ? p.name : (opts.name || '');
    line2.textContent = p ? `in ${p.sign} · ${ORDINAL[p.house]} house` : '';
    line3.textContent = p ? `${Math.floor(p.degree)}°${p.retrograde ? ' R' : ''} · ${COPY.aspects(countFor(name))}` : '';
    if ((p || opts.name) && typeof title.getBBox === 'function') {
      const boxes = (p ? [title, line2, line3] : [title]).map((t) => t.getBBox());
      const x0 = Math.min(...boxes.map((b) => b.x)) - 10, x1 = Math.max(...boxes.map((b) => b.x + b.width)) + 10;
      const y0 = Math.min(...boxes.map((b) => b.y)) - 6, y1 = Math.max(...boxes.map((b) => b.y + b.height)) + 6;
      card.setAttribute('x', x0.toFixed(1)); card.setAttribute('y', y0.toFixed(1));
      card.setAttribute('width', (x1 - x0).toFixed(1)); card.setAttribute('height', (y1 - y0).toFixed(1));
    }
    card.setAttribute('opacity', p || opts.name ? 1 : 0);
  }
  const toggle = (name) => { pinned = pinned === name ? null : name; show(pinned); };
  for (const n of nodes) {
    n.g.addEventListener('click', (e) => { e.preventDefault(); toggle(n.name); });
    n.g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(n.name); } });
    if (hover) {
      n.g.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse' && !pinned) show(n.name); });
      n.g.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse' && !pinned) show(null); });
    }
  }
  svg.addEventListener('click', (e) => { if (!e.target.closest('.planet') && pinned) { pinned = null; show(null); } });
  show(null);

  const caption = document.createElement('p');
  caption.className = 'wheel-caption';
  caption.textContent = opts.caption || (hover ? COPY.captionHover : COPY.captionTap);
  container.appendChild(caption);
  return { svg, show, layout: L };
}
