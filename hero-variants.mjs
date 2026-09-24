#!/usr/bin/env node
// hero-variants.mjs — the Compass hero, rebuilt once per design skill, for side-by-side review.
//
// Richard, 2026-09-24: "take the Compass hero and rebuild it once per skill, a separate version
// using only that skill." The copy is identical in every version and is the approved hero copy,
// so the only variable is the design language. Each page is standalone: its own CSS, no site.css,
// because three of the four are not the Wolf Children design system and loading it would blend them.
//
// Which skills, and why these: of 54 installed skills only three carry a design language that can
// compose a web hero. The rest are motion and video (hyperframes and its ten companions,
// motion-doctrine, motion-graphics, seam-craft, slideshow, the caption and cursor skills), an
// importer that needs a Figma file, a Slides API reader, or skills about words. Building a
// "version" from those would be a category error rather than a comparison.
//
//   node hero-variants.mjs        writes readings/compass/hero/<name>/index.html
//
// Every page is noindex and carries the pixel, like the rest of the site.

import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const PIXEL_HASH = createHash('md5').update(readFileSync(join(ROOT, 'assets/js/pixel.js'))).digest('hex').slice(0, 8);
const DATASET = '1622703732974632';

// The approved hero copy, identical in all four. Nothing here changes between versions.
const COPY = {
  eyebrow: 'Compass · one child · one page · $27',
  h1: 'Your child has done the same thing for six months and you still don’t know why.',
  sub: 'It happens most days. You have a theory, someone else in the house has another, and every few weeks you try something different and watch to see whether it helped. Six months of that wears you out more than the behaviour does.',
  bullets: [
    'One page about your child, written for you',
    'Built from the date, time and place of their birth',
    'Something to think with on the next bad evening',
  ],
  cta: 'Get Compass',
  ctaSub: 'Ready in minutes, on your phone, yours to keep.',
  badges: ['Secure checkout by Stripe', 'It needs their birth time', 'Your child’s name, date and place never leave our own server'],
};

const FONTS = `
@font-face{font-family:"Montserrat";src:url("/assets/fonts/montserrat-900.woff2") format("woff2");font-weight:900;font-display:swap}
@font-face{font-family:"Libre Baskerville";src:url("/assets/fonts/libre-baskerville-400.woff2") format("woff2");font-weight:400;font-display:swap}
@font-face{font-family:"Libre Baskerville";src:url("/assets/fonts/libre-baskerville-400-italic.woff2") format("woff2");font-weight:400;font-style:italic;font-display:swap}
@font-face{font-family:"IBM Plex Mono";src:url("/assets/fonts/ibm-plex-mono-300.woff2") format("woff2");font-weight:300;font-display:swap}
@font-face{font-family:"IBM Plex Mono";src:url("/assets/fonts/ibm-plex-mono-400.woff2") format("woff2");font-weight:400;font-display:swap}
@font-face{font-family:"IBM Plex Mono";src:url("/assets/fonts/ibm-plex-mono-700.woff2") format("woff2");font-weight:700;font-display:swap}
`;

