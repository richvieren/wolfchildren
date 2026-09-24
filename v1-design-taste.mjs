#!/usr/bin/env node
// v1-design-taste.mjs — the Compass page in design-taste-frontend, built twice: with the
// empty-slot notes and without them.
//
// Richard, 2026-09-24: "five apologies down one page might read worse than silence." Same map,
// same copy, same design language; the only difference is whether a bare slot explains itself.
//
// DESIGN READ (mandated by the skill, §0.B, before generating):
//   A cold-traffic page for a parent who is guessing about one specific thing in her own house
//   and wants to stop. Premium consumer, warm, editorial. No social proof of any kind exists.
//
// DIALS (§1): DESIGN_VARIANCE 7 · MOTION_INTENSITY 3 · VISUAL_DENSITY 3
//   Landing / premium consumer preset is 7/6/3. Motion is dropped to 3 because this is a static
//   page with no script; what remains is hover and focus interpolation, never instant swaps.
//
// TWO OVERRIDES TAKEN, both permitted by the skill and both approved by Richard:
//   §4.2 bans the warm cream and beige family as the default reach for premium-consumer briefs,
//   naming hexes next to our #DFD7C3. The override is "the brand brief explicitly names those
//   colors". brand-bible.md §2 names #DFD7C3 as the only page background, so the override applies.
//   §4.1 very discourages serif as a default. The override is "the brand brief literally names a
//   serif font". The bible names Libre Baskerville for leads. It is used for leads only.
//
// HARD RULES FOLLOWED (§4.7), and the one that could not be:
//   Hero stack max 4 text elements: eyebrow, headline, subtext, CTA. The three bullets and the
//     three badges are banned inside a hero and move to the band directly below it. No copy changed.
//   Hero top padding capped at 96px.
//   Eyebrow restraint: 4 eyebrows across 13 sections, under the ceil(13/3)=5 ceiling.
//   Section-layout-repetition ban: nine layout families, each used once.
//   Zigzag cap: no two consecutive image-and-text splits exist at all.
//   Split-header ban: no section pairs a big left headline with a small right paragraph.
//   Cards only where elevation means hierarchy; elsewhere hairlines and space.
//   Mobile collapse declared per section.
//   COULD NOT FOLLOW: "hero fits the initial viewport, subtext max 20 words". The approved
//     subtext is 50 words and Richard held it. The skill says solve it with type scale, so the
//     hero headline runs at clamp(2.5rem, 5vw, 4.25rem) rather than the larger scale the copy
//     would otherwise invite, and the hero is still taller than the rule wants. Stated, not hidden.

import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { audit, report } from './src/lib/slop.mjs';
import { C } from './src/lib/compass-copy.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const PIXEL = createHash('md5').update(readFileSync(join(ROOT, 'assets/js/pixel.js'))).digest('hex').slice(0, 8);
const DATASET = '1622703732974632';

