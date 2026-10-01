#!/usr/bin/env node
// widget-forms.mjs — twelve shapes a Compass widget could take, drawn with
// Nora's real numbers so none of it is a mock.
//
// Richard, 2026-10-01: premium, mobile first, playful, clear at a glance, and a
// lot of variation. Not everything can be a slider. This is the menu to pick ten
// from; nothing here is wired into the product.
//
// All hand-drawn SVG and CSS. No chart library, no build step, no PDF engine to
// survive. The palette is the reading's own, so this is how they would actually
// look inside a Compass.
//
//   node widget-forms.mjs

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PIXEL, DATASET } from './variants.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));

// Nora. 12 January 2020, 14:30, Ghent. A child who does not exist.
const EL = { fire: 35, earth: 35, air: 25, water: 5 };
const MOD = { cardinal: 38, fixed: 35, mutable: 27 };
const PER_SIGN = { Capricorn: 6, Leo: 1, Aquarius: 1, Sagittarius: 1, Taurus: 1, Pisces: 1, Aries: 1, Cancer: 1 };
const SIGNS = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const WIRED = [['Who she is',3],['How she feels',1],['How she thinks',3],['What she loves',0],['How she pushes',1]];
const SPEED = { 'How she feels': [14.47, 11.8, 15.4], 'How she thinks': [1.65, -1.4, 2.2],
                'What she loves': [1.22, -0.62, 1.26], 'How she pushes': [0.68, -0.4, 0.8] };
const MOON_ANGLE = 203.3;

const P = (a) => a.map(([x, y]) => `${x},${y}`).join(' ');
const pol = (cx, cy, r, deg) => [cx + r * Math.cos((deg - 90) * Math.PI / 180), cy + r * Math.sin((deg - 90) * Math.PI / 180)];
const arc = (cx, cy, r, a0, a1) => {
  const [x0, y0] = pol(cx, cy, r, a0), [x1, y1] = pol(cx, cy, r, a1);
  return `M ${x0} ${y0} A ${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1}`;
};

