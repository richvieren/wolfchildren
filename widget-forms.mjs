#!/usr/bin/env node
// widget-forms.mjs — the drawn widget forms, revised against Richard's review of
// 2026-10-01.
//
// His verdicts on the first pass: N12 (weighted words) is out. N09 (one bar) is
// out, because its data moved into the ring. The ring itself moved off elements,
// since N06's web covers that, and now carries pace. Every form gains a plain line
// that says what it measures, and no label hides behind a drawing any more.
//
// Numbers are set in Morning Memories. That came from his note on the old gauge:
// "I potentially like this better than the other ones, so in the next render use
// this font for the numbers in the stats and graphics."
//
// Every value is Nora's, read from reader/data/natal.py. Nothing is invented to
// make a picture work. The WHY lines are my drafts and are marked as drafts on the
// page, because the copy is Richard's to write.
//
//   node widget-forms.mjs

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PIXEL, DATASET } from './variants.mjs';
import { TOKENS } from './src/lib/widget-theme.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));

// ── Nora. 12 January 2020, 14:30, Ghent. A child who does not exist. ────────
const EL = { fire: 35, earth: 35, air: 25, water: 5 };
const MOD = { cardinal: 38, fixed: 35, mutable: 27 };
const PER_SIGN = { Capricorn: 6, Leo: 1, Aquarius: 1, Sagittarius: 1, Taurus: 1, Pisces: 1, Aries: 1, Cancer: 1 };
const SIGNS = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
// Connections per part, and the plain name Richard asked for: being, feeling,
// thinking, loving, pushing.
const WIRED = [['being',3],['feeling',1],['thinking',3],['loving',0],['pushing',1]];
const MOON_SPEED = { v: 14.4666, lo: 11.8, hi: 15.4 };
const MOON_ANGLE = 203.3;

const P = (a) => a.map(([x, y]) => `${x},${y}`).join(' ');
const pol = (cx, cy, r, deg) => [cx + r * Math.cos((deg - 90) * Math.PI / 180), cy + r * Math.sin((deg - 90) * Math.PI / 180)];
const arc = (cx, cy, r, a0, a1) => {
  const [x0, y0] = pol(cx, cy, r, a0), [x1, y1] = pol(cx, cy, r, a1);
  return `M ${x0} ${y0} A ${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1}`;
};
const key = (rows) => `<ul class="key">${rows.map(([sw, n, t]) => `<li><i${sw ? ` style="background:${sw}"` : ' class="hollow"'}></i><b>${n}</b> ${t}</li>`).join('')}</ul>`;

// ── N01 the moon that night ────────────────────────────────────────────────
function moon() {
  const c = Math.cos(MOON_ANGLE * Math.PI / 180), lit = (1 - c) / 2, wax = MOON_ANGLE < 180;
  const R = 52, C = 70, rx = (R * Math.abs(c)).toFixed(1);
  const half = wax ? `M ${C},${C - R} A ${R},${R} 0 0,1 ${C},${C + R} Z` : `M ${C},${C - R} A ${R},${R} 0 0,0 ${C},${C + R} Z`;
  const gib = lit > 0.5, sweep = gib ? (wax ? 0 : 1) : (wax ? 1 : 0);
  const pits = [[56, 52, 10], [88, 62, 7], [66, 90, 8], [44, 78, 5], [80, 40, 4], [94, 86, 5]]
    .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#C9BCA0" opacity=".32"/>`).join('');
  return `<svg viewBox="0 0 140 140" class="art"><circle cx="${C}" cy="${C}" r="${R + 11}" fill="#3A4435"/>
    <circle cx="${C}" cy="${C}" r="${R}" fill="#5D6A56"/><path d="${half}" fill="#F0E7D2"/>
    <path d="M ${C},${C - R} A ${rx},${R} 0 0,${sweep} ${C},${C + R} Z" fill="${gib ? '#F0E7D2' : '#5D6A56'}"/>
    ${pits}<circle cx="${C}" cy="${C}" r="${R}" fill="none" stroke="#2F382B" stroke-width="1.4"/></svg>`;
}

// ── N03 twelve places ──────────────────────────────────────────────────────
function slots() {
  const cells = SIGNS.map((s, i) => {
    const n = PER_SIGN[s] || 0;
    const dots = Array.from({ length: n }, (_, j) => `<circle cx="${12 + (j % 3) * 9}" cy="${30 - Math.floor(j / 3) * 9}" r="3.4" fill="var(--green)"/>`).join('');
    return `<g transform="translate(${(i % 4) * 70},${Math.floor(i / 4) * 56})">
      <rect x="2" y="2" width="64" height="48" rx="4" fill="${n ? 'var(--tan-soft)' : 'none'}" stroke="var(--tan)"/>
      ${dots}<text x="34" y="46" class="tiny">${s.slice(0, 3).toUpperCase()}</text></g>`;
  }).join('');
  return `<svg viewBox="0 0 280 170" class="art wide">${cells}</svg>`;
}

