#!/usr/bin/env node
// widget-3d.mjs — the widgets as cards standing in space.
//
// Richard, 2026-10-01: "is there no way that you can do the 3dification?"
//
// Yes, in the browser. True perspective is a projective transform and SVG only
// carries affine ones, so baking it into an .svg file would mean turning every
// circle into a polygon and every piece of text into outlines. The browser does
// the projection properly and keeps text as text, so that is where it is done.
//
// Each card is a real plane in a 3D scene: a perspective camera, a turn and a
// lean, a lit face, an extruded edge for thickness, and a ground shadow. None of
// it is a picture of a widget. They are the live widgets, so a copy change or a
// data change travels through on its own.
//
//   node widget-3d.mjs

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PIXEL, DATASET } from './variants.mjs';
import { FORMS } from './widget-forms.mjs';
import { TOKENS, TONES } from './src/lib/widget-theme.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));

// Angle, lean and depth per card, so a run of them reads as a scene rather than
// as one pose repeated. ry turns it, rx leans it, z pushes it toward the lens.
const POSE = [
  { ry: -22, rx: 7, z: 40 }, { ry: 18, rx: -5, z: 0 }, { ry: -14, rx: -8, z: 70 },
  { ry: 26, rx: 6, z: 20 }, { ry: -30, rx: -4, z: 55 }, { ry: 12, rx: 9, z: 10 },
  { ry: -18, rx: -7, z: 35 }, { ry: 22, rx: 4, z: 65 }, { ry: -10, rx: 8, z: 25 },
];

const card = (f, i) => {
  const p = POSE[i % POSE.length];
  return `<div class="stage">
  <div class="card3d ${TONES[f.id] || ''}" style="--ry:${p.ry}deg;--rx:${p.rx}deg;--z:${p.z}px">
    <div class="face">
      <div class="wlabel">${f.title}</div>
      ${f.art}
      <p class="said">${f.said}</p>
    </div>
    <div class="edge" aria-hidden="true"></div>
  </div>
  <div class="tagline"><span class="id">${f.id}</span> ${f.form}</div>
</div>`;
};

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Widgets in 3D</title>
<script src="/assets/js/pixel.js?v=${PIXEL}"></script>
<style>
@font-face{font-family:"Morning Memories";src:url("/assets/fonts/morning-memories-400.woff2") format("woff2");font-weight:400;font-display:swap}
@font-face{font-family:"Special Elite";src:url("/assets/fonts/special-elite-400.woff2") format("woff2");font-weight:400;font-display:swap}
${TOKENS}
*{box-sizing:border-box}
html,body{overflow-x:clip}
body{margin:0;background:var(--cream);color:var(--green);font:400 15px/1.6 "Special Elite","Courier New",monospace}
.wrap{max-width:430px;margin:0 auto;padding:0 18px 90px}
header{padding:40px 0 6px}
h1{margin:0;font:400 34px/1.04 "Morning Memories",Georgia,serif}
header p{margin:10px 0 0;font-size:13px;opacity:.78}
.bar{position:sticky;top:0;z-index:5;display:flex;gap:7px;flex-wrap:wrap;margin:16px 0 4px;
  padding:10px 0;background:var(--cream)}
.bar button{font:400 11px/1 "Special Elite",monospace;letter-spacing:.08em;text-transform:uppercase;
  padding:8px 11px;border:1px solid var(--tan);border-radius:999px;background:none;color:var(--green);cursor:pointer}
.bar button[aria-pressed="true"]{background:var(--green);color:var(--on-accent);border-color:var(--green)}

/* ── the scene ────────────────────────────────────────────────────────────
   One camera per card. 900px of perspective at this width converges without
   distorting: the far edge of a turned card is really shorter than the near
   one, which is the thing a flat skew cannot do. */
.stage{perspective:900px;perspective-origin:50% 42%;padding:34px 0 10px;margin-top:18px}
.card3d{position:relative;transform-style:preserve-3d;
  transform:translateZ(var(--z)) rotateX(var(--rx)) rotateY(var(--ry));
  transition:transform .7s cubic-bezier(.2,.7,.2,1)}
.face{position:relative;border-radius:14px;padding:18px 16px 16px;
  background:var(--cream);border:1px solid var(--tan);
  /* light from the upper left, so a turning face catches it along one edge */
  background-image:linear-gradient(105deg,rgba(255,255,255,.5),rgba(255,255,255,0) 46%,rgba(22,21,20,.07));
  box-shadow:0 1px 0 rgba(255,255,255,.5) inset}
