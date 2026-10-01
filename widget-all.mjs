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
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PIXEL, DATASET } from './variants.mjs';
import { FORMS } from './widget-forms.mjs';
import { WIDGETS, WIDGET_CSS } from './src/lib/compass-widgets.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));

// The sample asks for Montserrat and Libre Baskerville. Remap to the landing pair.
// Morning Memories ships one weight, so 900 becomes 400 rather than a faked bold.
// His note on E15 and E16: keep the caps on a short label, not on a long line, so
// badge-placement loses its uppercase.
const RESKIN = WIDGET_CSS
  .replace(/font-family:Montserrat/g, 'font-family:"Morning Memories",Georgia,serif')
  .replace(/font-family:"Libre Baskerville"/g, 'font-family:"Special Elite","Courier New",monospace')
  .replace(/font-family:"IBM Plex Mono"/g, 'font-family:"Special Elite","Courier New",monospace')
  .replace(/font-weight:900/g, 'font-weight:400');

const reskinHtml = (h) => h
  .replace(/font-family="'IBM Plex Mono'"/g, 'font-family="Morning Memories"')
  .replace(/font-family="Montserrat"/g, 'font-family="Morning Memories"')
  .replace(/(font-family="Morning Memories"[^>]*?)font-weight="900"/g, '$1font-weight="400"');

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
  E04: { note: 'UNCLEAR, clarify', title: 'What she is growing towards',
    why: 'A point in the chart that marks unfamiliar ground, the direction she grows in rather than the ground she starts on. Hers points at Cancer: caring for people close to her.' },
  E06: { note: 'move it higher up, between two and three', move: 2 },
  E07: { note: 'covered in the new ones, so can be replaced', replacedBy: 'N06 Web' },
  E08: { note: 'unclear what a cardinal pace of 38% means. clarify or title it better',
    title: 'How she meets anything new',
    why: 'Three habits: starting things, holding them steady, changing direction. The percentages are how much of her chart sits in each.',
    html: (h) => h.replace('<div class="wlabel">Pace</div>', '<div class="wlabel">How she meets anything new</div>')
      .replace('<span class="bar-name">cardinal</span>', '<span class="bar-name">starts it</span>')
      .replace('<span class="bar-name">fixed</span>', '<span class="bar-name">holds it</span>')
      .replace('<span class="bar-name">mutable</span>', '<span class="bar-name">changes it</span>'),
    alt: 'N02 Hundred squares, same numbers',
    flag: 'The bar names now read in plain words, but your own footer below still says "Leading: cardinal" and the paragraph explains "Cardinal is the leading note". I did not touch your words. Tell me whether the prose follows the labels, or whether the labels go back.' },
  E09: { note: 'great, but the title is ass. turn it into three separate widgets', split: 3 },
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
  E13: { note: 'needs a way better title. strong module', title: 'Three things she does by habit',
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
  const title = p.title || it.label;
  const badge = p.replacedBy ? `replace with ${p.replacedBy}` : (drawn(it.html) ? 'drawn' : `text, ${chars(it.html)}ch`);
  const cls = p.replacedBy ? 'card out' : 'card';
  const body = p.split
    ? trio.map((t, n) => `<div class="sub"><div class="subhd"><b>${t.a} or ${t.b}</b><span>${it.id}.${n + 1}</span></div>
        <div class="wc-live live only-${n + 1}">${reskinHtml(it.html)}</div></div>`).join('')
    : `<div class="wc-live live">${reskinHtml(p.html ? p.html(it.html) : it.html)}</div>`;
  return `<article class="${cls}" id="${it.id}">
  <div class="tag"><span class="id">${it.id}</span><span class="form">${it.key}</span><span class="badge ${p.replacedBy ? 'out' : drawn(it.html) ? 'has' : 'txt'}">${badge}</span></div>
  <h2>${title}${p.title ? ' <em>DRAFT</em>' : ''}</h2>
  ${body}
  ${p.note ? `<p class="note"><em>YOU SAID</em>${p.note}</p>` : ''}
  ${p.why ? `<p class="why"><em>DRAFT</em>${p.why}</p>` : ''}
  ${p.alt ? `<p class="why"><em>ALT FORM</em>${p.alt}</p>` : ''}
  ${p.flag ? `<p class="flag"><em>NEEDS YOU</em>${p.flag}</p>` : ''}</article>`;
}