const page = (title, note, css, body) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${title} | Compass hero</title>
<script src="/assets/js/pixel.js?v=${PIXEL_HASH}"></script>
<style>${FONTS}
*{box-sizing:border-box}
html,body{margin:0;padding:0}
.which{position:fixed;top:0;left:0;right:0;z-index:99;font:400 12px/1.4 "IBM Plex Mono",monospace;
  background:#111;color:#fff;padding:8px 14px;letter-spacing:.04em}
.which b{font-weight:700}
.which span{opacity:.62}
${css}</style>
</head>
<body>
<noscript><img hidden height="1" width="1" src="https://www.facebook.com/tr?id=${DATASET}&amp;ev=PageView&amp;noscript=1" alt=""></noscript>
<p class="which"><b>${title}</b> <span>${note}</span></p>
${body}
</body>
</html>
`;

// ─────────────────────────────────────────────────────────── 1. control, as live
const control = () => page(
  'Control',
  'the hero as it is live now, for comparison. Wolf Children components, no design skill used.',
  `body{background:#DFD7C3;color:#495543;font:400 16px/1.65 "IBM Plex Mono",monospace}
  .wrap{max-width:1180px;margin:0 auto;padding:96px 24px 64px}
  .grid{display:grid;gap:40px}
  @media(min-width:900px){.grid{grid-template-columns:1fr 1fr;gap:56px;align-items:start}}
  .eyebrow{font:400 12px/1.4 "IBM Plex Mono",monospace;letter-spacing:.06em;text-transform:uppercase;margin:0 0 18px}
  h1{font:900 40px/1.0 "Montserrat",sans-serif;letter-spacing:-.01em;margin:0 0 20px}
  @media(min-width:900px){h1{font-size:64px}}
  .lead{font:400 18px/1.55 "Libre Baskerville",serif;letter-spacing:-.01em;margin:0 0 24px}
  ul{list-style:none;margin:0 0 28px;padding:0}
  li{padding:8px 0 8px 18px;border-bottom:1px solid #CDB494;position:relative}
  li:before{content:"";position:absolute;left:0;top:17px;width:8px;height:1px;background:#CDB494}
  .btn{display:inline-block;background:#AC2E20;color:#DFD7C3;text-decoration:none;padding:14px 28px;font:700 14px/1 "IBM Plex Mono",monospace;letter-spacing:.04em}
  .ctasub{margin:12px 0 0;font-size:14px}
  .badges{list-style:none;margin:28px 0 0;padding:0;font-size:13px;opacity:.85}
  .badges li{border:0;padding:4px 0 4px 18px}
  .slot{background:#CDB494;aspect-ratio:4/5;display:flex;align-items:center;justify-content:center;
    font:400 12px/1.4 "IBM Plex Mono",monospace;color:#495543;text-align:center;padding:16px}
  .slot.detail{aspect-ratio:2/3}
  .media{display:grid;grid-template-columns:1fr 1fr;gap:16px}`,
  `<div class="wrap"><div class="grid">
    <div>
      <p class="eyebrow">${COPY.eyebrow}</p>
      <h1>${COPY.h1}</h1>
      <p class="lead">${COPY.sub}</p>
      <ul>${COPY.bullets.map((b) => `<li>${b}</li>`).join('')}</ul>
      <a class="btn" href="#">${COPY.cta}</a>
      <p class="ctasub">${COPY.ctaSub}</p>
      <ul class="badges">${COPY.badges.map((b) => `<li>${b}</li>`).join('')}</ul>
    </div>
    <div class="media"><div class="slot">PHOTO · hero<br>4:5</div><div class="slot detail">PHOTO · hero-detail<br>2:3</div></div>
  </div></div>`);

// ───────────────────────────────────────────────── 2. lore-design, applied literally
// Craft rules from the skill: type is the hero (140px+ desktop), the dark stage #161215 with
// #000 banned, one accent (lilac #EAABFE) in at most three places, radius 0 everywhere, vertical
// space 96-192px, bracketed CTAs. The skill requires declaring fonts: PODIUM Sharp is not on this
// machine, so Montserrat 900 stands in for the display face and the note says so.
const lore = () => page(
  'lore-design',
  'the Lore design system applied literally. Dark stage, type as architecture, lilac accent, zero radius, bracketed CTA. PODIUM Sharp is unavailable, so Montserrat 900 stands in.',
  `body{background:#161215;color:#fff;font:400 16px/1.6 "IBM Plex Mono",monospace}
  .wrap{max-width:1440px;margin:0 auto;padding:192px 32px 128px}
  .eyebrow{font:400 12px/1 "IBM Plex Mono",monospace;letter-spacing:.14em;text-transform:uppercase;
    color:#EAABFE;margin:0 0 64px}
  h1{font:900 64px/0.92 "Montserrat",sans-serif;letter-spacing:-.02em;text-transform:uppercase;
    margin:0 0 96px;max-width:14ch}
  @media(min-width:1000px){h1{font-size:140px}}
  .lower{display:grid;gap:64px}
  @media(min-width:1000px){.lower{grid-template-columns:1fr 1fr;gap:96px}}
  .lead{font:400 18px/1.7 "IBM Plex Mono",monospace;color:#B9B2B6;margin:0;max-width:56ch}
  ul{list-style:none;margin:0;padding:0}
  li{font:400 14px/1.6 "IBM Plex Mono",monospace;color:#B9B2B6;padding:16px 0;border-top:1px solid #2A2427}
  li:last-child{border-bottom:1px solid #2A2427}
  .cta{display:inline-block;margin:96px 0 0;font:900 20px/1 "Montserrat",sans-serif;
    letter-spacing:.02em;color:#EAABFE;text-decoration:none;text-transform:uppercase}
  .ctasub{margin:24px 0 0;font-size:13px;color:#6E6669}
  .badges{margin:96px 0 0;display:flex;flex-wrap:wrap;gap:32px;list-style:none;padding:0}
  .badges li{border:0;padding:0;font-size:12px;color:#6E6669;letter-spacing:.04em;text-transform:uppercase}
  .stage{margin:128px 0 0;background:#1e1a1d;aspect-ratio:21/9;display:flex;align-items:center;
    justify-content:center;color:#3A3438;font-size:12px;letter-spacing:.14em;text-transform:uppercase}`,
  `<div class="wrap">
    <p class="eyebrow">${COPY.eyebrow}</p>
    <h1>${COPY.h1}</h1>
    <div class="lower">
      <p class="lead">${COPY.sub}</p>
      <ul>${COPY.bullets.map((b) => `<li>${b}</li>`).join('')}</ul>
    </div>
    <a class="cta" href="#">[${COPY.cta}]</a>
    <p class="ctasub">${COPY.ctaSub}</p>
    <ul class="badges">${COPY.badges.map((b) => `<li>${b}</li>`).join('')}</ul>
    <div class="stage">PHOTO · hero · 21:9</div>
  </div>`);

// ───────────────────────────────────────── 3. hue, run as its own process on this brand
// hue's mandatory step is the hero stage: a background field, an optional hero subject, and the
// relation between them. Wolf Children is a lifestyle brand whose authority comes from the
// photographs (brand bible §7), so the preset is `editorial-photo`: photo full-bleed, hero subject
// none, relation flat. Tokens are the brand's own: cream, forest green, tan, the deep orange for
// a filled button. Spacing is a 4px scale; the type scale is the bible's.
const hueVersion = () => page(
  'hue',
  'hue run as its own process: hero stage preset editorial-photo, photo full-bleed, no hero subject, flat relation. Tokens and type scale from the Wolf Children brand bible.',
  `body{background:#DFD7C3;color:#495543;font:400 16px/1.65 "IBM Plex Mono",monospace}
  .stage{position:relative;min-height:88vh;display:flex;align-items:flex-end;
    background:linear-gradient(180deg,#8E9B86 0%,#6E7C68 58%,#495543 100%)}
  .stage:after{content:"PHOTO · hero · full bleed · a child outside at dusk, looking up";
    position:absolute;top:24px;left:24px;font:400 11px/1.4 "IBM Plex Mono",monospace;
    color:rgba(223,215,195,.55);letter-spacing:.06em;text-transform:uppercase}
  .scrim{position:absolute;inset:0;background:linear-gradient(180deg,rgba(29,34,27,0) 30%,rgba(29,34,27,.72) 100%)}
  .inner{position:relative;width:100%;max-width:1180px;margin:0 auto;padding:0 24px 64px}
  .eyebrow{font:400 12px/1.4 "IBM Plex Mono",monospace;letter-spacing:.06em;text-transform:uppercase;
    color:#DFD7C3;margin:0 0 16px}
  h1{font:900 40px/1.02 "Montserrat",sans-serif;letter-spacing:-.01em;color:#DFD7C3;margin:0;max-width:18ch}
  @media(min-width:900px){h1{font-size:64px}.inner{padding-bottom:96px}}
  .below{max-width:1180px;margin:0 auto;padding:48px 24px 96px;display:grid;gap:32px}
  @media(min-width:900px){.below{grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr);gap:64px;align-items:start}}
  .lead{font:400 19px/1.6 "Libre Baskerville",serif;letter-spacing:-.01em;margin:0;max-width:62ch}
  ul{list-style:none;margin:0;padding:0}
  li{font-size:15px;padding:12px 0;border-bottom:1px solid #CDB494}
  li:first-child{border-top:1px solid #CDB494}
  .act{grid-column:1/-1;display:flex;flex-wrap:wrap;align-items:center;gap:20px;margin-top:8px}
  .btn{display:inline-block;background:#AC2E20;color:#DFD7C3;text-decoration:none;
    padding:16px 32px;font:700 14px/1 "IBM Plex Mono",monospace;letter-spacing:.04em}
  .ctasub{margin:0;font-size:14px}
  .badges{grid-column:1/-1;display:flex;flex-wrap:wrap;gap:8px 24px;list-style:none;padding:0;margin:8px 0 0}
  .badges li{border:0;padding:0;font-size:13px;opacity:.8}`,
  `<header class="stage"><div class="scrim"></div><div class="inner">
     <p class="eyebrow">${COPY.eyebrow}</p>
     <h1>${COPY.h1}</h1>
   </div></header>
   <div class="below">
     <p class="lead">${COPY.sub}</p>
     <ul>${COPY.bullets.map((b) => `<li>${b}</li>`).join('')}</ul>
     <div class="act"><a class="btn" href="#">${COPY.cta}</a><p class="ctasub">${COPY.ctaSub}</p></div>
     <ul class="badges">${COPY.badges.map((b) => `<li>${b}</li>`).join('')}</ul>
   </div>`);

// ──────────────────────── 4. hyperframes-creative house style, adapted to a static page
// Its own docs say these rules override web instincts and are written for video frames, so this is
// the one adaptation in the set: the composition doctrine applies, the motion does not. What it
// asks for: light palette because the subject is children, one accent hue, neutrals tinted toward
// the accent rather than dead grey, a background layer of two to five persistent decoratives, and
// an eye led somewhere rather than everything centred with equal weight.
const houseStyle = () => page(
  'hyperframes-creative',
  'the house style: light palette for a children subject, one accent hue, neutrals tinted toward it, a background layer of four decoratives, weight led to one corner. Its motion rules do not apply to a static page.',
  `body{background:#E4DCC8;color:#3F4A3A;font:400 16px/1.65 "IBM Plex Mono",monospace;overflow-x:hidden}
  .frame{position:relative;min-height:92vh;display:flex;align-items:center;padding:64px 24px}
  /* background layer: ghost word, radial glow, hairline rules, a tinted field */
  .ghost{position:absolute;right:-4vw;top:6vh;font:900 30vw/0.8 "Montserrat",sans-serif;
    color:#495543;opacity:.055;pointer-events:none;user-select:none;letter-spacing:-.03em}
  .glow{position:absolute;left:-10vw;top:-10vh;width:70vw;height:70vw;border-radius:50%;
    background:radial-gradient(circle,rgba(218,70,53,.14) 0%,rgba(218,70,53,0) 62%);pointer-events:none}
  .rules{position:absolute;inset:0;pointer-events:none;
    background:repeating-linear-gradient(90deg,transparent 0 calc(12.5% - 1px),rgba(73,85,67,.07) calc(12.5% - 1px) 12.5%)}
  .corner{position:absolute;right:24px;bottom:24px;width:120px;height:120px;
    border-right:1px solid rgba(218,70,53,.35);border-bottom:1px solid rgba(218,70,53,.35);pointer-events:none}
  .inner{position:relative;width:100%;max-width:1120px;margin:0 auto;display:grid;gap:36px}
  @media(min-width:960px){.inner{grid-template-columns:minmax(0,7fr) minmax(0,4fr);gap:72px;align-items:center}}
  .eyebrow{display:inline-block;font:700 11px/1 "IBM Plex Mono",monospace;letter-spacing:.12em;
    text-transform:uppercase;color:#DFD7C3;background:#DA4635;padding:7px 12px;margin:0 0 24px}
  h1{font:900 42px/1.0 "Montserrat",sans-serif;letter-spacing:-.015em;margin:0 0 24px;max-width:16ch}
  @media(min-width:960px){h1{font-size:72px}}
  .lead{font:400 18px/1.6 "Libre Baskerville",serif;letter-spacing:-.01em;margin:0 0 32px;max-width:54ch;color:#4A5545}
  .act{display:flex;flex-wrap:wrap;align-items:center;gap:18px}
  .btn{display:inline-block;background:#3F4A3A;color:#E4DCC8;text-decoration:none;padding:16px 30px;
    font:700 14px/1 "IBM Plex Mono",monospace;letter-spacing:.04em}
  .ctasub{margin:0;font-size:14px;color:#6A745F}
  .side{position:relative}
  .card{background:#DFD7C3;border:1px solid #CDB494;padding:22px}
  .card h2{font:700 11px/1 "IBM Plex Mono",monospace;letter-spacing:.12em;text-transform:uppercase;
    margin:0 0 14px;color:#6A745F}
  ul{list-style:none;margin:0;padding:0}
  li{font-size:15px;line-height:1.5;padding:11px 0;border-bottom:1px solid rgba(205,180,148,.75)}
  li:last-child{border-bottom:0;padding-bottom:0}
  .badges{position:relative;max-width:1120px;margin:0 auto;padding:0 24px 64px;display:flex;
    flex-wrap:wrap;gap:8px 28px;list-style:none;font-size:13px;color:#6A745F}
  .badges li{border:0;padding:0}`,
  `<section class="frame">
     <div class="glow"></div><div class="rules"></div><div class="ghost">SKY</div><div class="corner"></div>
     <div class="inner">
       <div>
         <p class="eyebrow">${COPY.eyebrow}</p>
         <h1>${COPY.h1}</h1>
         <p class="lead">${COPY.sub}</p>
         <div class="act"><a class="btn" href="#">${COPY.cta}</a><p class="ctasub">${COPY.ctaSub}</p></div>
       </div>
       <div class="side"><div class="card"><h2>What it is</h2>
         <ul>${COPY.bullets.map((b) => `<li>${b}</li>`).join('')}</ul></div></div>
     </div>
   </section>
   <ul class="badges">${COPY.badges.map((b) => `<li>${b}</li>`).join('')}</ul>`);

const VARIANTS = {
  control: control(),
  'lore-design': lore(),
  hue: hueVersion(),
  'hyperframes-creative': houseStyle(),
};

for (const [name, html] of Object.entries(VARIANTS)) {
  const dir = join(ROOT, 'readings/compass/hero', name);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
  console.log(`wrote /readings/compass/hero/${name}/`);
}
