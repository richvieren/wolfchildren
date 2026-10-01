#!/usr/bin/env node
// widget-all.mjs — every widget in one page, with Richard's review of 2026-10-01
// applied as a patch layer over the published sample.
//
// His notes, item by item, are in PATCH below. The sample's own HTML is never
// rewritten by hand here: it is patched by named string swaps, so his copy travels
// through untouched unless a note asked for it to change.
//
// Titles and WHY lines marked DRAFT are mine. They are drafts because the copy is
// his, and the page says so on every one of them.
//
//   node widget-all.mjs

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PIXEL, DATASET } from './variants.mjs';
import { FORMS } from './widget-forms.mjs';
import { WIDGETS, WIDGET_CSS } from './src/lib/compass-widgets.mjs';
import { TOKENS, ROUND, TONES } from './src/lib/widget-theme.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));

// The sample asks for Montserrat and Libre Baskerville. Remap to the landing pair.
// Morning Memories ships one weight, so 900 becomes 400 rather than a faked bold.
// His note on E15 and E16: keep the caps on a short label, not on a long line, so
// badge-placement loses its uppercase.
export const RESKIN = WIDGET_CSS
  .replace(/font-family:Montserrat/g, 'font-family:"Morning Memories",Georgia,serif')
  .replace(/font-family:"Libre Baskerville"/g, 'font-family:"Special Elite","Courier New",monospace')
  .replace(/font-family:"IBM Plex Mono"/g, 'font-family:"Special Elite","Courier New",monospace')
  .replace(/font-weight:900/g, 'font-weight:400');

// Text set inside a drawing is values and labels, so it takes the body face.
// Morning Memories is for headings only. These are SVG presentation attributes,
// which no stylesheet rule can reach.
const reskinHtml = (h) => h
  .replace(/font-family="'IBM Plex Mono'"/g, 'font-family="Special Elite"')
  .replace(/font-family="Montserrat"/g, 'font-family="Special Elite"')
  .replace(/(font-family="Special Elite"[^>]*?)font-weight="900"/g, '$1font-weight="400"');

// ── small drawings his notes asked for ─────────────────────────────────────
const compassRose = `<svg viewBox="0 0 64 64" class="rose" aria-hidden="true">
  <circle cx="32" cy="32" r="29" fill="none" stroke="#CDB494" stroke-width="1.5"/>
  <circle cx="32" cy="32" r="22" fill="none" stroke="#CDB494" stroke-width="1"/>
  <polygon points="32,6 37,32 32,58 27,32" fill="#C0623A"/>
  <polygon points="6,32 32,27 58,32 32,37" fill="#495543" opacity=".55"/>
  <circle cx="32" cy="32" r="3.4" fill="#F3EEE2" stroke="#495543" stroke-width="1.4"/>
</svg>`;

const questionMark = `<svg viewBox="0 0 48 48" class="qmark" aria-hidden="true">
  <circle cx="24" cy="24" r="22" fill="none" stroke="#CDB494" stroke-width="1.5"/>
  <path d="M17 18a7 7 0 1 1 10 6.3c-1.9 1.1-3 2.3-3 4.2v1.5" fill="none" stroke="#C0623A" stroke-width="3.2" stroke-linecap="round"/>
  <circle cx="24" cy="35.5" r="2.3" fill="#C0623A"/>
</svg>`;

// Houses 1 to 6 sit below the horizon, 7 to 12 above. Houses 10, 11, 12, 1, 2, 3
// are the self side, 4 to 9 the other-people side. Counted from Nora's thirteen
// placements, read from reader/data/natal.py.
const HEMI = { 'Out in the world|with others': 8, 'Out in the world|on her own': 3,
               'At home|on her own': 2, 'At home|with others': 0 };