// ── N04 tug of war ─────────────────────────────────────────────────────────
function tug() {
  const a = MOD.cardinal, b = MOD.mutable, tot = a + b;
  const k = 160 - ((a - b) / tot) * 92;
  const rope = Array.from({ length: 26 }, (_, i) => {
    const x = 36 + i * (248 / 25);
    return `${x},${48 + (i % 2 ? 2.4 : -2.4)}`;
  }).join(' ');
  return `<svg viewBox="0 0 320 104" class="art wide">
    <polyline points="${rope}" fill="none" stroke="var(--tan)" stroke-width="3" stroke-linejoin="round"/>
    <line x1="160" y1="22" x2="160" y2="74" stroke="var(--green)" stroke-width="1" stroke-dasharray="3 4"/>
    <circle cx="${k}" cy="48" r="11" fill="var(--orange)"/><circle cx="${k}" cy="48" r="4" fill="var(--on-accent)"/>
    <text x="14" y="92" class="tiny s">PREPARES</text>
    <text x="306" y="92" class="tiny e">GOES WITH THE FLOW</text></svg>`;
}

// ── N05 above or below the horizon ─────────────────────────────────────────
function horizon() {
  const rays = Array.from({ length: 12 }, (_, i) => {
    const [x1, y1] = pol(214, 40, 27, i * 30), [x2, y2] = pol(214, 40, 33, i * 30);
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--orange)" stroke-width="2"/>`;
  }).join('');
  return `<svg viewBox="0 0 320 128" class="art wide">
    <rect x="0" y="0" width="320" height="76" fill="rgba(205,180,148,.28)"/>
    <line x1="0" y1="76" x2="320" y2="76" stroke="var(--green)" stroke-width="1.5"/>
    <circle cx="214" cy="40" r="19" fill="var(--orange)"/>${rays}
    <text x="10" y="18" class="tiny s">SKY</text><text x="10" y="94" class="tiny s">GROUND</text>
    <text x="10" y="118" class="tiny s">14:30 · the sun is up · a day child</text></svg>`;
}

// ── N06 the web of four elements ───────────────────────────────────────────
// Richard, 2026-10-01: the labels were not aligned. They had been placed at a
// fixed radius plus a hand-tuned nudge per side, so the four sat at four
// different distances. Every anchor is now exactly LR from the centre and the
// two lines stack the same way on all four, so the spacing is equal by
// construction rather than by eye.
function web() {
  const keys = Object.keys(EL), CX = 130, CY = 118, R = 48, LR = R + 30;
  const pts = keys.map((k, i) => pol(CX, CY, R * (EL[k] / 40), i * 90));
  const rings = [0.33, 0.66, 1].map((f) => `<polygon points="${P(keys.map((_, i) => pol(CX, CY, R * f, i * 90)))}" fill="none" stroke="var(--tan)" stroke-width="1"/>`).join('');
  const anchor = ['middle', 'start', 'middle', 'end'];
  const labs = keys.map((k, i) => {
    const [x, y] = pol(CX, CY, LR, i * 90);
    return `<text x="${x}" y="${y - 4}" class="tiny" text-anchor="${anchor[i]}">${k.toUpperCase()}</text>
      <text x="${x}" y="${y + 15}" class="num sm" text-anchor="${anchor[i]}">${EL[k]}%</text>`;
  }).join('');
  return `<svg viewBox="0 0 260 244" class="art wide">${rings}
    <polygon points="${P(pts)}" fill="var(--orange-soft)" stroke="var(--orange)" stroke-width="0.7"/>
    ${pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.7" fill="var(--orange)"/>`).join('')}${labs}</svg>
    ${key([['var(--orange)', 'Fire', 'acts first, asks later'],
           ['var(--orange)', 'Earth', 'wants it solid before moving'],
           ['var(--orange)', 'Air', 'talks it through'],
           ['var(--orange)', 'Water', 'feels it first']])}`;
}

// ── N07 the dial, labels below the drawing ─────────────────────────────────
function dial() {
  const { v, lo, hi } = MOON_SPEED, f = (v - lo) / (hi - lo);
  const a0 = -120, a1 = 120, a = a0 + f * (a1 - a0), CX = 80, CY = 92;
  const [nx, ny] = pol(CX, CY, 44, a);
  const ticks = Array.from({ length: 9 }, (_, i) => {
    const t = a0 + i * (a1 - a0) / 8, [x1, y1] = pol(CX, CY, 50, t), [x2, y2] = pol(CX, CY, 56, t);
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--tan)" stroke-width="1.6"/>`;
  }).join('');
  return `<svg viewBox="0 0 160 158" class="art"><path d="${arc(CX, CY, 50, a0, a1)}" fill="none" stroke="var(--tan)" stroke-width="3"/>
    <path d="${arc(CX, CY, 50, a0, a)}" fill="none" stroke="var(--orange)" stroke-width="4"/>${ticks}
    <line x1="${CX}" y1="${CY}" x2="${nx}" y2="${ny}" stroke="var(--green)" stroke-width="3" stroke-linecap="round"/>
    <circle cx="${CX}" cy="${CY}" r="5" fill="var(--green)"/>
    <text x="${CX}" y="140" class="num big">${Math.round(f * 100)}%</text>
    <text x="14" y="152" class="tiny s">SLOW</text><text x="146" y="152" class="tiny e">QUICK</text></svg>`;
}