// ── 1 moon phase ──────────────────────────────────────────────────────────
function moon() {
  const c = Math.cos(MOON_ANGLE * Math.PI / 180), lit = (1 - c) / 2, wax = MOON_ANGLE < 180;
  const R = 52, C = 70, rx = (R * Math.abs(c)).toFixed(1);
  const half = wax ? `M ${C},${C-R} A ${R},${R} 0 0,1 ${C},${C+R} Z` : `M ${C},${C-R} A ${R},${R} 0 0,0 ${C},${C+R} Z`;
  const gib = lit > 0.5, sweep = gib ? (wax ? 0 : 1) : (wax ? 1 : 0);
  const pits = [[56,52,10],[88,62,7],[66,90,8],[44,78,5],[80,40,4],[94,86,5]]
    .map(([x,y,r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#C9BCA0" opacity=".32"/>`).join('');
  return `<svg viewBox="0 0 140 140" class="art"><circle cx="${C}" cy="${C}" r="${R+11}" fill="#3A4435"/>
    <circle cx="${C}" cy="${C}" r="${R}" fill="#5D6A56"/><path d="${half}" fill="#F0E7D2"/>
    <path d="M ${C},${C-R} A ${rx},${R} 0 0,${sweep} ${C},${C+R} Z" fill="${gib ? '#F0E7D2' : '#5D6A56'}"/>
    ${pits}<circle cx="${C}" cy="${C}" r="${R}" fill="none" stroke="#2F382B" stroke-width="1.4"/></svg>`;
}

// ── 2 ring of four ────────────────────────────────────────────────────────
function ring() {
  const keys = Object.keys(EL); let a = 0; const cols = ['#C0623A','#6E7A5E','#A9A07E','#5B7E86'];
  const segs = keys.map((k, i) => {
    const sweep = EL[k] / 100 * 360, d = arc(70, 70, 50, a + 1.5, a + sweep - 1.5); a += sweep;
    return `<path d="${d}" fill="none" stroke="${cols[i]}" stroke-width="17" stroke-linecap="butt"/>`;
  }).join('');
  return `<svg viewBox="0 0 140 140" class="art">${segs}
    <text x="70" y="66" class="big">35%</text><text x="70" y="84" class="tiny">fire and earth</text></svg>`;
}

// ── 3 twelve slots, where everything piles up ─────────────────────────────
function slots() {
  const cells = SIGNS.map((s, i) => {
    const n = PER_SIGN[s] || 0;
    const dots = Array.from({ length: n }, (_, j) => `<circle cx="${12 + (j % 3) * 9}" cy="${30 - Math.floor(j / 3) * 9}" r="3.4" fill="#495543"/>`).join('');
    return `<g transform="translate(${(i % 4) * 70},${Math.floor(i / 4) * 56})">
      <rect x="2" y="2" width="64" height="48" rx="4" fill="${n ? 'rgba(205,180,148,.34)' : 'none'}" stroke="#CDB494"/>
      ${dots}<text x="34" y="46" class="tiny">${s.slice(0, 3).toUpperCase()}</text></g>`;
  }).join('');
  return `<svg viewBox="0 0 280 170" class="art wide">${cells}</svg>`;
}

// ── 4 tug of war ──────────────────────────────────────────────────────────
function tug() {
  // Cardinal 38 against mutable 27. The knot sits where the stronger side has
  // dragged it, so the gap is the number and nobody has to read a percentage.
  const a = MOD.cardinal, b = MOD.mutable, k = 160 + ((a - b) / (a + b)) * 92;
  const rope = Array.from({ length: 26 }, (_, i) => {
    const x = 36 + i * (248 / 25);
    return `${x},${48 + (i % 2 ? 2.4 : -2.4)}`;
  }).join(' ');
  return `<svg viewBox="0 0 320 96" class="art wide">
    <polyline points="${rope}" fill="none" stroke="#CDB494" stroke-width="3" stroke-linejoin="round"/>
    <line x1="160" y1="22" x2="160" y2="74" stroke="#495543" stroke-width="1" stroke-dasharray="3 4"/>
    <circle cx="${k}" cy="48" r="11" fill="#C0623A"/>
    <circle cx="${k}" cy="48" r="4" fill="#F3EEE2"/>
    <text x="30" y="86" class="tiny s">digs in first</text>
    <text x="290" y="86" class="tiny e">rolls with it</text></svg>`;
}

// ── 5 horizon, born in daylight ───────────────────────────────────────────
function horizon() {
  return `<svg viewBox="0 0 320 120" class="art wide">
    <rect x="0" y="0" width="320" height="76" fill="rgba(205,180,148,.28)"/>
    <line x1="0" y1="76" x2="320" y2="76" stroke="#495543" stroke-width="1.5"/>
    <circle cx="214" cy="40" r="19" fill="#C0623A"/>
    ${Array.from({length:12},(_,i)=>{const [x,y]=pol(214,40,27,i*30);return `<line x1="${x}" y1="${y}" x2="${pol(214,40,33,i*30)[0]}" y2="${pol(214,40,33,i*30)[1]}" stroke="#C0623A" stroke-width="2"/>`}).join('')}
    <text x="12" y="100" class="tiny s">the sun was still up when she arrived</text></svg>`;
}

// ── 6 web of four ─────────────────────────────────────────────────────────
function web() {
  const keys = Object.keys(EL), R = 52;
  const pts = keys.map((k, i) => pol(70, 70, R * (EL[k] / 40), i * 90));
  const rings = [0.33, 0.66, 1].map(f => `<polygon points="${P(keys.map((_, i) => pol(70, 70, R * f, i * 90)))}" fill="none" stroke="#CDB494" stroke-width="1"/>`).join('');
  const labs = keys.map((k, i) => { const [x, y] = pol(70, 70, R + 14, i * 90); return `<text x="${x}" y="${y + 4}" class="tiny">${k}</text>`; }).join('');
  return `<svg viewBox="0 0 140 140" class="art">${rings}
    <polygon points="${P(pts)}" fill="rgba(192,98,58,.30)" stroke="#C0623A" stroke-width="2"/>
    ${pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.2" fill="#C0623A"/>`).join('')}${labs}</svg>`;
}

// ── 7 speed dial ──────────────────────────────────────────────────────────
function dial() {
  const [v, lo, hi] = SPEED['How she feels'], f = (v - lo) / (hi - lo);
  const a0 = -120, a1 = 120, a = a0 + f * (a1 - a0);
  const [nx, ny] = pol(70, 84, 44, a);
  const ticks = Array.from({length:9},(_,i)=>{const t=a0+i*(a1-a0)/8;const [x1,y1]=pol(70,84,50,t),[x2,y2]=pol(70,84,56,t);
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#CDB494" stroke-width="1.6"/>`}).join('');
  return `<svg viewBox="0 0 140 120" class="art"><path d="${arc(70,84,50,a0,a1)}" fill="none" stroke="#CDB494" stroke-width="3"/>
    <path d="${arc(70,84,50,a0,a)}" fill="none" stroke="#C0623A" stroke-width="4"/>${ticks}
    <line x1="70" y1="84" x2="${nx}" y2="${ny}" stroke="#495543" stroke-width="3" stroke-linecap="round"/>
    <circle cx="70" cy="84" r="5" fill="#495543"/>
    <text x="22" y="108" class="tiny s">slow</text><text x="118" y="108" class="tiny e">quick</text></svg>`;
}

