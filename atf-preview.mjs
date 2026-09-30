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

const ROOT = dirname(fileURLToPath(import.meta.url));

const page = (cell, T) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Compass · above the fold · ${cell}</title>
<script src="/assets/js/pixel.js?v=${PIXEL}"></script>
<style>
@font-face{font-family:"Morning Memories";src:url("/assets/fonts/morning-memories-400.woff2") format("woff2");font-weight:400;font-display:swap}
@font-face{font-family:"Special Elite";src:url("/assets/fonts/special-elite-400.woff2") format("woff2");font-weight:400;font-display:swap}

:root{
  --paper:#F8F5EC; --ink:#131613; --rust:#8B4133; --sienna:#995A3D; --olive:#828951;
  --line:rgba(153,90,61,.28); --muted:rgba(19,22,19,.68);
}
*{box-sizing:border-box}
html,body{overflow-x:clip}
body{margin:0;background:var(--paper);color:var(--ink);
  font:400 15px/1.55 "Special Elite","Courier New",monospace;-webkit-font-smoothing:antialiased}
.wrap{padding:0 20px}

/* 1 announce */
.announce{background:var(--rust);color:var(--paper);text-align:center;
  padding:9px 16px;font-size:12.5px;letter-spacing:.01em}

/* 2 header */
.hdr{height:56px;display:flex;align-items:center;justify-content:space-between;padding:0 20px}
.mark{height:26px;width:132px;background:var(--ink);
  -webkit-mask:url("/assets/img/logo/wolfchildren-logo-mask-1200.png") no-repeat left center/contain;
          mask:url("/assets/img/logo/wolfchildren-logo-mask-1200.png") no-repeat left center/contain}
.menu{width:24px;height:14px;border-top:1.5px solid var(--ink);border-bottom:1.5px solid var(--ink);position:relative}
.menu:after{content:"";position:absolute;left:0;top:5.25px;width:100%;border-top:1.5px solid var(--ink)}

/* 3 moon + eyebrow */
.badge{text-align:center;padding-top:10px}
.moon{width:22px;height:22px;color:var(--olive);display:inline-block}
.moon svg{display:block;width:100%;height:100%}
.eyebrow{margin:8px 0 0;font-size:12.5px;letter-spacing:.02em;color:var(--muted)}
.stem{width:1px;height:20px;background:var(--line);margin:8px auto 0}

/* 4 headline + sub */
h1{margin:14px 0 0;font-family:"Morning Memories",Georgia,serif;font-weight:400;
  font-size:38px;line-height:1.04;letter-spacing:-.005em;text-align:center;text-wrap:balance}
.sub{margin:14px auto 0;max-width:34ch;text-align:center;font-size:14.5px;line-height:1.5;color:var(--muted)}

/* 5 square carousel */
.carousel{margin-top:16px;position:relative}
.slides{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none}
.slides::-webkit-scrollbar{display:none}
.slide{flex:0 0 100%;scroll-snap-align:center;aspect-ratio:1/1;position:relative}
.slide img{display:block;width:100%;height:100%;object-fit:contain;padding:26px}
.dots{position:absolute;left:0;right:0;bottom:12px;display:flex;justify-content:center;gap:7px}
.dot{width:6px;height:6px;border-radius:50%;background:var(--line)}
.dot.on{background:var(--sienna)}
.tag{position:absolute;left:14px;top:14px;background:rgba(248,245,236,.9);color:var(--sienna);
  font-size:10.5px;letter-spacing:.09em;text-transform:uppercase;padding:5px 9px;border:1px solid var(--line)}

/* 6 birth details */
.form{margin-top:18px}
.flabel{font-size:12px;letter-spacing:.09em;text-transform:uppercase;color:var(--sienna);margin-bottom:8px}
.row{display:flex;gap:8px}
.field{flex:1;height:46px;border:1px solid var(--line);background:#FDFBF5;border-radius:3px;
  padding:0 12px;font:400 14px/46px "Special Elite",monospace;color:var(--muted)}
.field + .field{flex:0 0 118px}
.field.full{margin-top:8px;flex:1 1 auto}

