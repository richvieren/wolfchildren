#!/usr/bin/env node
// widget-all.mjs — every widget in one page, old and new, so a keep / modify / drop
// decision can be made by looking rather than by reading a list.
//
// Richard, 2026-10-01: "Merge the new ones together with the old ones, put them all
// in one fucking page so I can have a look." Plus: the landing page fonts, Morning
// Memories for titles and Special Elite for body, applied here too.
//
// Two groups. N01 to N12 are the new forms, drawn from Nora's real chart. E01 to E30
// are the blocks the reading renders today, lifted from the published sample. Every
// item has an ID, so a verdict can name it.
//
// Nothing here is wired into the product. The reading is untouched.
//
//   node widget-all.mjs

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PIXEL, DATASET } from './variants.mjs';
import { FORMS } from './widget-forms.mjs';
import { WIDGETS, WIDGET_CSS } from './src/lib/compass-widgets.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));

// The sample's own CSS asks for Montserrat and Libre Baskerville. Remap those two
// families to the landing page pair so the old blocks are judged in the new type.
// Morning Memories ships one weight, so a 900 becomes a 400 rather than a browser
// faking a bold on a script face.
const RESKIN = WIDGET_CSS
  .replace(/font-family:Montserrat/g, 'font-family:"Morning Memories",Georgia,serif')
  .replace(/font-family:"Libre Baskerville"/g, 'font-family:"Special Elite","Courier New",monospace')
  .replace(/font-family:"IBM Plex Mono"/g, 'font-family:"Special Elite","Courier New",monospace')
  .replace(/font-weight:900/g, 'font-weight:400');

// The wheel and the gauge set their type as SVG presentation attributes, not CSS,
// so the remap above cannot reach them. Swap those by hand and leave Wheel Glyphs,
// which is the subset that draws the zodiac signs.
const reskinHtml = (h) => h
  .replace(/font-family="'IBM Plex Mono'"/g, 'font-family="Special Elite"')
  .replace(/font-family="Montserrat"/g, 'font-family="Morning Memories"')
  .replace(/(font-family="Morning Memories"[^>]*?)font-weight="900"/g, '$1font-weight="400"');

const keys = Object.keys(WIDGETS);
const drawn = (h) => (h.match(/<svg/g) || []).length > 0
  || /class="[^"]*(bar-|meter|track|gauge|slider)/.test(h);
const chars = (h) => h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().length;

// Existing blocks, in the order the reading renders them, grouped by section.
const sections = [];
for (const [i, k] of keys.entries()) {
  const w = WIDGETS[k];
  if (!sections.length || sections.at(-1).name !== w.section) sections.push({ name: w.section, items: [] });
  sections.at(-1).items.push({ id: `E${String(i + 1).padStart(2, '0')}`, key: k, ...w });
}

const newCards = FORMS.map(([form, head, art, said], i) => `<article class="card" id="N${String(i + 1).padStart(2, '0')}">
  <div class="tag"><span class="id">N${String(i + 1).padStart(2, '0')}</span><span class="form">${form}</span><span class="badge new">drawn</span></div>
  <h2>${head}</h2>
  ${art}
  <p class="said">${said}</p></article>`).join('\n');