// ── 8 constellation of wiring ─────────────────────────────────────────────
function constellation() {
  const nodes = { 'Who she is': [160,34], 'How she thinks': [250,78], 'How she pushes': [214,140],
                  'How she feels': [96,140], 'What she loves': [58,72] };
  const links = [['Who she is','How she thinks'],['Who she is','How she pushes'],['How she thinks','How she pushes'],['Who she is','How she feels']];
  const ln = links.map(([a,b]) => `<line x1="${nodes[a][0]}" y1="${nodes[a][1]}" x2="${nodes[b][0]}" y2="${nodes[b][1]}" stroke="#CDB494" stroke-width="1.6"/>`).join('');
  const nd = Object.entries(nodes).map(([k,[x,y]]) => {
    const n = WIRED.find(w => w[0] === k)[1];
    return `<circle cx="${x}" cy="${y}" r="${7 + n * 2.6}" fill="${n ? '#495543' : 'none'}" stroke="#495543" stroke-width="${n ? 0 : 1.8}" stroke-dasharray="${n ? '' : '3 3'}"/>
      <text x="${x}" y="${y + (y > 100 ? 30 : -22)}" class="tiny">${k}</text>`;
  }).join('');
  return `<svg viewBox="0 0 320 180" class="art wide">${ln}${nd}</svg>`;
}

// ── 9 one bar, three parts ────────────────────────────────────────────────
function stacked() {
  const keys = Object.keys(MOD), cols = ['#C0623A','#495543','#A9A07E']; let x = 0;
  const segs = keys.map((k, i) => { const w = MOD[k] / 100 * 300; const s = `<rect x="${x + 10}" y="18" width="${w - 3}" height="34" rx="3" fill="${cols[i]}"/>
    <text x="${x + 10 + w / 2}" y="40" class="tiny on">${MOD[k]}%</text>`; x += w; return s; }).join('');
  const labs = keys.map((k, i) => `<text x="${14 + i * 100}" y="72" class="tiny s">${k}</text>`).join('');
  return `<svg viewBox="0 0 320 84" class="art wide">${segs}${labs}</svg>`;
}

// ── 10 orbit rings ────────────────────────────────────────────────────────
function orbit() {
  const rs = [22, 34, 46, 58], bodies = [[22, 40],[34, 150],[46, 255],[58, 320],[46, 70],[34, 300]];
  const rings = rs.map(r => `<circle cx="70" cy="70" r="${r}" fill="none" stroke="#CDB494" stroke-width="1"/>`).join('');
  const dots = bodies.map(([r, d]) => { const [x, y] = pol(70, 70, r, d); return `<circle cx="${x}" cy="${y}" r="4.6" fill="#495543"/>`; }).join('');
  return `<svg viewBox="0 0 140 140" class="art"><circle cx="70" cy="70" r="9" fill="#C0623A"/>${rings}${dots}</svg>`;
}

// ── 11 climbing steps ─────────────────────────────────────────────────────
function steps() {
  const vals = WIRED.map(([, n]) => n), mx = Math.max(...vals);
  const bars = WIRED.map(([k, n], i) => `<rect x="${12 + i * 60}" y="${110 - (n / mx) * 80 || 108}" width="40" height="${(n / mx) * 80 || 2}" rx="3" fill="${n ? '#495543' : '#CDB494'}"/>
    <text x="${32 + i * 60}" y="128" class="tiny">${k.replace('How she ', '').replace('What she ', '').replace('Who she ','')}</text>`).join('');
  return `<svg viewBox="0 0 320 140" class="art wide">${bars}</svg>`;
}

// ── 12 weighted pills ─────────────────────────────────────────────────────
function pills() {
  return WIRED.map(([k, n]) => `<span class="pill" style="font-size:${11 + n * 2.4}px;opacity:${0.45 + n * 0.18}">${k}</span>`).join('');
}

