#!/usr/bin/env node
// funnel-variants.mjs — the full Compass page, built twice: one design language each, one module
// order for both.
//
// Richard, 2026-09-24: "the module order comes from the funnel references, not from the design
// skill." The references are the six-brand cold-traffic teardown in
// clients/Cato/cosmic-landing/DECISIONS.md (IM8, Grüns, Marsmen, MUD\WTR, Ritual, AG1, evidence
// dated 2026-09-16). D29 rebuilt that page on the Grüns first-order module order and measured the
// result; D12 puts proof above the headline and a sticky CTA from pixel one; D13 keeps the CTA
// count low; D11 and D29 say an unfillable slot is named and replaced, never faked.
//
// The spine, as built and measured there:
//   announce · sticky · hero (proof above the H1) · first proof at 6% · stats · reasons ·
//   outcomes · offer at ~31% with how-it-works folded in · CTA banner · review wall · compare ·
//   authority · CTA banner · FAQ · closing · footer
//
// Four slots have nothing real behind them here, and are handled the way D29 handled its four
// rather than invented:
//   trusted logos      dropped. We have none, and borrowed authority was rejected there too.
//   review wall        replaced by the two whole sample pages: the live product, labelled as the
//                      product, never as social proof.
//   authority          replaced by the refusal block. No founder and no credentials is a brand
//                      bible rule, so what we refuse to write is the authority we actually have.
//   proof above the H1 replaced by the free whole sample. It is an offer, not proof, and the line
//                      says so rather than dressing it as evidence.
//
//   node funnel-variants.mjs   writes readings/compass/full/<hue|hyperframes-creative>/index.html

import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { audit, report } from './src/lib/slop.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const PIXEL_HASH = createHash('md5').update(readFileSync(join(ROOT, 'assets/js/pixel.js'))).digest('hex').slice(0, 8);
const DATASET = '1622703732974632';

