#!/usr/bin/env node
// compass-preview.mjs — Nora's Compass as it would actually read, with the new
// module order and the photographs in frames.
//
// Richard, 2026-10-01: "let's just create a real profile again, a real compass,
// and already put some of these photos in these borders, as well as the updated
// order of the modules, so we can see how it looks for real."
//
// Everything here comes from the review page rather than a second copy: the
// blocks, his patches, the font remap and the photo CSS are imported, so a
// decision cannot drift between the two pages. The drawn forms are wrapped in
// the reading's own card classes so they sit native rather than pasted in.
//
// This does not touch the product. reader/compass.py still renders what buyers
// get, and nothing here is deployed to them.
//
//   node compass-preview.mjs

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PIXEL, DATASET } from './variants.mjs';
import { FORMS } from './widget-forms.mjs';
import { patchedBlocks, RESKIN, PHOTO_CSS, TRIO } from './widget-all.mjs';
import { TOKENS, ROUND, TONES } from './src/lib/widget-theme.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const B = patchedBlocks();
const F = new Map(FORMS.map((f) => [f.id, f]));

// A block in a toned wrapper, so the tone's tokens reach everything inside it.
const toned = (id, html) => (TONES[id] ? `<div class="${TONES[id]}">${html}</div>` : html);

const block = (id) => toned(id, rawBlock(id));

const rawBlock = (id) => {
  const b = B.get(id);
  if (!b) throw new Error(`no block ${id}`);
  if (!b.split) return b.html;
  // Three spectrums, three widgets, no group title.
  const bare = b.html.replace('<div class="wlabel">Three lines</div>', '');
  return TRIO.map((t, n) => `<div class="only-${n + 1} spec-one"><div class="wlabel">${t.a} or ${t.b}</div>${bare}</div>`).join('');
};

// A drawn form, wearing the reading's own card classes.
const form = (id) => {
  const f = F.get(id);
  if (!f) throw new Error(`no form ${id}`);
  return `<div class="card ${TONES[id] || ''}"><div class="wlabel">${f.title}</div>${f.art}
    <p class="wcontext">${f.said}</p><p class="wcontext dim">${f.why}</p></div>`;
};

const sh = (label, num) => `<div class="sh"><span class="sh-label">${label}</span><span class="sh-line"></span><span class="sh-num">${num}</span></div>`;

// Four photographs, four treatments, so the frames are judged in place.
// The compass photographs are 4:3 landscape. The instax window is 361 by 460,
// which is portrait, so that one crops hard. It is here on purpose: it shows
// that the frame needs portrait photography, not that it is broken.
const FRAME = '/assets/img/frames';
const photos = {
  1: `<figure class="ph ph-polaroid ph-shadow ph-tilt wide"><img class="ph-photo" src="/assets/compass/nature-1.jpg" alt="" loading="lazy"></figure>`,
  2: `<figure class="ph ph-matte ph-tape wide"><img class="ph-photo" src="/assets/compass/nature-2.jpg" alt="" loading="lazy"></figure>`,
  3: `<figure class="ph ph-card wide"><img class="ph-photo" src="/assets/compass/nature-3.jpg" alt="" loading="lazy"><img class="ph-tape-img t4" src="${FRAME}/tape-4.png" alt=""></figure>`,
  4: `<figure class="ph ph-instax ph-shadow"><img class="ph-photo" src="/assets/compass/nature-4.jpg" alt="" loading="lazy"><img class="ph-over" src="${FRAME}/instaxpolaroid-frame.png" alt=""></figure>`,
};
const photo = (n) => `<div class="photo-slot">${photos[n]}</div>`;

