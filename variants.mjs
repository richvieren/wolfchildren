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
import { scopedAtfCss, atfMarkup, ATF_JS, atfDesktopCss } from './src/lib/atf-section.mjs';
import { resolve as resolveAtf } from './src/lib/atf-copy.mjs';

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
  <div class="hero-media">
    <img class="shot" src="/assets/img/compass/hero.jpg" width="1400" height="1750" alt="A child on a beach at sunset, small against the water" loading="eager">
    <img class="shot shot--detail" src="/assets/img/compass/hero-detail.jpg" width="1200" height="1800" alt="The same evening, close: a child crouched in long grass" loading="lazy">
  </div>
</div></section>

<div class="band"><div class="wrap band-grid">
  ${C.support.bullets.map((b) => `<p class="bullet">${b}</p>`).join('')}
</div><div class="wrap"><div class="badges">${C.support.badges.map((b) => `<span class="small">${b}</span>`).join('')}</div></div></div>

<figure class="bleed"><img src="/assets/img/compass/band-dusk.jpg" width="2048" height="878" alt="A beach at dusk, mountains behind, one child small in the frame" loading="lazy"></figure>

<section class="s recognition-s"><div class="wrap">
  <h2>${C.recognition.h2}</h2>
  <div class="recognition">${C.recognition.body.map((t) => `<p>${t}</p>`).join('')}</div>
</div></section>

<section class="s sample"><div class="wrap">
  <h2>${C.sample.h2}</h2>
  <p class="lead">${C.sample.body}</p>
  <figure class="sample-shot"><img class="shot" src="/assets/img/compass/sample.jpg" width="2048" height="1365" alt="A child building a sandcastle at the end of the day" loading="lazy"></figure>
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

<section class="s gallery-s"><div class="wrap">
  <div class="gallery">
    <img class="shot" src="/assets/img/compass/reason-1.jpg" width="1200" height="1500" alt="A child standing on a rock in a forest, looking back" loading="lazy">
    <img class="shot" src="/assets/img/compass/reason-2.jpg" width="1200" height="1500" alt="A child at a fence, absorbed in an animal on the other side" loading="lazy">
    <img class="shot" src="/assets/img/compass/reason-3.jpg" width="1200" height="1500" alt="A child running down a grass slope" loading="lazy">
    <img class="shot" src="/assets/img/compass/reason-4.jpg" width="1200" height="1500" alt="A child small on a path between tall pines" loading="lazy">
  </div>
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
  <figure class="offer-shot"><img class="shot" src="/assets/img/compass/offer.jpg" width="1229" height="2048" alt="A child in a doorway at the end of the day" loading="lazy"></figure>
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

<figure class="bleed"><img src="/assets/img/compass/band-season.jpg" width="2048" height="878" alt="A forest path, a child small among the trees" loading="lazy"></figure>