// One set of words, rendered twice. Only the design language differs between the two pages.
const C = {
  announce: 'A whole Compass is free to read before you buy one.',
  sticky: { label: 'Get Compass', price: '$27' },
  hero: {
    proof: 'Read a whole one first. It is free, and it is the real thing, not an extract.',
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
  },
  sample: {
    eyebrow: 'A whole one, free',
    h2: 'Read one before you buy one.',
    body: 'Two complete Compass pages, start to finish, for children who do not exist. One for a boy and one for a girl, so you can read the page for whichever you have at home. Nothing is held back and nothing is blurred.',
    links: [
      { label: 'Read the one written for a girl', href: '/readings/compass/sample/nora/' },
      { label: 'Read the one written for a boy', href: '/readings/compass/sample/finn/' },
    ],
  },
  stats: {
    h2: 'What one page holds.',
    items: [
      { n: '24', label: 'sections', line: 'Every one of them about your child, in the order you scroll.' },
      { n: '22', label: 'carry words', line: 'The other two are the wheel and the chart at a glance.' },
      { n: '3', label: 'facts in', line: 'The date, the time and the place. Nothing else is asked of you.' },
    ],
  },
  reasons: {
    eyebrow: 'What is on it',
    h2: 'Five things the page tells you about the week you are in.',
    items: [
      { t: 'What settles them', line: 'Read from the Moon, for the end of a day that went past them. What brings them back, and what makes it worse, so the next bad evening has a name and a way back.' },
      { t: 'How they take things in', line: 'Whether an explanation lands, or a demonstration does, or neither until later. This is the one that changes what you say at the door on a school morning.' },
      { t: 'Where their energy goes', line: 'Out into the world or kept at home. A quiet day stops reading as a bad day once you know which one you have.' },
      { t: 'What they are like under pressure', line: 'The version of your child you meet at the end of a long day, described plainly, so you recognise it instead of taking it personally.' },
      { t: 'One question to sit with', line: 'For you, not for them. A question, never an instruction, so the page ends in your hands.' },
    ],
  },
  outcomes: {
    eyebrow: 'What you walk away with',
    h2: 'The guessing stops being the whole job.',
    items: [
      'A name for the thing that keeps happening, which is most of the relief',
      'A reason to stop trying the approach that has never once worked',
      'Something to hand the other adult in the house, so you are arguing about less',
      'One page you will read again in a year and find true',
    ],
  },
  offer: {
    eyebrow: 'The offer',
    h2: 'Compass',
    price: '$27',
    tagline: 'One child, one page, yours to keep.',
    how: [
      { n: '1', t: 'Give three facts', line: 'The birth date, the time and the place. The time is required, and the birth certificate usually has it.' },
      { n: '2', t: 'The page is written', line: 'It is ready in minutes, on your phone, while you are still sitting there.' },
      { n: '3', t: 'You keep it', line: 'In your portal, to read again, or printed for the fridge.' },
    ],
    includes: [
      'The full page for one child, on your phone or printed',
      'A page of questions, so you can keep reading it with Claude or ChatGPT',
      'Your child’s name, date and place of birth kept on our own server',
      'Two children? Each child gets their own page',
    ],
    cta: 'Get Compass',
    note: 'A mistake of ours is redone or refunded within 30 days. A wrong birth entry is rewritten once at no cost.',
  },
  banner1: { h: 'You have read five of them. The page has twenty-four.', sub: 'All of it about your child, in plain words.', cta: 'Get Compass' },
  banner2: { h: 'Six months of guessing, or twenty-seven dollars.', sub: 'Read a whole one free first, then decide.', cta: 'Get Compass' },
  product: {
    eyebrow: 'The product itself',
    h2: 'This is the page, not a picture of it.',
    body: 'We have no testimonials yet, so nothing here is dressed as one. What stands in for them is the product: two whole pages you can read, and the chart wheel below, drawn from a real birth moment for a child who does not exist.',
  },
  compare: {
    eyebrow: 'Compared',
    h2: 'Next to a horoscope, and next to the full reading.',
    cols: ['A horoscope app', 'Compass', 'North Star'],
    rows: [
      ['About', 'Everyone born in a month', 'Your child, from their date, time and place', 'Your child in depth, with your own answers read in'],
      ['Length', 'A line a day', 'One page you scroll', 'Nine to fifteen pages'],
      ['Needs from you', 'A sign', 'Date, time and place', 'Date, time, place and three answers'],
      ['When it arrives', 'Now', 'Minutes after the details are in', 'Within 24 hours'],
      ['Price', 'Free', '$27', '$199'],
    ],
  },
  refuse: {
    eyebrow: 'What Compass will not do',
    h2: 'We will not label your child.',
    items: [
      { t: 'Nothing here is clinical', line: 'We are not doctors, and a page from us carries no diagnosis and no developmental assessment. If something about your child worries you, talk to someone who has met them.' },
      { t: 'No word to carry', line: 'We hand you no type, no score and no percentile. A label ends the conversation about a child, and we would rather you kept asking.' },
      { t: 'We leave the road ahead alone', line: 'We write about the ground your child is standing on now. You will not read which year will be hard, which subject they will shine at, or who they turn into.' },
      { t: 'No plan to follow', line: 'There is no routine to start on Monday and no list of things to change by Tuesday. You already know your child better than we do.' },
    ],
  },
  faq: {
    eyebrow: 'Questions',
    h2: 'Before you decide.',
    items: [
      ['I am not sure I believe in astrology.', 'Read a sample first and decide whether it describes a real child. The only test that counts happens at your kitchen table. If it reads like a horoscope, you have lost nothing.'],
      ['They are three. Is it too early?', 'It is not too early. How your child meets the day is already true at three and still true at eleven.'],
      ['I do not have their exact birth time.', 'Compass needs it. The birth certificate usually has it, and the hospital will have it on file. Without the time we would be guessing, and guessing is what you came here to stop.'],
      ['What if it does not sound like them?', 'Tell us and we refund it. A page that does not sound like your child is no use to you and none to us.'],
      ['Will it say something I do not want to read?', 'It may name something you already suspected. You will not read that your child is difficult, or behind, or a type.'],
      ['What happens to their details?', 'Your child’s name, date of birth and place of birth are stored on our own server and never leave it. You can delete a child from the portal at any time.'],
    ],
  },
  closing: { h: 'The same night, one layer deeper.', sub: 'You already know this child. We read the same one from the night they arrived.', cta: 'Get Compass' },
};