// ── Richard's review, as a patch per block ─────────────────────────────────
// title: a proposed replacement title (DRAFT). why: a proposed clarifying line
// (DRAFT). html: a swap applied to the sample's markup. note: what he said.
const PATCH = {
  E01: { note: 'compass graphic above the name, birth details instead of the placements',
    html: (h) => h
      .replace('<h1>Nora</h1>', `${compassRose}<h1>Nora</h1>`)
      .replace('6 years old · a girl · Capricorn Sun, Leo Moon, Gemini rising',
               '6 years old · a girl<br>12 January 2020 · 14:30 · Ghent, Belgium') },
  E02: { note: 'drop the circles, label Sun / Moon / Rising, show the real sign glyph',
    html: () => ['Sun|Capricorn|♑|who she is becoming', 'Moon|Leo|♌|what settles her', 'Rising|Gemini|♊|how she meets the world']
      .map((r) => { const [p, s, g, sub] = r.split('|');
        return `<div class="card big3 flat"><div class="big3-word">${p}</div><div class="glyph big3-glyph">${g}</div><div class="big3-sign">${s}</div><div class="big3-sub">${sub}</div></div>`; })
      .join('').replace(/^/, '<div class="big3-grid">') + '</div>' },
  E03: { note: 'great, but what does it do',
    why: 'One planet is given the job of running the whole chart. Whatever that planet is doing colours everything else. Hers is Mercury, so thinking leads.' },
  E04: { note: 'still not clear what she is growing towards. make it tangible or take it out',
    title: 'What she is growing towards', inModule: true,
    html: (h) => h.replace('<span class="pill-label">Leans towards</span>', '<span class="pill-label">Growing towards</span>')
      .replace('<span class="pill-text">Cancer · the North Node</span>',
               '<span class="pill-text">Looking after the people closest to her</span>'),
    why: 'The sign name was doing no work for a parent, so the module now carries the plain meaning instead of the term.' },
  E06: { note: 'move it higher up, between two and three', move: 2 },
  E07: { note: 'covered in the new ones, so can be replaced', replacedBy: 'N06 Web' },
  E08: { note: 'take it out. "how she meets anything new, holds it" does not say anything',
    removed: true },
  E09: { note: 'do not title the whole thing. keep the widget titles, drop the filler', split: 3 },
  E10: { note: 'weird execution. can we not turn this into a matrix?',
    title: 'Where her energy goes',
    why: 'Her thirteen placements sorted two ways at once: out in the world or at home, and on her own or with other people. The fullest box is where most of her life happens.',
    html: (h) => {
      let out = h.replace('<div class="wlabel">Where the energy goes</div>', '<div class="wlabel">Where her energy goes</div>');
      for (const [k, n] of Object.entries(HEMI)) {
        const [a, b] = k.split('|');
        out = out.replace(`<div class="hemi-title">${a}</div><div class="hemi-sub">${b}</div>`,
          `<div class="hemi-title">${a}</div><div class="hemi-sub">${b}</div><div class="hemi-n">${n}</div>`);
      }
      return out;
    } },
  E13: { note: '"three things she does by habit" does not match it. careful or bold is not something you do',
    title: 'Three traits, and where she sits', 
    why: 'Each line is a pair of opposites. The dot is where she actually sits between them, not a score out of ten.' },
  E14: { note: 'needs a better label. use this number font everywhere',
    title: 'How much she wants to be noticed',
    why: 'How much of her chart sits in the parts of the sky that face outward. A high number means being seen matters to her.' },
  E15: { note: 'caps belong on a short label, not a long line' },
  E16: { note: 'same as E15' },
  E18: { note: 'keep for now, might delete later' },
  E19: { note: 'title unclear, bundle E19 to E21', bundle: true,
    why: 'Three areas of life, each with a sign on its doorway. The sign says how she tends to approach that area.' },
  E20: { note: 'title unclear', bundle: true },
  E21: { note: 'title unclear', bundle: true },
  E22: { note: 'clarify this section', title: 'Nothing turned inward',
    why: 'Some planets appear to travel backwards from Earth at a birth. That is read as a part of her that works inwardly before it shows. None of hers do, so what she thinks and wants tends to show on the outside.' },
  E23: { note: 'label it stellium, clarify it, the dark background is great',
    html: (h) => h.replace('<div class="stellium-label">A cluster</div>', '<div class="stellium-label">Stellium</div>'),
    why: 'A stellium is three or more planets packed into one sign. It is the single loudest thing in a chart, and hers holds six placements, five of them planets.' },
  E24: { note: 'could be accompanied by a question mark svg',
    html: (h) => h.replace('<div class="letter-label">A question to sit with</div>',
      `<div class="letter-label with-icon">${questionMark}A question to sit with</div>`) },
};