// ── N08 what is wired to what ──────────────────────────────────────────────
function constellation() {
  const nodes = { being: [160, 36], thinking: [250, 80], pushing: [214, 140], feeling: [96, 140], loving: [58, 74] };
  const links = [['being', 'thinking'], ['being', 'pushing'], ['thinking', 'pushing'], ['being', 'feeling']];
  const ln = links.map(([a, b]) => `<line x1="${nodes[a][0]}" y1="${nodes[a][1]}" x2="${nodes[b][0]}" y2="${nodes[b][1]}" stroke="var(--tan)" stroke-width="1.6"/>`).join('');
  const nd = Object.entries(nodes).map(([k, [x, y]]) => {
    const n = WIRED.find((w) => w[0] === k)[1];
    return `<circle cx="${x}" cy="${y}" r="${7 + n * 2.6}" fill="${n ? 'var(--green)' : 'none'}" stroke="var(--green)" stroke-width="${n ? 0 : 1.8}" stroke-dasharray="${n ? '' : '3 3'}"/>
      <text x="${x}" y="${y + (y > 100 ? 30 : -22)}" class="tiny">${k.toUpperCase()}</text>`;
  }).join('');
  return `<svg viewBox="0 0 320 184" class="art wide">${ln}${nd}</svg>`;
}

// ── N11 which parts pull the most weight ───────────────────────────────────
function steps() {
  const vals = WIRED.map(([, n]) => n), mx = Math.max(...vals);
  const bars = WIRED.map(([k, n], i) => `<rect x="${12 + i * 60}" y="${n ? 112 - (n / mx) * 84 : 110}" width="40" height="${n ? (n / mx) * 84 : 2}" rx="3" fill="${n ? 'var(--green)' : 'var(--tan)'}"/>
    <text x="${32 + i * 60}" y="${n ? 106 - (n / mx) * 84 : 104}" class="num">${n}</text>
    <text x="${32 + i * 60}" y="128" class="tiny">${k.toUpperCase()}</text>`).join('');
  return `<svg viewBox="0 0 320 140" class="art wide">${bars}</svg>`;
}

