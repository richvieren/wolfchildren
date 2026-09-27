#!/usr/bin/env node
// preview-widgets.mjs — the reasons block, with the real product in it.
//
// Richard, 2026-09-27: "Six reasons, six widgets, each next to the copy that
// names it. That's it." Structured on Cato's reasons module, which is the only
// place on her page that carries live product: two columns above 880px, the
// widget capped at 570px, even rows tinted and flipped so the page zig-zags.
// Reference: clients/Cato/cosmic-landing/shared/styles.css .reason / .reason__live
//
// The widgets are the real markup from the published Compass sample, lifted by
// scripts/extract-widgets.py. No screenshots, no images, no JavaScript. The
// text in them is selectable and it reflows, because it is the product.
//
//   node preview-widgets.mjs   writes readings/compass/preview-widgets/index.html

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FONTS, PIXEL, DATASET } from './variants.mjs';
import { WIDGETS, WIDGET_CSS } from './src/lib/compass-widgets.mjs';
import { C } from './src/lib/compass-copy.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));

// Each approved reason, against the section of the reading it names.
const PAIRS = ['big3', 'spectra', 'energy', 'seen', 'wheel', 'question'];

const rows = C.reasons.items.map(([title, body], i) => {
  const w = WIDGETS[PAIRS[i]];
  return `
<article class="reason">
  <div class="reason__text">
    <p class="reason__meta"><span class="reason__num">${String(i + 1).padStart(2, '0')}</span><span class="reason__cat">${title}</span></p>
    <p class="reason__body">${body}</p>
    <p class="reason__proof">In the reading: ${w.label}</p>
  </div>
  <div class="reason__live wc-live">${w.html}</div>
</article>`;
}).join('\n');

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Reasons with live widgets | Compass</title>
<script src="/assets/js/pixel.js?v=${PIXEL}"></script>
<style>${FONTS}
*{box-sizing:border-box}
html,body{overflow-x:clip}
body{margin:0;background:#DFD7C3;color:#495543;font:400 16px/1.7 "IBM Plex Mono",monospace}
.note{background:#495543;color:#DFD7C3;padding:14px 24px;font-size:12.5px;line-height:1.6}
.note b{color:#DA4635}
.head{max-width:1180px;margin:0 auto;padding:72px 24px 40px}
h1{font:900 clamp(1.9rem,3.6vw,2.9rem)/1.06 "Montserrat",sans-serif;letter-spacing:-.03em;margin:0;max-width:20ch}
.head p{margin:20px 0 0;font:400 17px/1.6 "Libre Baskerville",serif;max-width:56ch;color:#3A4435}

/* Cato's reason row: the row IS the band, content sits on the grid inside it. */
.reason{display:grid;gap:0;align-items:center;padding:56px 24px;background:#DFD7C3}
.reason:nth-of-type(even){background:#D8CFB7}
.reason__meta{display:flex;align-items:baseline;gap:12px;margin:0 0 10px}
.reason__num{font:900 24px/1.1 "Montserrat",sans-serif;letter-spacing:-.05em;color:#AC2E20;font-variant-numeric:tabular-nums}
.reason__cat{font:900 clamp(1.3rem,2.3vw,1.9rem)/1.15 "Montserrat",sans-serif;letter-spacing:-.03em}
.reason__body{margin:0;font:400 17px/1.6 "Libre Baskerville",serif;color:#3A4435;max-width:46ch}
.reason__proof{margin:18px 0 0;font:400 12px/1.6 "IBM Plex Mono",monospace;letter-spacing:.06em;
  text-transform:uppercase;color:#AC2E20}
.reason__live{margin:28px 0 0;min-width:0;max-width:100%}
@media(min-width:880px){
  /* The row IS the band, exactly as the reference does it: full width, tinted
     edge to edge, content centred by padding rather than by a max-width. An
     earlier version centred the row and faked the bleed with a pseudo-element
     at inset 0 -50vw, which pushed the document to 2248px on a 1625px viewport. */
  .reason{grid-template-columns:1fr 1fr;gap:64px;
    padding:80px max(40px, calc((100% - 1180px) / 2))}
  .reason__live{margin:0;justify-self:end;width:100%;max-width:570px}
  .reason:nth-of-type(even) .reason__live{grid-column:1;grid-row:1;justify-self:start}
  .reason:nth-of-type(even) .reason__text{grid-column:2;grid-row:1}
}
footer{max-width:1180px;margin:0 auto;padding:64px 24px;font-size:12.5px;color:#6A745F}

/* The product's own stylesheet, scoped so it cannot touch the page around it. */
${WIDGET_CSS}
.wc-live{max-width:100%;overflow-x:clip}
.wc-live .card{margin:0}
/* The reading is a fixed-width document, so four of its rules carry hard pixel
   widths that are wider than a phone. They are capped here rather than edited
   in the extract, so the snapshot stays a faithful copy and the landing page
   owns the responsive behaviour. Fidelity above these widths is unchanged. */
.wc-live .wheel-wrap{margin:0 auto;width:min(398px,100%)}
.wc-live .letter-text{width:auto;max-width:620px}
.wc-live .badge-desc,.wc-live .badge-basis,.wc-live .stellium-desc{width:auto;max-width:100%}
</style>
</head>
<body>
<noscript><img hidden height="1" width="1" src="https://www.facebook.com/tr?id=${DATASET}&amp;ev=PageView&amp;noscript=1" alt=""></noscript>
<p class="note"><b>Preview only.</b> Six approved reasons, six real widgets lifted from the published Compass sample. Not screenshots: this is the product's own markup and stylesheet, so the text is selectable and it reflows. <b>Known and unfixed:</b> the sample is written to a girl, so the widgets say &ldquo;she&rdquo; and name Nora, a child who does not exist. The reader has only &ldquo;she&rdquo; and &ldquo;he&rdquo;, so a neutral sample needs a change there first.</p>
<div class="head">
  <h1>${C.reasons.h2}</h1>
  <p>Each row shows the section of the reading it names, rendered from the reading itself.</p>
</div>
${rows}
<footer>Wolf Children &middot; preview, noindex, not linked from anywhere</footer>
</body>
</html>
`;

const dir = join(ROOT, 'readings/compass/preview-widgets');
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, 'index.html'), html);
console.log('wrote /readings/compass/preview-widgets/');
