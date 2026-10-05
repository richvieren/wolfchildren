#!/usr/bin/env node
// atf-preview.mjs — the Compass above-the-fold section, mobile first.
//
// Richard, 2026-09-30, from his Photoshop preview. Palette, type and the wheel
// are his; the call to action, the birth-details capture, the reassurance lines
// and the sticky bar are the parts he asked me to add.
//
// The wheel here is a crop of his own preview, standing in until the real one
// arrives (rotating, tilted). It sits in a square carousel, slide 1 of n.
//
//   node atf-preview.mjs   writes readings/compass/atf/index.html

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CELLS, resolve, testable } from './src/lib/atf-copy.mjs';
import { PIXEL, DATASET } from './variants.mjs';
import { ATF_CSS, atfMarkup, ATF_JS, atfDesktopCss } from './src/lib/atf-section.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));


const page = (cell, T) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Compass · above the fold · ${cell}</title>
<script src="/assets/js/pixel.js?v=${PIXEL}"></script>
<style>${ATF_CSS}${atfDesktopCss("body")}</style>
</head>
<body class="atf-desktop" data-cell="${cell}">
<noscript><img hidden height="1" width="1" src="https://www.facebook.com/tr?id=${DATASET}&amp;ev=PageView&amp;noscript=1" alt=""></noscript>
${atfMarkup(T)}
${ATF_JS}
</body>
</html>
`;


/** A phone-frame wrapper so the mobile layout can be reviewed from a desktop
 *  browser and, unlike a screenshot, refreshed. It iframes the real page, so it
 *  is never out of date. Carries the pixel because every HTML file on this site
 *  must (tests/pixel.test.js), which means a visit here fires PageView twice. It
 *  is noindex and unlinked, so that is Richard's own device only. */
const framePage = (cells) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Compass ATF · phone preview</title>
<script src="/assets/js/pixel.js?v=${PIXEL}"></script>
<style>
*{box-sizing:border-box}
body{margin:0;background:#8D8A82;color:#F8F5EC;
  font:400 13px/1.5 ui-monospace,Menlo,Consolas,monospace;padding:28px 20px 60px}
h1{margin:0 0 4px;font-size:17px;letter-spacing:.06em;text-transform:uppercase}
.note{margin:0 0 26px;opacity:.72;font-size:12px}
.rack{display:flex;gap:44px;flex-wrap:wrap;align-items:flex-start}
.unit{position:relative}
.cap{margin:0 0 8px;font-size:11.5px;letter-spacing:.08em;text-transform:uppercase;opacity:.8}
.phone{position:relative;border:3px solid #26241F;border-radius:14px;overflow:hidden;background:#F8F5EC}
iframe{display:block;border:0}
.fold{position:absolute;left:0;right:0;height:0;border-top:2px dashed #E4553F;pointer-events:none;z-index:2}
.fold span{position:absolute;right:6px;top:4px;font-size:10px;letter-spacing:.06em;color:#E4553F;
  background:rgba(0,0,0,.45);padding:2px 5px;border-radius:2px}
.cells{margin-top:34px;font-size:12px;opacity:.8}
.cells a{color:#F8F5EC}
</style>
</head>
<body>
<h1>Compass · above the fold</h1>
<p class="note">The live page in a phone frame. Refresh to see the latest build. Scroll inside a frame.</p>
<div class="rack">
  <div class="unit">
    <p class="cap">iPhone 14/15/16 · 393 x 852</p>
    <div class="phone" style="width:393px;height:852px">
      <iframe src="/readings/compass/atf/" width="393" height="852" title="Compass above the fold, 393pt"></iframe>
      <div class="fold" style="top:700px"><span>fold 700</span></div>
    </div>
  </div>
  <div class="unit">
    <p class="cap">iPhone SE · 375 x 667</p>
    <div class="phone" style="width:375px;height:667px">
      <iframe src="/readings/compass/atf/" width="375" height="667" title="Compass above the fold, 375pt"></iframe>
      <div class="fold" style="top:560px"><span>fold 560</span></div>
    </div>
  </div>
</div>
<p class="cells">Cells: ${cells.map((c) => `<a href="/readings/compass/atf/${c === 'control' ? '' : c + '/'}">${c}</a>`).join(' · ')}</p>
<noscript><img hidden height="1" width="1" src="https://www.facebook.com/tr?id=${DATASET}&amp;ev=PageView&amp;noscript=1" alt=""></noscript>
</body>
</html>
`;

for (const cell of Object.keys(CELLS)) {
  const dir = join(ROOT, 'readings/compass/atf', cell === 'control' ? '' : cell);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), page(cell, resolve(cell)));
  console.log(`wrote /readings/compass/atf/${cell === 'control' ? '' : cell + '/'}  [${cell}]`);
}
const fdir = join(ROOT, 'readings/compass/atf/preview');
mkdirSync(fdir, { recursive: true });
writeFileSync(join(fdir, 'index.html'), framePage(Object.keys(CELLS)));
console.log('wrote /readings/compass/atf/preview/   <- the phone frame, refreshable');

const t = testable();
console.log(t.length ? `slots under test: ${t.join(', ')}` : 'slots under test: none yet, every slot has one variant');