const CSS = `
:root{
  --cream:#DFD7C3; --green:#495543; --tan:#CDB494; --accent:#DA4635; --accent-deep:#AC2E20;
  --ink:#3A4435; --muted:#6A745F;
  --s1:4px; --s2:8px; --s3:16px; --s4:24px; --s5:40px; --s6:64px; --s7:96px; --s8:144px;
}
*{box-sizing:border-box}
html{scroll-behaviour:smooth}
body{margin:0;background:var(--cream);color:var(--green);
  font:300 16px/1.7 "IBM Plex Mono",ui-monospace,monospace;-webkit-font-smoothing:antialiased}
.wrap{width:100%;max-width:1180px;margin:0 auto;padding:0 var(--s4)}
section{padding:var(--s7) 0}
@media(min-width:900px){section{padding:var(--s8) 0}}
h1,h2,h3{font-family:"Montserrat",system-ui,sans-serif;font-weight:900;margin:0}
h1{font-size:clamp(2.5rem,5vw,4.25rem);line-height:1.02;letter-spacing:-.02em;max-width:17ch}
h2{font-size:clamp(1.75rem,3.2vw,2.75rem);line-height:1.06;letter-spacing:-.015em;max-width:20ch}
h3{font-size:1rem;line-height:1.35;letter-spacing:-.005em}
p{margin:0}
.lead{font:400 clamp(1.05rem,1.4vw,1.2rem)/1.6 "Libre Baskerville",Georgia,serif;
  letter-spacing:-.01em;max-width:60ch;color:var(--ink)}
.eyebrow{font:400 11px/1 "IBM Plex Mono",monospace;letter-spacing:.16em;text-transform:uppercase;
  color:var(--muted);margin-bottom:var(--s4)}
.small{font-size:13px;color:var(--muted)}
a{color:inherit}
.btn{display:inline-flex;align-items:center;justify-content:center;background:var(--accent-deep);
  color:var(--cream);text-decoration:none;padding:17px 32px;font:700 14px/1 "IBM Plex Mono",monospace;
  letter-spacing:.04em;transition:background 180ms cubic-bezier(.22,.61,.36,1),transform 180ms cubic-bezier(.22,.61,.36,1)}
.btn:hover{background:#8F251A;transform:translateY(-1px)}
.btn:focus-visible{outline:2px solid var(--green);outline-offset:3px}
.link{text-underline-offset:.28em;text-decoration-thickness:1px;transition:color 160ms ease-out}
.link:hover{color:var(--accent-deep)}

/* announcement bar */
.announce{background:var(--green);color:var(--cream);text-align:center;padding:11px var(--s3);font-size:13px}
/* nav, one line, 64px */
.nav{position:sticky;top:0;z-index:50;height:64px;display:flex;align-items:center;
  justify-content:space-between;gap:var(--s3);background:rgba(223,215,195,.92);
  backdrop-filter:blur(8px);border-bottom:1px solid var(--tan);padding:0 var(--s4)}
.nav .mark{font:900 15px/1 "Montserrat",sans-serif;letter-spacing:-.01em}
.nav .btn{padding:11px 20px;font-size:12px}

/* 1 · hero: left-weighted asymmetric, never centred (VARIANCE 7 → anti-centre) */
.hero{padding-top:var(--s7);padding-bottom:var(--s6)}
@media(min-width:900px){.hero{padding-top:96px}}
.hero .lead{margin-top:var(--s4)}
.hero .act{margin-top:var(--s5);display:flex;flex-wrap:wrap;align-items:center;gap:var(--s4)}
.note{border-left:2px solid var(--tan);padding:10px 0 10px var(--s3);margin-bottom:var(--s4);
  font-size:12.5px;line-height:1.6;color:var(--muted);max-width:64ch}

/* 2 · support band: hairline-divided row, no cards */
.band{border-top:1px solid var(--tan);border-bottom:1px solid var(--tan);padding:var(--s5) 0}
.band .wrap{display:grid;gap:var(--s4)}
@media(min-width:820px){.band .wrap{grid-template-columns:repeat(3,1fr);gap:var(--s5)}}
.band p{font-size:15px}
.badges{margin-top:var(--s5);display:flex;flex-wrap:wrap;gap:var(--s2) var(--s5)}

/* 3 · sample: inverted panel */
.invert{background:var(--green);color:var(--cream)}
.invert h2,.invert .lead{color:var(--cream)}
.invert .eyebrow{color:var(--tan)}
.invert .links{margin-top:var(--s5);display:flex;flex-direction:column;gap:var(--s3);align-items:flex-start}

/* 4 · stats: three figures on hairlines */
.stats{display:grid;gap:var(--s5)}
@media(min-width:760px){.stats{grid-template-columns:repeat(3,1fr);gap:var(--s6)}}
.stat{border-top:2px solid var(--green);padding-top:var(--s3)}
.stat b{display:block;font:900 clamp(2.5rem,4vw,3.5rem)/1 "Montserrat",sans-serif;letter-spacing:-.02em}
.stat i{display:block;font-style:normal;font-size:11px;letter-spacing:.16em;text-transform:uppercase;
  color:var(--muted);margin:var(--s2) 0 var(--s3)}

/* 5 · reasons: hanging numerals, full width, no cards */
.reasons{margin-top:var(--s6);display:grid}
.reason{display:grid;grid-template-columns:auto 1fr;gap:var(--s4);padding:var(--s5) 0;border-top:1px solid var(--tan)}
.reason:last-child{border-bottom:1px solid var(--tan)}
@media(min-width:900px){.reason{grid-template-columns:72px minmax(0,20ch) minmax(0,1fr);gap:var(--s5);align-items:start}}
.reason .n{font:900 13px/1 "Montserrat",sans-serif;color:var(--accent);padding-top:5px}
.reason p{font-size:15px;color:var(--ink);max-width:58ch}

/* 6 · outcomes: two columns of plain lines */
.outcomes{margin-top:var(--s5);display:grid;gap:var(--s3)}
@media(min-width:820px){.outcomes{grid-template-columns:1fr 1fr;gap:var(--s3) var(--s6)}}
.outcomes p{padding:var(--s3) 0;border-bottom:1px solid var(--tan);font-size:15px}

/* 7 · offer: price block and steps, the one place cards earn their elevation */
.offer{display:grid;gap:var(--s5)}
@media(min-width:900px){.offer{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:var(--s6);align-items:start}}
.price{font:900 clamp(3rem,5vw,4rem)/1 "Montserrat",sans-serif;letter-spacing:-.02em;margin:var(--s3) 0}
.includes{margin-top:var(--s4)}
.includes p{padding:var(--s3) 0;border-bottom:1px solid rgba(205,180,148,.7);font-size:15px}
.steps{display:grid;gap:var(--s3)}
.step{background:rgba(255,255,255,.34);border:1px solid var(--tan);padding:var(--s4);
  box-shadow:0 1px 0 rgba(73,85,67,.06)}
.step b{display:block;font:700 13px/1.3 "IBM Plex Mono",monospace;margin-bottom:var(--s2)}
.step p{font-size:14px;color:var(--ink)}

/* 8 · banner: full-bleed band */
.banner{background:var(--accent-deep);color:var(--cream)}
.banner h2{color:var(--cream);max-width:24ch}
.banner p{color:#F0DAD4;margin:var(--s3) 0 var(--s5);max-width:52ch}
.banner .btn{background:var(--cream);color:var(--accent-deep)}
.banner .btn:hover{background:#fff}

/* 9 · compare: a real table */
.tablewrap{margin-top:var(--s5);overflow-x:auto}
table{width:100%;border-collapse:collapse;font-size:14px;min-width:640px}
th,td{text-align:left;padding:var(--s3) var(--s2);border-bottom:1px solid var(--tan);vertical-align:top}
thead th{font:700 11px/1.3 "IBM Plex Mono",monospace;letter-spacing:.14em;text-transform:uppercase;
  color:var(--muted);border-bottom:2px solid var(--green)}
tbody th{font:400 13px/1.5 "IBM Plex Mono",monospace;color:var(--muted);width:15%}
td:nth-child(3){background:rgba(205,180,148,.26);font-weight:400}

/* 10 · faq: accordion */
.faq{margin-top:var(--s5);border-top:1px solid var(--tan)}
details{border-bottom:1px solid var(--tan)}
summary{cursor:pointer;list-style:none;padding:var(--s4) 0;font:700 15px/1.4 "IBM Plex Mono",monospace;
  display:flex;justify-content:space-between;gap:var(--s4);transition:color 160ms ease-out}
summary:hover{color:var(--accent-deep)}
summary::-webkit-details-marker{display:none}
summary::after{content:"+";font-weight:400;color:var(--muted)}
details[open] summary::after{content:"–"}
details p{padding:0 0 var(--s4);font-size:15px;color:var(--ink);max-width:64ch}

/* 11 · close: centred, permitted for a manifesto close */
.close{text-align:center}
.close h2{margin:0 auto var(--s4)}
.close .lead{margin:0 auto var(--s5)}
footer{background:var(--green);color:var(--tan);font-size:13px;padding:var(--s6) 0}
`;