const oldCards = sections.map((sec) => `<h3 class="sec">${sec.name}</h3>
${sec.items.map((it) => `<article class="card" id="${it.id}">
  <div class="tag"><span class="id">${it.id}</span><span class="form">${it.key}</span><span class="badge ${drawn(it.html) ? 'has' : 'txt'}">${drawn(it.html) ? 'drawn' : `text, ${chars(it.html)}ch`}</span></div>
  <h2>${it.label}</h2>
  <div class="wc-live live">${reskinHtml(it.html)}</div></article>`).join('\n')}`).join('\n');

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Every widget, old and new</title>
<script src="/assets/js/pixel.js?v=${PIXEL}"></script>
<style>
@font-face{font-family:"Morning Memories";src:url("/assets/fonts/morning-memories-400.woff2") format("woff2");font-weight:400;font-display:swap}
@font-face{font-family:"Special Elite";src:url("/assets/fonts/special-elite-400.woff2") format("woff2");font-weight:400;font-display:swap}
:root{--cream:#DFD7C3;--green:#495543;--tan:#CDB494;--orange:#C0623A;--tan-soft:rgba(205,180,148,.45)}
*{box-sizing:border-box}
html,body{overflow-x:clip}
body{margin:0;background:var(--cream);color:var(--green);font:400 15px/1.6 "Special Elite","Courier New",monospace}
.wrap{max-width:430px;margin:0 auto;padding:0 18px 90px}
header{padding:40px 0 4px}
h1{margin:0;font:400 38px/1.02 "Morning Memories",Georgia,serif}
header p{margin:10px 0 0;font-size:13.5px;opacity:.78}
.group{margin:34px 0 0;padding-top:16px;border-top:2px solid var(--green)}
.group b{display:block;font:400 25px/1.1 "Morning Memories",Georgia,serif}
.group span{display:block;margin-top:4px;font-size:12.5px;opacity:.7}
.sec{margin:26px 0 0;font:400 12px/1 "Special Elite",monospace;letter-spacing:.16em;text-transform:uppercase;opacity:.55}
.card{margin:14px 0 0;border:1px solid var(--tan);border-radius:5px;background:rgba(255,255,255,.26);padding:14px 13px 13px}
.tag{display:flex;align-items:center;gap:7px;flex-wrap:wrap;margin-bottom:9px;font-size:10.5px}
.id{font:400 11px/1 "Special Elite",monospace;background:var(--green);color:#F3EEE2;padding:4px 6px;border-radius:3px;letter-spacing:.06em}
.form{opacity:.62}
.badge{margin-left:auto;padding:3px 7px;border-radius:99px;font-size:9.5px;letter-spacing:.06em;text-transform:uppercase}
.badge.new,.badge.has{background:var(--orange);color:#F3EEE2}
.badge.txt{border:1px solid var(--tan);opacity:.72}
h2{margin:0 0 12px;font:400 23px/1.12 "Morning Memories",Georgia,serif}
.art{display:block;width:100%;max-width:200px;margin:0 auto;height:auto}
.art.wide{max-width:100%}
text{font-family:"Special Elite","Courier New",monospace;fill:var(--green)}
.tiny{font-size:9px;text-anchor:middle;opacity:.78}
.tiny.s{text-anchor:start}.tiny.e{text-anchor:end}.tiny.on{fill:#F3EEE2;opacity:1}
.big{font:400 26px "Morning Memories",Georgia,serif;text-anchor:middle;fill:var(--green)}
.said{margin:12px 0 0;padding-top:10px;border-top:1px solid var(--tan-soft);font-size:12px;opacity:.74}
.pills{display:flex;flex-wrap:wrap;gap:8px;align-items:baseline;justify-content:center;padding:8px 0}
.pill{font-family:"Morning Memories",Georgia,serif}
/* the sample's own CSS, with the two families remapped to the landing pair */
${RESKIN}
.live{overflow-x:auto}
.wc-live .hero,.wc-live .letter,.wc-live section{background:none}
</style>
</head>
<body>
<noscript><img hidden height="1" width="1" src="https://www.facebook.com/tr?id=${DATASET}&amp;ev=PageView&amp;noscript=1" alt=""></noscript>
<div class="wrap">
<header><h1>Every widget, old and new</h1>
<p>${FORMS.length} drawn forms and ${keys.length} blocks the reading renders today. All of it in Morning Memories and Special Elite. Call anything out by its ID.</p></header>

<div class="group"><b>New, drawn</b><span>N01 to N${String(FORMS.length).padStart(2, '0')}. Nora's real numbers. Nothing wired in yet.</span></div>
${newCards}

<div class="group"><b>In the reading today</b><span>E01 to E${String(keys.length).padStart(2, '0')}. Lifted from the published sample, in the order it renders.</span></div>
${oldCards}
</div>
</body>
</html>
`;

const dir = join(ROOT, 'readings/compass/widget-all');
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, 'index.html'), html);
console.log(`wrote /readings/compass/widget-all/  (${FORMS.length} new + ${keys.length} existing)`);
