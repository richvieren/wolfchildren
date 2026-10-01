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

const ROOT = dirname(fileURLToPath(import.meta.url));

// ── Nora. 12 January 2020, 14:30, Ghent. A child who does not exist. ────────
const EL = { fire: 35, earth: 35, air: 25, water: 5 };
const MOD = { cardinal: 38, fixed: 35, mutable: 27 };
const PER_SIGN = { Capricorn: 6, Leo: 1, Aquarius: 1, Sagittarius: 1, Taurus: 1, Pisces: 1, Aries: 1, Cancer: 1 };
const SIGNS = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
// Connections per part, and the plain name Richard asked for: being, feeling,
// thinking, loving, pushing.
const WIRED = [['being',3],['feeling',1],['thinking',3],['loving',0],['pushing',1]];
// Degrees per day. Fastest first. Read from the chart, not rounded by hand.
const SPEED = [['feeling','Moon',14.4666],['thinking','Mercury',1.649],['loving','Venus',1.2152],
               ['being','Sun',1.0186],['pushing','Mars',0.6764]];
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

// ── N02 the ring, now carrying pace ────────────────────────────────────────
function ring() {
  const keys = Object.keys(MOD); let a = 0; const cols = ['#C0623A', '#495543', '#A9A07E'];
  const segs = keys.map((k, i) => {
    const sweep = MOD[k] / 100 * 360, d = arc(70, 70, 50, a + 1.6, a + sweep - 1.6); a += sweep;
    return `<path d="${d}" fill="none" stroke="${cols[i]}" stroke-width="17"/>`;
  }).join('');
  return `<svg viewBox="0 0 140 140" class="art">${segs}
    <text x="70" y="66" class="num big">38%</text><text x="70" y="85" class="tiny">starts it</text></svg>
    ${key([[cols[0], 'Starts it', `${MOD.cardinal}% · gets things moving`],
           [cols[1], 'Holds it', `${MOD.fixed}% · keeps them going`],
           [cols[2], 'Changes it', `${MOD.mutable}% · switches direction`]])}`;
}

// ── N03 twelve places ──────────────────────────────────────────────────────
function slots() {
  const cells = SIGNS.map((s, i) => {
    const n = PER_SIGN[s] || 0;
    const dots = Array.from({ length: n }, (_, j) => `<circle cx="${12 + (j % 3) * 9}" cy="${30 - Math.floor(j / 3) * 9}" r="3.4" fill="#495543"/>`).join('');
    return `<g transform="translate(${(i % 4) * 70},${Math.floor(i / 4) * 56})">
      <rect x="2" y="2" width="64" height="48" rx="4" fill="${n ? 'rgba(205,180,148,.34)' : 'none'}" stroke="#CDB494"/>
      ${dots}<text x="34" y="46" class="tiny">${s.slice(0, 3).toUpperCase()}</text></g>`;
  }).join('');
  return `<svg viewBox="0 0 280 170" class="art wide">${cells}</svg>
    ${key([['#495543', 'One dot', 'one of her thirteen placements'],
           ['rgba(205,180,148,.34)', 'A filled box', 'a part of life she feels more strongly'],
           [null, 'An empty box', 'quiet ground for her']])}`;
}

// ── N04 tug of war ─────────────────────────────────────────────────────────
function tug() {
  const a = MOD.cardinal, b = MOD.mutable, k = 160 + ((a - b) / (a + b)) * 92;
  const rope = Array.from({ length: 26 }, (_, i) => {
    const x = 36 + i * (248 / 25);
    return `${x},${48 + (i % 2 ? 2.4 : -2.4)}`;
  }).join(' ');
  return `<svg viewBox="0 0 320 104" class="art wide">
    <polyline points="${rope}" fill="none" stroke="#CDB494" stroke-width="3" stroke-linejoin="round"/>
    <line x1="160" y1="22" x2="160" y2="74" stroke="#495543" stroke-width="1" stroke-dasharray="3 4"/>
    <circle cx="${k}" cy="48" r="11" fill="#C0623A"/><circle cx="${k}" cy="48" r="4" fill="#F3EEE2"/>
    <text x="20" y="88" class="tiny s">PREPARES</text>
    <text x="300" y="88" class="tiny e">GOES WITH THE FLOW</text>
    <text x="20" y="100" class="num s">${a}%</text><text x="300" y="100" class="num e">${b}%</text></svg>`;
}