const shell = (title, note, body) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${title} | Compass</title>
<script src="/assets/js/pixel.js?v=${PIXEL}"></script>
<style>
@font-face{font-family:"Montserrat";src:url("/assets/fonts/montserrat-900.woff2") format("woff2");font-weight:900;font-display:swap}
@font-face{font-family:"Libre Baskerville";src:url("/assets/fonts/libre-baskerville-400.woff2") format("woff2");font-weight:400;font-display:swap}
@font-face{font-family:"IBM Plex Mono";src:url("/assets/fonts/ibm-plex-mono-300.woff2") format("woff2");font-weight:300;font-display:swap}
@font-face{font-family:"IBM Plex Mono";src:url("/assets/fonts/ibm-plex-mono-400.woff2") format("woff2");font-weight:400;font-display:swap}
@font-face{font-family:"IBM Plex Mono";src:url("/assets/fonts/ibm-plex-mono-700.woff2") format("woff2");font-weight:700;font-display:swap}
.which{font:400 12px/1.5 "IBM Plex Mono",monospace;background:#111;color:#fff;padding:8px 14px;letter-spacing:.04em}
.which b{font-weight:700}.which span{opacity:.62}
${CSS}</style>
</head>
<body>
<noscript><img hidden height="1" width="1" src="https://www.facebook.com/tr?id=${DATASET}&amp;ev=PageView&amp;noscript=1" alt=""></noscript>
<p class="which"><b>${title}</b> <span>${note}</span></p>
${body}
</body>
</html>
`;

const build = (withNotes) => {
  const n = (key) => (withNotes ? `<p class="note">${C.notes[key]}</p>` : '');
  return `
<p class="announce">${C.announce}</p>
<nav class="nav"><span class="mark">Wolf Children</span><a class="btn" href="#offer">Get Compass</a></nav>

<section class="hero"><div class="wrap">
  ${n('proof')}
  <p class="eyebrow">${C.hero.eyebrow}</p>
  <h1>${C.hero.h1}</h1>
  <p class="lead">${C.hero.sub}</p>
  <div class="act"><a class="btn" href="#offer">${C.hero.cta}</a><p class="small">${C.hero.ctaSub}</p></div>
</div></section>

<div class="band"><div class="wrap">
  ${C.support.bullets.map((b) => `<p>${b}</p>`).join('')}
</div><div class="wrap"><div class="badges">${C.support.badges.map((b) => `<span class="small">${b}</span>`).join('')}</div></div></div>

${withNotes ? `<section><div class="wrap">${n('press')}</div></section>` : ''}

<section class="invert"><div class="wrap">
  <h2>${C.sample.h2}</h2>
  <p class="lead">${C.sample.body}</p>
  <div class="links">${C.sample.links.map(([l, h]) => `<a class="link" href="${h}">${l}</a>`).join('')}</div>
</div></section>

<section><div class="wrap">
  <h2>${C.stats.h2}</h2>
  <div class="stats" style="margin-top:var(--s6)">
    ${C.stats.items.map(([b, i, p]) => `<div class="stat"><b>${b}</b><i>${i}</i><p class="small">${p}</p></div>`).join('')}
  </div>
  ${withNotes ? n('unrecorded') : ''}
</div></section>

<section><div class="wrap">
  <p class="eyebrow">${C.reasons.eyebrow}</p>
  <h2>${C.reasons.h2}</h2>
  <div class="reasons">
    ${C.reasons.items.map(([t, p], i) => `<div class="reason"><span class="n">${String(i + 1).padStart(2, '0')}</span><h3>${t}</h3><p>${p}</p></div>`).join('')}
  </div>
</div></section>

<section><div class="wrap">
  <h2>${C.outcomes.h2}</h2>
  <div class="outcomes">${C.outcomes.items.map((o) => `<p>${o}</p>`).join('')}</div>
</div></section>

<section id="offer"><div class="wrap">
  <p class="eyebrow">${C.offer.eyebrow}</p>
  <div class="offer">
    <div>
      <h2>${C.offer.h2}</h2>
      <p class="price">${C.offer.price}</p>
      <p class="lead">${C.offer.tagline}</p>
      <div class="includes">${C.offer.includes.map((i) => `<p>${i}</p>`).join('')}</div>
      <div class="act" style="margin-top:var(--s5)"><a class="btn" href="#">${C.offer.cta}</a></div>
      <p class="small" style="margin-top:var(--s4);max-width:52ch">${C.offer.note}</p>
    </div>
    <div class="steps">${C.offer.how.map(([t, p]) => `<div class="step"><b>${t}</b><p>${p}</p></div>`).join('')}</div>
  </div>
</div></section>

<section class="banner"><div class="wrap">
  <h2>${C.banner1[0]}</h2><p>${C.banner1[1]}</p><a class="btn" href="#offer">Get Compass</a>
</div></section>

${withNotes ? `<section><div class="wrap">${n('ugc')}</div></section>` : ''}

<section><div class="wrap">
  <h2>${C.compare.h2}</h2>
  <div class="tablewrap"><table>
    <thead><tr><th></th>${C.compare.cols.map((c) => `<th>${c}</th>`).join('')}</tr></thead>
    <tbody>${C.compare.rows.map((r) => `<tr><th>${r[0]}</th>${r.slice(1).map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>
  </table></div>
</div></section>

${withNotes ? `<section><div class="wrap">${n('endorse')}</div></section>` : ''}

<section class="banner"><div class="wrap">
  <h2>${C.banner2[0]}</h2><p>${C.banner2[1]}</p><a class="btn" href="#offer">Get Compass</a>
</div></section>

${withNotes ? `<section><div class="wrap">${n('reviews')}</div></section>` : ''}

<section><div class="wrap">
  <p class="eyebrow">${C.faq.eyebrow}</p>
  <h2>${C.faq.h2}</h2>
  <div class="faq">${C.faq.items.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</div>
</div></section>

<section class="close"><div class="wrap">
  <h2>${C.close[0]}</h2><p class="lead">${C.close[1]}</p><a class="btn" href="#offer">${C.close[2]}</a>
</div></section>

<footer><div class="wrap">Wolf Children · hello@wolfchildren.co</div></footer>
`;
};

const copyBlob = JSON.stringify(C).replace(/","/g, '\n').replace(/[{}"\[\]]/g, ' ').replace(/\w+:/g, ' ');
const hits = audit(copyBlob);
if (hits.length) { console.error(report(hits)); process.exit(1); }
console.log('anti-slop audit: clean');

const NOTE = 'design-taste-frontend · dials 7/3/3 · teardown module order · copy approved 2026-09-24';
for (const [slug, withNotes, label] of [
  ['notes', true, 'v1 · with the empty-slot notes'],
  ['silent', false, 'v1 · empty slots left silent'],
]) {
  const dir = join(ROOT, 'readings/compass/v1', slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), shell(label, NOTE, build(withNotes)));
  console.log(`wrote /readings/compass/v1/${slug}/`);
}