const newCards = FORMS.map((f) => `<article class="card" id="${f.id}">
  <div class="tag"><span class="id">${f.id}</span><span class="form">${f.form}</span><span class="badge has">drawn</span></div>
  <h2>${f.title}</h2>
  ${f.art}
  <p class="said">${f.said}</p>
  <p class="why"><em>DRAFT</em>${f.why}</p></article>`).join('\n');

let oldCards = '', bundleOpen = false;
for (const it of items) {
  if (it.patch.bundle && !bundleOpen) { oldCards += `<div class="bundle"><div class="bundlehd">Three doorways<span>E19 to E21, bundled as you asked</span></div>`; bundleOpen = true; }
  oldCards += card(it) + '\n';
  if (bundleOpen && !items[items.indexOf(it) + 1]?.patch.bundle) { oldCards += '</div>\n'; bundleOpen = false; }
}

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
:root{--cream:#DFD7C3;--green:#495543;--tan:#CDB494;--orange:#C0623A;--tan-soft:rgba(205,180,148,.45)}
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
.card{margin:14px 0 0;border:1px solid var(--tan);border-radius:5px;background:rgba(255,255,255,.26);padding:14px 13px 13px}
.card.out{opacity:.5;border-style:dashed}
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
.num{font-family:"Morning Memories",Georgia,serif;text-anchor:middle;font-size:17px}
.num.big{font-size:30px}.num.sm{font-size:13px}.num.tag{font-size:11px;fill:#F3EEE2}
.num.s{text-anchor:start}.num.e{text-anchor:end}
.tiny{font-size:8.5px;text-anchor:middle;letter-spacing:.07em;opacity:.8}
.tiny.s{text-anchor:start}.tiny.e{text-anchor:end}
.key{list-style:none;margin:12px 0 0;padding:0;font-size:11.5px}
.key li{display:flex;gap:7px;align-items:baseline;padding:2.5px 0;opacity:.85}
.key i{flex:0 0 auto;width:9px;height:9px;border-radius:2px;margin-top:4px}
.key i.hollow{border:1.5px dashed var(--green);background:none;border-radius:50%}
.key b{font-weight:400;text-transform:uppercase;letter-spacing:.06em;font-size:10px}
/* the sample's own CSS, families remapped */
${RESKIN}
.live{overflow-x:auto}
.wc-live .hero,.wc-live .letter,.wc-live section{background:none}
/* E15 and E16: caps on the short label only */
.wc-live .badge-placement{text-transform:none;letter-spacing:0}
/* E01: the compass sits above the name */
.wc-live .rose{display:block;width:52px;height:52px;margin:0 auto 6px}
/* E02: no circles, a real sign glyph instead */
.wc-live .big3.flat{text-align:center}
.wc-live .big3-glyph{font-family:"Wheel Glyphs";font-size:30px;line-height:1;margin:2px 0 4px;color:var(--orange)}
.wc-live .big3.flat .big3-word{opacity:.6}
/* E10: the matrix carries its counts */
.wc-live .hemi-n{font-family:"Morning Memories",Georgia,serif;font-size:30px;line-height:1;margin-top:6px}
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
<p>Your review applied. ${FORMS.length} drawn forms and ${items.length} blocks. A green YOU SAID chip is your note. An orange DRAFT chip is my words, not yours, and is there to be overwritten.</p></header>

<div class="group"><b>The drawn forms</b><span>N01 to N${String(FORMS.length).padStart(2, '0')}. Was twelve, now ten. Weighted words and the single bar are gone.</span></div>
${newCards}

<div class="group"><b>In the reading today</b><span>E01 to E${String(items.length).padStart(2, '0')}. The wheel moved up to third, as you asked.</span></div>
${oldCards}
</div>
</body>
</html>
`;

const dir = join(ROOT, 'readings/compass/widget-all');
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, 'index.html'), html);
console.log(`wrote /readings/compass/widget-all/  (${FORMS.length} new + ${items.length} existing, ${Object.keys(PATCH).length} patched)`);