// ── N05 above or below the horizon ─────────────────────────────────────────
function horizon() {
  const rays = Array.from({ length: 12 }, (_, i) => {
    const [x1, y1] = pol(214, 40, 27, i * 30), [x2, y2] = pol(214, 40, 33, i * 30);
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#C0623A" stroke-width="2"/>`;
  }).join('');
  return `<svg viewBox="0 0 320 128" class="art wide">
    <rect x="0" y="0" width="320" height="76" fill="rgba(205,180,148,.28)"/>
    <line x1="0" y1="76" x2="320" y2="76" stroke="#495543" stroke-width="1.5"/>
    <circle cx="214" cy="40" r="19" fill="#C0623A"/>${rays}
    <text x="10" y="18" class="tiny s">SKY</text><text x="10" y="94" class="tiny s">GROUND</text>
    <text x="10" y="118" class="tiny s">14:30 · the sun is up · a day child</text></svg>`;
}

// ── N06 the web of four elements ───────────────────────────────────────────
function web() {
  const keys = Object.keys(EL), R = 46, CX = 100, CY = 80;
  const pts = keys.map((k, i) => pol(CX, CY, R * (EL[k] / 40), i * 90));
  const rings = [0.33, 0.66, 1].map((f) => `<polygon points="${P(keys.map((_, i) => pol(CX, CY, R * f, i * 90)))}" fill="none" stroke="#CDB494" stroke-width="1"/>`).join('');
  // Labels sit outside the shape, anchored away from the centre, so nothing hides.
  const place = [['middle', 0, -10], ['start', 8, 4], ['middle', 0, 18], ['end', -8, 4]];
  const labs = keys.map((k, i) => {
    const [ax, dx, dy] = place[i], [x, y] = pol(CX, CY, R + 14, i * 90);
    return `<text x="${x + dx}" y="${y + dy}" class="tiny" text-anchor="${ax}">${k.toUpperCase()}</text>
      <text x="${x + dx}" y="${y + dy + 12}" class="num sm" text-anchor="${ax}">${EL[k]}%</text>`;
  }).join('');
  return `<svg viewBox="0 0 200 172" class="art wide">${rings}
    <polygon points="${P(pts)}" fill="rgba(192,98,58,.30)" stroke="#C0623A" stroke-width="2"/>
    ${pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.2" fill="#C0623A"/>`).join('')}${labs}</svg>
    ${key([['#C0623A', 'Fire', 'acts first, asks later'],
           ['#C0623A', 'Earth', 'wants it solid before moving'],
           ['#C0623A', 'Air', 'talks it through'],
           ['#C0623A', 'Water', 'feels it first']])}`;
}

// ── N07 the dial, labels below the drawing ─────────────────────────────────
function dial() {
  const { v, lo, hi } = MOON_SPEED, f = (v - lo) / (hi - lo);
  const a0 = -120, a1 = 120, a = a0 + f * (a1 - a0), CX = 80, CY = 92;
  const [nx, ny] = pol(CX, CY, 44, a);
  const ticks = Array.from({ length: 9 }, (_, i) => {
    const t = a0 + i * (a1 - a0) / 8, [x1, y1] = pol(CX, CY, 50, t), [x2, y2] = pol(CX, CY, 56, t);
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#CDB494" stroke-width="1.6"/>`;
  }).join('');
  return `<svg viewBox="0 0 160 158" class="art"><path d="${arc(CX, CY, 50, a0, a1)}" fill="none" stroke="#CDB494" stroke-width="3"/>
    <path d="${arc(CX, CY, 50, a0, a)}" fill="none" stroke="#C0623A" stroke-width="4"/>${ticks}
    <line x1="${CX}" y1="${CY}" x2="${nx}" y2="${ny}" stroke="#495543" stroke-width="3" stroke-linecap="round"/>
    <circle cx="${CX}" cy="${CY}" r="5" fill="#495543"/>
    <text x="${CX}" y="138" class="num big">${v.toFixed(1)}°</text>
    <text x="14" y="152" class="tiny s">SLOW ${lo}°</text><text x="146" y="152" class="tiny e">QUICK ${hi}°</text></svg>`;
}