<section class="s faq-s"><div class="wrap">
  <p class="eyebrow">${C.faq.eyebrow}</p>
  <h2>${C.faq.h2}</h2>
  <div class="faq">${C.faq.items.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</div>
</div></section>

<figure class="bleed"><img src="/assets/img/compass/close.jpg" width="2048" height="1365" alt="A child walking back along the beach at dusk" loading="lazy"></figure>

<section class="s close"><div class="wrap">
  <h2>${C.close[0]}</h2><p class="lead">${C.close[1]}</p><a class="btn" href="#offer">${C.close[2]}</a>
</div></section>

<footer><div class="wrap">Wolf Children · hello@wolfchildren.co</div></footer>
`;

// Structure every theme inherits. Themes override freely.

// ── The five taken forward (Richard, 2026-10-05) ───────────────────────────
// Opt-in only. A theme with `v2: true` gets the ATF on top, the two landing
// fonts and the framed photographs; every other variant is untouched, because
// he named five and the rule is to touch only what he named.

// Morning Memories for headings, Special Elite for everything else. Both ship a
// single weight, so there is no bold to reach for: emphasis is size, caps and
// letter-spacing, and `font-synthesis:none` stops a browser faking one.
export const FONTS_V2 = `
@font-face{font-family:"Morning Memories";src:url("/assets/fonts/morning-memories-400.woff2") format("woff2");font-weight:400;font-display:swap}
@font-face{font-family:"Morning Memories";src:url("/assets/fonts/morning-memories-italic.woff2") format("woff2");font-weight:400;font-style:italic;font-display:swap}
@font-face{font-family:"Special Elite";src:url("/assets/fonts/special-elite-400.woff2") format("woff2");font-weight:400;font-display:swap}
`;

// Every photograph re-exported from Richard's originals at its native ratio.
// The old set was cropped to 4:5, 2:3, 3:5, 3:2 and 21:9 against originals that
// are only ever 0.75 or 1.333, which is how a crop took a child's legs off.
// Nothing here is cropped and no rule uses object-fit:cover.
export const PHOTOS_V2 = {
  'hero': { w: 1200, h: 1600, alt: "A child alone on the sand, a silhouette against the setting sun" },
  'hero-detail': { w: 1200, h: 1600, alt: "The same evening, close: a child crouched in long grass" },
  'band-dusk': { w: 1600, h: 1200, alt: "A beach at dusk, the mountain behind, one child small in the frame" },
  'sample': { w: 1600, h: 1200, alt: "A child building a sandcastle at the end of the day" },
  'reason-1': { w: 1200, h: 1600, alt: "A child standing on a rock in a forest, looking back" },
  'reason-2': { w: 1200, h: 1600, alt: "A child at a fence, absorbed in the animals on the other side" },
  'reason-3': { w: 1200, h: 1600, alt: "A child running across grass towards the trees" },
  'reason-4': { w: 1200, h: 1600, alt: "A child small on a path between tall pines" },
  'offer': { w: 1200, h: 1600, alt: "A child in a doorway at the end of the day, boots muddy" },
  'band-season': { w: 1600, h: 1200, alt: "A forest path, a child small among the trees" },
  'close': { w: 1600, h: 1200, alt: "A child at the water's edge at sunset, the beach empty" }
};

// The almanac treatment: a white matte, a torn strip of tape, a soft drop.
// Mobile first, so the frame is a percentage of the photo and scales with it.
export const PHOTO_CSS_V2 = `
/* The photo treatment, matched to the markup bodyV2 actually emits:
   figure class="ph tape-a ph-tilt-a". It previously targeted .ph-matte and
   .ph-tape, classes removed in an earlier pass, so no matte rendered and the
   tape fell back to .ph img{width:100%} and painted full width as if it were
   the photograph. */
.ph{position:relative;display:block;margin:0;background:var(--cream);line-height:0;
  padding:3.5%;border:1px solid var(--tan);overflow:visible}
.ph img.ph-photo{display:block;width:100%;height:auto;aspect-ratio:auto!important;
  max-height:none!important;object-fit:contain!important;border-radius:0}
.ph > img.tape{position:absolute;top:-13px;left:50%;width:38%;height:auto;z-index:2;border:0;padding:0}
.ph.tape-a > img.tape{transform:translateX(-50%) rotate(-2deg)}
.ph.tape-b > img.tape{transform:translateX(-52%) rotate(2.4deg)}
.ph.tape-c > img.tape{transform:translateX(-48%) rotate(-3.2deg)}
.ph-tilt-a{transform:rotate(-1.1deg)}
.ph-tilt-b{transform:rotate(.9deg)}
figure{margin:0}
@media(min-width:900px){.ph > img.tape{width:24%;top:-18px}}
`;



// Everything a v2 page needs regardless of its design language. Each theme's
// `cssV2` is then only its own design, which is what differs between the five.

// The palette, from projects/wolf-children/brand-bible.md §2. Fixed, not derived.
export const TOKENS_WC = `
:root{
  --cream:#DFD7C3; --green:#495543; --tan:#CDB494;
  --orange:#DA4635; --cta:#AC2E20; --bark:#6B4A2F; --green-hover:#3A4435;
}
`;

export const WC_BASE = `
/* ── Wolf Children base ───────────────────────────────────────────────────
   Built from the wolf-children-design skill. This replaces BASE and the old
   per-theme CSS entirely for the five: Richard, 2026-10-05, "nothing from the
   previous design survives unless it matches the ATF". Every value below is a
   token from references/tokens.md. The five differ only in composition. */

*,*::before,*::after{box-sizing:border-box;font-synthesis:none;font-synthesis-weight:none}
*{font-weight:400}
html,body{overflow-x:clip}
body{margin:0;background:var(--cream);color:var(--green);
  font:400 15px/1.55 "Special Elite","Courier New",monospace;-webkit-font-smoothing:antialiased}

/* the old header and announce bar are removed from the markup, not hidden */
.wrap{width:100%;max-width:1120px;margin:0 auto;padding:0 20px}
.s{padding:64px 0}
@media(min-width:900px){.s{padding:112px 0}.wrap{padding:0 32px}}

/* ── type. Morning Memories on headings only, never under 24px ─────────── */
h1,h2,h3{font-family:"Morning Memories",Georgia,serif;letter-spacing:-.02em;line-height:1.04;margin:0}
h1{font-size:clamp(34px,8vw,64px)}
h2{font-size:clamp(26px,5.2vw,40px)}
h3{font-size:clamp(20px,3.4vw,26px);letter-spacing:-.01em}
p{margin:0 0 14px;max-width:66ch}
.lead{font-size:clamp(16px,4vw,19px);line-height:1.5;letter-spacing:-.01em;max-width:60ch}
.small,.note-line,.bsub{font-size:12px;line-height:1.45}
/* tertiary layer: uppercase, +.09em, bark. The only place bark appears in prose. */
.eyebrow,.sn,.n,.badges span,.flabel{font-size:11.5px;letter-spacing:.09em;text-transform:uppercase;color:var(--bark)}
b,strong{text-transform:uppercase;letter-spacing:.09em}
a{color:var(--green);text-underline-offset:3px;text-decoration-thickness:1px}
a:hover{text-decoration-thickness:2px}
.link,.links a{color:var(--bark)}

/* ── the one orange: the button. Nothing else in its section may be orange ── */
.btn{display:inline-flex;align-items:center;justify-content:center;min-height:50px;
  padding:0 22px;border:0;border-radius:3px;background:var(--cta);color:var(--cream);
  font:400 15px/1 "Special Elite","Courier New",monospace;letter-spacing:.06em;
  text-transform:uppercase;text-decoration:none;cursor:pointer;transition:background 120ms ease-out}
.btn:hover{background:var(--green)}
.act{margin-top:24px;display:flex;flex-wrap:wrap;align-items:center;gap:12px 16px}

/* ── structure is a 1px tan line. No shadows anywhere. ─────────────────── */
.band,.stat,.reason,.step,.refusal,.offer,.faq,.tablewrap,.includes{
  border:1px solid var(--tan);border-radius:4px;padding:20px}
.band-grid,.stats,.reasons,.steps,.refusals,.outcomes,.includes,.compare{
  display:grid;gap:16px;margin-top:32px}
.price{font-size:28px;letter-spacing:-.01em}
.bullet{display:grid;grid-template-columns:12px 1fr;gap:8px;align-items:start;margin:0 0 10px}
.bullet i{width:12px;height:12px;margin-top:4px;border:1px solid var(--bark);border-radius:999px;
  position:relative;flex:none;font-style:normal}
.bullet i:after{content:"";position:absolute;left:3.5px;top:1.5px;width:3px;height:6px;
  border-right:1.5px solid var(--bark);border-bottom:1.5px solid var(--bark);transform:rotate(42deg)}

/* the stem: the system's signature connector, 1px x 16px under an eyebrow */
.eyebrow + .stem,.stem{width:1px;height:16px;background:var(--tan);margin:8px auto 0;display:block}

table{width:100%;border-collapse:collapse;font-size:13.5px}
th,td{padding:10px 12px;border-bottom:1px solid var(--tan);text-align:left;vertical-align:top}
thead th{font-size:11px;letter-spacing:.09em;text-transform:uppercase;color:var(--bark)}
details{border-bottom:1px solid var(--tan);padding:14px 0}
summary{cursor:pointer;list-style:none;font-size:15px}
summary::-webkit-details-marker{display:none}

/* ── the one inverted ground. Bark is 1.01:1 here and unavailable. ─────── */
.banner,.close{background:var(--green);color:var(--cream);border-radius:4px;padding:32px 24px}
.banner h2,.close h2,.banner a,.close a{color:var(--cream)}
.banner .eyebrow,.close .eyebrow{color:var(--cream)}
.banner .btn,.close .btn{background:var(--cream);color:var(--green)}
.banner .btn:hover,.close .btn:hover{background:var(--tan)}

/* ── photographs. The box fits the picture; the picture is never cropped. ── */
.ph{position:relative;display:block;margin:0;background:var(--cream);line-height:0;
  padding:3.5%;border:1px solid var(--tan)}
.ph img{display:block;width:100%;height:auto;aspect-ratio:auto!important;max-height:none!important;
  object-fit:contain!important;border-radius:0}
.ph .tape{position:absolute;top:-13px;left:50%;width:38%;height:auto;z-index:2}
.ph.tape-a .tape{transform:translateX(-50%) rotate(-2deg)}
.ph.tape-b .tape{transform:translateX(-52%) rotate(2.4deg)}
.ph.tape-c .tape{transform:translateX(-48%) rotate(-3.2deg)}
.ph-tilt-a{transform:rotate(-1.1deg)}
.ph-tilt-b{transform:rotate(.9deg)}
figure{margin:0}
.bleed{margin-top:32px}
.hero-media,.gallery{display:grid;gap:24px;margin-top:32px}
@media(min-width:900px){.ph .tape{width:24%;top:-18px}}

`;

export const V2_SHARED = `
/* Both faces ship one weight. Nothing may fake a second. */
/* .which lives in BASE, which all 26 variants share, so it is overridden here
   rather than edited there. */
.which{font-family:"Special Elite","Courier New",monospace!important;background:var(--green)!important;color:var(--cream)!important}
*,*::before,*::after{font-synthesis:none!important;font-synthesis-weight:none!important}
*{font-weight:400!important}
body{font-family:"Special Elite","Courier New",monospace;font-size:15px;line-height:1.66}
h1,h2,h3,h4,.display{font-family:"Morning Memories",Georgia,serif!important;letter-spacing:-.015em;line-height:1.04}
body,.which,.lead,.btn,.stat b,.reason .n,.price,.step .sn,.step b,
thead th,tbody th,summary,.nav .mark{font-family:"Special Elite","Courier New",monospace!important}
/* Emphasis without a bold cut: size, caps and tracking carry it. */
.eyebrow,.kicker,.small,.which,.tag,.label{font-family:"Special Elite","Courier New",monospace;
  text-transform:uppercase;letter-spacing:.16em;font-size:11px}
b,strong{text-transform:uppercase;letter-spacing:.1em}
.btn,.cta{font-family:"Special Elite","Courier New",monospace;text-transform:uppercase;letter-spacing:.13em}
/* No crop and no stretch, anywhere. The shared base sets object-fit:cover on
   .bleed img and .gallery img and an aspect-ratio on the gallery; both are
   released here rather than edited, since they belong to all 26 variants. */
.bleed img,.gallery img,.shot,.ph img{aspect-ratio:auto!important;height:auto!important;
  max-height:none!important;object-fit:contain!important}
.bleed{overflow:visible}
.shot,.ph img{border-radius:0;box-shadow:none;filter:none}
.ph{max-width:100%}
/* The ATF is a mobile-native section. On a wide screen it is placed, not
   stretched: centred at its design width on the page's own ground. Its internals
   are untouched. */
@media(min-width:900px){.atf-root{max-width:520px;margin-inline:auto}}
/* A theme that overflows sideways guards it with body{overflow-x:hidden}, which
   does not hold: the overflow escapes to html and the page scrolls anyway.
   hyperframes measured 65px of real sideways scroll from its own perspective
   planes, with or without anything added here. clip rather than hidden, so no
   scroll container is created and sticky still works. */
html,body{overflow-x:clip}
`;


// The section is immune to whatever a theme does. Loaded after all of them.
// A theme styling a bare element beats the section's inheritance: the section's
// h1 sets no colour of its own, so mengto's h1 rule coloured it. This hands every
// element inside the section back to the section before its own rules load.
export const ATF_RESET = `
#atf,#atf *{color:inherit;text-transform:none;letter-spacing:normal;font-style:normal;
  line-height:inherit;margin:0;font-weight:400;
  background-image:none;box-shadow:none;text-shadow:none;transform:none;filter:none}