const keys = Object.keys(WIDGETS);
const drawn = (h) => (h.match(/<svg/g) || []).length > 0 || /class="[^"]*(bar-|spec-|gauge|hemi-)/.test(h);
const chars = (h) => h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().length;

// Build the list, then honour the one move his notes asked for.
let items = keys.map((k, i) => {
  const id = `E${String(i + 1).padStart(2, '0')}`;
  return { id, key: k, ...WIDGETS[k], patch: PATCH[id] || {} };
});
const moved = items.filter((it) => it.patch.move !== undefined);
for (const m of moved) {
  items = items.filter((it) => it !== m);
  items.splice(m.patch.move, 0, m);
}

// The three spectrum lines in E09, shown as three cards. The sample's markup is
// left whole and the other two lines are hidden with CSS, so his copy is not cut
// up by a regex.
const poleNames = [...(WIDGETS['card-three-lines'].html.matchAll(/<span class="pole[^"]*">([^<]+)<\/span>/g))].map((m) => m[1]);
const trio = [0, 1, 2].map((n) => ({ a: poleNames[n * 2], b: poleNames[n * 2 + 1] }));

function card(it) {
  const p = it.patch;
  const chip = (id) => `<span class="id">${id}</span>`;

  // Taken out of the reading. The id stays so earlier notes still resolve.
  if (p.removed) {
    return `<article class="card gone" id="${it.id}">
  <div class="tag">${chip(it.id)}<span class="form">${it.key}</span><span class="badge out">taken out</span></div>
  <h2>${it.label}</h2>
  <p class="note"><em>YOU SAID</em>${p.note}</p></article>`;
  }

  // Three spectrums, three widgets, each named by its own two ends. No group
  // title: he has asked three times not to call the set "Three lines".
  if (p.split) {
    return trio.map((t, n) => `<article class="card" id="${it.id}-${n + 1}">
  <div class="tag">${chip(`${it.id}.${n + 1}`)}<span class="form">${it.key}</span><span class="badge has">drawn</span></div>
  <h2>${t.a} or ${t.b}</h2>
  <div class="wc-live live only-${n + 1}">${reskinHtml(it.html).replace('<div class="wlabel">Three lines</div>', '')}</div>
  ${n === 0 ? `<p class="note"><em>YOU SAID</em>${p.note}</p>` : ''}</article>`).join('\n');
  }

  const title = p.title || it.label;
  const badge = p.replacedBy ? `replace with ${p.replacedBy}` : (drawn(it.html) ? 'drawn' : `text, ${chars(it.html)}ch`);
  return `<article class="${p.replacedBy ? 'card out' : 'card'}" id="${it.id}">
  <div class="tag">${chip(it.id)}<span class="form">${it.key}</span><span class="badge ${p.replacedBy ? 'out' : drawn(it.html) ? 'has' : 'txt'}">${badge}</span></div>
  <h2>${title}${p.title ? ` <em>DRAFT &middot; ${p.inModule ? 'IN MODULE' : 'CARD ONLY'}</em>` : ''}</h2>
  <div class="wc-live live">${reskinHtml(p.html ? p.html(it.html) : it.html)}</div>
  ${p.note ? `<p class="note"><em>YOU SAID</em>${p.note}</p>` : ''}
  ${p.why ? `<p class="why"><em>DRAFT</em>${p.why}</p>` : ''}
  ${p.alt ? `<p class="why"><em>ALT FORM</em>${p.alt}</p>` : ''}
  ${p.flag ? `<p class="flag"><em>NEEDS YOU</em>${p.flag}</p>` : ''}</article>`;
}


export const PHOTO_CSS = `
/* ── Photographs ──────────────────────────────────────────────────────────
   the-almanac.showit.site layers PNGs from Showit's CDN over its photos:
   instaxpolaroid-frame.png, squarecard.png, tape-1/4/7.png, plus paper.png and
   grain.png as texture. Those are their assets on their servers, so none of
   them is used here. The geometry is taken from their own layout numbers and
   rebuilt in CSS: the polaroid frame is 432 by 653 with the photo at 361 by 456
   inset 36 across and 71 down, which is 8.3% of the frame width at the sides,
   16.4% on top and 29.2% underneath. The shadow is their value. */
.ph{display:block;position:relative;margin:0;background:#F7F3E9;line-height:0}
.ph img{display:block;width:100%;height:auto}
.ph-matte{padding:5.5%}
.ph-polaroid{padding:16.4% 8.3% 29.2%}
.ph-shadow{box-shadow:-1px 1px 3px rgba(22,21,20,.5),0 10px 26px rgba(22,21,20,.2)}
.ph-tilt{transform:rotate(-1.6deg)}
/* their tape is a 4:1 PNG with torn ends, so the ends are cut rather than drawn */
.ph-tape{overflow:visible}
.ph-tape::before{content:"";position:absolute;top:-13px;left:50%;width:46%;aspect-ratio:4/1;
  transform:translateX(-50%) rotate(-2.4deg);
  background:linear-gradient(176deg,rgba(214,201,170,.86),rgba(233,223,199,.74));
  box-shadow:0 1px 2px rgba(22,21,20,.16);
  clip-path:polygon(0 14%,4% 0,8% 16%,92% 5%,96% 0,100% 18%,96% 100%,92% 85%,8% 97%,4% 100%,0 84%)}
.ph-grain::after{content:"";position:absolute;inset:0;pointer-events:none;opacity:.5;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.22'/%3E%3C/svg%3E")}
.why em.built,.why em{vertical-align:1px}
/* ── Their furniture, used as published ──────────────────────────────────
   instaxpolaroid-frame.png is an overlay, not a border: its alpha channel has a
   real window at inset L40 R38 T73 B132 on 439 by 665, so the photo sits behind
   it and shows through. squarecard.png and paper.png have no window, so they
   back a photo instead of covering one.
   These selectors carry an extra class on purpose. ".ph img" is one class plus
   one element, which outranks a bare class, so a plain ".ph-tape-img" loses to
   it and the tape renders full width. */
.ph-instax{background:none;aspect-ratio:439/665}
/* The frame PNG has rounded corners and its own shadow baked in. A CSS
   box-shadow follows the element's rectangular border box, so it paints a hard
   rectangle behind the rounded frame and the whole thing reads as pasted on.
   The asset is left to carry its own shadow. */
.ph-instax.ph-shadow{box-shadow:none}
.ph-instax img.ph-photo{position:absolute;left:9.11%;top:10.98%;width:82.23%;height:69.17%;object-fit:cover}
.ph img.ph-over{position:absolute;inset:0;width:100%;height:100%}
.ph-card,.ph-paper{background-repeat:no-repeat;background-size:100% 100%;background-color:transparent}
.ph-card{background-image:url("/assets/img/frames/squarecard.png");padding:7.5% 7.5% 11%}
.ph-paper{background-image:url("/assets/img/frames/paper.png");padding:9% 8% 16%}
.ph-card img.ph-photo,.ph-paper img.ph-photo{width:100%;height:auto}
.ph img.ph-tape-img{position:absolute;height:auto}
.ph img.ph-tape-img.t1{top:-4%;left:27%;width:46%;transform:rotate(-2.5deg)}
.ph img.ph-tape-img.t4{top:-4%;left:50%;width:38%;transform:translateX(-50%) rotate(-2deg)}
.ph img.ph-tape-img.t7{top:-4%;left:-8%;width:32%;transform:rotate(-24deg)}
`;

// The reading's own running order, with the drawn forms placed in the section
// their data belongs to. Ids never move, so a note about N04 or E13 still lands
// on the same widget wherever it sits in the flow.
export const ORDER = [
  ['Opening', ['E01', 'E02', 'E06', 'E03', 'E04', 'E05']],
  ['01 The chart at a glance', ['N06', 'E07', 'N03', 'N10', 'N08', 'N04', 'N07', 'N01', 'N05', 'E08', 'E09', 'E10']],
  ['The letter', ['E11', 'E12']],
  ['02 Holding on and being seen', ['E13', 'E14', 'E15', 'E16', 'E17', 'E18', 'E19', 'E20', 'E21']],
  ['03 Turned inward', ['E22', 'E23']],
  ['Closing', ['E24']],
  ['Structure', ['E25', 'E26', 'E29', 'E30']],
  ['04 Keep going', ['E27', 'E28']],
];

const formCard = (f) => `<article class="card" id="${f.id}">
  <div class="tag"><span class="id">${f.id}</span><span class="form">${f.form}</span><span class="badge has">drawn</span></div>
  <h2>${f.title}</h2>
  ${f.art}
  <p class="said">${f.said}</p>
  <p class="why"><em>DRAFT</em>${f.why}</p></article>`;

// The sample's blocks with Richard's patches and the font remap applied, keyed
// by id. The real-reading preview assembles from this, so a decision made here
// cannot drift out of sync with what he signed off on the review page.
export function patchedBlocks() {
  const out = new Map();
  for (const it of items) {
    const p = it.patch;
    if (p.removed || p.replacedBy) continue;
    out.set(it.id, { id: it.id, key: it.key, label: p.title || it.label, section: it.section,
                     split: !!p.split, html: reskinHtml(p.html ? p.html(it.html) : it.html) });
  }
  return out;
}
export const TRIO = trio;

const byId = new Map();
for (const f of FORMS) byId.set(f.id, formCard(f));
for (const it of items) byId.set(it.id, card(it));

const placed = new Set();
let body = ORDER.map(([sec, ids]) => {
  const inner = ids.map((id) => {
    placed.add(id);
    const html = byId.get(id);
    if (!html) throw new Error(`ORDER names ${id}, which does not exist`);
    // The cusps keep the bundle Richard asked for, inside the flow.
    return html;
  }).join('\n');
  return `<h3 class="sec">${sec}</h3>\n${inner}`;
}).join('\n');

// Nothing may fall out of the running order without being noticed.
const missing = [...byId.keys()].filter((id) => !placed.has(id));
if (missing.length) throw new Error(`not placed in ORDER: ${missing.join(', ')}`);

// Their own furniture, downloaded on Richard's instruction, 2026-10-01.
// instaxpolaroid-frame.png is an overlay: 439 by 665 with a transparent window
// at inset L40 R38 T73 B132, measured off the alpha channel, which is the same
// geometry as their layout numbers. squarecard.png has no window, so it backs a
// photo rather than covering one. grain.png is not shipped: it is 9.7 MB.
const FR = '/assets/img/frames';
const photo = (n) => `<img class="ph-photo" src="/assets/compass/nature-${n}.jpg" alt="" loading="lazy">`;

const frames = [
  ['Matte', 'css', `<figure class="ph ph-matte">${photo(1)}</figure>`, 'CSS. An even white border.'],
  ['Polaroid', 'css', `<figure class="ph ph-polaroid">${photo(2)}</figure>`, 'CSS. Their proportions, no asset.'],
  ['Matte and tape', 'css', `<figure class="ph ph-matte ph-tape">${photo(3)}</figure>`, 'CSS. Drawn strip.'],
  ['Polaroid, lifted', 'css', `<figure class="ph ph-polaroid ph-shadow ph-tilt">${photo(4)}</figure>`, 'CSS. Their shadow value, plus a tilt.'],
  ['Instax frame', 'asset', `<figure class="ph ph-instax">${photo(1)}<img class="ph-over" src="${FR}/instaxpolaroid-frame.png" alt=""></figure>`, 'instaxpolaroid-frame.png over the photo.'],
  ['Instax, lifted', 'asset', `<figure class="ph ph-instax ph-shadow ph-tilt">${photo(2)}<img class="ph-over" src="${FR}/instaxpolaroid-frame.png" alt=""></figure>`, 'Same, with shadow and tilt.'],
  ['Instax and tape', 'asset', `<figure class="ph ph-instax ph-shadow">${photo(3)}<img class="ph-over" src="${FR}/instaxpolaroid-frame.png" alt=""><img class="ph-tape-img t1" src="${FR}/tape-1.png" alt=""></figure>`, 'tape-1.png across the top edge.'],
  ['Square card', 'asset', `<figure class="ph ph-card">${photo(4)}<img class="ph-tape-img t4" src="${FR}/tape-4.png" alt=""></figure>`, 'squarecard.png backing, tape-4.png corner.'],
  ['Torn paper', 'asset', `<figure class="ph ph-paper">${photo(1)}<img class="ph-tape-img t7" src="${FR}/tape-7.png" alt=""></figure>`, 'paper.png backing, tape-7.png corner.'],
].map(([name, kind, markup, note], i) => `<article class="card" id="P${String(i + 1).padStart(2, '0')}">
  <div class="tag"><span class="id">P${String(i + 1).padStart(2, '0')}</span><span class="form">${name}</span><span class="badge ${kind === 'asset' ? 'has' : 'txt'}">${kind === 'asset' ? 'their asset' : 'css only'}</span></div>
  ${markup}
  <p class="why"><em class="built">BUILT</em>${note}</p></article>`).join('\n');

body += `\n<h3 class="sec">Photographs</h3>\n${frames}`;

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Every widget, old and new</title>
<script src="/assets/js/pixel.js?v=${PIXEL}"></script>
<style>
@font-face{font-family:"Morning Memories";src:url("/assets/fonts/morning-memories-400.woff2") format("woff2");font-weight:400;font-display:swap}
@font-face{font-family:"Special Elite";src:url("/assets/fonts/special-elite-400.woff2") format("woff2");font-weight:400;font-display:swap}
${TOKENS}
*{box-sizing:border-box}
html,body{overflow-x:clip}
body{margin:0;background:var(--cream);color:var(--green);font:400 15px/1.6 "Special Elite","Courier New",monospace}
.wrap{max-width:430px;margin:0 auto;padding:0 18px 90px}
header{padding:38px 0 4px}
h1{margin:0;font:400 36px/1.02 "Morning Memories",Georgia,serif}
header p{margin:10px 0 0;font-size:13px;opacity:.76}
.group{margin:32px 0 0;padding-top:15px;border-top:2px solid var(--green)}
.group b{display:block;font:400 24px/1.1 "Morning Memories",Georgia,serif}
.group span{display:block;margin-top:4px;font-size:12px;opacity:.68}
.card{margin:14px 0 0;border:1px solid var(--tan);border-radius:12px;background:rgba(255,255,255,.26);padding:14px 13px 13px}
.card.out{opacity:.5;border-style:dashed}
.card.gone{opacity:.45;border-style:dashed}
.card.gone h2{text-decoration:line-through}
.tag{display:flex;align-items:center;gap:7px;flex-wrap:wrap;margin-bottom:9px;font-size:10.5px}
.id{font:400 15px/1 "Special Elite",monospace;background:var(--green);color:#F3EEE2;padding:6px 9px;border-radius:4px;letter-spacing:.08em}
.form{font-size:12px;letter-spacing:.12em;text-transform:uppercase;opacity:.72}
.badge{margin-left:auto;padding:3px 7px;border-radius:99px;font-size:9px;letter-spacing:.06em;text-transform:uppercase}
.badge.has{background:var(--orange);color:#F3EEE2}
.badge.txt{border:1px solid var(--tan);opacity:.7}
.badge.out{background:var(--green);color:#F3EEE2}
h2{margin:0 0 12px;font:400 22px/1.14 "Morning Memories",Georgia,serif}
h2 em,.note em,.why em{font-style:normal;background:var(--orange);color:#F3EEE2;padding:1px 5px;border-radius:3px;font:400 9px/1.5 "Special Elite",monospace;letter-spacing:.08em;vertical-align:2px;margin-right:5px}
.note em{background:var(--green)}
.why em.built{background:#5B7E86}
.flag{margin:9px 0 0;padding:9px 10px;border-radius:4px;background:rgba(192,98,58,.14);border:1px solid var(--orange);font-size:11.5px}
.flag em{font-style:normal;background:#8B2E1E;color:#F3EEE2;padding:1px 5px;border-radius:3px;font:400 9px/1.5 "Special Elite",monospace;letter-spacing:.08em;margin-right:5px}
.note,.why{margin:9px 0 0;font-size:11.5px;opacity:.76}
.note{padding-top:9px;border-top:1px solid var(--tan-soft)}
.said{margin:12px 0 0;padding-top:10px;border-top:1px solid var(--tan-soft);font-size:12.5px}
.bundle{margin:14px 0 0;padding:12px 10px;border:1px solid var(--green);border-radius:6px}
.bundlehd{font:400 20px/1.15 "Morning Memories",Georgia,serif}
.bundlehd span{display:block;font:400 10px/1.6 "Special Elite",monospace;letter-spacing:.1em;text-transform:uppercase;opacity:.55}
.bundle .card{background:rgba(255,255,255,.4)}
.sub{margin:10px 0 0;padding-top:9px;border-top:1px dashed var(--tan)}
.subhd b{font:400 17px/1.2 "Morning Memories",Georgia,serif}
.subhd span{float:right;font-size:10px;opacity:.5}
/* new-form drawing styles */
.art{display:block;width:100%;max-width:210px;margin:0 auto;height:auto}
.art.wide{max-width:100%}
text{font-family:"Special Elite","Courier New",monospace;fill:var(--green)}
.num{font-family:"Special Elite","Courier New",monospace;text-anchor:middle;font-size:17px}
.num.big{font-size:30px}.num.sm{font-size:13px}.num.tag{font-size:11px;fill:#F3EEE2}
.num.s{text-anchor:start}.num.e{text-anchor:end}
.tiny{font-size:8.5px;text-anchor:middle;letter-spacing:.07em;opacity:.8}
.tiny.s{text-anchor:start}.tiny.e{text-anchor:end}
.key{list-style:none;margin:12px 0 0;padding:0;font-size:11.5px}
.key li{display:flex;gap:7px;align-items:baseline;padding:2.5px 0;opacity:.85}
.key i{flex:0 0 auto;width:9px;height:9px;border-radius:2px;margin-top:4px}
.key i.hollow{border:1.5px dashed var(--green);background:none;border-radius:50%}
.key b{font-weight:400;text-transform:uppercase;letter-spacing:.06em;font-size:10px}
${PHOTO_CSS}
/* the sample's own CSS, families remapped */
${RESKIN}
${ROUND}
.live{overflow-x:auto}
.wc-live .hero,.wc-live .letter,.wc-live section{background:none}
/* Every numeric read-out in the sample's blocks, in the body font, not the display one */
.wc-live .bar-count,.wc-live .gauge-num,.wc-live .cusp-num,.wc-live .product-price,
.wc-live .hemi-n,.wc-live .sh-num{font-family:"Special Elite","Courier New",monospace}
/* E15 and E16: caps on the short label only */
.wc-live .badge-placement{text-transform:none;letter-spacing:0}
/* E01: the compass sits above the name */
.wc-live .rose{display:block;width:52px;height:52px;margin:0 auto 6px}
/* E02: no circles, a real sign glyph instead */
.wc-live .big3.flat{text-align:center}
.wc-live .big3-glyph{font-family:"Wheel Glyphs";font-size:30px;line-height:1;margin:2px 0 4px;color:var(--orange)}
.wc-live .big3.flat .big3-word{opacity:.6}
/* E10: the matrix carries its counts */
.wc-live .hemi-n{font-family:"Special Elite","Courier New",monospace;font-size:28px;line-height:1;margin-top:6px}
/* E24: the question mark */
.wc-live .letter-label.with-icon{display:flex;align-items:center;gap:8px}
.wc-live .qmark{width:26px;height:26px;flex:0 0 auto}
/* E09 shown as three, without cutting the markup up */
.only-1 .spec:not(:nth-of-type(1)),.only-2 .spec:not(:nth-of-type(2)),.only-3 .spec:not(:nth-of-type(3)){display:none}
.only-1 .wlabel,.only-2 .wlabel,.only-3 .wlabel{display:none}
</style>
</head>
<body>
<noscript><img hidden height="1" width="1" src="https://www.facebook.com/tr?id=${DATASET}&amp;ev=PageView&amp;noscript=1" alt=""></noscript>
<div class="wrap">
<header><h1>Every widget, old and new</h1>
<p>Your review applied. ${FORMS.length} drawn forms and ${items.length} blocks. A green YOU SAID chip is your note. An orange DRAFT chip is my words. IN MODULE means the title is written into the widget itself. CARD ONLY means it is just a label on this page. Everything runs in the order the reading renders it.</p></header>

${body}
</div>
</body>
</html>
`;

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const dir = join(ROOT, 'readings/compass/widget-all');
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
  console.log(`wrote /readings/compass/widget-all/  (${FORMS.length} new + ${items.length} existing, ${Object.keys(PATCH).length} patched)`);
}
