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
  padding:6px 16px;font-size:12px;letter-spacing:.01em}

/* 2 header */
.hdr{height:0;position:relative;z-index:3}
.mark{position:absolute;left:20px;top:10px;height:24px;width:124px;background:var(--ink);
  -webkit-mask:url("/assets/img/logo/wolfchildren-logo-mask-1200.png") no-repeat left center/contain;
          mask:url("/assets/img/logo/wolfchildren-logo-mask-1200.png") no-repeat left center/contain}

/* 3 moon + eyebrow */
.badge{text-align:center;padding-top:8px}
.moon{width:18px;height:18px;color:var(--olive);display:block;margin:0 auto -3px}
.moon svg{display:block;width:100%;height:100%}
.eyebrow{margin:0;font-size:12px;letter-spacing:.02em;color:var(--muted)}
.stem{width:1px;height:16px;background:var(--line);margin:5px auto 0}

/* 4 headline + sub */
h1{margin:4px 0 0;font-family:"Morning Memories",Georgia,serif;font-weight:400;
  font-size:36px;line-height:.98;letter-spacing:-.02em;text-align:center;text-wrap:balance}
.sub{margin:7px auto 0;max-width:48ch;text-align:center;font-size:13.5px;line-height:1.36;letter-spacing:-.01em;color:var(--muted)}

/* 5 square carousel */
.carousel{margin:8px 20px 0;position:relative}
.slides{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none}
.slides::-webkit-scrollbar{display:none}
.slide{flex:0 0 100%;scroll-snap-align:center;height:240px;position:relative}
.slide img{display:block;width:100%;height:100%;object-fit:contain}
.empty{position:absolute;inset:0;display:grid;place-items:center;text-align:center;padding:18px;
  border:1px dashed var(--line);color:var(--sienna);opacity:.75;font-size:11.5px;line-height:1.4}
.arrow{position:absolute;top:50%;transform:translateY(-50%);width:30px;height:30px;padding:0;
  border:1px solid var(--line);background:rgba(248,245,236,.92);color:var(--sienna);border-radius:50%;
  font:400 17px/28px "Special Elite",monospace;cursor:pointer;z-index:2}
.arrow.prev{left:4px}.arrow.next{right:4px}
.dots{position:absolute;left:0;right:0;bottom:2px;display:flex;justify-content:center;gap:7px}
.dot{width:7px;height:7px;padding:0;border:0;border-radius:50%;background:var(--line);cursor:pointer}
.dot.on{background:var(--sienna)}
.tag{position:absolute;left:0;top:0;background:rgba(248,245,236,.9);color:var(--sienna);
  font-size:10.5px;letter-spacing:.09em;text-transform:uppercase;padding:5px 9px;border:1px solid var(--line)}

/* 6 birth details */
.form{margin-top:8px}
.flabel{font-size:11.5px;letter-spacing:.09em;text-transform:uppercase;color:var(--sienna);margin-bottom:6px}
.row{display:flex;gap:6px}
.field{flex:1;height:44px;border:1px solid var(--line);background:#FDFBF5;border-radius:3px;
  padding:0 12px;font:400 13.5px/44px "Special Elite",monospace;color:var(--muted)}
.field + .field{flex:0 0 118px}
.field.full{margin-top:6px;flex:1 1 auto}

/* 7 CTA */
.cta{display:block;margin-top:8px;width:100%;height:50px;border:0;border-radius:3px;
  background:var(--rust);color:var(--paper);font:400 15px/50px "Special Elite",monospace;
  letter-spacing:.06em;text-align:center;text-decoration:none}
.under{margin-top:7px;text-align:center;font-size:11.5px;color:var(--muted)}
.under a{color:var(--sienna)}

/* 8 reassurance */
.fuds{margin:12px 0 0;padding:10px 12px;border:1px solid var(--line);border-radius:4px;
  display:grid;grid-template-columns:1fr 1fr;gap:7px 12px}
.fud{display:grid;grid-template-columns:12px 1fr;gap:6px;font-size:10.5px;line-height:1.28;color:var(--muted)}
.fud b{color:var(--ink);font-weight:400}
.tick{width:12px;height:12px;margin-top:1px;border:1px solid var(--sienna);border-radius:50%;position:relative}
.tick:after{content:"";position:absolute;left:3.5px;top:1.5px;width:3px;height:6px;
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

<header class="hdr"><span class="mark"></span></header>

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
  <div class="slides" id="slides">
    ${T.slides.map((s, i) => s.src
      ? `<div class="slide"><img src="${s.src}" width="${s.w}" height="${s.h}" alt="${s.alt}" ${i ? 'loading="lazy"' : ''}></div>`
      : `<div class="slide"><span class="empty">${s.brief}</span></div>`).join('\n    ')}
  </div>
  ${T.slides.length > 1 ? `<button class="arrow prev" type="button" aria-label="Previous">&#8249;</button>
  <button class="arrow next" type="button" aria-label="Next">&#8250;</button>
  <div class="dots">${T.slides.map((_, i) => `<button class="dot${i ? '' : ' on'}" type="button" aria-label="Slide ${i + 1}"></button>`).join('')}</div>` : ''}
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

<script>
(function(){
  var sc=document.getElementById('slides'); if(!sc) return;
  var dots=[].slice.call(document.querySelectorAll('.dot'));
  if(!dots.length) return;
  var at=function(){ return Math.round(sc.scrollLeft/sc.clientWidth); };
  var go=function(i){ i=Math.max(0,Math.min(dots.length-1,i)); sc.scrollTo({left:sc.clientWidth*i,behavior:'smooth'}); };
  dots.forEach(function(d,i){ d.addEventListener('click',function(){ go(i); }); });
  var p=document.querySelector('.arrow.prev'), n=document.querySelector('.arrow.next');
  if(p) p.addEventListener('click',function(){ go(at()-1); });
  if(n) n.addEventListener('click',function(){ go(at()+1); });
  sc.addEventListener('scroll',function(){
    var i=at(); dots.forEach(function(d,j){ d.classList.toggle('on', j===i); });
  },{passive:true});
})();
</script>
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