// ── N08 what is wired to what ──────────────────────────────────────────────
function constellation() {
  const nodes = { being: [160, 36], thinking: [250, 80], pushing: [214, 140], feeling: [96, 140], loving: [58, 74] };
  const links = [['being', 'thinking'], ['being', 'pushing'], ['thinking', 'pushing'], ['being', 'feeling']];
  const ln = links.map(([a, b]) => `<line x1="${nodes[a][0]}" y1="${nodes[a][1]}" x2="${nodes[b][0]}" y2="${nodes[b][1]}" stroke="#CDB494" stroke-width="1.6"/>`).join('');
  const nd = Object.entries(nodes).map(([k, [x, y]]) => {
    const n = WIRED.find((w) => w[0] === k)[1];
    return `<circle cx="${x}" cy="${y}" r="${7 + n * 2.6}" fill="${n ? '#495543' : 'none'}" stroke="#495543" stroke-width="${n ? 0 : 1.8}" stroke-dasharray="${n ? '' : '3 3'}"/>
      <text x="${x}" y="${y + (y > 100 ? 30 : -22)}" class="tiny">${k.toUpperCase()}</text>`;
  }).join('');
  return `<svg viewBox="0 0 320 184" class="art wide">${ln}${nd}</svg>
    ${key([['#495543', 'A filled circle', 'this part works with others'],
           [null, 'A dashed circle', 'this part runs on its own'],
           ['#CDB494', 'A line', 'these two pull together']])}`;
}

// ── N10 which parts change fastest ─────────────────────────────────────────
function speedRings() {
  const rs = [18, 31, 44, 57, 70];
  const rings = rs.map((r, i) => `<circle cx="84" cy="84" r="${r}" fill="none" stroke="#CDB494" stroke-width="${i === 0 ? 1.8 : 1}"/>`).join('');
  const dots = SPEED.map(([part], i) => {
    const [x, y] = pol(84, 84, rs[i], i * 72 + 18);
    return `<circle cx="${x}" cy="${y}" r="6" fill="#C0623A"/><text x="${x}" y="${y + 3.4}" class="num tag">${i + 1}</text>`;
  }).join('');
  return `<svg viewBox="0 0 168 168" class="art"><circle cx="84" cy="84" r="5" fill="#495543"/>${rings}${dots}</svg>
    ${key(SPEED.map(([part, planet, sp], i) => ['#C0623A', `${i + 1} ${part}`, `${sp.toFixed(2)}° a day${i === 0 ? ' · fastest, changes daily' : i === SPEED.length - 1 ? ' · slowest, barely shifts' : ''}`]))}`;
}

// ── N11 which parts pull the most weight ───────────────────────────────────
function steps() {
  const vals = WIRED.map(([, n]) => n), mx = Math.max(...vals);
  const bars = WIRED.map(([k, n], i) => `<rect x="${12 + i * 60}" y="${n ? 112 - (n / mx) * 84 : 110}" width="40" height="${n ? (n / mx) * 84 : 2}" rx="3" fill="${n ? '#495543' : '#CDB494'}"/>
    <text x="${32 + i * 60}" y="${n ? 106 - (n / mx) * 84 : 104}" class="num">${n}</text>
    <text x="${32 + i * 60}" y="128" class="tiny">${k.toUpperCase()}</text>`).join('');
  return `<svg viewBox="0 0 320 140" class="art wide">${bars}</svg>`;
}