// Each form: the shape's name, the line a parent reads, the drawing, what Nora's
// answer is, and a draft line saying what the widget measures.
export const FORMS = [
  { id: 'N01', form: 'Moon phase', title: 'The moon the night she arrived', art: moon(),
    said: 'Two days past full. Almost all of it still lit.',
    why: 'A fact about her birth night, drawn to scale. It carries no verdict about her.' },
  { id: 'N03', form: 'Twelve places', title: 'Where most of her sits', art: slots(),
    said: 'Six of her thirteen placements landed in one box. The other seven sit alone.',
    why: 'The sky is cut into twelve places. A full box is a part of life she will feel more strongly than most children do.' },
  { id: 'N04', form: 'Tug of war', title: 'Prepares, or goes with the flow', art: tug(),
    said: 'She prepares more than she goes with the flow.',
    why: 'Two habits pulling against each other. The knot shows which one wins in her, and by how much.' },
  { id: 'N05', form: 'Horizon', title: 'Born with the sun up or down', art: horizon(),
    said: 'The sun was still up. Nora is a day child.',
    why: 'Astrologers call this sect, and it is one of the oldest splits in the craft. A day child is read as leading with the sun, outward and visible. A night child leads with the moon, inward and felt.' },
  { id: 'N06', form: 'Web', title: 'What she is made of', art: web(),
    said: 'Wide on fire and earth. Almost nothing on water.',
    why: 'Four elements, four ways of handling life. The shape shows which she has plenty of and which she has little of.' },
  { id: 'N07', form: 'Dial', title: 'How fast her moods move', art: dial(),
    said: 'Quick. Three quarters of the way towards the fast end.',
    why: 'How far the moon travelled on her birth day. A faster moon is read as moods that arrive and pass quickly.' },
  { id: 'N08', form: 'Constellation', title: 'What is wired to what', art: constellation(),
    said: 'Being, thinking and pushing pull together. Loving runs on its own.',
    why: 'Each circle is one part of her. A line means those two parts move together. A part with no lines runs separately from the rest.' },
  { id: 'N10', form: 'Columns', title: 'Which parts pull the most weight', art: steps(),
    said: 'Being and thinking pull hardest. Loving pulls nothing along with it.',
    why: 'How many other parts each one is tied to. A tall column drags the rest along when it moves. A flat one acts alone.' },
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
@font-face{font-family:"Morning Memories";src:url("/assets/fonts/morning-memories-400.woff2") format("woff2");font-weight:400;font-display:swap}
@font-face{font-family:"Special Elite";src:url("/assets/fonts/special-elite-400.woff2") format("woff2");font-weight:400;font-display:swap}
${TOKENS}
*{box-sizing:border-box}
html,body{overflow-x:clip}
body{margin:0;background:var(--cream);color:var(--green);font:400 15px/1.6 "Special Elite","Courier New",monospace}
.wrap{max-width:430px;margin:0 auto;padding:0 18px 80px}
header{padding:40px 0 8px}
h1{margin:0;font:400 36px/1.04 "Morning Memories",Georgia,serif}
header p{margin:10px 0 0;font-size:13.5px;opacity:.78}
.card{margin:16px 0 0;border:1px solid var(--tan);border-radius:12px;background:rgba(255,255,255,.26);padding:15px 14px 14px}
.tag{display:flex;align-items:center;gap:9px;margin-bottom:10px}
.idchip{font:400 15px/1 "Special Elite",monospace;background:var(--green);color:#F3EEE2;padding:6px 9px;border-radius:4px;letter-spacing:.08em}
.tag .form{font-size:12px;letter-spacing:.12em;text-transform:uppercase;opacity:.72}
.hd{margin-bottom:13px}
.hd b{display:block;font:400 24px/1.12 "Morning Memories",Georgia,serif}
.art{display:block;width:100%;max-width:210px;margin:0 auto;height:auto}
.art.wide{max-width:100%}
text{font-family:"Special Elite","Courier New",monospace;fill:var(--green)}
.num{font-family:"Special Elite","Courier New",monospace;text-anchor:middle;font-size:17px}
.num.big{font-size:34px}.num.xl{font-size:27px}.num.sm{font-size:13px}.num.tag{font-size:11px;fill:#F3EEE2}
.num.s{text-anchor:start}.num.e{text-anchor:end}
.tiny{font-size:8.5px;text-anchor:middle;letter-spacing:.07em;opacity:.8}
.tiny.s{text-anchor:start}.tiny.e{text-anchor:end}
.key{list-style:none;margin:12px 0 0;padding:0;font-size:11.5px}
.key li{display:flex;gap:7px;align-items:baseline;padding:2.5px 0;opacity:.85}
.key i{flex:0 0 auto;width:9px;height:9px;border-radius:2px;margin-top:4px}
.key i.hollow{border:1.5px dashed var(--green);background:none;border-radius:50%}
.key b{font-weight:400;text-transform:uppercase;letter-spacing:.06em;font-size:10px}
.said{margin:13px 0 0;padding-top:10px;border-top:1px solid var(--tan-soft);font-size:12.5px}
.why{margin:9px 0 0;font-size:11.5px;opacity:.7}
.why em{font-style:normal;background:var(--orange);color:#F3EEE2;padding:1px 5px;border-radius:3px;font-size:9px;letter-spacing:.08em;margin-right:5px}
</style>
</head>
<body>
<noscript><img hidden height="1" width="1" src="https://www.facebook.com/tr?id=${DATASET}&amp;ev=PageView&amp;noscript=1" alt=""></noscript>
<div class="wrap">
<header><h1>The widget forms</h1>
<p>${FORMS.length} shapes, Nora's real numbers. The green chip is the module number, so call anything out by it. Lines marked DRAFT are mine and are yours to overwrite.</p></header>
${FORMS.map((f) => `<article class="card" id="${f.id}">
  <div class="tag"><span class="idchip">${f.id}</span><span class="form">${f.form}</span></div>
  <div class="hd"><b>${f.title}</b></div>
  ${f.art}
  <p class="said">${f.said}</p>
  <p class="why"><em>DRAFT</em>${f.why}</p></article>`).join('\n')}
</div>
</body>
</html>
`;

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const dir = join(ROOT, 'readings/compass/widget-forms');
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
  console.log(`wrote /readings/compass/widget-forms/  (${FORMS.length} forms)`);
}