#atf{color:var(--green)}
#atf img{border:0;padding:0;border-radius:0;max-width:none;filter:none}
`;

export const ATF_GUARD = `
/* ── the ATF owns its own box ─────────────────────────────────────────────
   WC_BASE styles bare elements for the page below the section. Those selectors
   also reach inside it, and a bare p rule with max-width 66ch was clamping the full
   bleed announce bar to 484px. The section's own rules are more specific than
   these and keep winning; this only undoes what the page added. */
#atf p{margin:revert;max-width:none}
#atf h1,#atf h2,#atf h3{max-width:none}
#atf .eyebrow{text-transform:none}
#atf .stem{margin:5px auto 0}
#atf b,#atf strong{text-transform:none;letter-spacing:inherit}
#atf a{text-decoration:none}
#atf .under a{text-decoration:underline}
#atf figure{margin:0}
`;

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
.shot{display:block;width:100%;height:auto}
.hero-media{margin-top:48px;display:grid;gap:16px}
@media(min-width:900px){.hero-media{grid-template-columns:minmax(0,3fr) minmax(0,2fr);align-items:start}}
.shot--detail{display:none}
@media(min-width:900px){.shot--detail{display:block}}
.bleed{margin:0}
.bleed img{display:block;width:100%;height:auto;max-height:58vh;object-fit:cover}
.sample-shot{margin:40px 0 0}
.gallery-s{padding-top:0}
.gallery{display:grid;gap:12px;grid-template-columns:repeat(2,minmax(0,1fr))}
@media(min-width:820px){.gallery{grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}}
.gallery img{aspect-ratio:4/5;object-fit:cover}
.offer-shot{margin:0 0 40px;max-width:320px}
@media(min-width:900px){.offer-shot{float:right;margin:0 0 24px 40px}}
.which{font:400 12px/1.5 "IBM Plex Mono",monospace;background:#111;color:#fff;padding:8px 14px;letter-spacing:.04em}
.which b{font-weight:700}.which span{opacity:.62}
`;