/* 7 CTA */
.cta{display:block;margin-top:14px;width:100%;height:54px;border:0;border-radius:3px;
  background:var(--rust);color:var(--paper);font:400 15.5px/54px "Special Elite",monospace;
  letter-spacing:.06em;text-align:center;text-decoration:none}
.under{margin-top:9px;text-align:center;font-size:12px;color:var(--muted)}
.under a{color:var(--sienna)}

/* 8 reassurance */
.fuds{margin:18px 0 0;padding:16px 0 0;border-top:1px solid var(--line);display:grid;gap:10px}
.fud{display:grid;grid-template-columns:16px 1fr;gap:9px;font-size:12.5px;line-height:1.45;color:var(--muted)}
.fud b{color:var(--ink);font-weight:400}
.tick{width:16px;height:16px;margin-top:1px;border:1px solid var(--sienna);border-radius:50%;position:relative}
.tick:after{content:"";position:absolute;left:4.5px;top:2.5px;width:4px;height:8px;
  border-right:1.5px solid var(--sienna);border-bottom:1.5px solid var(--sienna);transform:rotate(42deg)}

/* 9 sticky bar */
.sticky{position:fixed;left:0;right:0;bottom:0;background:rgba(248,245,236,.96);
  border-top:1px solid var(--line);padding:9px 20px;display:flex;align-items:center;gap:12px;
  backdrop-filter:blur(8px)}
.sticky .price{font-size:13px;color:var(--muted);white-space:nowrap}
.sticky .price b{color:var(--ink);font-weight:400}
.sticky .cta{margin:0;height:44px;line-height:44px;font-size:14px;flex:1}
.spacer{height:74px}
</style>
</head>
<body data-cell="${cell}">

<noscript><img hidden height="1" width="1" src="https://www.facebook.com/tr?id=${DATASET}&amp;ev=PageView&amp;noscript=1" alt=""></noscript>

<p class="announce">${T.announce}</p>

<header class="hdr"><span class="mark"></span><span class="menu"></span></header>

<div class="wrap">
  <div class="badge">
    <span class="moon"><svg viewBox="0 0 48 48"><mask id="c"><rect width="48" height="48" fill="#000"/><circle cx="24" cy="24" r="15" fill="#fff"/><circle cx="33" cy="20" r="14" fill="#000"/></mask><rect width="48" height="48" fill="currentColor" mask="url(#c)"/></svg></span>
    <p class="eyebrow">${T.eyebrow}</p>
    <div class="stem"></div>
  </div>

  <h1>${T.headline}</h1>
  <p class="sub">${T.sub}</p>
</div>

<div class="carousel">
  <div class="slides">
    <div class="slide"><img src="/assets/img/atf/zodiac-map.svg" width="900" height="900" alt="Your child's birth chart, drawn as a wheel"><span class="tag">${T.slideTag}</span></div>
  </div>
  <div class="dots"><span class="dot on"></span><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>
</div>

<div class="wrap">
  <div class="form">
    <p class="flabel">${T.formLabel}</p>
    <div class="row">
      <span class="field">${T.fieldDate}</span>
      <span class="field">${T.fieldTime}</span>
    </div>
    <span class="field full" style="display:block">${T.fieldPlace}</span>
  </div>

  <a class="cta" href="#">${T.cta}</a>
  <p class="under">${T.under}</p>

  <div class="fuds">
    ${T.fuds.map(([h, t]) => `<p class="fud"><span class="tick"></span><span><b>${h}</b> ${t}</span></p>`).join('\n    ')}
  </div>
</div>

<div class="spacer"></div>
<div class="sticky">
  <span class="price">${T.stickyName}<br><b>${T.stickyPrice}</b></span>
  <a class="cta" href="#">${T.stickyCta}</a>
</div>

</body>
</html>
`;

for (const cell of Object.keys(CELLS)) {
  const dir = join(ROOT, 'readings/compass/atf', cell === 'control' ? '' : cell);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), page(cell, resolve(cell)));
  console.log(`wrote /readings/compass/atf/${cell === 'control' ? '' : cell + '/'}  [${cell}]`);
}
const t = testable();
console.log(t.length ? `slots under test: ${t.join(', ')}` : 'slots under test: none yet, every slot has one variant');