const reading = [
  block('E01'), block('E02'), block('E06'), block('E03'), block('E04'), block('E05'),
  photo(1),
  sh('The chart at a glance', '01'),
  form('N06'), form('N03'), form('N10'), form('N08'), form('N04'), form('N07'), form('N01'), form('N05'),
  block('E09'), block('E10'),
  block('E11'),
  photo(2),
  block('E12'),
  sh('Holding on and being seen', '02'),
  block('E13'), block('E14'), block('E15'), block('E16'), block('E17'), block('E18'),
  '<div class="divider"></div>',
  block('E19'), block('E20'), block('E21'),
  photo(3),
  sh('Turned inward', '03'),
  block('E22'), block('E23'),
  block('E24'),
  photo(4),
  sh('Keep going', '04'),
  block('E27'), block('E28'),
  block('E30'),
].join('\n');

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Compass for Nora</title>
<script src="/assets/js/pixel.js?v=${PIXEL}"></script>
<style>
@font-face{font-family:"Morning Memories";src:url("/assets/fonts/morning-memories-400.woff2") format("woff2");font-weight:400;font-display:swap}
@font-face{font-family:"Special Elite";src:url("/assets/fonts/special-elite-400.woff2") format("woff2");font-weight:400;font-display:swap}
${TOKENS}
*{box-sizing:border-box}
html,body{overflow-x:clip}
body{margin:0;background:var(--cream);color:var(--green);font:400 15px/1.6 "Special Elite","Courier New",monospace}
.page{max-width:430px;margin:0 auto;padding:0 18px 90px}
.banner{margin:16px 0 4px;padding:11px 12px;border:1px solid var(--orange);border-radius:5px;background:rgba(192,98,58,.12);font-size:11.5px;line-height:1.55}
.banner b{display:block;font:400 13px/1.3 "Morning Memories",Georgia,serif;margin-bottom:3px}
${PHOTO_CSS}
.photo-slot{margin:26px 0}
.ph.wide{width:100%}
.ph-instax{max-width:260px;margin:0 auto}
/* the drawn forms, wearing the reading's card */
.card svg.art{display:block;width:100%;max-width:210px;margin:10px auto;height:auto}
.card svg.art.wide{max-width:100%}
.card text{font-family:"Special Elite","Courier New",monospace;fill:var(--green)}
.card .num{font-family:"Special Elite","Courier New",monospace;text-anchor:middle;font-size:17px}
.card .num.big{font-size:34px}.card .num.xl{font-size:27px}.card .num.sm{font-size:13px}.card .num.tag{font-size:11px;fill:#F3EEE2}
.card .num.s{text-anchor:start}.card .num.e{text-anchor:end}
.card .tiny{font-size:8.5px;text-anchor:middle;letter-spacing:.07em;opacity:.8}
.card .tiny.s{text-anchor:start}.card .tiny.e{text-anchor:end}
.card .key{list-style:none;margin:10px 0 0;padding:0;font-size:11.5px}
.card .key li{display:flex;gap:7px;align-items:baseline;padding:2.5px 0;opacity:.85}
.card .key i{flex:0 0 auto;width:9px;height:9px;border-radius:2px;margin-top:4px}
.card .key i.hollow{border:1.5px dashed var(--green);background:none;border-radius:50%}
.card .key b{font-weight:400;text-transform:uppercase;letter-spacing:.06em;font-size:10px}
.wcontext.dim{opacity:.68;font-size:13px}
.spec-one{margin-top:14px}
.spec-one .wlabel{margin-bottom:6px}
.only-1 .spec:not(:nth-of-type(1)),.only-2 .spec:not(:nth-of-type(2)),.only-3 .spec:not(:nth-of-type(3)){display:none}
.spec-one .card>.wlabel{display:none}
${RESKIN}
${ROUND}
.wc-live .rose{display:block;width:52px;height:52px;margin:0 auto 6px}
.wc-live .big3.flat{text-align:center}
.wc-live .big3-glyph{font-family:"Wheel Glyphs";font-size:30px;line-height:1;margin:2px 0 4px;color:var(--orange)}
.wc-live .big3.flat .big3-word{opacity:.6}
.wc-live .hemi-n{font-family:"Special Elite","Courier New",monospace;font-size:28px;line-height:1;margin-top:6px}
.wc-live .letter-label.with-icon{display:flex;align-items:center;gap:8px}
.wc-live .qmark{width:26px;height:26px;flex:0 0 auto}
.wc-live .badge-placement{text-transform:none;letter-spacing:0}
.wc-live .bar-count,.wc-live .gauge-num,.wc-live .cusp-num,.wc-live .product-price,
.wc-live .hemi-n,.wc-live .sh-num{font-family:"Special Elite","Courier New",monospace}
</style>
</head>
<body>
<noscript><img hidden height="1" width="1" src="https://www.facebook.com/tr?id=${DATASET}&amp;ev=PageView&amp;noscript=1" alt=""></noscript>
<div class="page wc-live">
<div class="banner"><b>Preview, not the product</b>
The lines under each drawn widget are my draft wording and are yours to replace. Photograph four uses the instax frame, whose window is portrait, so a landscape shot crops hard. That frame wants portrait photography.</div>
${reading}
</div>
</body>
</html>
`;

const dir = join(ROOT, 'readings/compass/preview');
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, 'index.html'), html);
console.log(`wrote /readings/compass/preview/`);