const THEMES = {
  // ── design-taste-frontend v1 ────────────────────────────────────────────────
  // Dials 8/6/4: higher variance and density than v2, so a tighter grid, more
  // contrast steps, and an offset hero rather than a flush-left one.

  // ── high-end-visual-design ─────────────────────────────────────────────────
  // Its variance engine says pick one vibe and one layout archetype and commit.
  // Vibe: Editorial Luxury (warm creams, muted sage, high-contrast serif display,
  // a film-grain overlay at 3%). Layout: The Editorial Split.
  // Banned by it and avoided here: 1px grey borders, harsh shadows, edge-to-edge
  // sticky navs glued to the top, linear easing.

  // ── minimalist-ui ──────────────────────────────────────────────────────────
  // Warm bone canvas, white surfaces, hairlines at 6% black, no gradients, no
  // pill containers, shadows effectively absent, extreme typographic contrast,
  // one muted pastel accent, tabular numerals.

  // ── industrial-brutalist-ui ────────────────────────────────────────────────
  // One mode, committed: Swiss Industrial Print. Newsprint substrate, monolithic
  // heavy sans, unforgiving visible grid, oversized viewport-bleeding numerals,
  // primary red as the alert accent, uppercase structure, compressed leading.

  // ── gpt-taste ──────────────────────────────────────────────────────────────
  // Its AIDA order is overruled: the teardown order wins, as Richard ruled. What
  // is applied is everything else it mandates — the floating nav pill, the
  // ultra-wide H1 container under its two-line iron rule, massive section
  // padding, gapless bento, and its ban on cheap meta-labels, which means this
  // is the only variant with no eyebrow anywhere.

  // ── stitch-design-taste ────────────────────────────────────────────────────
  // Its output is a DESIGN.md that a generator reads, so the design system it
  // encodes is applied directly: calibrated colour with one accent, a strict 8px
  // grid, asymmetric 7/5 splits rather than halves, tight type scale, and
  // perpetual micro-motion expressed as hover and focus states on a static page.

  // ── redesign-existing-projects ─────────────────────────────────────────────
  // Audit-led rather than a fresh aesthetic: it takes the live page and applies
  // its own diagnosis list. Headlines given presence, tracking tightened, measure
  // held near 65 characters, medium and semibold introduced between 400 and 700,
  // tabular figures for the numbers, and all-caps subheads replaced by lowercase
  // italic. The palette deliberately stays the brand's, because the skill's rule
  // is to improve what exists rather than rewrite it.

  // ── hue ────────────────────────────────────────────────────────────────────
  // Its mandatory step is the hero stage. Wolf Children is a lifestyle brand
  // whose authority is its photographs, so the preset is editorial-photo: photo
  // full bleed, hero subject none, relation flat. The photograph does not exist,
  // so the field stands in and the bar says so. Tokens are the brand's own.

  // ── hyperframes-creative ───────────────────────────────────────────────────
  // House style, adapted: it is written for video frames and says its rules
  // override web instincts, so composition carries and motion does not. Light
  // palette because the subject is children, one accent hue, neutrals tinted
  // toward it rather than dead grey, a background layer of persistent
  // decoratives, and weight led to one side instead of centred.
};