// Each row: the form's name, the line a parent reads, the drawing, the answer.
// The plain line leads and the form name is a small tag, because the test is
// whether the picture lands before the words do.
const W = [
  ['Moon phase', 'The moon the night she arrived', moon(), 'Two days past full. Almost all of it still lit.'],
  ['Ring', "What she's made of", ring(), 'Equal parts fire and earth. Barely any water.'],
  ['Twelve slots', 'Where most of her sits', slots(), 'Six of her thirteen pieces landed in the same place.'],
  ['Tug of war', 'Digs in, or rolls with it', tug(), 'She digs in first, by a clear margin.'],
  ['Horizon', 'Born in daylight or in the dark', horizon(), 'The sun was still up.'],
  ['Web', 'Her outline, in one shape', web(), 'Wide on fire and earth. Pinched at water.'],
  ['Dial', 'How fast her moods move', dial(), 'Quick. Near the top of the range.'],
  ['Constellation', "What's wired to what", constellation(), 'Four parts of her are linked. One stands on its own.'],
  ['One bar', 'How she starts, holds and bends', stacked(), 'Three near-equal thirds. No single one runs her.'],
  ['Orbit', 'How close each part sits', orbit(), 'Six of them crowd the same ring.'],
  ['Columns', 'Loudest to quietest', steps(), 'Who she is and how she thinks are loudest. What she loves is quietest.'],
  ['Weighted words', 'The same ranking, no chart', `<div class="pills">${pills()}</div>`, 'Size does the work.'],
];

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Widget forms</title>
<script src="/assets/js/pixel.js?v=${PIXEL}"></script>
<style>
@font-face{font-family:"Montserrat";src:url("/assets/fonts/montserrat-900.woff2") format("woff2");font-weight:900;font-display:swap}
@font-face{font-family:"IBM Plex Mono";src:url("/assets/fonts/ibm-plex-mono-400.woff2") format("woff2");font-weight:400;font-display:swap}
@font-face{font-family:"IBM Plex Mono";src:url("/assets/fonts/ibm-plex-mono-700.woff2") format("woff2");font-weight:700;font-display:swap}
:root{--cream:#DFD7C3;--green:#495543;--tan:#CDB494;--orange:#C0623A;--tan-soft:rgba(205,180,148,.45)}
*{box-sizing:border-box}
html,body{overflow-x:clip}
body{margin:0;background:var(--cream);color:var(--green);font:400 14px/1.6 "IBM Plex Mono",monospace}
.wrap{max-width:430px;margin:0 auto;padding:0 18px 80px}
header{padding:44px 0 10px}
h1{margin:0;font:900 30px/1.05 "Montserrat",sans-serif;letter-spacing:-.03em}
header p{margin:12px 0 0;font-size:13px;opacity:.75}
.card{margin:16px 0 0;border:1px solid var(--tan);border-radius:5px;background:rgba(255,255,255,.22);padding:16px 14px 14px}
.hd{margin-bottom:14px}
.hd b{display:block;font:900 17px/1.2 "Montserrat",sans-serif;letter-spacing:-.02em}
.hd span{display:block;margin-top:5px;font-size:10px;letter-spacing:.13em;text-transform:uppercase;opacity:.5}
.art{display:block;width:100%;max-width:200px;margin:0 auto;height:auto}
.art.wide{max-width:100%}
.cap{margin:12px 0 0;padding-top:10px;border-top:1px solid var(--tan-soft);font-size:11.5px;opacity:.72}
text{font-family:"IBM Plex Mono",monospace;fill:var(--green)}
.tiny{font-size:9px;text-anchor:middle;opacity:.78}
.tiny.s{text-anchor:start}.tiny.e{text-anchor:end}.tiny.on{fill:#F3EEE2;font-weight:700;opacity:1}
.big{font:900 24px "Montserrat",sans-serif;text-anchor:middle;fill:var(--green)}
.pills{display:flex;flex-wrap:wrap;gap:8px;align-items:baseline;justify-content:center;padding:8px 0}
.pill{font-family:"Montserrat",sans-serif;font-weight:900;letter-spacing:-.01em}
</style>
</head>
<body>
<noscript><img hidden height="1" width="1" src="https://www.facebook.com/tr?id=${DATASET}&amp;ev=PageView&amp;noscript=1" alt=""></noscript>
<div class="wrap">
<header><h1>Twelve shapes a widget could take</h1>
<p>Nora's real numbers, drawn twelve ways. Hand-drawn SVG, no chart library. Pick the ten that carry the most at a glance.</p></header>
${W.map(([form, head, art, said], i) => `<div class="card">
  <div class="hd"><b>${head}</b><span>${String(i + 1).padStart(2, '0')} ${form}</span></div>
  ${art}
  <p class="cap">${said}</p></div>`).join('\n')}
</div>
</body>
</html>
`;

const dir = join(ROOT, 'readings/compass/widget-forms');
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, 'index.html'), html);
console.log(`wrote /readings/compass/widget-forms/  (${W.length} forms)`);
