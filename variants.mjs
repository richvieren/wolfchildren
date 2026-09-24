#!/usr/bin/env node
// variants.mjs — the Compass page in nine more design languages.
//
// Richard, 2026-09-24. Same approved copy (src/lib/compass-copy.mjs), same module order from the
// six-brand teardown, empty slots silent. Only the design language changes.
//
// THE MODULE ORDER, identical in all nine:
//   announce · nav with sticky CTA · hero · support band · recognition · sample · stats ·
//   six reasons · refusal · outcomes · offer · CTA banner · compare · CTA banner · FAQ ·
//   close · footer
//   recognition and refusal were added 2026-09-24 with the copywriter's blueprint. The teardown
//   order is untouched; these two sit where the blueprint puts them, because the blueprint's
//   structure is approved and the refusal is the centre of the page.
//   Slots 2 (proof line), 3 (press), 9 (customer images), 11 (endorsement) and 14 (reviews) are
//   empty and silent. Slots 6 and 8 were never recorded in the teardown, so nothing is placed.
//
// FONTS: every one of these skills names faces we do not have on this machine (Geist, Satoshi,
// Cabinet Grotesk, Clash Display, Switzer, Neue Haas, Archivo Black, PP Editorial New, Lyon Text).
// Fetching them would be an external asset pull and a new network dependency on a site that
// self-hosts everything, so it was not done. All nine run on the three self-hosted brand faces:
// Montserrat 900, Libre Baskerville, IBM Plex Mono. Each page says so in its own bar. Where a
// skill's identity depends on a face we lack, the note names the substitution.
//
//   node variants.mjs   writes readings/compass/<slug>/index.html for each

import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { audit, report } from './src/lib/slop.mjs';
import { C } from './src/lib/compass-copy.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
export const PIXEL = createHash('md5').update(readFileSync(join(ROOT, 'assets/js/pixel.js'))).digest('hex').slice(0, 8);
export const DATASET = '1622703732974632';

export const FONTS = `
@font-face{font-family:"Montserrat";src:url("/assets/fonts/montserrat-900.woff2") format("woff2");font-weight:900;font-display:swap}
@font-face{font-family:"Libre Baskerville";src:url("/assets/fonts/libre-baskerville-400.woff2") format("woff2");font-weight:400;font-display:swap}
@font-face{font-family:"Libre Baskerville";src:url("/assets/fonts/libre-baskerville-400-italic.woff2") format("woff2");font-weight:400;font-style:italic;font-display:swap}
@font-face{font-family:"Libre Baskerville";src:url("/assets/fonts/libre-baskerville-700.woff2") format("woff2");font-weight:700;font-display:swap}
@font-face{font-family:"IBM Plex Mono";src:url("/assets/fonts/ibm-plex-mono-300.woff2") format("woff2");font-weight:300;font-display:swap}
@font-face{font-family:"IBM Plex Mono";src:url("/assets/fonts/ibm-plex-mono-400.woff2") format("woff2");font-weight:400;font-display:swap}
@font-face{font-family:"IBM Plex Mono";src:url("/assets/fonts/ibm-plex-mono-700.woff2") format("woff2");font-weight:700;font-display:swap}
`;