/* the extruded side, pushed back so it reads as thickness rather than a border */
.edge{position:absolute;inset:0;border-radius:14px;background:rgba(58,68,53,.55);transform:translateZ(-10px)}
/* the shadow lies on the ground as its own plane */
.stage::after{content:"";display:block;height:26px;margin:-6px 10% 0;border-radius:50%;
  background:radial-gradient(ellipse at 50% 0,rgba(22,21,20,.3),rgba(22,21,20,0) 70%)}

.wlabel{font:400 11px/1.3 "Special Elite",monospace;letter-spacing:.11em;text-transform:uppercase;opacity:.72;margin-bottom:8px}
.said{margin:10px 0 0;padding-top:9px;border-top:1px solid var(--tan-soft);font-size:11.5px;opacity:.8}
.tagline{margin-top:12px;text-align:center;font-size:11px;opacity:.62}
.tagline .id{font:400 12px/1 "Special Elite",monospace;background:var(--green);color:var(--on-accent);padding:4px 7px;border-radius:4px;letter-spacing:.07em;margin-right:6px}

/* the drawings, unchanged, riding on the tilted plane */
.art{display:block;width:100%;max-width:200px;margin:8px auto;height:auto}
.art.wide{max-width:100%}
text{font-family:"Special Elite","Courier New",monospace;fill:var(--green)}
.num{font-family:"Special Elite","Courier New",monospace;text-anchor:middle;font-size:17px}
.num.big{font-size:34px}.num.xl{font-size:27px}.num.sm{font-size:13px}.num.tag{font-size:11px;fill:var(--on-accent)}
.num.s{text-anchor:start}.num.e{text-anchor:end}
.tiny{font-size:8.5px;text-anchor:middle;letter-spacing:.07em;opacity:.8}
.tiny.s{text-anchor:start}.tiny.e{text-anchor:end}
.key{list-style:none;margin:10px 0 0;padding:0;font-size:11px}
.key li{display:flex;gap:7px;align-items:baseline;padding:2px 0;opacity:.85}
.key i{flex:0 0 auto;width:9px;height:9px;border-radius:2px;margin-top:4px}
.key i.hollow{border:1.5px dashed var(--green);background:none;border-radius:50%}
.key b{font-weight:400;text-transform:uppercase;letter-spacing:.06em;font-size:9.5px}

/* flat: the same cards with the camera switched off, to compare against */
body.flat .card3d{transform:none}
body.flat .edge{display:none}
body.flat .stage::after{opacity:0}
/* turning: a slow pass, for judging how they read in motion */
body.turn .card3d{animation:turn 9s ease-in-out infinite alternate}
@keyframes turn{
  from{transform:translateZ(var(--z)) rotateX(var(--rx)) rotateY(calc(var(--ry) - 10deg))}
  to{transform:translateZ(var(--z)) rotateX(calc(var(--rx) * -1)) rotateY(calc(var(--ry) + 10deg))}}
/* bare: no page ground and no furniture, for capturing a card on its own */
body.bare{background:transparent}
body.bare header,body.bare .bar,body.bare .tagline{display:none}
@media (prefers-reduced-motion:reduce){body.turn .card3d{animation:none}}
</style>
</head>
<body>
<noscript><img hidden height="1" width="1" src="https://www.facebook.com/tr?id=${DATASET}&amp;ev=PageView&amp;noscript=1" alt=""></noscript>
<div class="wrap">
<header><h1>Widgets in 3D</h1>
<p>The live widgets standing on tilted planes, not pictures of them. Real perspective, so a turned card's far edge is shorter than its near one. The text stays text.</p></header>
<div class="bar">
  <button data-mode="" aria-pressed="true">Posed</button>
  <button data-mode="turn" aria-pressed="false">Turning</button>
  <button data-mode="flat" aria-pressed="false">Flat</button>
  <button data-mode="bare" aria-pressed="false">No ground</button>
</div>
${FORMS.map(card).join('\n')}
</div>
<script>
const bar = document.querySelector('.bar');
bar.addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (!b) return;
  for (const o of bar.querySelectorAll('button')) o.setAttribute('aria-pressed', String(o === b));
  document.body.className = b.dataset.mode;
});
</script>
</body>
</html>
`;

const dir = join(ROOT, 'readings/compass/widget-3d');
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, 'index.html'), html);
console.log(`wrote /readings/compass/widget-3d/  (${FORMS.length} cards)`);