const FONTS = `
@font-face{font-family:"Montserrat";src:url("/assets/fonts/montserrat-900.woff2") format("woff2");font-weight:900;font-display:swap}
@font-face{font-family:"Libre Baskerville";src:url("/assets/fonts/libre-baskerville-400.woff2") format("woff2");font-weight:400;font-display:swap}
@font-face{font-family:"IBM Plex Mono";src:url("/assets/fonts/ibm-plex-mono-300.woff2") format("woff2");font-weight:300;font-display:swap}
@font-face{font-family:"IBM Plex Mono";src:url("/assets/fonts/ibm-plex-mono-400.woff2") format("woff2");font-weight:400;font-display:swap}
@font-face{font-family:"IBM Plex Mono";src:url("/assets/fonts/ibm-plex-mono-700.woff2") format("woff2");font-weight:700;font-display:swap}
`;

const shell = (title, note, css, body) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${title} | Compass, full page</title>
<script src="/assets/js/pixel.js?v=${PIXEL_HASH}"></script>
<style>${FONTS}
*{box-sizing:border-box}html,body{margin:0;padding:0}
.which{position:sticky;top:0;z-index:99;font:400 12px/1.5 "IBM Plex Mono",monospace;background:#111;color:#fff;padding:8px 14px;letter-spacing:.04em}
.which b{font-weight:700}.which span{opacity:.62}
${css}</style>
</head>
<body>
<noscript><img hidden height="1" width="1" src="https://www.facebook.com/tr?id=${DATASET}&amp;ev=PageView&amp;noscript=1" alt=""></noscript>
<p class="which"><b>${title}</b> <span>${note}</span></p>
${body}
</body>
</html>
`;

const li = (xs) => xs.map((x) => `<li>${x}</li>`).join('');

// ── version 1: hue ───────────────────────────────────────────────────────────
// hue's model, run on this brand: hero stage preset editorial-photo (photo full bleed, no hero
// subject, flat relation), tokens from the brand bible, one accent, a 4px spacing scale, and its
// own rule that a section's ground alternates to mark rhythm.
const hueCss = `
body{background:#DFD7C3;color:#495543;font:300 16px/1.7 "IBM Plex Mono",monospace}
.wrap{max-width:1140px;margin:0 auto;padding:0 24px}
section{padding:80px 0}
@media(min-width:900px){section{padding:112px 0}}
.ink{background:#495543;color:#DFD7C3}
.ink .eyebrow{color:#CDB494}
.announce{background:#495543;color:#DFD7C3;text-align:center;padding:11px 16px;font-size:13px;letter-spacing:.02em}
.sticky{position:sticky;top:33px;z-index:80;background:rgba(223,215,195,.95);border-bottom:1px solid #CDB494;
  padding:10px 24px;display:flex;align-items:center;justify-content:space-between;gap:16px;font-size:13px}
.sticky a{background:#AC2E20;color:#DFD7C3;text-decoration:none;padding:9px 18px;font:700 12px/1 "IBM Plex Mono",monospace;letter-spacing:.04em}
.eyebrow{font:400 12px/1.4 "IBM Plex Mono",monospace;letter-spacing:.08em;text-transform:uppercase;margin:0 0 16px;color:#6A745F}
h1{font:900 40px/1.02 "Montserrat",sans-serif;letter-spacing:-.015em;margin:0 0 20px;max-width:17ch}
@media(min-width:900px){h1{font-size:64px}}
h2{font:900 28px/1.06 "Montserrat",sans-serif;letter-spacing:-.01em;margin:0 0 24px;max-width:22ch}
@media(min-width:900px){h2{font-size:40px}}
.lead{font:400 19px/1.6 "Libre Baskerville",serif;letter-spacing:-.01em;margin:0 0 28px;max-width:62ch}
.stage{position:relative;min-height:76vh;display:flex;align-items:flex-end;
  background:linear-gradient(180deg,#8E9B86 0%,#6E7C68 56%,#495543 100%)}
.stage:after{content:"PHOTO · hero · full bleed";position:absolute;top:20px;left:24px;
  font:400 11px/1.4 "IBM Plex Mono",monospace;color:rgba(223,215,195,.5);letter-spacing:.08em;text-transform:uppercase}
.scrim{position:absolute;inset:0;background:linear-gradient(180deg,rgba(29,34,27,0) 34%,rgba(29,34,27,.74) 100%)}
.stage .wrap{position:relative;width:100%;padding-bottom:56px}
.stage .eyebrow,.stage h1{color:#DFD7C3}
.proof{font:400 14px/1.5 "IBM Plex Mono",monospace;color:#DFD7C3;margin:0 0 20px;padding-left:12px;border-left:2px solid #DA4635}
.hero-lower{display:grid;gap:28px}
@media(min-width:900px){.hero-lower{grid-template-columns:1.1fr .9fr;gap:56px;align-items:start}}
ul{list-style:none;margin:0;padding:0}
.rule li{padding:12px 0;border-bottom:1px solid #CDB494;font-size:15px}
.rule li:first-child{border-top:1px solid #CDB494}
.ink .rule li{border-color:#6A745F}
.btn{display:inline-block;background:#AC2E20;color:#DFD7C3;text-decoration:none;padding:16px 30px;font:700 14px/1 "IBM Plex Mono",monospace;letter-spacing:.04em}
.ink .btn{background:#DA4635}
.act{display:flex;flex-wrap:wrap;align-items:center;gap:18px;margin-top:8px}
.sub{margin:0;font-size:14px;color:#6A745F}
.ink .sub{color:#CDB494}
.badges{display:flex;flex-wrap:wrap;gap:8px 24px;font-size:13px;color:#6A745F;margin-top:24px}
.links a{display:inline-block;margin-right:28px;color:#495543;font-size:15px;text-underline-offset:.25em}
.stats{display:grid;gap:24px}
@media(min-width:760px){.stats{grid-template-columns:repeat(3,1fr);gap:40px}}
.stat .n{font:900 56px/1 "Montserrat",sans-serif;letter-spacing:-.02em;display:block}
.stat .l{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#6A745F;display:block;margin:6px 0 10px}
.num{display:grid;gap:0}
.num li{display:grid;grid-template-columns:auto 1fr;gap:20px;padding:26px 0;border-top:1px solid #CDB494;align-items:start}
.num li:last-child{border-bottom:1px solid #CDB494}
.num .i{font:900 20px/1 "Montserrat",sans-serif;color:#DA4635}
.num h3{font:700 15px/1.3 "IBM Plex Mono",monospace;margin:0 0 8px}
.num p{margin:0;font-size:15px;max-width:60ch}
.cards{display:grid;gap:20px}
@media(min-width:760px){.cards{grid-template-columns:repeat(3,1fr)}}
.card{border:1px solid #CDB494;padding:22px}
.ink .card{border-color:#6A745F}
.card h3{font:700 13px/1.3 "IBM Plex Mono",monospace;margin:0 0 10px;letter-spacing:.04em}
.card p{margin:0;font-size:14px}
.offer{display:grid;gap:32px}
@media(min-width:900px){.offer{grid-template-columns:1fr 1fr;gap:64px}}
.price{font:900 56px/1 "Montserrat",sans-serif;letter-spacing:-.02em;margin:0 0 8px}
table{width:100%;border-collapse:collapse;font-size:14px}
th,td{text-align:left;padding:14px 10px;border-bottom:1px solid #CDB494;vertical-align:top}
th{font:700 12px/1.3 "IBM Plex Mono",monospace;letter-spacing:.06em;text-transform:uppercase}
td:nth-child(3){background:rgba(205,180,148,.28)}
.banner{background:#495543;color:#DFD7C3;text-align:center}
.banner h2{margin:0 auto 12px;max-width:20ch}
.banner .sub{color:#CDB494;margin:0 0 24px}
.faq dt{font:700 15px/1.4 "IBM Plex Mono",monospace;margin:24px 0 8px;padding-top:24px;border-top:1px solid #CDB494}
.faq dd{margin:0;font-size:15px;max-width:66ch}
footer{background:#495543;color:#CDB494;font-size:13px;padding:40px 0}
`;

const hueBody = `
<p class="announce">${C.announce}</p>
<div class="sticky"><span>Compass · ${C.sticky.price}</span><a href="#offer">${C.sticky.label}</a></div>

<header class="stage"><div class="scrim"></div><div class="wrap">
  <p class="proof">${C.hero.proof}</p>
  <p class="eyebrow">${C.hero.eyebrow}</p>
  <h1>${C.hero.h1}</h1>
</div></header>

<section><div class="wrap"><div class="hero-lower">
  <div><p class="lead">${C.hero.sub}</p>
    <div class="act"><a class="btn" href="#offer">${C.hero.cta}</a><p class="sub">${C.hero.ctaSub}</p></div>
    <div class="badges">${C.hero.badges.map((b) => `<span>${b}</span>`).join('')}</div></div>
  <ul class="rule">${li(C.hero.bullets)}</ul>
</div></div></section>

<section class="ink"><div class="wrap">
  <p class="eyebrow">${C.sample.eyebrow}</p><h2>${C.sample.h2}</h2>
  <p class="lead">${C.sample.body}</p>
  <p class="links">${C.sample.links.map((l) => `<a href="${l.href}">${l.label}</a>`).join('')}</p>
</div></section>

<section><div class="wrap"><h2>${C.stats.h2}</h2><div class="stats">
  ${C.stats.items.map((s) => `<div class="stat"><span class="n">${s.n}</span><span class="l">${s.label}</span><p class="sub">${s.line}</p></div>`).join('')}
</div></div></section>

<section><div class="wrap">
  <p class="eyebrow">${C.reasons.eyebrow}</p><h2>${C.reasons.h2}</h2>
  <ul class="num">${C.reasons.items.map((r, i) => `<li><span class="i">${i + 1}</span><div><h3>${r.t}</h3><p>${r.line}</p></div></li>`).join('')}</ul>
</div></section>

<section><div class="wrap">
  <p class="eyebrow">${C.outcomes.eyebrow}</p><h2>${C.outcomes.h2}</h2>
  <ul class="rule">${li(C.outcomes.items)}</ul>
</div></section>

<section class="ink" id="offer"><div class="wrap">
  <p class="eyebrow">${C.offer.eyebrow}</p>
  <div class="offer">
    <div><h2>${C.offer.h2}</h2><p class="price">${C.offer.price}</p><p class="lead">${C.offer.tagline}</p>
      <ul class="rule">${li(C.offer.includes)}</ul>
      <div class="act"><a class="btn" href="#">${C.offer.cta}</a></div>
      <p class="sub" style="margin-top:16px">${C.offer.note}</p></div>
    <div class="cards">${C.offer.how.map((h) => `<div class="card"><h3>${h.n}. ${h.t}</h3><p>${h.line}</p></div>`).join('')}</div>
  </div>
</div></section>

<section class="banner"><div class="wrap"><h2>${C.banner1.h}</h2><p class="sub">${C.banner1.sub}</p><a class="btn" href="#offer">${C.banner1.cta}</a></div></section>

<section><div class="wrap">
  <p class="eyebrow">${C.product.eyebrow}</p><h2>${C.product.h2}</h2>
  <p class="lead">${C.product.body}</p>
  <p class="links">${C.sample.links.map((l) => `<a href="${l.href}">${l.label}</a>`).join('')}</p>
</div></section>

<section><div class="wrap">
  <p class="eyebrow">${C.compare.eyebrow}</p><h2>${C.compare.h2}</h2>
  <table><thead><tr><th></th>${C.compare.cols.map((c) => `<th>${c}</th>`).join('')}</tr></thead>
  <tbody>${C.compare.rows.map((r) => `<tr><th>${r[0]}</th>${r.slice(1).map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>
</div></section>

<section class="ink"><div class="wrap">
  <p class="eyebrow">${C.refuse.eyebrow}</p><h2>${C.refuse.h2}</h2>
  <div class="cards">${C.refuse.items.map((r) => `<div class="card"><h3>${r.t}</h3><p>${r.line}</p></div>`).join('')}</div>
</div></section>

<section class="banner"><div class="wrap"><h2>${C.banner2.h}</h2><p class="sub">${C.banner2.sub}</p><a class="btn" href="#offer">${C.banner2.cta}</a></div></section>

<section><div class="wrap"><p class="eyebrow">${C.faq.eyebrow}</p><h2>${C.faq.h2}</h2>
  <dl class="faq">${C.faq.items.map(([q, a]) => `<dt>${q}</dt><dd>${a}</dd>`).join('')}</dl></div></section>

<section><div class="wrap" style="text-align:center">
  <h2 style="margin:0 auto 14px">${C.closing.h}</h2><p class="lead" style="margin:0 auto 26px">${C.closing.sub}</p>
  <a class="btn" href="#offer">${C.closing.cta}</a></div></section>

<footer><div class="wrap">Wolf Children · hello@wolfchildren.co</div></footer>
`;

// ── version 2: hyperframes-creative ──────────────────────────────────────────
// The house style: light palette because the subject is children, one accent hue, neutrals tinted
// toward it, a background layer of persistent decoratives on the frames that carry weight, an eye
// led rather than everything centred, and the lazy defaults refused. Motion rules do not apply.
const hfCss = `
body{background:#E4DCC8;color:#3F4A3A;font:400 16px/1.68 "IBM Plex Mono",monospace;overflow-x:hidden}
.wrap{max-width:1120px;margin:0 auto;padding:0 24px;position:relative}
section{padding:76px 0;position:relative}
@media(min-width:900px){section{padding:104px 0}}
.announce{background:#DA4635;color:#F3EDE0;text-align:center;padding:10px 16px;font:700 12px/1.4 "IBM Plex Mono",monospace;letter-spacing:.08em;text-transform:uppercase}
.sticky{position:sticky;top:33px;z-index:80;background:#E4DCC8;border-bottom:1px solid rgba(63,74,58,.18);
  padding:10px 24px;display:flex;align-items:center;justify-content:space-between;gap:16px;font-size:13px}
.sticky a{background:#3F4A3A;color:#E4DCC8;text-decoration:none;padding:9px 18px;font:700 12px/1 "IBM Plex Mono",monospace;letter-spacing:.04em}
.eyebrow{display:inline-block;font:700 11px/1 "IBM Plex Mono",monospace;letter-spacing:.12em;text-transform:uppercase;
  color:#F3EDE0;background:#DA4635;padding:7px 12px;margin:0 0 22px}
h1{font:900 42px/1.0 "Montserrat",sans-serif;letter-spacing:-.018em;margin:0 0 22px;max-width:16ch}
@media(min-width:960px){h1{font-size:72px}}
h2{font:900 30px/1.05 "Montserrat",sans-serif;letter-spacing:-.012em;margin:0 0 22px;max-width:20ch}
@media(min-width:960px){h2{font-size:44px}}
.lead{font:400 18px/1.6 "Libre Baskerville",serif;letter-spacing:-.01em;margin:0 0 28px;max-width:56ch;color:#4A5545}
.ghost{position:absolute;right:-4vw;top:4vh;font:900 26vw/0.8 "Montserrat",sans-serif;color:#495543;opacity:.05;pointer-events:none;user-select:none;letter-spacing:-.03em}
.glow{position:absolute;left:-12vw;top:-8vh;width:66vw;height:66vw;border-radius:50%;background:radial-gradient(circle,rgba(218,70,53,.13) 0%,rgba(218,70,53,0) 62%);pointer-events:none}
.rules{position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(90deg,transparent 0 calc(12.5% - 1px),rgba(63,74,58,.06) calc(12.5% - 1px) 12.5%)}
.corner{position:absolute;right:24px;bottom:24px;width:110px;height:110px;border-right:1px solid rgba(218,70,53,.32);border-bottom:1px solid rgba(218,70,53,.32);pointer-events:none}
.hero{min-height:88vh;display:flex;align-items:center}
.hero .inner{display:grid;gap:34px}
@media(min-width:960px){.hero .inner{grid-template-columns:minmax(0,7fr) minmax(0,4fr);gap:68px;align-items:center}}
.proof{font:700 13px/1.5 "IBM Plex Mono",monospace;color:#DA4635;margin:0 0 18px}
ul{list-style:none;margin:0;padding:0}
.card{background:#DFD7C3;border:1px solid #CDB494;padding:22px}
.card h3{font:700 11px/1 "IBM Plex Mono",monospace;letter-spacing:.12em;text-transform:uppercase;margin:0 0 14px;color:#6A745F}
.card li{font-size:15px;line-height:1.5;padding:11px 0;border-bottom:1px solid rgba(205,180,148,.8)}
.card li:last-child{border-bottom:0;padding-bottom:0}
.btn{display:inline-block;background:#3F4A3A;color:#E4DCC8;text-decoration:none;padding:16px 30px;font:700 14px/1 "IBM Plex Mono",monospace;letter-spacing:.04em}
.act{display:flex;flex-wrap:wrap;align-items:center;gap:18px}
.sub{margin:0;font-size:14px;color:#6A745F}
.badges{display:flex;flex-wrap:wrap;gap:8px 26px;font-size:13px;color:#6A745F;margin-top:24px}
.links a{display:inline-block;margin-right:26px;color:#3F4A3A;font-size:15px;text-underline-offset:.25em}
.slab{background:#DFD7C3;border-top:1px solid #CDB494;border-bottom:1px solid #CDB494}
.stats{display:grid;gap:26px}
@media(min-width:760px){.stats{grid-template-columns:repeat(3,1fr);gap:44px}}
.stat .n{font:900 60px/1 "Montserrat",sans-serif;letter-spacing:-.02em;color:#DA4635;display:block}
.stat .l{font:700 11px/1 "IBM Plex Mono",monospace;letter-spacing:.12em;text-transform:uppercase;color:#6A745F;display:block;margin:8px 0 10px}
.num li{display:grid;grid-template-columns:auto 1fr;gap:22px;padding:26px 0;border-top:1px solid #CDB494;align-items:start}
.num li:last-child{border-bottom:1px solid #CDB494}
.num .i{font:900 34px/0.9 "Montserrat",sans-serif;color:rgba(218,70,53,.34)}
.num h3{font:700 15px/1.3 "IBM Plex Mono",monospace;margin:0 0 8px}
.num p{margin:0;font-size:15px;max-width:58ch}
.grid3{display:grid;gap:20px}
@media(min-width:760px){.grid3{grid-template-columns:repeat(3,1fr)}}
.offer{display:grid;gap:30px}
@media(min-width:900px){.offer{grid-template-columns:1.05fr .95fr;gap:60px}}
.price{font:900 60px/1 "Montserrat",sans-serif;letter-spacing:-.02em;margin:0 0 10px;color:#DA4635}
table{width:100%;border-collapse:collapse;font-size:14px}
th,td{text-align:left;padding:14px 10px;border-bottom:1px solid #CDB494;vertical-align:top}
th{font:700 12px/1.3 "IBM Plex Mono",monospace;letter-spacing:.06em;text-transform:uppercase}
td:nth-child(3){background:#DFD7C3}
.banner{background:#3F4A3A;color:#E4DCC8}
.banner h2{color:#E4DCC8;max-width:22ch}
.banner .eyebrow{background:#DA4635}
.banner .sub{color:#CDB494}
.banner .btn{background:#DA4635;color:#F3EDE0}
.faq dt{font:700 15px/1.4 "IBM Plex Mono",monospace;margin:22px 0 8px;padding-top:22px;border-top:1px solid #CDB494}
.faq dd{margin:0;font-size:15px;max-width:64ch;color:#4A5545}
footer{background:#3F4A3A;color:#CDB494;font-size:13px;padding:40px 0}
`;

const hfBody = `
<p class="announce">${C.announce}</p>
<div class="sticky"><span>Compass · ${C.sticky.price}</span><a href="#offer">${C.sticky.label}</a></div>

<section class="hero">
  <div class="glow"></div><div class="rules"></div><div class="ghost">SKY</div><div class="corner"></div>
  <div class="wrap"><div class="inner">
    <div>
      <p class="proof">${C.hero.proof}</p>
      <p class="eyebrow">${C.hero.eyebrow}</p>
      <h1>${C.hero.h1}</h1>
      <p class="lead">${C.hero.sub}</p>
      <div class="act"><a class="btn" href="#offer">${C.hero.cta}</a><p class="sub">${C.hero.ctaSub}</p></div>
      <div class="badges">${C.hero.badges.map((b) => `<span>${b}</span>`).join('')}</div>
    </div>
    <div class="card"><h3>What it is</h3><ul>${li(C.hero.bullets)}</ul></div>
  </div></div>
</section>

<section class="slab"><div class="wrap">
  <p class="eyebrow">${C.sample.eyebrow}</p><h2>${C.sample.h2}</h2>
  <p class="lead">${C.sample.body}</p>
  <p class="links">${C.sample.links.map((l) => `<a href="${l.href}">${l.label}</a>`).join('')}</p>
</div></section>

<section><div class="wrap"><h2>${C.stats.h2}</h2><div class="stats">
  ${C.stats.items.map((s) => `<div class="stat"><span class="n">${s.n}</span><span class="l">${s.label}</span><p class="sub">${s.line}</p></div>`).join('')}
</div></div></section>

<section><div class="rules"></div><div class="wrap">
  <p class="eyebrow">${C.reasons.eyebrow}</p><h2>${C.reasons.h2}</h2>
  <ul class="num">${C.reasons.items.map((r, i) => `<li><span class="i">${String(i + 1).padStart(2, '0')}</span><div><h3>${r.t}</h3><p>${r.line}</p></div></li>`).join('')}</ul>
</div></section>

<section class="slab"><div class="wrap">
  <p class="eyebrow">${C.outcomes.eyebrow}</p><h2>${C.outcomes.h2}</h2>
  <div class="card"><ul>${li(C.outcomes.items)}</ul></div>
</div></section>

<section id="offer"><div class="glow"></div><div class="wrap">
  <p class="eyebrow">${C.offer.eyebrow}</p>
  <div class="offer">
    <div><h2>${C.offer.h2}</h2><p class="price">${C.offer.price}</p><p class="lead">${C.offer.tagline}</p>
      <div class="card"><ul>${li(C.offer.includes)}</ul></div>
      <div class="act" style="margin-top:24px"><a class="btn" href="#">${C.offer.cta}</a></div>
      <p class="sub" style="margin-top:16px">${C.offer.note}</p></div>
    <div class="grid3" style="grid-template-columns:1fr">${C.offer.how.map((h) => `<div class="card"><h3>${h.n} · ${h.t}</h3><p style="margin:0;font-size:15px">${h.line}</p></div>`).join('')}</div>
  </div>
</div></section>

<section class="banner"><div class="wrap"><h2>${C.banner1.h}</h2><p class="sub" style="margin:0 0 24px">${C.banner1.sub}</p><a class="btn" href="#offer">${C.banner1.cta}</a></div></section>

<section><div class="wrap">
  <p class="eyebrow">${C.product.eyebrow}</p><h2>${C.product.h2}</h2>
  <p class="lead">${C.product.body}</p>
  <p class="links">${C.sample.links.map((l) => `<a href="${l.href}">${l.label}</a>`).join('')}</p>
</div></section>

<section class="slab"><div class="wrap">
  <p class="eyebrow">${C.compare.eyebrow}</p><h2>${C.compare.h2}</h2>
  <table><thead><tr><th></th>${C.compare.cols.map((c) => `<th>${c}</th>`).join('')}</tr></thead>
  <tbody>${C.compare.rows.map((r) => `<tr><th>${r[0]}</th>${r.slice(1).map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>
</div></section>

<section><div class="rules"></div><div class="wrap">
  <p class="eyebrow">${C.refuse.eyebrow}</p><h2>${C.refuse.h2}</h2>
  <div class="grid3" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr))">
    ${C.refuse.items.map((r) => `<div class="card"><h3>${r.t}</h3><p style="margin:0;font-size:15px">${r.line}</p></div>`).join('')}</div>
</div></section>

<section class="banner"><div class="wrap"><h2>${C.banner2.h}</h2><p class="sub" style="margin:0 0 24px">${C.banner2.sub}</p><a class="btn" href="#offer">${C.banner2.cta}</a></div></section>

<section><div class="wrap"><p class="eyebrow">${C.faq.eyebrow}</p><h2>${C.faq.h2}</h2>
  <dl class="faq">${C.faq.items.map(([q, a]) => `<dt>${q}</dt><dd>${a}</dd>`).join('')}</dl></div></section>

<section class="slab"><div class="corner"></div><div class="wrap">
  <h2>${C.closing.h}</h2><p class="lead">${C.closing.sub}</p><a class="btn" href="#offer">${C.closing.cta}</a></div></section>

<footer><div class="wrap">Wolf Children · hello@wolfchildren.co</div></footer>
`;

const NOTE = 'module order from the six-brand teardown (Grüns first-order spine, DECISIONS.md D29); design language from the skill.';
const PAGES = {
  hue: shell('hue', NOTE, hueCss, hueBody),
  'hyperframes-creative': shell('hyperframes-creative', NOTE, hfCss, hfBody),
};

// The copy is the same in both, and it goes through the audit before either is written.
const copyText = Object.values(C).map((v) => JSON.stringify(v)).join('\n')
  .replace(/","/g, '\n').replace(/[{}"\[\]]/g, ' ').replace(/\w+:/g, '');
const hits = audit(copyText);
if (hits.length) {
  console.error('anti-slop audit failed on the page copy:\n' + report(hits));
  process.exit(1);
}
console.log('anti-slop audit: clean');

for (const [name, html] of Object.entries(PAGES)) {
  const dir = join(ROOT, 'readings/compass/full', name);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
  console.log(`wrote /readings/compass/full/${name}/`);
}