/** The whole page for one theme. Identical copy and module order in every variant. */

/** The shared skeleton, turned into the v2 page: no announcement bar, every
 *  photograph swapped for its uncropped re-export and wrapped in the matte and
 *  tape. The skeleton itself is not restructured; he asked for a restyle. */
export function bodyV2() {
  // The ATF is the header now. The old announce bar and the old nav are removed
  // from the markup, not hidden: Richard, 2026-10-05, "The old header is gone."
  let out = BODY.replace(/<p class="announce">[\s\S]*?<\/p>\s*/, '')
                .replace(/<nav class="nav">[\s\S]*?<\/nav>\s*/, '');
  // Richard, 2026-10-05, after reading Anthropic's frontend-design guidance:
  // "Kill the middle-dot meta strings and the eyebrow-above-every-heading.
  // Those aren't in the bible, they're AI tells, and they go."
  //
  // Both live in the same four elements. "Compass · one child · one page · $27"
  // is the meta string and an eyebrow at once; the other three are bare labels
  // over a heading that already says the same thing. Removed here rather than in
  // src/lib/compass-copy.mjs, so the other 21 variants and the readings keep the
  // approved copy untouched and this is one line to undo.
  const dropped = [...out.matchAll(/<p class="eyebrow">([^<]*)<\/p>/g)].map((m) => m[1]);
  out = out.replace(/<p class="eyebrow">[^<]*<\/p>\s*/g, '');
  if (dropped.length !== 4) throw new Error(`expected 4 eyebrows to drop, found ${dropped.length}`);
  let n = 0;
  out = out.replace(/<img([^>]*?)src="\/assets\/img\/compass\/([a-z0-9-]+)\.jpg"([^>]*?)>/g, (m, a, slot, b) => {
    const ph = PHOTOS_V2[slot];
    if (!ph) throw new Error(`no v2 photo for slot ${slot}`);
    const cls = (a + b).match(/class="([^"]*)"/);
    const eager = /loading="eager"/.test(a + b);
    const tape = ['tape-a', 'tape-b', 'tape-c'][n % 3];
    const tilt = n % 2 ? 'ph-tilt-b' : 'ph-tilt-a';
    const tapeSrc = `/assets/img/frames/tape-${[1, 4, 7][n % 3]}.png`;
    n += 1;
    return `<figure class="ph ${tape} ${tilt}${cls ? ' ' + cls[1] : ''}">`
      + `<img class="ph-photo" src="/assets/img/compass2/${slot}.webp" width="${ph.w}" height="${ph.h}" `
      + `alt="${ph.alt}" ${eager ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'} decoding="async">`
      + `<img class="tape" src="${tapeSrc}" alt="" aria-hidden="true" loading="lazy"></figure>`;
  });
  if (n !== Object.keys(PHOTOS_V2).length) throw new Error(`v2 body wrapped ${n} photos, expected ${Object.keys(PHOTOS_V2).length}`);
  return out;
}

export function variantPage(t) {
  if (t.v2) return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${t.title} | Compass</title>
<script src="/assets/js/pixel.js?v=${PIXEL}"></script>
<style>${FONTS_V2}${TOKENS_WC}${BASE}${t.css}${PHOTO_CSS_V2}${V2_SHARED}${ATF_RESET}${scopedAtfCss("#atf")}${ATF_GUARD}${atfDesktopCss("#atf")}${t.cssV2 || ''}</style>
</head>
<body>
<noscript><img hidden height="1" width="1" src="https://www.facebook.com/tr?id=${DATASET}&amp;ev=PageView&amp;noscript=1" alt=""></noscript>
<div id="atf">${t.atfV2 ? t.atfV2(atfMarkup(resolveAtf('control'))) : atfMarkup(resolveAtf('control'))}</div>
${bodyV2()}
${ATF_JS}
</body>
</html>
`;
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
