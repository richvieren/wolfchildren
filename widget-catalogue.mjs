#!/usr/bin/env node
// widget-catalogue.mjs — every block the Compass renders, labelled.
//
// Richard, 2026-09-28: "Build one page showing every widget the sample renders,
// all of them, not the six you picked. Labelled, so I can see what's available
// and choose which go on the page."
//
// Nothing is selected here. It renders whatever scripts/extract-widgets.py
// exported, in the order the reading renders it, so the page cannot quietly
// drift from the product. Each entry carries the id to quote back when choosing.
//
//   node widget-catalogue.mjs   writes readings/compass/widget-catalogue/index.html

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FONTS, PIXEL, DATASET } from './variants.mjs';
import { WIDGETS, WIDGET_CSS } from './src/lib/compass-widgets.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const entries = Object.entries(WIDGETS);
const free = entries.filter(([, w]) => w.gendered.length === 0);

let lastSection = null;
const items = entries.map(([id, w], i) => {
  const head = w.section !== lastSection
    ? `<h2 class="sec">${(lastSection = w.section)}</h2>` : '';
  const g = w.gendered.length
    ? `<span class="tag tag--gen">says ${w.gendered.join(', ')}</span>`
    : '<span class="tag tag--ok">gender free</span>';
  return `${head}
<article class="item">
  <div class="bar">
    <span class="n">${String(i + 1).padStart(2, '0')}</span>
    <code class="id">${id}</code>
    <span class="lbl">${w.label}</span>
    ${g}
  </div>
  <div class="stage"><div class="wc-live">${w.html}</div></div>
</article>`;
}).join('\n');

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Every Compass block | catalogue</title>
<script src="/assets/js/pixel.js?v=${PIXEL}"></script>
<style>${FONTS}
*{box-sizing:border-box}
html,body{overflow-x:clip}
body{margin:0;background:#CFC6AE;color:#495543;font:400 15px/1.6 "IBM Plex Mono",monospace}
.wrapper{max-width:1180px;margin:0 auto;padding:0 24px 96px}
header.top{padding:64px 0 32px}
h1{font:900 clamp(1.9rem,3.6vw,2.8rem)/1.06 "Montserrat",sans-serif;letter-spacing:-.03em;margin:0;max-width:22ch}
.top p{margin:18px 0 0;font:400 16px/1.65 "Libre Baskerville",serif;max-width:62ch;color:#3A4435}
.counts{margin-top:22px;display:flex;flex-wrap:wrap;gap:8px 20px;font-size:13px;color:#5D6A56}
h2.sec{margin:56px 0 18px;font:900 12px/1 "Montserrat",sans-serif;letter-spacing:.18em;
  text-transform:uppercase;color:#AC2E20;border-bottom:1px solid #B5A98C;padding-bottom:12px}
.item{margin:0 0 20px;border:1px solid #B5A98C;background:#DFD7C3}
.bar{display:flex;flex-wrap:wrap;align-items:baseline;gap:8px 14px;padding:12px 16px;
  background:#495543;color:#DFD7C3;font-size:12.5px}
.n{font:900 12px/1 "Montserrat",sans-serif;color:#CDB494}
.id{font-size:12.5px;color:#fff;background:rgba(255,255,255,.14);padding:3px 7px;border-radius:3px}
.lbl{flex:1 1 220px;color:#CDB494}
.tag{font-size:11px;letter-spacing:.06em;text-transform:uppercase;padding:3px 8px;border-radius:3px}
.tag--ok{background:#6F8A5E;color:#0F140C}
.tag--gen{background:#DA4635;color:#2B0E09}
/* The stage is the reading's own page ground, so each block sits on the colour
   it was designed against rather than on the catalogue's. */
.stage{padding:28px 20px;background:#DFD7C3;overflow-x:auto}
.wc-live{max-width:100%}
footer{padding:56px 24px;max-width:1180px;margin:0 auto;font-size:12.5px;color:#5D6A56;
  border-top:1px solid #B5A98C}

${WIDGET_CSS}
/* The reading is a fixed-width document; these four rules carry hard pixel
   widths wider than a phone. Capped here, not in the extract, so the snapshot
   stays a faithful copy. Nothing changes above those widths. */
.wc-live .wheel-wrap{margin:0 auto;width:min(398px,100%)}
.wc-live .letter-text{width:auto;max-width:620px}
.wc-live .badge-desc,.wc-live .badge-basis,.wc-live .stellium-desc{width:auto;max-width:100%}
.wc-live .card{margin:0}
.wc-live .photo{max-width:520px}
</style>
</head>
<body>
<noscript><img hidden height="1" width="1" src="https://www.facebook.com/tr?id=${DATASET}&amp;ev=PageView&amp;noscript=1" alt=""></noscript>
<div class="wrapper">
<header class="top">
  <h1>Every block a Compass renders</h1>
  <p>All ${entries.length}, in the order the reading renders them, lifted from the published sample. This is the product's own markup and stylesheet, not pictures of it. Quote an id back to place one on a page.</p>
  <div class="counts">
    <span>${entries.length} blocks</span>
    <span>${free.length} carry no gendered word</span>
    <span>${entries.length - free.length} name the child or say she / her</span>
    <span>source: the sample for Nora, a child who does not exist</span>
  </div>
</header>
${items}
</div>
<footer>Wolf Children &middot; catalogue, noindex, not linked from anywhere. Regenerate with <code>python3 scripts/extract-widgets.py &amp;&amp; node widget-catalogue.mjs</code></footer>
</body>
</html>
`;

const dir = join(ROOT, 'readings/compass/widget-catalogue');
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, 'index.html'), html);
console.log(`wrote /readings/compass/widget-catalogue/  (${entries.length} blocks)`);