// The shared skeleton. Every theme restyles and re-lays it out through CSS and the data-theme
// hook; nothing here changes between variants, so a difference you see is a design decision.
export const BODY = `
<p class="announce">${C.announce}</p>
<nav class="nav"><span class="mark">Wolf Children</span><a class="btn btn--nav" href="#offer">Get Compass</a></nav>

<section class="s hero"><div class="wrap">
  <p class="eyebrow">${C.hero.eyebrow}</p>
  <h1>${C.hero.h1}</h1>
  <p class="lead">${C.hero.sub}</p>
  <div class="act"><a class="btn" href="#offer">${C.hero.cta}</a><p class="small">${C.hero.ctaSub}</p></div>
</div></section>

<div class="band"><div class="wrap band-grid">
  ${C.support.bullets.map((b) => `<p class="bullet">${b}</p>`).join('')}
</div><div class="wrap"><div class="badges">${C.support.badges.map((b) => `<span class="small">${b}</span>`).join('')}</div></div></div>

<section class="s recognition-s"><div class="wrap">
  <h2>${C.recognition.h2}</h2>
  <div class="recognition">${C.recognition.body.map((t) => `<p>${t}</p>`).join('')}</div>
</div></section>

<section class="s sample"><div class="wrap">
  <h2>${C.sample.h2}</h2>
  <p class="lead">${C.sample.body}</p>
  <div class="links">${C.sample.links.map(([l, h]) => `<a class="link" href="${h}">${l}</a>`).join('')}</div>
</div></section>

<section class="s stats-s"><div class="wrap">
  <h2>${C.stats.h2}</h2>
  <div class="stats">${C.stats.items.map(([b, i, p]) => `<div class="stat"><b>${b}</b><i>${i}</i><p class="small">${p}</p></div>`).join('')}</div>
</div></section>

<section class="s reasons-s"><div class="wrap">
  <p class="eyebrow">${C.reasons.eyebrow}</p>
  <h2>${C.reasons.h2}</h2>
  <div class="reasons">${C.reasons.items.map(([t, p], i) => `<div class="reason"><span class="n">${String(i + 1).padStart(2, '0')}</span><h3>${t}</h3><p>${p}</p></div>`).join('')}</div>
</div></section>

<section class="s refusal-s"><div class="wrap">
  <h2>${C.refusal.h2}</h2>
  <div class="refusals">${C.refusal.items.map(([t, d]) => `<div class="refusal"><b>${t}</b><p>${d}</p></div>`).join('')}</div>
</div></section>

<section class="s outcomes-s"><div class="wrap">
  <h2>${C.outcomes.h2}</h2>
  <div class="outcomes">${C.outcomes.items.map((o) => `<p>${o}</p>`).join('')}</div>
</div></section>

<section class="s offer-s" id="offer"><div class="wrap">
  <p class="eyebrow">${C.offer.eyebrow}</p>
  <div class="offer">
    <div class="offer-main">
      <h2>${C.offer.h2}</h2>
      <p class="price">${C.offer.price}</p>
      <p class="lead">${C.offer.tagline}</p>
      <div class="includes">${C.offer.includes.map((i) => `<p>${i}</p>`).join('')}</div>
      <div class="act"><a class="btn" href="#">${C.offer.cta}</a></div>
      <p class="small note-line">${C.offer.note}</p>
    </div>
    <div class="steps">${C.offer.how.map(([t, p], i) => `<div class="step"><span class="sn">${i + 1}</span><b>${t}</b><p>${p}</p></div>`).join('')}</div>
  </div>
</div></section>

<section class="s banner"><div class="wrap">
  <h2>${C.banner1[0]}</h2><p class="bsub">${C.banner1[1]}</p><a class="btn" href="#offer">Get Compass</a>
</div></section>

<section class="s compare-s"><div class="wrap">
  <h2>${C.compare.h2}</h2>
  <div class="tablewrap"><table>
    <thead><tr><th></th>${C.compare.cols.map((c) => `<th>${c}</th>`).join('')}</tr></thead>
    <tbody>${C.compare.rows.map((r) => `<tr><th>${r[0]}</th>${r.slice(1).map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>
  </table></div>
</div></section>

<section class="s banner banner--two"><div class="wrap">
  <h2>${C.banner2[0]}</h2><p class="bsub">${C.banner2[1]}</p><a class="btn" href="#offer">Get Compass</a>
</div></section>

<section class="s faq-s"><div class="wrap">
  <p class="eyebrow">${C.faq.eyebrow}</p>
  <h2>${C.faq.h2}</h2>
  <div class="faq">${C.faq.items.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</div>
</div></section>

<section class="s close"><div class="wrap">
  <h2>${C.close[0]}</h2><p class="lead">${C.close[1]}</p><a class="btn" href="#offer">${C.close[2]}</a>
</div></section>

<footer><div class="wrap">Wolf Children · hello@wolfchildren.co</div></footer>
`;

// Structure every theme inherits. Themes override freely.
export const BASE = `
*{box-sizing:border-box}
body{margin:0}
.wrap{width:100%;max-width:1180px;margin:0 auto;padding:0 24px}
.s{padding:88px 0}
@media(min-width:900px){.s{padding:128px 0}}
h1,h2,h3{margin:0}
p{margin:0}
/* Space after a heading is structure, not decoration: without it the lead butts against the
   headline, which is the spacing fault Richard called amateur. Themes may override. */
h1 + .lead,h2 + .lead{margin-top:24px}
h2 + .lead + .links,h2 + .lead + .tablewrap{margin-top:32px}
.eyebrow + h1,.eyebrow + h2{margin-top:0}
a{color:inherit}
.nav{position:sticky;top:0;z-index:50;height:64px;display:flex;align-items:center;justify-content:space-between;padding:0 24px}
.btn{display:inline-flex;align-items:center;justify-content:center;text-decoration:none;
  padding:17px 32px;transition:all 180ms cubic-bezier(.22,.61,.36,1)}
.btn--nav{padding:11px 20px;font-size:12px}
.act{margin-top:40px;display:flex;flex-wrap:wrap;align-items:center;gap:24px}
.band-grid{display:grid;gap:24px}
@media(min-width:820px){.band-grid{grid-template-columns:repeat(3,1fr);gap:40px}}
.badges{margin-top:40px;display:flex;flex-wrap:wrap;gap:8px 40px}
.links{margin-top:40px;display:flex;flex-direction:column;gap:16px;align-items:flex-start}
.stats{margin-top:56px;display:grid;gap:40px}
@media(min-width:760px){.stats{grid-template-columns:repeat(3,1fr);gap:64px}}
.stat i{display:block;font-style:normal}
.reasons{margin-top:56px;display:grid}
.reason{display:grid;grid-template-columns:auto 1fr;gap:24px;padding:36px 0}
@media(min-width:900px){.reason{grid-template-columns:72px minmax(0,20ch) minmax(0,1fr);gap:40px;align-items:start}}
.outcomes{margin-top:40px;display:grid;gap:16px}
@media(min-width:820px){.outcomes{grid-template-columns:1fr 1fr;gap:16px 64px}}
.offer{display:grid;gap:40px}
@media(min-width:900px){.offer{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:64px;align-items:start}}
.steps{display:grid;gap:16px}
.tablewrap{margin-top:40px;overflow-x:auto}
table{width:100%;border-collapse:collapse;min-width:640px}
th,td{text-align:left;padding:16px 8px;vertical-align:top}
.faq{margin-top:40px}
details summary{cursor:pointer;list-style:none;padding:22px 0;display:flex;justify-content:space-between;gap:24px}
details summary::-webkit-details-marker{display:none}
details summary::after{content:"+"}
details[open] summary::after{content:"–"}
details p{padding:0 0 22px;max-width:64ch}
.close{text-align:center}
.close h2,.close .lead{margin-left:auto;margin-right:auto}
footer{padding:56px 0}
.recognition{margin-top:24px;display:grid;gap:20px;max-width:62ch}
.refusals{margin-top:56px;display:grid;gap:24px}
@media(min-width:820px){.refusals{grid-template-columns:repeat(2,1fr);gap:32px 48px}}
.refusal b{display:block}
.refusal p{margin-top:8px}
.which{font:400 12px/1.5 "IBM Plex Mono",monospace;background:#111;color:#fff;padding:8px 14px;letter-spacing:.04em}
.which b{font-weight:700}.which span{opacity:.62}
`;

const THEMES = {
  // ── design-taste-frontend v1 ────────────────────────────────────────────────
  // Dials 8/6/4: higher variance and density than v2, so a tighter grid, more
  // contrast steps, and an offset hero rather than a flush-left one.
  'v1-original': {
    title: 'design-taste-frontend-v1',
    note: 'dials 8/6/4 · higher variance and density than v2 · offset hero, denser rhythm · brand faces stand in for Geist and Satoshi',
    css: `
body{background:#DFD7C3;color:#495543;font:300 15px/1.65 "IBM Plex Mono",monospace}
.s{padding:72px 0}@media(min-width:900px){.s{padding:104px 0}}
h1,h2,h3{font-family:"Montserrat",sans-serif;font-weight:900;letter-spacing:-.025em}
h1{font-size:clamp(2.4rem,5.4vw,4.5rem);line-height:.98;max-width:15ch}
h2{font-size:clamp(1.6rem,3vw,2.5rem);line-height:1.04;max-width:19ch}
h3{font-size:15px;line-height:1.3}
.lead{font:400 17px/1.55 "Libre Baskerville",serif;letter-spacing:-.01em;max-width:56ch;color:#3A4435}
.eyebrow{font:400 10.5px/1 "IBM Plex Mono",monospace;letter-spacing:.2em;text-transform:uppercase;color:#6A745F;margin-bottom:20px}
.small{font-size:12.5px;color:#6A745F}
.announce{background:#495543;color:#DFD7C3;text-align:center;padding:10px;font-size:12.5px}
.nav{background:rgba(223,215,195,.94);border-bottom:1px solid #CDB494}
.nav .mark{font:900 14px "Montserrat",sans-serif}
.btn{background:#AC2E20;color:#DFD7C3;font:700 13px/1 "IBM Plex Mono",monospace;letter-spacing:.05em;border-radius:0}
.btn:hover{background:#8F251A}
.hero{padding-top:72px}
@media(min-width:1000px){.hero .wrap{padding-left:8%}}
.band{border-top:1px solid #CDB494;border-bottom:1px solid #CDB494;padding:32px 0;background:rgba(205,180,148,.14)}
.bullet{font-size:14px}
.sample{background:#495543;color:#DFD7C3}.sample h2,.sample .lead{color:#DFD7C3}
.stat b{display:block;font:900 clamp(2.2rem,3.6vw,3.2rem)/1 "Montserrat",sans-serif;letter-spacing:-.03em}
.stat i{font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;color:#6A745F;margin:6px 0 12px}
.stat{border-top:3px solid #495543;padding-top:14px}
.reason{border-top:1px solid #CDB494;padding:30px 0}
.reason:last-child{border-bottom:1px solid #CDB494}
.reason .n{font:900 12px "Montserrat",sans-serif;color:#DA4635}
.reason p{font-size:14px;color:#3A4435;max-width:56ch}
.outcomes p{padding:14px 0;border-bottom:1px solid #CDB494;font-size:14px}
.price{font:900 clamp(2.8rem,4.6vw,3.8rem)/1 "Montserrat",sans-serif;letter-spacing:-.03em;margin:14px 0}
.includes p{padding:13px 0;border-bottom:1px solid rgba(205,180,148,.7);font-size:14px}
.includes{margin-top:22px}.note-line{margin-top:20px;max-width:50ch}
.step{border:1px solid #CDB494;padding:20px;background:rgba(255,255,255,.3)}
.step .sn{font:900 11px "Montserrat",sans-serif;color:#DA4635;display:block;margin-bottom:6px}
.step b{display:block;font:700 13px "IBM Plex Mono",monospace;margin-bottom:6px}
.step p{font-size:13.5px;color:#3A4435}
.banner{background:#AC2E20;color:#DFD7C3;text-align:left}
.banner h2{color:#DFD7C3;max-width:22ch}.bsub{color:#F0DAD4;margin:14px 0 32px;max-width:48ch}
.banner .btn{background:#DFD7C3;color:#AC2E20}
table{font-size:13.5px}
thead th{font:700 10.5px "IBM Plex Mono",monospace;letter-spacing:.18em;text-transform:uppercase;color:#6A745F;border-bottom:2px solid #495543}
tbody th{font:400 12.5px "IBM Plex Mono",monospace;color:#6A745F;width:15%}
th,td{border-bottom:1px solid #CDB494}
td:nth-child(3){background:rgba(205,180,148,.3)}
details{border-bottom:1px solid #CDB494}.faq{border-top:1px solid #CDB494}
summary{font:700 14px "IBM Plex Mono",monospace}
details p{font-size:14px;color:#3A4435}
footer{background:#495543;color:#CDB494;font-size:12.5px}
`,
  },

  // ── high-end-visual-design ─────────────────────────────────────────────────
  // Its variance engine says pick one vibe and one layout archetype and commit.
  // Vibe: Editorial Luxury (warm creams, muted sage, high-contrast serif display,
  // a film-grain overlay at 3%). Layout: The Editorial Split.
  // Banned by it and avoided here: 1px grey borders, harsh shadows, edge-to-edge
  // sticky navs glued to the top, linear easing.
  'high-end': {
    title: 'high-end-visual-design',
    note: 'vibe archetype Editorial Luxury · layout archetype Editorial Split · serif display, film grain at 3%, floating nav, diffused shadows · Libre Baskerville stands in for PP Editorial New',
    css: `
body{background:#EFE9DC;color:#2F3A2B;font:300 16px/1.75 "IBM Plex Mono",monospace;position:relative}
body:before{content:"";position:fixed;inset:0;pointer-events:none;z-index:1;opacity:.03;
  background-image:radial-gradient(#2F3A2B 1px,transparent 1px);background-size:3px 3px}
.s{padding:104px 0}@media(min-width:900px){.s{padding:168px 0}}
h1,h2{font-family:"Libre Baskerville",Georgia,serif;font-weight:400;letter-spacing:-.02em}
h1{font-size:clamp(2.6rem,5.6vw,5rem);line-height:1.04;max-width:16ch}
h2{font-size:clamp(1.8rem,3.4vw,3rem);line-height:1.12;max-width:20ch}
h3{font:700 14px/1.35 "IBM Plex Mono",monospace;letter-spacing:.02em}
.lead{font:300 17px/1.8 "IBM Plex Mono",monospace;max-width:58ch;color:#55604F}
.eyebrow{font:400 10px/1 "IBM Plex Mono",monospace;letter-spacing:.28em;text-transform:uppercase;color:#8A9382;margin-bottom:28px}
.small{font-size:13px;color:#8A9382}
.announce{background:#2F3A2B;color:#EFE9DC;text-align:center;padding:12px;font-size:12px;letter-spacing:.04em}
.nav{position:sticky;top:16px;margin:16px auto 0;max-width:1120px;height:60px;border-radius:999px;
  background:rgba(239,233,220,.82);backdrop-filter:blur(14px);box-shadow:0 12px 40px rgba(47,58,43,.09);padding:0 28px}
.nav .mark{font:400 16px "Libre Baskerville",serif}
.btn{background:#2F3A2B;color:#EFE9DC;font:400 13px/1 "IBM Plex Mono",monospace;letter-spacing:.1em;
  border-radius:999px;box-shadow:0 10px 30px rgba(47,58,43,.16)}
.btn:hover{transform:translateY(-2px);box-shadow:0 16px 44px rgba(47,58,43,.22)}
.hero{padding-top:88px}
.band{padding:48px 0;border-top:1px solid rgba(47,58,43,.12);border-bottom:1px solid rgba(47,58,43,.12)}
.bullet{font-size:15px;color:#55604F}
.sample{background:#2F3A2B;color:#EFE9DC}
.sample h2{color:#EFE9DC}.sample .lead{color:#C3CBBC}
.stat b{display:block;font:400 clamp(2.6rem,4.4vw,3.8rem)/1 "Libre Baskerville",serif;letter-spacing:-.02em}
.stat i{font-size:10px;letter-spacing:.26em;text-transform:uppercase;color:#8A9382;margin:12px 0 14px}
.reason{padding:42px 0;border-bottom:1px solid rgba(47,58,43,.12)}
.reason .n{font:400 12px "IBM Plex Mono",monospace;color:#8A9382;letter-spacing:.14em}
.reason p{font-size:15px;color:#55604F;max-width:56ch}
.outcomes p{padding:18px 0;border-bottom:1px solid rgba(47,58,43,.12);font-size:15px}
.price{font:400 clamp(3rem,5vw,4.4rem)/1 "Libre Baskerville",serif;margin:18px 0}
.includes{margin-top:28px}
.includes p{padding:16px 0;border-bottom:1px solid rgba(47,58,43,.1);font-size:15px}
.note-line{margin-top:26px;max-width:52ch}
.step{background:#F6F2E8;border-radius:18px;padding:26px;box-shadow:0 18px 50px rgba(47,58,43,.07)}
.step .sn{display:block;font:400 11px "IBM Plex Mono",monospace;letter-spacing:.24em;color:#8A9382;margin-bottom:10px}
.step b{display:block;font:700 14px "IBM Plex Mono",monospace;margin-bottom:8px}
.step p{font-size:14px;color:#55604F}
.banner{background:#55604F;color:#EFE9DC}
.banner h2{color:#EFE9DC;max-width:22ch}.bsub{color:#C3CBBC;margin:18px 0 36px;max-width:50ch}
.banner .btn{background:#EFE9DC;color:#2F3A2B}
table{font-size:14px}
thead th{font:400 10px "IBM Plex Mono",monospace;letter-spacing:.24em;text-transform:uppercase;color:#8A9382}
tbody th{font:300 13px "IBM Plex Mono",monospace;color:#8A9382;width:16%}
th,td{border-bottom:1px solid rgba(47,58,43,.12)}
td:nth-child(3){background:rgba(47,58,43,.05)}
.faq{border-top:1px solid rgba(47,58,43,.12)}
details{border-bottom:1px solid rgba(47,58,43,.12)}
summary{font:400 17px "Libre Baskerville",serif}
details p{font-size:15px;color:#55604F}
footer{background:#2F3A2B;color:#8A9382;font-size:12px}
`,
  },

  // ── minimalist-ui ──────────────────────────────────────────────────────────
  // Warm bone canvas, white surfaces, hairlines at 6% black, no gradients, no
  // pill containers, shadows effectively absent, extreme typographic contrast,
  // one muted pastel accent, tabular numerals.
  minimalist: {
    title: 'minimalist-ui',
    note: 'warm bone canvas, white surfaces, hairlines at 6% · no gradients, no pills, no shadow over .05 · one muted accent · tabular numerals · Libre Baskerville stands in for Lyon Text',
    css: `
body{background:#F7F6F3;color:#2F3437;font:400 15px/1.7 "IBM Plex Mono",monospace;font-variant-numeric:tabular-nums}
.s{padding:80px 0}@media(min-width:900px){.s{padding:120px 0}}
h1,h2{font-family:"Libre Baskerville",serif;font-weight:400;letter-spacing:-.03em}
h1{font-size:clamp(2.2rem,4.4vw,3.6rem);line-height:1.1;max-width:20ch}
h2{font-size:clamp(1.5rem,2.6vw,2.15rem);line-height:1.15;max-width:24ch}
h3{font:500 14px/1.4 "IBM Plex Mono",monospace}
.lead{font:400 15px/1.75 "IBM Plex Mono",monospace;max-width:62ch;color:#787774}
.eyebrow{font:400 11px/1 "IBM Plex Mono",monospace;letter-spacing:.1em;color:#9B9A97;margin-bottom:18px;text-transform:none}
.small{font-size:12.5px;color:#9B9A97}
.announce{background:#FFFFFF;color:#787774;text-align:center;padding:11px;font-size:12.5px;border-bottom:1px solid rgba(0,0,0,.06)}
.nav{background:rgba(247,246,243,.9);backdrop-filter:blur(6px);border-bottom:1px solid rgba(0,0,0,.06)}
.nav .mark{font:500 14px "IBM Plex Mono",monospace}
.btn{background:#2F3437;color:#F7F6F3;font:500 13px/1 "IBM Plex Mono",monospace;border-radius:4px}
.btn:hover{background:#111111}
.hero{padding-top:72px}
.band{padding:36px 0;background:#FFFFFF;border-top:1px solid rgba(0,0,0,.06);border-bottom:1px solid rgba(0,0,0,.06)}
.bullet{font-size:14px;color:#787774}
.sample{background:#FFFFFF;border-top:1px solid rgba(0,0,0,.06);border-bottom:1px solid rgba(0,0,0,.06)}
.stat{background:#FFFFFF;border:1px solid rgba(0,0,0,.06);border-radius:6px;padding:24px}
.stat b{display:block;font:400 2.4rem/1 "Libre Baskerville",serif;color:#2F3437}
.stat i{font-size:11px;letter-spacing:.08em;color:#9B9A97;margin:8px 0 12px}
.reason{padding:26px 0;border-bottom:1px solid rgba(0,0,0,.06)}
.reason .n{font:400 12px "IBM Plex Mono",monospace;color:#C3B5A0}
.reason p{font-size:14px;color:#787774;max-width:58ch}
.outcomes p{padding:14px 0;border-bottom:1px solid rgba(0,0,0,.06);font-size:14px;color:#787774}
.price{font:400 3rem/1 "Libre Baskerville",serif;margin:12px 0;color:#2F3437}
.includes{margin-top:22px}
.includes p{padding:13px 0;border-bottom:1px solid rgba(0,0,0,.06);font-size:14px;color:#787774}
.note-line{margin-top:22px;max-width:52ch}
.step{background:#FFFFFF;border:1px solid rgba(0,0,0,.06);border-radius:6px;padding:22px}
.step .sn{display:block;font-size:11px;color:#C3B5A0;margin-bottom:8px}
.step b{display:block;font:500 13px "IBM Plex Mono",monospace;margin-bottom:6px}
.step p{font-size:13.5px;color:#787774}
.banner{background:#FFFFFF;border-top:1px solid rgba(0,0,0,.06);border-bottom:1px solid rgba(0,0,0,.06)}
.banner h2{color:#2F3437;max-width:24ch}
.bsub{color:#9B9A97;margin:14px 0 30px;max-width:52ch;font-size:14px}
table{font-size:13.5px}
thead th{font:500 11px "IBM Plex Mono",monospace;letter-spacing:.08em;color:#9B9A97}
tbody th{font:400 12.5px "IBM Plex Mono",monospace;color:#9B9A97;width:16%}
th,td{border-bottom:1px solid rgba(0,0,0,.06)}
td:nth-child(3){background:#FFFFFF}
.faq{border-top:1px solid rgba(0,0,0,.06)}
details{border-bottom:1px solid rgba(0,0,0,.06)}
summary{font:500 14px "IBM Plex Mono",monospace}
details p{font-size:14px;color:#787774}
footer{background:#FFFFFF;color:#9B9A97;font-size:12.5px;border-top:1px solid rgba(0,0,0,.06)}
`,
  },

  // ── industrial-brutalist-ui ────────────────────────────────────────────────
  // One mode, committed: Swiss Industrial Print. Newsprint substrate, monolithic
  // heavy sans, unforgiving visible grid, oversized viewport-bleeding numerals,
  // primary red as the alert accent, uppercase structure, compressed leading.
  brutalist: {
    title: 'industrial-brutalist-ui',
    note: 'mode committed: Swiss Industrial Print · newsprint substrate, visible structural grid, oversized bleeding numerals, primary red, uppercase, compressed leading · Montserrat 900 stands in for Neue Haas Grotesk Black',
    css: `
body{background:#E8E6E1;color:#111111;font:400 14px/1.55 "IBM Plex Mono",monospace}
.wrap{max-width:1280px;border-left:1px solid #111;border-right:1px solid #111}
.s{padding:0;border-bottom:1px solid #111}
.s .wrap{padding-top:56px;padding-bottom:56px}
@media(min-width:900px){.s .wrap{padding-top:80px;padding-bottom:80px}}
h1,h2,h3{font-family:"Montserrat",sans-serif;font-weight:900;text-transform:uppercase}
h1{font-size:clamp(2.6rem,7vw,6rem);line-height:.88;letter-spacing:-.045em;max-width:13ch}
h2{font-size:clamp(1.7rem,3.6vw,3rem);line-height:.92;letter-spacing:-.035em;max-width:18ch}
h3{font-size:13px;line-height:1.2;letter-spacing:.02em}
.lead{font:400 15px/1.6 "IBM Plex Mono",monospace;max-width:58ch;color:#3A3A3A}
.eyebrow{font:700 10px/1 "IBM Plex Mono",monospace;letter-spacing:.3em;text-transform:uppercase;color:#C8102E;margin-bottom:18px}
.small{font-size:12px;color:#5A5A5A}
.announce{background:#111;color:#E8E6E1;text-align:center;padding:9px;font:700 11px/1 "IBM Plex Mono",monospace;letter-spacing:.2em;text-transform:uppercase}
.nav{background:#E8E6E1;border-bottom:1px solid #111}
.nav .mark{font:900 13px "Montserrat",sans-serif;text-transform:uppercase;letter-spacing:.06em}
.btn{background:#C8102E;color:#fff;font:700 12px/1 "IBM Plex Mono",monospace;letter-spacing:.14em;
  text-transform:uppercase;border-radius:0}
.btn:hover{background:#111}
.band{border-bottom:1px solid #111}
.band .wrap{padding-top:28px;padding-bottom:28px}
.band-grid{gap:0}
@media(min-width:820px){.bullet{border-left:1px solid #111;padding-left:20px}
.bullet:first-child{border-left:0;padding-left:0}}
.bullet{font-size:13px}
.sample{background:#111;color:#E8E6E1}
.sample h2{color:#E8E6E1}.sample .lead{color:#B4B4B4}
.stats{gap:0}
@media(min-width:760px){.stat{border-left:1px solid #111;padding-left:24px}
.stat:first-child{border-left:0;padding-left:0}}
.stat b{display:block;font:900 clamp(3.4rem,7vw,5.5rem)/.85 "Montserrat",sans-serif;letter-spacing:-.05em}
.stat i{font:700 10px/1 "IBM Plex Mono",monospace;letter-spacing:.26em;text-transform:uppercase;color:#C8102E;margin:10px 0 12px}
.reason{border-top:1px solid #111;padding:26px 0}
.reason .n{font:900 clamp(1.6rem,3vw,2.4rem)/1 "Montserrat",sans-serif;color:#C8102E;letter-spacing:-.04em}
.reason p{font-size:13.5px;color:#3A3A3A;max-width:56ch}
.outcomes{gap:0}
.outcomes p{padding:16px 0;border-top:1px solid #111;font-size:13.5px}
.price{font:900 clamp(3.4rem,6vw,5rem)/.9 "Montserrat",sans-serif;letter-spacing:-.05em;margin:10px 0;color:#C8102E}
.includes{margin-top:20px;border-top:1px solid #111}
.includes p{padding:12px 0;border-bottom:1px solid rgba(17,17,17,.24);font-size:13.5px}
.note-line{margin-top:20px;max-width:50ch}
.step{border:1px solid #111;padding:18px}
.step .sn{display:block;font:900 22px/1 "Montserrat",sans-serif;color:#C8102E;margin-bottom:6px}
.step b{display:block;font:700 12px "IBM Plex Mono",monospace;text-transform:uppercase;letter-spacing:.1em;margin-bottom:6px}
.step p{font-size:13px;color:#3A3A3A}
.banner{background:#C8102E;color:#fff}
.banner h2{color:#fff;max-width:20ch}.bsub{color:#FFD9DE;margin:14px 0 28px;max-width:46ch;font-size:13.5px}
.banner .btn{background:#fff;color:#C8102E}
table{font-size:13px;min-width:680px}
thead th{font:700 10px "IBM Plex Mono",monospace;letter-spacing:.2em;text-transform:uppercase;border-bottom:2px solid #111}
tbody th{font:700 12px "IBM Plex Mono",monospace;text-transform:uppercase;color:#5A5A5A;width:16%}
th,td{border-bottom:1px solid rgba(17,17,17,.28);border-right:1px solid rgba(17,17,17,.28)}
th:last-child,td:last-child{border-right:0}
td:nth-child(3){background:rgba(200,16,46,.07)}
.faq{border-top:1px solid #111}
details{border-bottom:1px solid #111}
summary{font:700 13px "IBM Plex Mono",monospace;text-transform:uppercase;letter-spacing:.08em}
details p{font-size:13.5px;color:#3A3A3A}
footer{background:#111;color:#B4B4B4;font:700 11px/1 "IBM Plex Mono",monospace;letter-spacing:.2em;text-transform:uppercase}
`,
  },

  // ── gpt-taste ──────────────────────────────────────────────────────────────
  // Its AIDA order is overruled: the teardown order wins, as Richard ruled. What
  // is applied is everything else it mandates — the floating nav pill, the
  // ultra-wide H1 container under its two-line iron rule, massive section
  // padding, gapless bento, and its ban on cheap meta-labels, which means this
  // is the only variant with no eyebrow anywhere.
  'gpt-taste': {
    title: 'gpt-taste',
    note: 'AIDA order overruled by the teardown order · applied: floating nav pill, ultra-wide H1 container, massive section padding, gapless bento, zero meta-labels so no eyebrows · Montserrat stands in for Cabinet Grotesk',
    css: `
body{background:#11100E;color:#F2EFE9;font:300 16px/1.75 "IBM Plex Mono",monospace}
.wrap{max-width:1320px}
.s{padding:128px 0}@media(min-width:900px){.s{padding:192px 0}}
h1,h2,h3{font-family:"Montserrat",sans-serif;font-weight:900;letter-spacing:-.035em}
h1{font-size:clamp(3rem,6.4vw,5.5rem);line-height:.96;max-width:none}
h2{font-size:clamp(2rem,4vw,3.4rem);line-height:1;max-width:26ch}
h3{font-size:15px;line-height:1.3;letter-spacing:-.01em}
.lead{font:300 18px/1.7 "IBM Plex Mono",monospace;max-width:64ch;color:#A8A29A}
.eyebrow{display:none}
.small{font-size:13px;color:#7D776F}
.announce{background:#F2EFE9;color:#11100E;text-align:center;padding:11px;font-size:12.5px}
.nav{position:sticky;top:20px;margin:20px auto 0;max-width:1240px;height:62px;border-radius:999px;
  background:rgba(32,30,27,.72);backdrop-filter:blur(16px);border:1px solid rgba(242,239,233,.1);padding:0 26px}
.nav .mark{font:900 14px "Montserrat",sans-serif;letter-spacing:-.01em}
.btn{background:#F2EFE9;color:#11100E;font:700 13px/1 "IBM Plex Mono",monospace;letter-spacing:.04em;border-radius:999px}
.btn:hover{background:#fff;transform:translateY(-2px)}
.hero{padding-top:120px}
.band{padding:0;border-top:1px solid rgba(242,239,233,.1);border-bottom:1px solid rgba(242,239,233,.1)}
.band .wrap{padding-top:0;padding-bottom:0}
.band-grid{gap:0}
@media(min-width:820px){.bullet{border-left:1px solid rgba(242,239,233,.1);padding:34px 26px}
.bullet:first-child{border-left:0;padding-left:0}}
.bullet{font-size:15px;padding:24px 0;color:#A8A29A}
.badges{padding:0 0 30px}
.sample{background:#1B1916}
.stats{gap:0;border:1px solid rgba(242,239,233,.1)}
.stat{padding:38px 30px;border-right:1px solid rgba(242,239,233,.1)}
.stat:last-child{border-right:0}
@media(max-width:759px){.stat{border-right:0;border-bottom:1px solid rgba(242,239,233,.1)}}
.stat b{display:block;font:900 clamp(2.8rem,5vw,4.2rem)/1 "Montserrat",sans-serif;letter-spacing:-.04em}
.stat i{font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#7D776F;margin:10px 0 14px}
.reason{padding:40px 0;border-top:1px solid rgba(242,239,233,.1)}
.reason .n{font:900 13px "Montserrat",sans-serif;color:#C8A24B}
.reason p{font-size:15px;color:#A8A29A;max-width:58ch}
.outcomes{gap:0;border:1px solid rgba(242,239,233,.1)}
.outcomes p{padding:26px;border-right:1px solid rgba(242,239,233,.1);border-bottom:1px solid rgba(242,239,233,.1);font-size:15px;color:#A8A29A}
@media(min-width:820px){.outcomes p:nth-child(2n){border-right:0}}
.price{font:900 clamp(3.4rem,5.6vw,4.8rem)/1 "Montserrat",sans-serif;letter-spacing:-.04em;margin:16px 0;color:#C8A24B}
.includes{margin-top:26px}
.includes p{padding:16px 0;border-bottom:1px solid rgba(242,239,233,.1);font-size:15px;color:#A8A29A}
.note-line{margin-top:26px;max-width:52ch}
.step{background:#1B1916;border:1px solid rgba(242,239,233,.1);border-radius:16px;padding:26px}
.step .sn{display:block;font:900 12px "Montserrat",sans-serif;color:#C8A24B;margin-bottom:10px}
.step b{display:block;font:700 14px "IBM Plex Mono",monospace;margin-bottom:8px}
.step p{font-size:14px;color:#A8A29A}
.banner{background:#C8A24B;color:#11100E}
.banner h2{color:#11100E;max-width:24ch}.bsub{color:#3A3121;margin:18px 0 36px;max-width:52ch}
.banner .btn{background:#11100E;color:#F2EFE9}
table{font-size:14px}
thead th{font:700 11px "IBM Plex Mono",monospace;letter-spacing:.18em;text-transform:uppercase;color:#7D776F;border-bottom:1px solid rgba(242,239,233,.2)}
tbody th{font:300 13px "IBM Plex Mono",monospace;color:#7D776F;width:16%}
th,td{border-bottom:1px solid rgba(242,239,233,.1)}
td:nth-child(3){background:rgba(200,162,75,.08)}
.faq{border-top:1px solid rgba(242,239,233,.1)}
details{border-bottom:1px solid rgba(242,239,233,.1)}
summary{font:700 15px "IBM Plex Mono",monospace}
details p{font-size:15px;color:#A8A29A}
footer{background:#0B0A09;color:#7D776F;font-size:13px}
`,
  },

  // ── stitch-design-taste ────────────────────────────────────────────────────
  // Its output is a DESIGN.md that a generator reads, so the design system it
  // encodes is applied directly: calibrated colour with one accent, a strict 8px
  // grid, asymmetric 7/5 splits rather than halves, tight type scale, and
  // perpetual micro-motion expressed as hover and focus states on a static page.
  stitch: {
    title: 'stitch-design-taste',
    note: 'its DESIGN.md semantics applied directly · strict 8px grid, asymmetric 7/5 splits, one calibrated accent, tight type scale · micro-motion is hover and focus only, since the page carries no script',
    css: `
body{background:#FBFAF7;color:#1F2421;font:400 15px/1.66 "IBM Plex Mono",monospace}
.s{padding:80px 0}@media(min-width:900px){.s{padding:128px 0}}
h1,h2,h3{font-family:"Montserrat",sans-serif;font-weight:900;letter-spacing:-.028em}
h1{font-size:clamp(2.4rem,4.8vw,4rem);line-height:1.02;max-width:18ch}
h2{font-size:clamp(1.6rem,2.8vw,2.4rem);line-height:1.08;max-width:22ch}
h3{font:700 14px/1.35 "IBM Plex Mono",monospace}
.lead{font:400 16px/1.7 "IBM Plex Mono",monospace;max-width:60ch;color:#5B635A}
.eyebrow{font:700 11px/1 "IBM Plex Mono",monospace;letter-spacing:.14em;text-transform:uppercase;color:#2E7D6B;margin-bottom:24px}
.small{font-size:13px;color:#8A918A}
.announce{background:#1F2421;color:#FBFAF7;text-align:center;padding:12px;font-size:13px}
.nav{background:rgba(251,250,247,.92);backdrop-filter:blur(8px);border-bottom:1px solid #E4E2DC}
.nav .mark{font:900 14px "Montserrat",sans-serif}
.btn{background:#2E7D6B;color:#FBFAF7;font:700 13px/1 "IBM Plex Mono",monospace;letter-spacing:.04em;border-radius:8px}
.btn:hover{background:#245F52;transform:translateY(-1px)}
.hero{padding-top:80px}
@media(min-width:1000px){.hero .wrap>*{max-width:calc(1180px * .58)}}
.band{padding:40px 0;background:#F3F1EB;border-top:1px solid #E4E2DC;border-bottom:1px solid #E4E2DC}
.bullet{font-size:14px;color:#5B635A}
.sample{background:#1F2421;color:#FBFAF7}
.sample h2{color:#FBFAF7}.sample .lead{color:#A9B0A8}
.stat{border-left:3px solid #2E7D6B;padding-left:16px}
.stat b{display:block;font:900 clamp(2.4rem,3.8vw,3.2rem)/1 "Montserrat",sans-serif;letter-spacing:-.03em}
.stat i{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#8A918A;margin:8px 0 12px}
@media(min-width:900px){.reason{grid-template-columns:56px minmax(0,7fr) minmax(0,5fr)}}
.reason{padding:32px 0;border-bottom:1px solid #E4E2DC}
.reason .n{font:700 12px "IBM Plex Mono",monospace;color:#2E7D6B}
.reason p{font-size:14px;color:#5B635A;max-width:54ch}
.outcomes p{padding:16px 0;border-bottom:1px solid #E4E2DC;font-size:14px;color:#5B635A}
@media(min-width:900px){.offer{grid-template-columns:minmax(0,7fr) minmax(0,5fr)}}
.price{font:900 clamp(2.8rem,4.4vw,3.6rem)/1 "Montserrat",sans-serif;letter-spacing:-.03em;margin:16px 0;color:#2E7D6B}
.includes{margin-top:24px}
.includes p{padding:14px 0;border-bottom:1px solid #E4E2DC;font-size:14px;color:#5B635A}
.note-line{margin-top:24px;max-width:52ch}
.step{background:#F3F1EB;border:1px solid #E4E2DC;border-radius:8px;padding:20px}
.step .sn{display:block;font:700 11px "IBM Plex Mono",monospace;color:#2E7D6B;margin-bottom:8px}
.step b{display:block;font:700 13px "IBM Plex Mono",monospace;margin-bottom:6px}
.step p{font-size:13.5px;color:#5B635A}
.banner{background:#2E7D6B;color:#FBFAF7}
.banner h2{color:#FBFAF7;max-width:24ch}.bsub{color:#BFE0D7;margin:16px 0 32px;max-width:52ch;font-size:14px}
.banner .btn{background:#FBFAF7;color:#2E7D6B}
table{font-size:13.5px}
thead th{font:700 11px "IBM Plex Mono",monospace;letter-spacing:.14em;text-transform:uppercase;color:#8A918A;border-bottom:2px solid #1F2421}
tbody th{font:400 13px "IBM Plex Mono",monospace;color:#8A918A;width:16%}
th,td{border-bottom:1px solid #E4E2DC}
td:nth-child(3){background:rgba(46,125,107,.07)}
.faq{border-top:1px solid #E4E2DC}
details{border-bottom:1px solid #E4E2DC}
summary{font:700 14px "IBM Plex Mono",monospace}
summary:hover{color:#2E7D6B}
details p{font-size:14px;color:#5B635A}
footer{background:#1F2421;color:#8A918A;font-size:13px}
`,
  },

  // ── redesign-existing-projects ─────────────────────────────────────────────
  // Audit-led rather than a fresh aesthetic: it takes the live page and applies
  // its own diagnosis list. Headlines given presence, tracking tightened, measure
  // held near 65 characters, medium and semibold introduced between 400 and 700,
  // tabular figures for the numbers, and all-caps subheads replaced by lowercase
  // italic. The palette deliberately stays the brand's, because the skill's rule
  // is to improve what exists rather than rewrite it.
  redesign: {
    title: 'redesign-existing-projects',
    note: 'audit-led, not a new aesthetic · the live palette kept on purpose · headline presence, tighter tracking, 65ch measure, weights 400/500/700, tabular figures, all-caps subheads replaced by lowercase italic',
    css: `
body{background:#DFD7C3;color:#495543;font:400 16px/1.72 "IBM Plex Mono",monospace;font-variant-numeric:tabular-nums}
.s{padding:84px 0}@media(min-width:900px){.s{padding:124px 0}}
h1,h2,h3{font-family:"Montserrat",sans-serif;font-weight:900}
h1{font-size:clamp(2.5rem,5vw,4.2rem);line-height:1;letter-spacing:-.03em;max-width:17ch}
h2{font-size:clamp(1.7rem,3vw,2.6rem);line-height:1.05;letter-spacing:-.022em;max-width:21ch}
h3{font:700 15px/1.35 "IBM Plex Mono",monospace;letter-spacing:-.005em}
.lead{font:400 17px/1.68 "Libre Baskerville",serif;letter-spacing:-.01em;max-width:65ch;color:#3E4839}
.eyebrow{font:400 italic 15px/1.4 "Libre Baskerville",serif;letter-spacing:0;text-transform:none;color:#6A745F;margin-bottom:14px}
.small{font-size:13.5px;color:#6A745F}
.announce{background:#495543;color:#DFD7C3;text-align:center;padding:11px;font-size:13px}
.nav{background:rgba(223,215,195,.93);backdrop-filter:blur(8px);border-bottom:1px solid #CDB494}
.nav .mark{font:900 15px "Montserrat",sans-serif;letter-spacing:-.01em}
.btn{background:#AC2E20;color:#DFD7C3;font:700 14px/1 "IBM Plex Mono",monospace;letter-spacing:.03em;border-radius:2px}
.btn:hover{background:#8F251A}
.hero{padding-top:76px}
.band{padding:40px 0;border-top:1px solid #CDB494;border-bottom:1px solid #CDB494}
.bullet{font-size:15px;color:#3E4839}
.sample{background:#495543;color:#DFD7C3}
.sample h2{color:#DFD7C3}.sample .lead{color:#CDB494}
.stat{border-top:2px solid #495543;padding-top:16px}
.stat b{display:block;font:900 clamp(2.6rem,4.2vw,3.6rem)/1 "Montserrat",sans-serif;letter-spacing:-.035em}
.stat i{font:400 italic 14px/1.3 "Libre Baskerville",serif;color:#6A745F;margin:8px 0 12px;text-transform:none;letter-spacing:0}
.reason{padding:34px 0;border-top:1px solid #CDB494}
.reason:last-child{border-bottom:1px solid #CDB494}
.reason .n{font:500 13px "IBM Plex Mono",monospace;color:#DA4635}
.reason p{font-size:15px;color:#3E4839;max-width:65ch}
.outcomes p{padding:16px 0;border-bottom:1px solid #CDB494;font-size:15px;color:#3E4839}
.price{font:900 clamp(3rem,4.8vw,4rem)/1 "Montserrat",sans-serif;letter-spacing:-.035em;margin:14px 0}
.includes{margin-top:24px}
.includes p{padding:14px 0;border-bottom:1px solid rgba(205,180,148,.72);font-size:15px}
.note-line{margin-top:24px;max-width:56ch}
.step{border:1px solid #CDB494;border-radius:2px;padding:22px;background:rgba(255,255,255,.3)}
.step .sn{display:block;font:500 12px "IBM Plex Mono",monospace;color:#DA4635;margin-bottom:8px}
.step b{display:block;font:700 14px "IBM Plex Mono",monospace;margin-bottom:6px}
.step p{font-size:14px;color:#3E4839}
.banner{background:#495543;color:#DFD7C3}
.banner h2{color:#DFD7C3;max-width:22ch}.bsub{color:#CDB494;margin:16px 0 32px;max-width:54ch}
.banner .btn{background:#DA4635;color:#fff}
table{font-size:14px}
thead th{font:500 12px "IBM Plex Mono",monospace;letter-spacing:.08em;color:#6A745F;border-bottom:2px solid #495543}
tbody th{font:400 italic 14px "Libre Baskerville",serif;color:#6A745F;width:16%}
th,td{border-bottom:1px solid #CDB494}
td:nth-child(3){background:rgba(205,180,148,.28)}
.faq{border-top:1px solid #CDB494}
details{border-bottom:1px solid #CDB494}
summary{font:500 15px "IBM Plex Mono",monospace}
details p{font-size:15px;color:#3E4839}
footer{background:#495543;color:#CDB494;font-size:13px}
`,
  },

  // ── hue ────────────────────────────────────────────────────────────────────
  // Its mandatory step is the hero stage. Wolf Children is a lifestyle brand
  // whose authority is its photographs, so the preset is editorial-photo: photo
  // full bleed, hero subject none, relation flat. The photograph does not exist,
  // so the field stands in and the bar says so. Tokens are the brand's own.
  hue: {
    title: 'hue',
    note: 'hero stage preset editorial-photo · photo full bleed, no hero subject, flat relation · the photograph does not exist yet, so the field stands in for it · tokens and type scale from the brand bible',
    css: `
body{background:#DFD7C3;color:#495543;font:300 16px/1.7 "IBM Plex Mono",monospace}
.s{padding:88px 0}@media(min-width:900px){.s{padding:132px 0}}
h1,h2,h3{font-family:"Montserrat",sans-serif;font-weight:900;letter-spacing:-.018em}
h1{font-size:clamp(2.4rem,4.8vw,4rem);line-height:1.02;max-width:18ch;color:#DFD7C3}
h2{font-size:clamp(1.7rem,3.1vw,2.6rem);line-height:1.06;max-width:21ch}
h3{font-size:15px;line-height:1.35}
.lead{font:400 18px/1.62 "Libre Baskerville",serif;letter-spacing:-.01em;max-width:60ch;color:#3A4435}
.eyebrow{font:400 12px/1.4 "IBM Plex Mono",monospace;letter-spacing:.1em;text-transform:uppercase;color:#6A745F;margin-bottom:18px}
.small{font-size:13px;color:#6A745F}
.announce{background:#495543;color:#DFD7C3;text-align:center;padding:11px;font-size:13px}
.nav{background:rgba(223,215,195,.94);border-bottom:1px solid #CDB494}
.nav .mark{font:900 15px "Montserrat",sans-serif}
.btn{background:#AC2E20;color:#DFD7C3;font:700 14px/1 "IBM Plex Mono",monospace;letter-spacing:.04em;border-radius:0}
.btn:hover{background:#8F251A}
.hero{position:relative;min-height:78vh;display:flex;align-items:flex-end;padding:0 0 56px;
  background:linear-gradient(180deg,#8E9B86 0%,#6E7C68 56%,#495543 100%)}
.hero:before{content:"PHOTO · HERO · FULL BLEED · NOT YET SHOT";position:absolute;top:22px;left:24px;
  font:400 10.5px/1 "IBM Plex Mono",monospace;letter-spacing:.14em;color:rgba(223,215,195,.5)}
.hero:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(29,34,27,0) 36%,rgba(29,34,27,.72) 100%)}
.hero .wrap{position:relative;z-index:2}
.hero .eyebrow{color:#DFD7C3}
.hero .lead{color:#DFD7C3;margin-top:20px}
.hero .small{color:#CDB494}
.band{padding:40px 0;border-bottom:1px solid #CDB494}
.bullet{font-size:15px}
.sample{background:#495543;color:#DFD7C3}
.sample h2{color:#DFD7C3}.sample .lead{color:#CDB494}
.stat{border-top:2px solid #495543;padding-top:16px}
.stat b{display:block;font:900 clamp(2.6rem,4.2vw,3.6rem)/1 "Montserrat",sans-serif;letter-spacing:-.025em}
.stat i{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#6A745F;margin:8px 0 12px}
.reason{padding:34px 0;border-top:1px solid #CDB494}
.reason:last-child{border-bottom:1px solid #CDB494}
.reason .n{font:900 13px "Montserrat",sans-serif;color:#DA4635}
.reason p{font-size:15px;color:#3A4435;max-width:58ch}
.outcomes p{padding:15px 0;border-bottom:1px solid #CDB494;font-size:15px}
.price{font:900 clamp(3rem,4.8vw,3.9rem)/1 "Montserrat",sans-serif;letter-spacing:-.025em;margin:14px 0}
.includes{margin-top:24px}
.includes p{padding:14px 0;border-bottom:1px solid rgba(205,180,148,.7);font-size:15px}
.note-line{margin-top:24px;max-width:54ch}
.step{border:1px solid #CDB494;padding:22px;background:rgba(255,255,255,.28)}
.step .sn{display:block;font:900 12px "Montserrat",sans-serif;color:#DA4635;margin-bottom:8px}
.step b{display:block;font:700 14px "IBM Plex Mono",monospace;margin-bottom:6px}
.step p{font-size:14px;color:#3A4435}
.banner{background:#495543;color:#DFD7C3;text-align:center}
.banner h2{color:#DFD7C3;max-width:24ch;margin:0 auto}
.bsub{color:#CDB494;margin:16px auto 32px;max-width:50ch}
.banner .btn{background:#DA4635;color:#fff}
table{font-size:14px}
thead th{font:700 11px "IBM Plex Mono",monospace;letter-spacing:.12em;text-transform:uppercase;color:#6A745F;border-bottom:2px solid #495543}
tbody th{font:300 13px "IBM Plex Mono",monospace;color:#6A745F;width:16%}
th,td{border-bottom:1px solid #CDB494}
td:nth-child(3){background:rgba(205,180,148,.28)}
.faq{border-top:1px solid #CDB494}
details{border-bottom:1px solid #CDB494}
summary{font:700 15px "IBM Plex Mono",monospace}
details p{font-size:15px;color:#3A4435}
footer{background:#495543;color:#CDB494;font-size:13px}
`,
  },

  // ── hyperframes-creative ───────────────────────────────────────────────────
  // House style, adapted: it is written for video frames and says its rules
  // override web instincts, so composition carries and motion does not. Light
  // palette because the subject is children, one accent hue, neutrals tinted
  // toward it rather than dead grey, a background layer of persistent
  // decoratives, and weight led to one side instead of centred.
  hyperframes: {
    title: 'hyperframes-creative',
    note: 'house style adapted: it is written for video frames, so composition carries and its motion rules do not · light palette for a child subject, one accent, neutrals tinted toward it, four persistent decoratives, weight led off-centre',
    css: `
body{background:#E4DCC8;color:#3F4A3A;font:400 16px/1.68 "IBM Plex Mono",monospace;overflow-x:hidden}
.s{padding:84px 0;position:relative}@media(min-width:900px){.s{padding:120px 0}}
h1,h2,h3{font-family:"Montserrat",sans-serif;font-weight:900;letter-spacing:-.02em}
h1{font-size:clamp(2.5rem,5.2vw,4.4rem);line-height:1;max-width:16ch}
h2{font-size:clamp(1.8rem,3.4vw,2.8rem);line-height:1.04;max-width:20ch}
h3{font-size:15px;line-height:1.35}
.lead{font:400 18px/1.6 "Libre Baskerville",serif;letter-spacing:-.01em;max-width:56ch;color:#4A5545}
.eyebrow{display:inline-block;font:700 11px/1 "IBM Plex Mono",monospace;letter-spacing:.12em;
  text-transform:uppercase;color:#F3EDE0;background:#DA4635;padding:7px 12px;margin-bottom:22px}
.small{font-size:14px;color:#6A745F}
.announce{background:#DA4635;color:#F3EDE0;text-align:center;padding:10px;
  font:700 11.5px/1 "IBM Plex Mono",monospace;letter-spacing:.1em;text-transform:uppercase}
.nav{background:#E4DCC8;border-bottom:1px solid rgba(63,74,58,.18)}
.nav .mark{font:900 15px "Montserrat",sans-serif}
.btn{background:#3F4A3A;color:#E4DCC8;font:700 14px/1 "IBM Plex Mono",monospace;letter-spacing:.04em;border-radius:0}
.btn:hover{background:#2C3429}
.hero{min-height:84vh;display:flex;align-items:center;padding-top:40px}
.hero:before{content:"SKY";position:absolute;right:-4vw;top:6vh;font:900 26vw/.8 "Montserrat",sans-serif;
  color:#495543;opacity:.05;pointer-events:none}
.hero:after{content:"";position:absolute;left:-12vw;top:-8vh;width:66vw;height:66vw;border-radius:50%;
  background:radial-gradient(circle,rgba(218,70,53,.13) 0%,rgba(218,70,53,0) 62%);pointer-events:none}
.hero .wrap{position:relative;z-index:2}
.reasons-s:before{content:"";position:absolute;inset:0;pointer-events:none;
  background:repeating-linear-gradient(90deg,transparent 0 calc(12.5% - 1px),rgba(63,74,58,.06) calc(12.5% - 1px) 12.5%)}
.close:before{content:"";position:absolute;right:24px;bottom:24px;width:110px;height:110px;
  border-right:1px solid rgba(218,70,53,.32);border-bottom:1px solid rgba(218,70,53,.32)}
.band{padding:36px 0;background:#DFD7C3;border-top:1px solid #CDB494;border-bottom:1px solid #CDB494}
.bullet{font-size:15px}
.sample{background:#DFD7C3;border-bottom:1px solid #CDB494}
.stat b{display:block;font:900 clamp(2.8rem,4.6vw,3.8rem)/1 "Montserrat",sans-serif;letter-spacing:-.03em;color:#DA4635}
.stat i{font:700 11px/1 "IBM Plex Mono",monospace;letter-spacing:.12em;text-transform:uppercase;color:#6A745F;margin:10px 0 12px}
.reason{padding:32px 0;border-top:1px solid #CDB494;position:relative;z-index:2}
.reason:last-child{border-bottom:1px solid #CDB494}
.reason .n{font:900 30px/.9 "Montserrat",sans-serif;color:rgba(218,70,53,.34)}
.reason p{font-size:15px;color:#4A5545;max-width:56ch}
.outcomes p{padding:15px 0;border-bottom:1px solid #CDB494;font-size:15px;color:#4A5545}
.price{font:900 clamp(3rem,4.8vw,4rem)/1 "Montserrat",sans-serif;letter-spacing:-.03em;margin:14px 0;color:#DA4635}
.includes{margin-top:22px;background:#DFD7C3;border:1px solid #CDB494;padding:20px}
.includes p{padding:12px 0;border-bottom:1px solid rgba(205,180,148,.8);font-size:15px}
.includes p:last-child{border-bottom:0;padding-bottom:0}
.note-line{margin-top:22px;max-width:52ch}
.step{background:#DFD7C3;border:1px solid #CDB494;padding:22px}
.step .sn{display:block;font:900 20px/1 "Montserrat",sans-serif;color:rgba(218,70,53,.4);margin-bottom:6px}
.step b{display:block;font:700 13px "IBM Plex Mono",monospace;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px}
.step p{font-size:14px;color:#4A5545}
.banner{background:#3F4A3A;color:#E4DCC8}
.banner h2{color:#E4DCC8;max-width:22ch}.bsub{color:#CDB494;margin:16px 0 32px;max-width:52ch}
.banner .btn{background:#DA4635;color:#F3EDE0}
table{font-size:14px}
thead th{font:700 11px "IBM Plex Mono",monospace;letter-spacing:.1em;text-transform:uppercase;color:#6A745F;border-bottom:2px solid #3F4A3A}
tbody th{font:400 13px "IBM Plex Mono",monospace;color:#6A745F;width:16%}
th,td{border-bottom:1px solid #CDB494}
td:nth-child(3){background:#DFD7C3}
.faq{border-top:1px solid #CDB494}
details{border-bottom:1px solid #CDB494}
summary{font:700 15px "IBM Plex Mono",monospace}
details p{font-size:15px;color:#4A5545}
footer{background:#3F4A3A;color:#CDB494;font-size:13px}
`,
  },
};

/** The whole page for one theme. Identical copy and module order in every variant. */
export function variantPage(t) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${t.title} | Compass</title>
<script src="/assets/js/pixel.js?v=${PIXEL}"></script>
<style>${FONTS}${BASE}${t.css}</style>
</head>
<body>
<noscript><img hidden height="1" width="1" src="https://www.facebook.com/tr?id=${DATASET}&amp;ev=PageView&amp;noscript=1" alt=""></noscript>
<p class="which"><b>${t.title}</b> <span>${t.note}</span></p>
${BODY}
</body>
</html>
`;
}

/** Writes one variant. Returns its path. */
export function writeVariant(slug, t) {
  const dir = join(ROOT, 'readings/compass', slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), variantPage(t));
  return `/readings/compass/${slug}/`;
}

/** The shared copy, flattened for the audit. Exported so every builder runs the same gate. */
export function auditShared() {
  const hits = audit(JSON.stringify(C).replace(/","/g, '\n').replace(/[{}"[\]]/g, ' ').replace(/\w+:/g, ' '));
  if (hits.length) { console.error(report(hits)); process.exit(1); }
  console.log('anti-slop audit on the shared copy: clean');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  auditShared();
  for (const [slug, t] of Object.entries(THEMES)) console.log(`wrote ${writeVariant(slug, t)}`);
}