// Each form: the shape's name, the line a parent reads, the drawing, what Nora's
// answer is, and a draft line saying what the widget measures.
export const FORMS = [
  { form: 'Moon phase', title: 'The moon the night she arrived', art: moon(),
    said: 'Two days past full. Almost all of it still lit.',
    why: 'A fact about her birth night, drawn to scale. It carries no verdict about her.' },
  { form: 'Ring', title: 'How she meets anything new', art: ring(),
    said: 'She starts things more often than she bends with them, but all three are close.',
    why: 'Three ways of handling something new: start it, hold it steady, or change direction. The ring shows how much of each she runs on.' },
  { form: 'Twelve places', title: 'Where most of her sits', art: slots(),
    said: 'Six of her thirteen placements landed in one box. The other seven sit alone.',
    why: 'The sky is cut into twelve places. A full box is a part of life she will feel more strongly than most children do.' },
  { form: 'Tug of war', title: 'Prepares, or goes with the flow', art: tug(),
    said: 'She prepares. The rope sits well past the middle.',
    why: 'Two habits pulling against each other. The knot shows which one wins in her, and by how much.' },
  { form: 'Horizon', title: 'Born with the sun up or down', art: horizon(),
    said: 'The sun was still up. Nora is a day child.',
    why: 'Astrologers call this sect, and it is one of the oldest splits in the craft. A day child is read as leading with the sun, outward and visible. A night child leads with the moon, inward and felt.' },
  { form: 'Web', title: 'What she is made of', art: web(),
    said: 'Wide on fire and earth. Almost nothing on water.',
    why: 'Four elements, four ways of handling life. The shape shows which she has plenty of and which she has little of.' },
  { form: 'Dial', title: 'How fast her moods move', art: dial(),
    said: 'Quick. Near the top of the range.',
    why: 'How far the moon travelled on her birth day. A faster moon is read as moods that arrive and pass quickly.' },
  { form: 'Constellation', title: 'What is wired to what', art: constellation(),
    said: 'Being, thinking and pushing pull together. Loving runs on its own.',
    why: 'Each circle is one part of her. A line means those two parts move together. A part with no lines runs separately from the rest.' },
  { form: 'Speed rings', title: 'Which parts of her change fastest', art: speedRings(),
    said: 'Feeling changes daily. Pushing barely shifts.',
    why: 'Each part of her is carried by one planet, and planets move at very different speeds. The inner ring changes most often. The outer ring stays put for years.' },
  { form: 'Columns', title: 'Which parts pull the most weight', art: steps(),
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
:root{--cream:#DFD7C3;--green:#495543;--tan:#CDB494;--orange:#C0623A;--tan-soft:rgba(205,180,148,.45)}
*{box-sizing:border-box}
html,body{overflow-x:clip}
body{margin:0;background:var(--cream);color:var(--green);font:400 15px/1.6 "Special Elite","Courier New",monospace}
.wrap{max-width:430px;margin:0 auto;padding:0 18px 80px}
header{padding:40px 0 8px}
h1{margin:0;font:400 36px/1.04 "Morning Memories",Georgia,serif}
header p{margin:10px 0 0;font-size:13.5px;opacity:.78}
.card{margin:16px 0 0;border:1px solid var(--tan);border-radius:5px;background:rgba(255,255,255,.26);padding:15px 14px 14px}
.hd{margin-bottom:13px}
.hd b{display:block;font:400 24px/1.12 "Morning Memories",Georgia,serif}
.hd span{display:block;margin-top:5px;font-size:10px;letter-spacing:.13em;text-transform:uppercase;opacity:.5}
.art{display:block;width:100%;max-width:210px;margin:0 auto;height:auto}
.art.wide{max-width:100%}
text{font-family:"Special Elite","Courier New",monospace;fill:var(--green)}
.num{font-family:"Morning Memories",Georgia,serif;text-anchor:middle;font-size:17px}
.num.big{font-size:30px}.num.sm{font-size:13px}.num.tag{font-size:11px;fill:#F3EEE2}
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
<p>Ten shapes, Nora's real numbers. Every one now says what it measures. Lines marked DRAFT are mine and are yours to overwrite.</p></header>
${FORMS.map((f, i) => `<article class="card">
  <div class="hd"><b>${f.title}</b><span>N${String(i + 1).padStart(2, '0')} ${f.form}</span></div>
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
