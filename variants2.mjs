#!/usr/bin/env node
// variants2.mjs — fifteen more design languages for the Compass page.
//
// Richard, 2026-09-24. Seven new skill repos were cloned to _tools/design-skills/repo/ and he
// chose fifteen skills: three page-building skills, one from each repo that has one, and twelve
// aesthetics from MengTo/Skills.
//
// Copy, module order and empty slots come from variants.mjs and are imported, not copied, so the
// only difference between any two of the twenty-five pages is the CSS in this file.
//
// FONTS, standing substitution. Every one of these skills names faces this machine does not have.
// Fetching them would add an external network dependency to a site that self-hosts everything, so
// all fifteen run on the three self-hosted brand faces: Montserrat 900, Libre Baskerville, IBM
// Plex Mono. Where a skill's identity depends on a face we lack, its note names the substitution.
//
//   node variants2.mjs            build all
//   node variants2.mjs <slug>     build one

import { BASE, FONTS, auditShared, writeVariant } from './variants.mjs';

export const THEMES = {

  // ── elaya / landing-page-design ────────────────────────────────────────────
  // Part B is a hard visual system and it is followed to the letter where the
  // machine allows: Tailwind type scale only (12/14/16/18/20/24/30/36/48/60/72),
  // its thirteen spacing tokens and nothing between them, flat backgrounds with
  // no gradient anywhere except the one permitted place, the hero heading in a
  // left-to-right #000 to #666 text gradient, borders on all four sides of a
  // card or none at all, heading and sub capped at 680px, and its motion curve
  // cubic-bezier(.32,.72,0,1) at 700ms on every transition.
  // Two rules it was not possible to keep, both named here rather than hidden:
  // it forbids weights of 900 and we hold only Montserrat 900 for headings, and
  // it wants one typeface per site where this site self-hosts three.
  'elaya-landing': {
    title: 'elaya · landing-page-design',
    note: 'Tailwind type scale, its 13 spacing tokens only, flat backgrounds, four-sided borders, 680px hero measure, its cubic-bezier(.32,.72,0,1) at 700ms · BROKEN ON PURPOSE, DECLARED: it forbids 900 weights and Montserrat 900 is the only display face here, and it wants one typeface where this site self-hosts three',
    css: `
body{background:#FFFFFF;color:#0A0A0A;font:400 16px/24px "IBM Plex Mono",monospace}
.s{padding:80px 0}@media(min-width:900px){.s{padding:96px 0}}
.wrap{max-width:1120px}
h1,h2,h3{font-family:"Montserrat",sans-serif;font-weight:900;letter-spacing:-.03em;text-wrap:balance}
h1{font-size:60px;line-height:1;max-width:680px;
  background:linear-gradient(90deg,#000000 0%,#666666 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
@media(max-width:700px){h1{font-size:36px;line-height:40px}}
h2{font-size:36px;line-height:40px;max-width:680px}
h3{font-size:18px;line-height:28px}
p{text-wrap:pretty}
.lead{font-size:18px;line-height:28px;max-width:680px;color:#404040}
.eyebrow{font-size:14px;line-height:20px;font-weight:600;color:#737373;margin-bottom:16px}
.small{font-size:14px;line-height:20px;color:#737373}
.announce{background:#0A0A0A;color:#FFFFFF;text-align:center;padding:12px;font-size:14px;line-height:20px}
.nav{background:rgba(255,255,255,.88);backdrop-filter:blur(12px);border-bottom:1px solid #E5E5E5}
.nav .mark{font:900 16px "Montserrat",sans-serif;letter-spacing:-.02em}
.btn{background:#0A0A0A;color:#FFFFFF;font-size:16px;font-weight:600;border-radius:8px;
  padding:12px 24px;transition:all 700ms cubic-bezier(.32,.72,0,1)}
.btn:hover{background:#404040;transform:translateY(-2px)}
.btn--nav{font-size:14px;padding:8px 12px}
.act{margin-top:40px;gap:16px}
.band{border-top:1px solid #E5E5E5;border-bottom:1px solid #E5E5E5;padding:48px 0;background:#FAFAFA}
.bullet{font-size:16px;line-height:24px}
.badges{margin-top:32px;gap:8px 32px}
.recognition{gap:16px}.recognition p{font-size:18px;line-height:28px;color:#404040}
.sample{background:#FAFAFA}
.links{gap:12px}
.link{font-size:16px;font-weight:600;text-decoration:underline;text-underline-offset:4px;
  transition:all 700ms cubic-bezier(.32,.72,0,1)}
.stat b{display:block;font:900 60px/1 "Montserrat",sans-serif;letter-spacing:-.04em}
.stat i{display:block;font-size:14px;line-height:20px;color:#737373;margin:8px 0 12px}
.reasons{gap:0}
.reason{border:1px solid #E5E5E5;border-radius:16px;padding:32px;margin-bottom:16px;background:#FFFFFF}
@media(min-width:900px){.reason{grid-template-columns:48px minmax(0,22ch) minmax(0,1fr);gap:32px}}
.reason .n{font:900 18px/1 "Montserrat",sans-serif;color:#A3A3A3}
.reason p{font-size:16px;line-height:24px;color:#404040}
.refusals{gap:16px}
.refusal{border:1px solid #E5E5E5;border-radius:16px;padding:24px;background:#FAFAFA}
.refusal b{font-size:14px;line-height:20px;font-weight:600;letter-spacing:.04em}
.refusal p{font-size:16px;line-height:24px;color:#404040}
.outcomes p{font-size:16px;line-height:24px;color:#404040;padding:12px 0}
.offer{gap:48px}
.price{font:900 60px/1 "Montserrat",sans-serif;letter-spacing:-.04em;margin:12px 0}
.includes{margin-top:24px;border:1px solid #E5E5E5;border-radius:16px;padding:8px 24px;background:#FAFAFA}
.includes p{padding:16px 0;border-bottom:1px solid #E5E5E5;font-size:16px;line-height:24px}
.includes p:last-child{border-bottom:0}
.note-line{margin-top:24px;max-width:520px}
.step{border:1px solid #E5E5E5;border-radius:16px;padding:24px;background:#FFFFFF}
.step .sn{display:block;font:900 16px/1 "Montserrat",sans-serif;color:#A3A3A3;margin-bottom:8px}
.step b{display:block;font-size:16px;font-weight:600;margin-bottom:4px}
.step p{font-size:14px;line-height:20px;color:#737373}
.banner{background:#0A0A0A;color:#FFFFFF}
.banner h2{background:linear-gradient(90deg,#FFFFFF 0%,#9B9B9B 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
.bsub{color:#A3A3A3;margin:16px 0 32px;font-size:18px;line-height:28px}
.banner .btn{background:#FFFFFF;color:#0A0A0A}
.banner .btn:hover{background:#E5E5E5}
.tablewrap{border:1px solid #E5E5E5;border-radius:16px}
table{font-size:14px;min-width:680px}
thead th{font-size:14px;font-weight:600;color:#737373;border-bottom:1px solid #E5E5E5;padding:16px 24px}
tbody th{font-weight:400;color:#737373;padding:16px 24px}
td{padding:16px 24px;border-bottom:1px solid #F5F5F5}
.faq{border-top:1px solid #E5E5E5}
details{border-bottom:1px solid #E5E5E5}
summary{font-size:16px;font-weight:600;padding:24px 0;transition:all 700ms cubic-bezier(.32,.72,0,1)}
details p{font-size:16px;line-height:24px;color:#404040}
.close{text-align:center}
.close h2{margin-left:auto;margin-right:auto}
footer{border-top:1px solid #E5E5E5;padding:48px 0;font-size:14px;color:#737373}
`,
  },

  // ── codeswithroh / tastemaker ──────────────────────────────────────────────
  // Built to its numbered gate list rather than to a palette, because the skill
  // is a process with gates, not a fixed look. The gates that changed real
  // decisions here:
  //   36  body copy is never monospace. Every other variant on this site sets
  //       body in IBM Plex Mono, so this one alone runs Libre Baskerville and
  //       keeps mono for data and labels only.
  //   23  pivotal sections padded 128-192px a side, adjacent gaps 120-250px.
  //   22  ONE separation mechanism for the whole page: alternating tint. No
  //       hairline dividers anywhere, which is also gate 52.
  //   52  semi-brutalist is a choice, not a reflex. Hairlines and flat fills are
  //       the house default of the other variants, so this one uses raised
  //       surfaces and soft shadow instead.
  //   20  card padding never exceeds the gap around it. 32px in, 40px between.
  //   37  headline line-height floored at 1.0.  38  no italic headings.
  //   51  the pill eyebrow does not repeat on every section.
  //   26  no clickable label wraps to two lines.  25  overflow-x clipped.
  'tastemaker': {
    title: 'tastemaker',
    note: 'built to its numbered gates, not a palette · gate 36 forces a serif body where every other variant here is mono · gate 22 one separation mechanism, alternating tint only · gate 52 raised surfaces instead of the hairline-and-flat-fill reflex · gates 20, 23, 25, 26, 37, 38, 51 applied',
    css: `
html,body{overflow-x:clip}
body{background:#F6F1E7;color:#2A2622;font:400 17px/1.7 "Libre Baskerville",Georgia,serif}
.s{padding:128px 0}
@media(max-width:899px){.s{padding:72px 0}}
.wrap{max-width:1100px}
h1,h2,h3{font-family:"Montserrat",sans-serif;font-weight:900;font-style:normal;
  letter-spacing:-.03em;overflow-wrap:anywhere;min-width:0}
h1{font-size:clamp(2.6rem,5.6vw,4.6rem);line-height:1;max-width:15ch}
h2{font-size:clamp(1.9rem,3.4vw,2.9rem);line-height:1.05;max-width:19ch}
h3{font-size:17px;line-height:1.35}
.lead{font-size:19px;line-height:1.65;max-width:58ch;color:#4A433C}
.eyebrow{font:400 12px/1 "IBM Plex Mono",monospace;letter-spacing:.16em;text-transform:uppercase;
  color:#8A7F72;margin-bottom:20px}
.reasons-s .eyebrow,.faq-s .eyebrow{display:none}
.small{font:400 14px/1.6 "IBM Plex Mono",monospace;color:#8A7F72}
.announce{background:#2A2622;color:#F6F1E7;text-align:center;padding:14px;
  font:400 13px/1 "IBM Plex Mono",monospace;letter-spacing:.08em}
.nav{background:rgba(246,241,231,.92);backdrop-filter:blur(10px);box-shadow:0 1px 0 rgba(42,38,34,.07)}
.nav .mark{font:900 16px "Montserrat",sans-serif;letter-spacing:-.02em}
.btn{background:#B4522E;color:#FFF8EC;font:900 15px/1 "Montserrat",sans-serif;border-radius:10px;
  white-space:nowrap;min-height:48px;box-shadow:0 6px 18px rgba(180,82,46,.26);letter-spacing:-.01em}
.btn:hover{background:#9A4426;transform:translateY(-1px);box-shadow:0 10px 26px rgba(180,82,46,.3)}
.btn--nav{min-height:40px;padding:11px 18px;font-size:13px}
.link{white-space:nowrap}
.act{margin-top:44px;gap:24px}
/* Gate 22: alternating tint is the only separation mechanism on this page. */
.band,.stats-s,.refusal-s,.compare-s{background:#EDE4D4}
.sample,.outcomes-s,.faq-s{background:#F1EADC}
.band{padding:56px 0}
.bullet{font-size:16px;line-height:1.6}
.badges{margin-top:32px;gap:12px 40px}
.recognition{gap:22px;max-width:60ch}
.recognition p{font-size:19px;line-height:1.65;color:#4A433C}
.links{gap:16px}
.stat b{display:block;font:900 clamp(3rem,5vw,4.2rem)/1 "Montserrat",sans-serif;letter-spacing:-.04em;color:#B4522E}
.stat i{display:block;font:400 12px/1 "IBM Plex Mono",monospace;letter-spacing:.14em;
  text-transform:uppercase;color:#8A7F72;margin:12px 0 14px}
.reasons{gap:40px}
.reason{background:#FFFBF2;border-radius:16px;padding:32px;box-shadow:0 2px 10px rgba(42,38,34,.06)}
@media(min-width:900px){.reason{grid-template-columns:56px minmax(0,20ch) minmax(0,1fr);gap:32px}}
.reason .n{font:900 20px/1 "Montserrat",sans-serif;color:#D8C6A8}
.reason p{font-size:16px;line-height:1.65;color:#4A433C}
.refusals{gap:40px}
.refusal{background:#FFFBF2;border-radius:16px;padding:32px;box-shadow:0 2px 10px rgba(42,38,34,.06)}
.refusal b{font:900 13px/1 "Montserrat",sans-serif;letter-spacing:.06em;color:#B4522E}
.refusal p{margin-top:12px;font-size:16px;line-height:1.65;color:#4A433C}
.outcomes p{font-size:16px;line-height:1.65;color:#4A433C;padding:14px 0}
.offer{gap:56px}
.price{font:900 clamp(3.2rem,5vw,4.2rem)/1 "Montserrat",sans-serif;letter-spacing:-.04em;margin:14px 0;color:#B4522E}
.includes{margin-top:26px;background:#FFFBF2;border-radius:16px;padding:12px 28px;box-shadow:0 2px 10px rgba(42,38,34,.06)}
.includes p{padding:18px 0;font-size:16px;line-height:1.6;box-shadow:0 1px 0 rgba(42,38,34,.07)}
.includes p:last-child{box-shadow:none}
.note-line{margin-top:26px;max-width:52ch}
.step{background:#FFFBF2;border-radius:16px;padding:28px;box-shadow:0 2px 10px rgba(42,38,34,.06)}
.step .sn{display:block;font:900 17px/1 "Montserrat",sans-serif;color:#D8C6A8;margin-bottom:8px}
.step b{display:block;font:900 15px "Montserrat",sans-serif;margin-bottom:8px;letter-spacing:-.01em}
.step p{font:400 15px/1.6 "Libre Baskerville",Georgia,serif;color:#4A433C}
.banner{background:#2A2622;color:#F6F1E7}
.banner h2{color:#F6F1E7;max-width:22ch}
.bsub{color:#C9BDAC;margin:20px 0 36px;font-size:18px;max-width:52ch}
.banner .btn{background:#F6F1E7;color:#2A2622;box-shadow:0 6px 18px rgba(0,0,0,.28)}
.banner .btn:hover{background:#FFFFFF}
.tablewrap{background:#FFFBF2;border-radius:16px;box-shadow:0 2px 10px rgba(42,38,34,.06)}
table{font-size:15px;min-width:680px}
thead th{font:900 12px "Montserrat",sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#8A7F72;padding:22px 20px}
tbody th{font:400 14px/1.5 "IBM Plex Mono",monospace;color:#8A7F72;width:16%;padding:18px 20px}
td{padding:18px 20px}
tbody tr:nth-child(odd) td,tbody tr:nth-child(odd) th{background:rgba(237,228,212,.5)}
.faq{margin-top:48px}
details{background:#FFFBF2;border-radius:14px;margin-bottom:12px;padding:0 24px;box-shadow:0 2px 10px rgba(42,38,34,.06)}
summary{font:900 16px "Montserrat",sans-serif;letter-spacing:-.01em}
details p{font-size:16px;line-height:1.65;color:#4A433C}
.close{text-align:center}
footer{padding:64px 0;font:400 14px/1.6 "IBM Plex Mono",monospace;color:#8A7F72}
`,
  },

  // ── conardli / web-design-engineer ─────────────────────────────────────────
  // Its own method: a Design Read, then five dials, then build to the bands.
  // DESIGN READ. Artifact: landing page. Audience: a parent who is guessing
  // about one specific thing their child keeps doing and wants to stop guessing.
  // Visual language: warm humanist, which is one of the skill's own named
  // families. Mode: greenfield. Constraints: three self-hosted faces, no
  // photography in the variant skeleton, no JavaScript on the page.
  // DIALS, and why each is where it is rather than at the skill's preset:
  //   Visual variance 7  strong art direction, off-grid moments, more than one
  //                      layout family. Type has to carry the page alone.
  //   Motion 2           static, state feedback only. The variants ship no JS
  //                      and the skill's band 1-2 is the honest one, not the 5
  //                      its landing-page preset suggests.
  //   Density 3          gallery-like, one dominant idea, generous pauses.
  //   Assets 3           band 1-3, typography carries the artifact, because
  //                      there is no photography here to depend on.
  //   Brand fidelity 8   preserve the brand faces and voice.
  // CONFLICT RESOLVED, by its own rule: high variance keeps a stable spine, so
  // the nav and the measure stay fixed and all experimentation sits in one
  // layer, the section headings, which step off the grid.
  'web-design-engineer': {
    title: 'conardli · web-design-engineer',
    note: 'design read: warm humanist landing page · dials variance 7, motion 2, density 3, assets 3, fidelity 8 · motion and assets set below its landing preset because the page ships no JS and no photography, declared rather than faked · variance held in one layer, the off-grid headings, per its own conflict rule',
    css: `
html,body{overflow-x:clip}
body{background:#FBF7EF;color:#241F1A;font:400 17px/1.75 "Libre Baskerville",Georgia,serif}
.s{padding:120px 0}
@media(min-width:1000px){.s{padding:176px 0}}
.wrap{max-width:1240px;padding:0 40px}
@media(max-width:700px){.wrap{padding:0 24px}.s{padding:80px 0}}
h1,h2,h3{font-family:"Montserrat",sans-serif;font-weight:900;letter-spacing:-.035em;overflow-wrap:anywhere}
h1{font-size:clamp(2.7rem,7vw,5.6rem);line-height:.96;max-width:14ch}
h2{font-size:clamp(2rem,4.4vw,3.4rem);line-height:1;max-width:17ch}
h3{font-size:16px;line-height:1.4;letter-spacing:-.01em}
/* The one experimental layer: section headings step off the grid, body stays put. */
@media(min-width:1000px){
  .s > .wrap > h2,.s > .wrap > .eyebrow{margin-left:-40px}
  .hero .wrap{padding-left:6%}
  .reasons-s > .wrap > h2{margin-left:-72px}
}
.lead{font-size:20px;line-height:1.7;max-width:54ch;color:#4C443A}
.eyebrow{font:400 12px/1 "IBM Plex Mono",monospace;letter-spacing:.24em;text-transform:uppercase;
  color:#998872;margin-bottom:28px}
.small{font:400 14px/1.7 "IBM Plex Mono",monospace;color:#998872}
.announce{background:#FBF7EF;color:#8A7A62;text-align:center;padding:16px;
  font:400 12px/1 "IBM Plex Mono",monospace;letter-spacing:.2em;text-transform:uppercase}
.nav{background:rgba(251,247,239,.9);backdrop-filter:blur(8px);height:72px}
.nav .mark{font:900 15px "Montserrat",sans-serif;letter-spacing:-.02em}
.btn{background:#241F1A;color:#FBF7EF;font:900 14px/1 "Montserrat",sans-serif;border-radius:999px;
  padding:18px 34px;white-space:nowrap;letter-spacing:-.01em}
.btn:hover{background:#C0623A}
.btn--nav{padding:11px 22px;font-size:12px}
.act{margin-top:56px;gap:28px}
.band{padding:0 0 120px}
.band-grid{gap:56px}
.bullet{font-size:17px;line-height:1.7;color:#4C443A;padding-top:20px;border-top:2px solid #241F1A}
.badges{margin-top:56px;gap:10px 48px}
.recognition{gap:28px;max-width:56ch}
.recognition p{font-size:20px;line-height:1.7;color:#4C443A}
.recognition p:first-child{font-size:24px;line-height:1.55;color:#241F1A}
.links{gap:20px}
.link{font:900 16px "Montserrat",sans-serif;border-bottom:2px solid #C0623A;padding-bottom:4px;white-space:nowrap}
.stats{margin-top:72px}
.stat b{display:block;font:900 clamp(3.4rem,7vw,5.4rem)/.9 "Montserrat",sans-serif;letter-spacing:-.05em;color:#C0623A}
.stat i{display:block;font:400 12px/1 "IBM Plex Mono",monospace;letter-spacing:.2em;
  text-transform:uppercase;color:#998872;margin:16px 0 16px}
.reasons{margin-top:80px;gap:0}
.reason{padding:44px 0;border-top:1px solid rgba(36,31,26,.16)}
.reason:last-child{border-bottom:1px solid rgba(36,31,26,.16)}
.reason .n{font:400 12px/1.6 "IBM Plex Mono",monospace;color:#998872;letter-spacing:.14em}
.reason p{font-size:17px;line-height:1.7;color:#4C443A;max-width:52ch}
.refusals{margin-top:72px;gap:48px}
.refusal b{font:900 14px/1 "Montserrat",sans-serif;letter-spacing:.06em;color:#C0623A}
.refusal p{margin-top:14px;font-size:17px;line-height:1.7;color:#4C443A;max-width:44ch}
.outcomes{margin-top:56px;gap:28px 72px}
.outcomes p{font-size:17px;line-height:1.7;color:#4C443A;padding-left:24px;border-left:2px solid #C0623A}
.offer{gap:80px}
.price{font:900 clamp(3.6rem,6vw,5rem)/1 "Montserrat",sans-serif;letter-spacing:-.05em;margin:18px 0;color:#C0623A}
.includes{margin-top:36px}
.includes p{padding:20px 0;border-top:1px solid rgba(36,31,26,.16);font-size:16px;line-height:1.65}
.note-line{margin-top:36px;max-width:50ch}
.step{padding-top:22px;border-top:2px solid #241F1A}
.step .sn{display:block;font:400 12px/1 "IBM Plex Mono",monospace;color:#998872;letter-spacing:.2em;margin-bottom:12px}
.step b{display:block;font:900 15px "Montserrat",sans-serif;margin-bottom:8px;letter-spacing:-.01em}
.step p{font-size:15px;line-height:1.65;color:#4C443A}
.banner{background:#241F1A;color:#FBF7EF;text-align:center}
.banner h2{color:#FBF7EF;max-width:24ch;margin:0 auto}
.bsub{color:#B5A791;margin:24px auto 40px;font-size:19px;max-width:50ch}
.banner .btn{background:#C0623A;color:#FBF7EF}
.banner .btn:hover{background:#FBF7EF;color:#241F1A}
table{font-size:15px;min-width:660px}
thead th{font:900 11px "Montserrat",sans-serif;letter-spacing:.16em;text-transform:uppercase;
  color:#998872;border-bottom:2px solid #241F1A;padding:20px 12px}
tbody th{font:400 14px/1.6 "IBM Plex Mono",monospace;color:#998872;width:16%}
th,td{border-bottom:1px solid rgba(36,31,26,.14);padding:20px 12px}
.faq{margin-top:56px;border-top:1px solid rgba(36,31,26,.16)}
details{border-bottom:1px solid rgba(36,31,26,.16)}
summary{font:900 17px "Montserrat",sans-serif;letter-spacing:-.015em;padding:28px 0}
details p{font-size:17px;line-height:1.7;color:#4C443A}
.close{text-align:center}
.close h2{margin:0 auto;max-width:18ch}
footer{padding:80px 0;font:400 13px/1.7 "IBM Plex Mono",monospace;color:#998872;
  border-top:1px solid rgba(36,31,26,.16)}
`,
  },

  // ── MengTo / clean-minimal-beige-light-mode ────────────────────────────────
  // Layered beige, stone, cream and off-white with very low-contrast borders, a
  // centred master container, a painted radial wash behind the page rather than
  // flat white, thin dividers, low-radius understated buttons, and the accent
  // used only as a signal. Its "Avoid" list rules out heavy shadows and
  // high-saturation accents, so there are none.
  'mengto-beige': {
    title: 'MengTo · clean-minimal-beige-light-mode',
    note: 'layered beige, stone and cream on a painted radial wash · very low-contrast borders, thin dividers, low radius · accent is a signal colour only, never a palette driver · no heavy shadows, per its Avoid list',
    css: `
html,body{overflow-x:clip}
body{background:#EFE9DD;color:#3A352C;font:400 16px/1.7 "Libre Baskerville",Georgia,serif;
  background-image:radial-gradient(120% 70% at 50% 0%,#F7F3EA 0%,#EFE9DD 55%,#E6DFD0 100%);
  background-attachment:fixed}
.s{padding:96px 0}@media(min-width:900px){.s{padding:120px 0}}
.wrap{max-width:1080px}
h1,h2,h3{font-family:"Montserrat",sans-serif;font-weight:900;letter-spacing:-.03em}
h1{font-size:clamp(2.3rem,4.8vw,3.9rem);line-height:1.02;max-width:17ch}
h2{font-size:clamp(1.6rem,2.9vw,2.4rem);line-height:1.08;max-width:20ch}
h3{font-size:15px;line-height:1.4}
.lead{font-size:18px;line-height:1.7;max-width:58ch;color:#5D564A}
.eyebrow{font:400 11px/1 "IBM Plex Mono",monospace;letter-spacing:.18em;text-transform:uppercase;color:#9C917D;margin-bottom:18px}
.small{font:400 13px/1.65 "IBM Plex Mono",monospace;color:#9C917D}
.announce{background:#E3DCCC;color:#6B6455;text-align:center;padding:11px;
  font:400 12px/1 "IBM Plex Mono",monospace;letter-spacing:.1em;border-bottom:1px solid #DCD3C0}
.nav{background:rgba(247,243,234,.88);backdrop-filter:blur(8px);border-bottom:1px solid #DCD3C0}
.nav .mark{font:900 14px "Montserrat",sans-serif}
.btn{background:#5A6B4E;color:#F7F3EA;font:900 13px/1 "Montserrat",sans-serif;border-radius:4px;
  padding:15px 26px;white-space:nowrap;border:1px solid rgba(0,0,0,.06)}
.btn:hover{background:#4A5940}
.btn--nav{padding:10px 16px;font-size:11.5px}
.act{margin-top:40px;gap:20px}
.band{background:#F3EFE5;border-top:1px solid #DCD3C0;border-bottom:1px solid #DCD3C0;padding:44px 0}
.bullet{font-size:15px;line-height:1.65;color:#5D564A}
.badges{margin-top:30px;gap:10px 36px}
.recognition{gap:20px;max-width:58ch}.recognition p{font-size:18px;line-height:1.7;color:#5D564A}
.sample,.outcomes-s{background:#F3EFE5;border-top:1px solid #DCD3C0;border-bottom:1px solid #DCD3C0}
.links{gap:14px}.link{font:900 15px "Montserrat",sans-serif;color:#5A6B4E}
.stats{margin-top:52px}
.stat{background:#F7F3EA;border:1px solid #DCD3C0;border-radius:4px;padding:28px}
.stat b{display:block;font:900 clamp(2.4rem,4vw,3.2rem)/1 "Montserrat",sans-serif;letter-spacing:-.04em;color:#5A6B4E}
.stat i{display:block;font:400 11px/1 "IBM Plex Mono",monospace;letter-spacing:.16em;text-transform:uppercase;color:#9C917D;margin:10px 0 12px}
.reasons{margin-top:52px;gap:0}
.reason{padding:30px 0;border-bottom:1px solid #DCD3C0}
.reason:first-child{border-top:1px solid #DCD3C0}
.reason .n{font:400 11px/1.6 "IBM Plex Mono",monospace;letter-spacing:.14em;color:#9C917D}
.reason p{font-size:15px;line-height:1.7;color:#5D564A;max-width:54ch}
.refusals{margin-top:52px;gap:20px}
.refusal{background:#F7F3EA;border:1px solid #DCD3C0;border-radius:4px;padding:26px}
.refusal b{font:900 12px/1 "Montserrat",sans-serif;letter-spacing:.08em;color:#5A6B4E}
.refusal p{margin-top:10px;font-size:15px;line-height:1.7;color:#5D564A}
.outcomes p{font-size:15px;line-height:1.7;color:#5D564A;padding:12px 0;border-bottom:1px solid #DCD3C0}
.offer{gap:52px}
.price{font:900 clamp(2.8rem,4.4vw,3.6rem)/1 "Montserrat",sans-serif;letter-spacing:-.04em;margin:12px 0;color:#5A6B4E}
.includes{margin-top:24px;background:#F7F3EA;border:1px solid #DCD3C0;border-radius:4px;padding:6px 22px}
.includes p{padding:15px 0;border-bottom:1px solid #E7E0D1;font-size:15px}
.includes p:last-child{border-bottom:0}
.note-line{margin-top:22px;max-width:52ch}
.step{background:#F7F3EA;border:1px solid #DCD3C0;border-radius:4px;padding:22px}
.step .sn{display:block;font:400 11px/1 "IBM Plex Mono",monospace;letter-spacing:.16em;color:#9C917D;margin-bottom:10px}
.step b{display:block;font:900 14px "Montserrat",sans-serif;margin-bottom:6px}
.step p{font-size:14px;line-height:1.65;color:#5D564A}
.banner{background:#E3DCCC;border-top:1px solid #DCD3C0;border-bottom:1px solid #DCD3C0}
.banner h2{max-width:24ch}.bsub{color:#6B6455;margin:16px 0 30px;font-size:17px;max-width:52ch}
.tablewrap{border:1px solid #DCD3C0;border-radius:4px;background:#F7F3EA}
table{font-size:14px;min-width:660px}
thead th{font:900 11px "Montserrat",sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#9C917D;padding:18px 16px;border-bottom:1px solid #DCD3C0}
tbody th{font:400 13px/1.6 "IBM Plex Mono",monospace;color:#9C917D;width:16%;padding:15px 16px}
td{padding:15px 16px;border-bottom:1px solid #E7E0D1}
.faq{margin-top:40px;border-top:1px solid #DCD3C0}
details{border-bottom:1px solid #DCD3C0}
summary{font:900 15px "Montserrat",sans-serif;padding:22px 0}
details p{font-size:15px;line-height:1.7;color:#5D564A}
.close{text-align:center}
footer{background:#E3DCCC;border-top:1px solid #DCD3C0;padding:52px 0;
  font:400 13px/1.7 "IBM Plex Mono",monospace;color:#9C917D}
`,
  },

  // ── MengTo / book-serif-index ──────────────────────────────────────────────
  // Two-zone composition: a dark outer interface shell with a warm paper
  // reading surface centred inside it. Serif body with generous leading, mono
  // section labels with heavy tracking, a drop cap, folio markers on the
  // reasons, edge and crease shading on the paper, and a subdued oxblood accent,
  // which is one of the three the skill names when no brand accent exists.
  // NOT BUILT, DECLARED: the index rail. It asks for sidebar chapter lists and
  // archive groupings. The Compass page has one linear scroll and no chapters,
  // so a rail would be invented navigation pointing at nothing.
  'mengto-book': {
    title: 'MengTo · book-serif-index',
    note: 'dark outer shell, warm paper reading surface centred inside it · serif body, mono tracked labels, drop cap, folio markers, crease and edge shading · oxblood accent, one of the three it names when no brand accent exists · NOT BUILT, DECLARED: the index rail, because this page has one linear scroll and no chapters to index',
    css: `
html,body{overflow-x:clip}
body{background:#1A1714;color:#2E2822;font:400 17px/1.8 "Libre Baskerville",Georgia,serif}
.announce{background:#1A1714;color:#8C7F6D;text-align:center;padding:14px;
  font:400 11px/1 "IBM Plex Mono",monospace;letter-spacing:.24em;text-transform:uppercase}
.nav{background:#1A1714;color:#E8DFCC;border-bottom:1px solid #332C24}
.nav .mark{font:900 14px "Montserrat",sans-serif;letter-spacing:.02em}
/* The paper surface: every section sits on it, the shell shows at the edges. */
.s,.band{background:#EFE6D2;position:relative;
  background-image:linear-gradient(90deg,rgba(26,23,20,.09) 0%,rgba(26,23,20,0) 4%,rgba(26,23,20,0) 96%,rgba(26,23,20,.09) 100%),
    linear-gradient(90deg,rgba(26,23,20,0) 49.6%,rgba(26,23,20,.055) 50%,rgba(26,23,20,0) 50.4%)}
.s{padding:88px 0}@media(min-width:900px){.s{padding:112px 0}}
.wrap{max-width:1000px}
h1,h2,h3{font-family:"Montserrat",sans-serif;font-weight:900;letter-spacing:-.03em;color:#221D18}
h1{font-size:clamp(2.2rem,4.6vw,3.7rem);line-height:1.04;max-width:17ch}
h2{font-size:clamp(1.55rem,2.8vw,2.3rem);line-height:1.1;max-width:21ch}
h3{font-size:15px;line-height:1.4}
.lead{font-size:18px;line-height:1.85;max-width:56ch;color:#4A4036}
.hero .lead:first-letter{float:left;font:900 62px/.82 "Montserrat",sans-serif;color:#7A2B26;
  margin:6px 12px 0 0}
.eyebrow{font:400 11px/1 "IBM Plex Mono",monospace;letter-spacing:.3em;text-transform:uppercase;color:#8C7F6D;margin-bottom:20px}
.small{font:400 13px/1.7 "IBM Plex Mono",monospace;color:#8C7F6D}
.btn{background:#7A2B26;color:#EFE6D2;font:900 13px/1 "Montserrat",sans-serif;border-radius:2px;
  padding:16px 28px;white-space:nowrap}
.btn:hover{background:#5E201C}
.btn--nav{padding:10px 16px;font-size:11.5px}
.act{margin-top:42px;gap:22px}
.band{padding:40px 0;box-shadow:inset 0 1px 0 rgba(26,23,20,.12),inset 0 -1px 0 rgba(26,23,20,.12)}
.bullet{font-size:16px;line-height:1.75;color:#4A4036}
.badges{margin-top:30px;gap:10px 36px}
.recognition{gap:22px;max-width:56ch}.recognition p{font-size:18px;line-height:1.85;color:#4A4036}
.links{gap:16px}
.link{font:400 16px/1 "Libre Baskerville",Georgia,serif;border-bottom:1px solid #7A2B26;padding-bottom:3px}
.stats{margin-top:56px}
.stat b{display:block;font:900 clamp(2.6rem,4.2vw,3.4rem)/1 "Montserrat",sans-serif;letter-spacing:-.04em;color:#7A2B26}
.stat i{display:block;font:400 11px/1 "IBM Plex Mono",monospace;letter-spacing:.24em;text-transform:uppercase;color:#8C7F6D;margin:12px 0 12px}
.reasons{margin-top:56px;gap:0}
.reason{padding:32px 0;border-bottom:1px solid rgba(26,23,20,.16)}
.reason:first-child{border-top:1px solid rgba(26,23,20,.16)}
.reason .n{font:400 11px/1.6 "IBM Plex Mono",monospace;letter-spacing:.24em;color:#8C7F6D}
.reason h3{font-family:"Libre Baskerville",Georgia,serif;font-weight:700;font-size:17px}
.reason p{font-size:16px;line-height:1.8;color:#4A4036;max-width:52ch}
.refusals{margin-top:52px;gap:32px 44px}
.refusal{border-left:2px solid #7A2B26;padding-left:20px}
.refusal b{font:400 11px/1 "IBM Plex Mono",monospace;letter-spacing:.2em;color:#7A2B26}
.refusal p{margin-top:12px;font-size:16px;line-height:1.8;color:#4A4036}
.outcomes p{font-size:16px;line-height:1.8;color:#4A4036;padding:13px 0;border-bottom:1px solid rgba(26,23,20,.14)}
.offer{gap:56px}
.price{font:900 clamp(3rem,4.6vw,3.8rem)/1 "Montserrat",sans-serif;letter-spacing:-.04em;margin:14px 0;color:#7A2B26}
.includes{margin-top:26px;border-top:1px solid rgba(26,23,20,.16)}
.includes p{padding:16px 0;border-bottom:1px solid rgba(26,23,20,.12);font-size:16px}
.note-line{margin-top:24px;max-width:52ch}
.step{padding-top:18px;border-top:1px solid rgba(26,23,20,.16)}
.step .sn{display:block;font:400 11px/1 "IBM Plex Mono",monospace;letter-spacing:.24em;color:#8C7F6D;margin-bottom:10px}
.step b{display:block;font:700 15px "Libre Baskerville",Georgia,serif;margin-bottom:6px}
.step p{font-size:15px;line-height:1.75;color:#4A4036}
.banner{background:#1A1714;background-image:none;color:#E8DFCC;text-align:center}
.banner h2{color:#E8DFCC;max-width:24ch;margin:0 auto}
.bsub{color:#8C7F6D;margin:18px auto 32px;font-size:17px;max-width:50ch}
.banner .btn{background:#7A2B26;color:#EFE6D2}
table{font-size:15px;min-width:660px}
thead th{font:400 11px "IBM Plex Mono",monospace;letter-spacing:.2em;text-transform:uppercase;color:#8C7F6D;border-bottom:2px solid #221D18;padding:18px 12px}
tbody th{font:400 14px/1.6 "IBM Plex Mono",monospace;color:#8C7F6D;width:16%}
th,td{border-bottom:1px solid rgba(26,23,20,.14);padding:17px 12px}
.faq{margin-top:44px;border-top:1px solid rgba(26,23,20,.16)}
details{border-bottom:1px solid rgba(26,23,20,.16)}
summary{font:700 17px "Libre Baskerville",Georgia,serif;padding:24px 0}
details p{font-size:16px;line-height:1.8;color:#4A4036}
.close{text-align:center}
footer{background:#1A1714;color:#8C7F6D;padding:60px 0;
  font:400 12px/1.7 "IBM Plex Mono",monospace;letter-spacing:.1em}
`,
  },

  // ── MengTo / editorial-tech ────────────────────────────────────────────────
  // Asymmetric editorial composition on controlled dark neutrals: offset
  // alignment rather than a centred SaaS hero, exposed grid traces and section
  // rules so the page reads engineered, mono utility labels against one large
  // display moment per section, and a single accent that punctuates rather than
  // fills. Its Avoid list rules out neon, HUD chrome and multi-colour palettes.
  // NOT BUILT, DECLARED: the cinematic media bands and inset photography
  // panels. They are half of this skill's identity and there is no photography
  // in the variant skeleton, so the layout carries the rhythm alone.
  'mengto-editorial-tech': {
    title: 'MengTo · editorial-tech',
    note: 'asymmetric columns on controlled dark neutrals, offset alignment, exposed grid traces and section rules, mono utility labels, one punctuating accent · NOT BUILT, DECLARED: the cinematic media bands and inset photo panels, half its identity, because the variant skeleton carries no photography',
    css: `
html,body{overflow-x:clip}
body{background:#121316;color:#D6D3CC;font:400 16px/1.7 "IBM Plex Mono",monospace}
.s{padding:96px 0;position:relative}@media(min-width:900px){.s{padding:132px 0}}
.wrap{max-width:1240px;padding:0 32px}
/* Exposed grid traces. */
.reasons-s:before,.compare-s:before{content:"";position:absolute;inset:0;pointer-events:none;
  background:repeating-linear-gradient(90deg,transparent 0 calc(16.666% - 1px),rgba(214,211,204,.055) calc(16.666% - 1px) 16.666%)}
h1,h2,h3{font-family:"Montserrat",sans-serif;font-weight:900;letter-spacing:-.04em;color:#F2F0EA}
h1{font-size:clamp(2.5rem,6vw,4.8rem);line-height:.96;max-width:15ch}
h2{font-size:clamp(1.7rem,3.2vw,2.7rem);line-height:1;max-width:18ch}
h3{font-size:14px;line-height:1.4;letter-spacing:-.01em}
.lead{font:400 17px/1.7 "Libre Baskerville",Georgia,serif;max-width:54ch;color:#9C9891}
.eyebrow{font:400 10.5px/1 "IBM Plex Mono",monospace;letter-spacing:.26em;text-transform:uppercase;color:#C8552F;margin-bottom:20px}
.small{font-size:13px;color:#83807A}
.announce{background:#0B0C0E;color:#83807A;text-align:center;padding:11px;font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;border-bottom:1px solid #26282C}
.nav{background:rgba(18,19,22,.9);backdrop-filter:blur(10px);border-bottom:1px solid #26282C}
.nav .mark{font:900 14px "Montserrat",sans-serif;color:#F2F0EA}
.btn{background:#C8552F;color:#0B0C0E;font:900 13px/1 "Montserrat",sans-serif;border-radius:0;padding:16px 28px;white-space:nowrap}
.btn:hover{background:#F2F0EA}
.btn--nav{padding:10px 16px;font-size:11.5px}
.act{margin-top:44px;gap:24px}
/* Offset alignment, the skill's core move. */
@media(min-width:1000px){
  .hero .wrap{padding-left:8%}
  .recognition-s .wrap,.outcomes-s .wrap{padding-left:33.33%}
  .sample .wrap{padding-left:16.666%}
}
.band{border-top:1px solid #26282C;border-bottom:1px solid #26282C;padding:36px 0;background:#0B0C0E}
.bullet{font-size:14px;color:#9C9891}
.badges{margin-top:28px;gap:10px 36px}
.recognition{gap:20px;max-width:52ch}
.recognition p{font:400 17px/1.7 "Libre Baskerville",Georgia,serif;color:#9C9891}
.links{gap:14px}
.link{font:900 14px "Montserrat",sans-serif;color:#C8552F;border-bottom:1px solid #C8552F;padding-bottom:3px}
.stats{margin-top:56px}
.stat b{display:block;font:900 clamp(2.8rem,4.6vw,3.8rem)/1 "Montserrat",sans-serif;letter-spacing:-.05em;color:#F2F0EA}
.stat i{display:block;font-size:10.5px;letter-spacing:.24em;text-transform:uppercase;color:#C8552F;margin:12px 0 12px}
.reasons{margin-top:56px;gap:0;position:relative;z-index:2}
.reason{padding:30px 0;border-top:1px solid #26282C}
.reason:last-child{border-bottom:1px solid #26282C}
.reason .n{font-size:10.5px;letter-spacing:.2em;color:#C8552F}
.reason p{font-size:14px;line-height:1.75;color:#9C9891;max-width:52ch}
.refusals{margin-top:52px;gap:28px 48px}
.refusal{border-top:1px solid #26282C;padding-top:20px}
.refusal b{font-size:10.5px;letter-spacing:.2em;color:#C8552F}
.refusal p{margin-top:12px;font-size:14px;line-height:1.75;color:#9C9891}
.outcomes p{font-size:14px;line-height:1.75;color:#9C9891;padding:12px 0;border-bottom:1px solid #26282C}
.offer{gap:56px}
.price{font:900 clamp(3rem,4.8vw,4rem)/1 "Montserrat",sans-serif;letter-spacing:-.05em;margin:14px 0;color:#C8552F}
.includes{margin-top:24px;border-top:1px solid #26282C}
.includes p{padding:15px 0;border-bottom:1px solid #26282C;font-size:14px}
.note-line{margin-top:22px;max-width:50ch}
.step{border-top:1px solid #26282C;padding-top:18px}
.step .sn{display:block;font-size:10.5px;letter-spacing:.24em;color:#C8552F;margin-bottom:10px}
.step b{display:block;font:900 13px "Montserrat",sans-serif;margin-bottom:6px;color:#F2F0EA}
.step p{font-size:13px;line-height:1.7;color:#83807A}
.banner{background:#0B0C0E;border-top:1px solid #26282C;border-bottom:1px solid #26282C}
.bsub{color:#83807A;margin:16px 0 30px;max-width:50ch}
.tablewrap{position:relative;z-index:2}
table{font-size:13.5px;min-width:680px}
thead th{font:900 10.5px "Montserrat",sans-serif;letter-spacing:.2em;text-transform:uppercase;color:#C8552F;border-bottom:1px solid #26282C;padding:18px 12px}
tbody th{color:#83807A;width:16%}
th,td{border-bottom:1px solid #26282C;padding:16px 12px}
.faq{margin-top:44px;border-top:1px solid #26282C}
details{border-bottom:1px solid #26282C}
summary{font:900 15px "Montserrat",sans-serif;padding:24px 0;color:#F2F0EA}
details p{font-size:14px;line-height:1.75;color:#9C9891}
.close{text-align:center}
footer{border-top:1px solid #26282C;padding:56px 0;font-size:12px;color:#83807A;letter-spacing:.1em}
`,
  },

  // ── MengTo / light-mode-paper-technical ────────────────────────────────────
  // A darker outer field with a framed paper interior: generous radius on the
  // master container, soft shadow, a low-contrast diagonal texture across the
  // large paper regions so the surface reads material, thin inset rules,
  // L-brackets and corner marks, and one accent that punctuates.
  'mengto-paper-technical': {
    title: 'MengTo · light-mode-paper-technical',
    note: 'dark outer field framing a paper interior · generous radius master container, soft shadow, low-contrast diagonal texture on the paper, inset rules, L-brackets and corner marks · one punctuating accent, never a marketing palette',
    css: `
html,body{overflow-x:clip}
body{background:#1B1D1A;color:#33302A;font:400 16px/1.72 "IBM Plex Mono",monospace;padding:0 0 28px}
.announce{background:#1B1D1A;color:#8E8A7E;text-align:center;padding:13px;font-size:11.5px;letter-spacing:.16em;text-transform:uppercase}
/* The framed master container: paper inside a darker field. */
.nav{background:#F4F0E4;margin:0 14px;border-radius:18px 18px 0 0;border:1px solid #DED7C4;border-bottom:0}
.nav .mark{font:900 14px "Montserrat",sans-serif;color:#24221D}
.s,.band{background:#F4F0E4;margin:0 14px;border-left:1px solid #DED7C4;border-right:1px solid #DED7C4;position:relative;
  background-image:repeating-linear-gradient(45deg,rgba(51,48,42,.022) 0 1px,transparent 1px 9px)}
footer{background:#F4F0E4;margin:0 14px;border-radius:0 0 18px 18px;border:1px solid #DED7C4;border-top:1px solid #DED7C4;
  box-shadow:0 22px 50px rgba(0,0,0,.34);padding:52px 0;font-size:12.5px;color:#8E8A7E;letter-spacing:.08em}
.s{padding:92px 0}@media(min-width:900px){.s{padding:116px 0}}
.wrap{max-width:1060px}
/* L-brackets at the corners of the pivotal sections. */
.hero:before,.hero:after,.offer-s:before,.offer-s:after{content:"";position:absolute;width:20px;height:20px;border-color:#B4863F}
.hero:before{top:22px;left:22px;border-top:1.5px solid;border-left:1.5px solid}
.hero:after{top:22px;right:22px;border-top:1.5px solid;border-right:1.5px solid}
.offer-s:before{bottom:22px;left:22px;border-bottom:1.5px solid;border-left:1.5px solid}
.offer-s:after{bottom:22px;right:22px;border-bottom:1.5px solid;border-right:1.5px solid}
h1,h2,h3{font-family:"Montserrat",sans-serif;font-weight:900;letter-spacing:-.032em;color:#24221D}
h1{font-size:clamp(2.3rem,4.9vw,3.9rem);line-height:1.02;max-width:17ch}
h2{font-size:clamp(1.6rem,2.9vw,2.4rem);line-height:1.08;max-width:20ch}
h3{font-size:14.5px;line-height:1.4}
.lead{font:400 17px/1.72 "Libre Baskerville",Georgia,serif;max-width:56ch;color:#5A554B}
.eyebrow{font-size:10.5px;letter-spacing:.22em;text-transform:uppercase;color:#B4863F;margin-bottom:18px}
.small{font-size:13px;color:#8E8A7E}
.btn{background:#24221D;color:#F4F0E4;font:900 13px/1 "Montserrat",sans-serif;border-radius:10px;padding:16px 28px;white-space:nowrap}
.btn:hover{background:#B4863F}
.btn--nav{padding:10px 16px;font-size:11.5px}
.act{margin-top:40px;gap:22px}
.band{padding:40px 0;box-shadow:inset 0 1px 0 #DED7C4,inset 0 -1px 0 #DED7C4}
.bullet{font-size:14.5px;color:#5A554B}
.badges{margin-top:28px;gap:10px 36px}
.recognition{gap:20px;max-width:56ch}
.recognition p{font:400 17px/1.72 "Libre Baskerville",Georgia,serif;color:#5A554B}
.links{gap:14px}.link{font:900 14.5px "Montserrat",sans-serif;color:#B4863F}
.stats{margin-top:52px}
.stat{border:1px solid #DED7C4;border-radius:12px;padding:26px;background:#FAF7EE}
.stat b{display:block;font:900 clamp(2.4rem,4vw,3.2rem)/1 "Montserrat",sans-serif;letter-spacing:-.04em;color:#B4863F}
.stat i{display:block;font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;color:#8E8A7E;margin:10px 0 12px}
.reasons{margin-top:52px;gap:0}
.reason{padding:28px 0;border-bottom:1px solid #DED7C4}
.reason:first-child{border-top:1px solid #DED7C4}
.reason .n{font-size:10.5px;letter-spacing:.2em;color:#B4863F}
.reason p{font-size:14.5px;line-height:1.75;color:#5A554B;max-width:52ch}
.refusals{margin-top:50px;gap:20px}
.refusal{border:1px solid #DED7C4;border-radius:12px;padding:24px;background:#FAF7EE}
.refusal b{font-size:10.5px;letter-spacing:.18em;color:#B4863F}
.refusal p{margin-top:10px;font-size:14.5px;line-height:1.75;color:#5A554B}
.outcomes p{font-size:14.5px;line-height:1.75;color:#5A554B;padding:12px 0;border-bottom:1px solid #DED7C4}
.offer{gap:52px}
.price{font:900 clamp(2.8rem,4.4vw,3.6rem)/1 "Montserrat",sans-serif;letter-spacing:-.04em;margin:12px 0;color:#B4863F}
.includes{margin-top:24px;border:1px solid #DED7C4;border-radius:12px;padding:6px 22px;background:#FAF7EE}
.includes p{padding:15px 0;border-bottom:1px solid #E8E1CF;font-size:14.5px}
.includes p:last-child{border-bottom:0}
.note-line{margin-top:22px;max-width:50ch}
.step{border:1px solid #DED7C4;border-radius:12px;padding:22px;background:#FAF7EE}
.step .sn{display:block;font-size:10.5px;letter-spacing:.2em;color:#B4863F;margin-bottom:10px}
.step b{display:block;font:900 13.5px "Montserrat",sans-serif;margin-bottom:6px}
.step p{font-size:13.5px;line-height:1.7;color:#5A554B}
.banner{background:#24221D}
.banner h2{color:#F4F0E4;max-width:24ch}
.bsub{color:#A9A296;margin:16px 0 30px;max-width:50ch}
.banner .btn{background:#B4863F;color:#24221D}
.tablewrap{border:1px solid #DED7C4;border-radius:12px;background:#FAF7EE}
table{font-size:13.5px;min-width:660px}
thead th{font:900 10.5px "Montserrat",sans-serif;letter-spacing:.18em;text-transform:uppercase;color:#8E8A7E;padding:18px 16px;border-bottom:1px solid #DED7C4}
tbody th{color:#8E8A7E;width:16%;padding:15px 16px}
td{padding:15px 16px;border-bottom:1px solid #E8E1CF}
.faq{margin-top:40px;border-top:1px solid #DED7C4}
details{border-bottom:1px solid #DED7C4}
summary{font:900 15px "Montserrat",sans-serif;padding:22px 0}
details p{font-size:14.5px;line-height:1.75;color:#5A554B}
.close{text-align:center}
`,
  },

  // ── MengTo / documentary-brutalist-agency ──────────────────────────────────
  // Hard black and warm white with pale proof surfaces, one compressed display
  // face against a neutral grotesk, exposed grid lines, square corners, no
  // glass, glow or decorative gradients, line breaks used as composition, and
  // the oversized footer wordmark it ends on. Billboard-scale hero line with
  // deliberately small supporting copy.
  // TWO THINGS NOT BUILT, DECLARED. The documentary collage and the black work
  // chapters are the spine of this skill and both are photography. There is
  // none here, so the black chapters carry type alone. The pale proof cards are
  // for verified quotes only, by its own rule, and there are no quotes, so the
  // proof surface stays empty rather than being filled with something else.
  'mengto-documentary': {
    title: 'MengTo · documentary-brutalist-agency',
    note: 'hard black and warm white, compressed display against neutral grotesk, exposed grid lines, square corners, no glass or glow, oversized footer wordmark · NOT BUILT, DECLARED: the documentary collage and the black work chapters, both photography, and the pale proof cards, which its own rule reserves for verified quotes we do not have',
    css: `
html,body{overflow-x:clip}
body{background:#FAF7F0;color:#0A0A0A;font:400 15px/1.6 "IBM Plex Mono",monospace}
.s{padding:80px 0;position:relative}@media(min-width:900px){.s{padding:104px 0}}
.wrap{max-width:1320px;padding:0 28px}
h1,h2,h3{font-family:"Montserrat",sans-serif;font-weight:900;letter-spacing:-.055em;text-transform:uppercase}
h1{font-size:clamp(2.8rem,10vw,8.5rem);line-height:.86;max-width:12ch}
h2{font-size:clamp(2rem,5.2vw,4rem);line-height:.9;max-width:16ch}
h3{font-size:13px;line-height:1.3;letter-spacing:.02em}
.lead{font-size:14px;line-height:1.65;max-width:44ch;color:#3D3D3D}
.eyebrow{font-size:10.5px;letter-spacing:.24em;text-transform:uppercase;color:#0A0A0A;margin-bottom:16px;
  border-bottom:2px solid #0A0A0A;display:inline-block;padding-bottom:5px}
.small{font-size:12px;color:#5A5A5A}
.announce{background:#0A0A0A;color:#FAF7F0;text-align:center;padding:12px;font-size:11px;letter-spacing:.2em;text-transform:uppercase}
.nav{background:#FAF7F0;border-bottom:2px solid #0A0A0A}
.nav .mark{font:900 15px "Montserrat",sans-serif;text-transform:uppercase;letter-spacing:-.03em}
.btn{background:#0A0A0A;color:#FAF7F0;font:900 12px/1 "Montserrat",sans-serif;border-radius:0;
  padding:18px 30px;text-transform:uppercase;letter-spacing:.06em;white-space:nowrap}
.btn:hover{background:#C6F0D8;color:#0A0A0A}
.btn--nav{padding:11px 18px;font-size:10.5px}
.act{margin-top:40px;gap:20px}
/* Black chapters, type only. */
.sample,.reasons-s,.compare-s{background:#0A0A0A;color:#FAF7F0}
.sample h2,.reasons-s h2,.compare-s h2{color:#FAF7F0}
.sample .lead,.reasons-s .eyebrow{color:#9A9A9A}
.reasons-s .eyebrow{border-bottom-color:#9A9A9A}
.band{border-bottom:2px solid #0A0A0A;padding:32px 0}
.band-grid{border-left:1px solid rgba(10,10,10,.2)}
.bullet{font-size:13px;padding-left:18px;border-left:1px solid rgba(10,10,10,.2);margin-left:-1px}
.badges{margin-top:26px;gap:8px 32px}
.recognition{gap:18px;max-width:46ch}.recognition p{font-size:14px;line-height:1.7;color:#3D3D3D}
.links{gap:12px}
.link{font:900 13px "Montserrat",sans-serif;text-transform:uppercase;letter-spacing:.04em;
  border-bottom:2px solid #C6F0D8;padding-bottom:3px}
.stats{margin-top:48px}
.stat b{display:block;font:900 clamp(3.4rem,7vw,5.6rem)/.85 "Montserrat",sans-serif;letter-spacing:-.06em}
.stat i{display:block;font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;color:#5A5A5A;margin:12px 0 10px}
.reasons{margin-top:48px;gap:0}
.reason{padding:26px 0;border-top:1px solid rgba(250,247,240,.22)}
.reason:last-child{border-bottom:1px solid rgba(250,247,240,.22)}
.reason .n{font:900 13px/1 "Montserrat",sans-serif;color:#C6F0D8}
.reason h3{color:#FAF7F0}
.reason p{font-size:13px;line-height:1.7;color:#9A9A9A;max-width:48ch}
.refusals{margin-top:48px;gap:0}
@media(min-width:820px){.refusals{gap:0}}
.refusal{border-top:2px solid #0A0A0A;padding:22px 0}
.refusal b{font:900 12px/1 "Montserrat",sans-serif;text-transform:uppercase;letter-spacing:.08em}
.refusal p{margin-top:10px;font-size:13px;line-height:1.7;color:#3D3D3D;max-width:44ch}
.outcomes p{font-size:13px;line-height:1.7;color:#3D3D3D;padding:12px 0;border-bottom:1px solid rgba(10,10,10,.2)}
.offer{gap:44px}
.price{font:900 clamp(3.4rem,6vw,5rem)/.85 "Montserrat",sans-serif;letter-spacing:-.06em;margin:14px 0}
.includes{margin-top:22px;border-top:2px solid #0A0A0A}
.includes p{padding:14px 0;border-bottom:1px solid rgba(10,10,10,.2);font-size:13px}
.note-line{margin-top:20px;max-width:46ch}
.step{border-top:2px solid #0A0A0A;padding-top:16px}
.step .sn{display:block;font:900 12px/1 "Montserrat",sans-serif;margin-bottom:8px}
.step b{display:block;font:900 12px "Montserrat",sans-serif;text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px}
.step p{font-size:12.5px;line-height:1.65;color:#3D3D3D}
.banner{background:#C6F0D8;border-top:2px solid #0A0A0A;border-bottom:2px solid #0A0A0A}
.banner--two{background:#F5D9E4}
.bsub{margin:16px 0 28px;max-width:46ch;font-size:14px}
table{font-size:12.5px;min-width:680px}
thead th{font:900 10.5px "Montserrat",sans-serif;letter-spacing:.18em;text-transform:uppercase;color:#9A9A9A;border-bottom:2px solid #FAF7F0;padding:16px 10px}
tbody th{color:#9A9A9A;width:16%}
th,td{border-bottom:1px solid rgba(250,247,240,.22);padding:15px 10px}
.faq{margin-top:40px;border-top:2px solid #0A0A0A}
details{border-bottom:2px solid #0A0A0A}
summary{font:900 14px "Montserrat",sans-serif;text-transform:uppercase;letter-spacing:.02em;padding:22px 0}
details p{font-size:13px;line-height:1.7;color:#3D3D3D}
.close{text-align:left}
.close h2,.close .lead{margin-left:0;margin-right:0}
/* The oversized wordmark it ends on. */
footer{background:#0A0A0A;color:#FAF7F0;padding:64px 0 0;font-size:11px;letter-spacing:.2em;text-transform:uppercase}
footer .wrap:after{content:"WOLF CHILDREN";display:block;margin-top:40px;
  font:900 clamp(3rem,15vw,13rem)/.8 "Montserrat",sans-serif;letter-spacing:-.06em;color:#FAF7F0}
`,
  },

  // ── MengTo / agency-grid-layout-minimal ────────────────────────────────────
  // A disciplined multi-column grid with large open spans and generous negative
  // space. Oversized headlines with tight tracking are the anchor; tiny
  // uppercase metadata sits in adjacent columns. Surfaces stay minimal: light
  // neutrals, thin separators, very restrained accent, understated buttons with
  // small uppercase labels rather than loud pills. Its Avoid list rules out
  // repeated cards, heavy borders and filling every gap, so gaps are left.
  'mengto-agency-grid': {
    title: 'MengTo · agency-grid-layout-minimal',
    note: 'disciplined wide grid, large open spans, oversized tight-tracked headlines as the anchor, tiny uppercase metadata in adjacent columns · thin separators, understated small-label buttons, accent almost withheld · gaps left open, per its Avoid list',
    css: `
html,body{overflow-x:clip}
body{background:#F2F2F0;color:#161616;font:400 15px/1.7 "IBM Plex Mono",monospace}
.s{padding:112px 0}@media(min-width:1000px){.s{padding:164px 0}}
.wrap{max-width:1440px;padding:0 44px}
@media(max-width:700px){.wrap{padding:0 22px}.s{padding:72px 0}}
h1,h2,h3{font-family:"Montserrat",sans-serif;font-weight:900;letter-spacing:-.05em}
h1{font-size:clamp(2.6rem,8vw,6.6rem);line-height:.92;max-width:13ch}
h2{font-size:clamp(1.9rem,4.2vw,3.4rem);line-height:.96;max-width:16ch}
h3{font-size:14px;line-height:1.35;letter-spacing:-.005em}
.lead{font-size:15px;line-height:1.75;max-width:42ch;color:#5C5C58}
.eyebrow{font-size:10px;letter-spacing:.26em;text-transform:uppercase;color:#9A9A94;margin-bottom:24px}
.small{font-size:11.5px;letter-spacing:.06em;color:#9A9A94}
.announce{background:#F2F2F0;color:#9A9A94;text-align:center;padding:16px;font-size:10px;letter-spacing:.3em;text-transform:uppercase}
.nav{background:rgba(242,242,240,.9);backdrop-filter:blur(8px);height:76px}
.nav .mark{font:900 14px "Montserrat",sans-serif;letter-spacing:-.03em}
.btn{background:transparent;color:#161616;border:1px solid #161616;border-radius:0;
  font:900 10.5px/1 "Montserrat",sans-serif;letter-spacing:.14em;text-transform:uppercase;
  padding:18px 32px;white-space:nowrap}
.btn:hover{background:#161616;color:#F2F2F0}
.btn--nav{padding:11px 18px;font-size:9.5px}
.act{margin-top:64px;gap:28px}
.band{padding:0 0 112px}
.band-grid{gap:72px}
.bullet{font-size:14px;line-height:1.7;color:#5C5C58}
.badges{margin-top:64px;gap:10px 56px}
.recognition{gap:24px;max-width:44ch}.recognition p{font-size:15px;line-height:1.8;color:#5C5C58}
.links{gap:18px}
.link{font:900 11px "Montserrat",sans-serif;letter-spacing:.14em;text-transform:uppercase;
  border-bottom:1px solid #161616;padding-bottom:6px}
.stats{margin-top:88px;gap:72px}
.stat b{display:block;font:900 clamp(3.2rem,6.5vw,5.2rem)/.86 "Montserrat",sans-serif;letter-spacing:-.06em}
.stat i{display:block;font-size:10px;letter-spacing:.26em;text-transform:uppercase;color:#9A9A94;margin:18px 0 14px}
.reasons{margin-top:88px;gap:0}
.reason{padding:40px 0;border-top:1px solid #DEDEDA}
.reason:last-child{border-bottom:1px solid #DEDEDA}
@media(min-width:1000px){.reason{grid-template-columns:80px minmax(0,18ch) minmax(0,34ch);gap:72px}}
.reason .n{font-size:10px;letter-spacing:.24em;color:#9A9A94}
.reason p{font-size:14px;line-height:1.75;color:#5C5C58}
.refusals{margin-top:80px;gap:56px 88px}
.refusal b{font-size:10px;letter-spacing:.24em;text-transform:uppercase;color:#9A9A94}
.refusal p{margin-top:16px;font-size:14px;line-height:1.75;color:#5C5C58;max-width:38ch}
.outcomes{margin-top:64px;gap:32px 88px}
.outcomes p{font-size:14px;line-height:1.75;color:#5C5C58}
.offer{gap:88px}
.price{font:900 clamp(3.2rem,6vw,5rem)/.86 "Montserrat",sans-serif;letter-spacing:-.06em;margin:20px 0}
.includes{margin-top:40px}
.includes p{padding:18px 0;border-top:1px solid #DEDEDA;font-size:14px;line-height:1.7}
.note-line{margin-top:40px;max-width:40ch}
.step{padding-top:20px;border-top:1px solid #161616}
.step .sn{display:block;font-size:10px;letter-spacing:.26em;color:#9A9A94;margin-bottom:14px}
.step b{display:block;font:900 13px "Montserrat",sans-serif;margin-bottom:8px;letter-spacing:-.01em}
.step p{font-size:13px;line-height:1.7;color:#5C5C58}
.banner{background:#161616;color:#F2F2F0}
.banner h2{color:#F2F2F0;max-width:20ch}
.bsub{color:#9A9A94;margin:24px 0 44px;max-width:40ch;font-size:14px}
.banner .btn{border-color:#F2F2F0;color:#F2F2F0}
.banner .btn:hover{background:#F2F2F0;color:#161616}
table{font-size:13px;min-width:680px}
thead th{font-size:10px;letter-spacing:.24em;text-transform:uppercase;color:#9A9A94;border-bottom:1px solid #161616;padding:22px 12px}
tbody th{color:#9A9A94;width:16%}
th,td{border-bottom:1px solid #DEDEDA;padding:22px 12px}
.faq{margin-top:64px;border-top:1px solid #DEDEDA}
details{border-bottom:1px solid #DEDEDA}
summary{font:900 14px "Montserrat",sans-serif;letter-spacing:-.015em;padding:30px 0}
details p{font-size:14px;line-height:1.75;color:#5C5C58}
.close{text-align:center}
footer{padding:96px 0;font-size:10.5px;letter-spacing:.24em;text-transform:uppercase;color:#9A9A94;border-top:1px solid #DEDEDA}
`,
  },

  // ── MengTo / split-layout-technical ────────────────────────────────────────
  // Two near-equal vertical panels on desktop, each with a distinct role: one
  // atmospheric and spatial, the other dense and informational. Thin frame
  // lines, inset boundary rules, corner markers and measured padding so each
  // panel reads as a technical display surface. Mono utility labelling on the
  // rails against quiet editorial headlines. Panels stack on small screens
  // without losing the sense of separate zones, which is its own instruction.
  'mengto-split': {
    title: 'MengTo · split-layout-technical',
    note: 'two near-equal panels, one atmospheric and one informational · thin frame lines, inset boundary rules, corner markers, measured padding · mono rails against quiet editorial headlines · panels stack on small screens but keep their zones',
    css: `
html,body{overflow-x:clip}
body{background:#0E0F11;color:#C9C6BF;font:400 15px/1.7 "IBM Plex Mono",monospace}
.s{padding:0;position:relative;border-bottom:1px solid #24262A}
.wrap{max-width:none;padding:0}
/* The split: heading zone left, content zone right, a rule between them. */
@media(min-width:960px){
  .s > .wrap{display:grid;grid-template-columns:44% 56%;align-items:start}
  .s > .wrap > h2,.s > .wrap > .eyebrow{grid-column:1;padding:72px 48px 0;margin:0}
  .s > .wrap > .eyebrow{padding-bottom:0}
  .s > .wrap > *:not(h2):not(.eyebrow){grid-column:2;padding:72px 48px;border-left:1px solid #24262A}
  .hero .wrap{grid-template-columns:56% 44%}
}
@media(max-width:959px){.s > .wrap > *{padding:0 24px}.s{padding:64px 0}}
.s > .wrap > h2{padding-bottom:72px}
h1,h2,h3{font-family:"Montserrat",sans-serif;font-weight:900;letter-spacing:-.035em;color:#F0EDE6}
h1{font-size:clamp(2.2rem,4.6vw,3.7rem);line-height:1.02;max-width:16ch}
h2{font-size:clamp(1.5rem,2.6vw,2.2rem);line-height:1.08;max-width:17ch}
h3{font-size:14px;line-height:1.4}
.lead{font-size:16px;line-height:1.75;max-width:52ch;color:#8E8B85}
.eyebrow{font-size:10px;letter-spacing:.28em;text-transform:uppercase;color:#5FA08C}
.small{font-size:12.5px;color:#6E6B66}
.announce{background:#0A0B0C;color:#6E6B66;text-align:center;padding:11px;font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;border-bottom:1px solid #24262A}
.nav{background:#0E0F11;border-bottom:1px solid #24262A;padding:0 28px}
.nav .mark{font:900 13px "Montserrat",sans-serif;color:#F0EDE6}
.btn{background:#5FA08C;color:#0A0B0C;font:900 12px/1 "Montserrat",sans-serif;border-radius:2px;
  padding:15px 26px;white-space:nowrap;letter-spacing:.04em}
.btn:hover{background:#F0EDE6}
.btn--nav{padding:10px 16px;font-size:10.5px}
.act{margin-top:36px;gap:20px}
/* Corner markers on each panel. */
.s:before,.s:after{content:"";position:absolute;width:7px;height:7px;border:1px solid #5FA08C;opacity:.5}
.s:before{top:14px;left:14px}.s:after{bottom:14px;right:14px}
.band{padding:36px 0;background:#0A0B0C;border-bottom:1px solid #24262A}
.band .wrap{display:block;padding:0 28px}
.band-grid{gap:0}
@media(min-width:820px){.band-grid{grid-template-columns:repeat(3,1fr);gap:0}}
.bullet{font-size:13.5px;color:#8E8B85;padding:0 24px;border-left:1px solid #24262A}
.badges{margin-top:26px;gap:8px 32px;padding:0 24px}
.recognition{gap:18px;max-width:50ch}.recognition p{font-size:16px;line-height:1.78;color:#8E8B85}
.links{gap:14px}
.link{font:900 13px "Montserrat",sans-serif;color:#5FA08C;letter-spacing:.02em}
.stats{margin-top:0;gap:0}
@media(min-width:760px){.stats{grid-template-columns:repeat(3,1fr);gap:0}}
.stat{padding:0 22px;border-left:1px solid #24262A}
.stat:first-child{border-left:0;padding-left:0}
.stat b{display:block;font:900 clamp(2.2rem,3.6vw,2.9rem)/1 "Montserrat",sans-serif;letter-spacing:-.04em;color:#5FA08C}
.stat i{display:block;font-size:10px;letter-spacing:.24em;text-transform:uppercase;color:#6E6B66;margin:10px 0 10px}
.reasons{margin-top:0;gap:0}
.reason{padding:22px 0;border-top:1px solid #24262A}
.reason:first-child{border-top:0;padding-top:0}
@media(min-width:900px){.reason{grid-template-columns:44px minmax(0,17ch) minmax(0,1fr);gap:24px}}
.reason .n{font-size:10px;letter-spacing:.2em;color:#5FA08C}
.reason p{font-size:13.5px;line-height:1.75;color:#8E8B85}
.refusals{margin-top:0;gap:0}
@media(min-width:820px){.refusals{grid-template-columns:1fr 1fr;gap:0}}
.refusal{padding:22px;border-top:1px solid #24262A;border-left:1px solid #24262A}
.refusal b{font-size:10px;letter-spacing:.2em;color:#5FA08C}
.refusal p{margin-top:10px;font-size:13.5px;line-height:1.75;color:#8E8B85}
.outcomes{margin-top:0}
.outcomes p{font-size:13.5px;line-height:1.75;color:#8E8B85;padding:13px 0;border-bottom:1px solid #24262A}
.offer{gap:36px}
.price{font:900 clamp(2.6rem,4vw,3.3rem)/1 "Montserrat",sans-serif;letter-spacing:-.04em;margin:12px 0;color:#5FA08C}
.includes{margin-top:22px;border-top:1px solid #24262A}
.includes p{padding:14px 0;border-bottom:1px solid #24262A;font-size:13.5px}
.note-line{margin-top:20px;max-width:48ch}
.step{padding:18px;border:1px solid #24262A}
.step .sn{display:block;font-size:10px;letter-spacing:.24em;color:#5FA08C;margin-bottom:8px}
.step b{display:block;font:900 12.5px "Montserrat",sans-serif;margin-bottom:6px;color:#F0EDE6}
.step p{font-size:12.5px;line-height:1.7;color:#8E8B85}
.banner{background:#0A0B0C}
.banner .wrap{display:block;padding:72px 48px}
.banner h2{color:#F0EDE6;max-width:22ch;padding:0}
.bsub{color:#6E6B66;margin:16px 0 28px;max-width:48ch;font-size:15px}
.tablewrap{margin-top:0}
table{font-size:12.5px;min-width:620px}
thead th{font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#5FA08C;border-bottom:1px solid #24262A;padding:15px 10px}
tbody th{color:#6E6B66;width:16%}
th,td{border-bottom:1px solid #24262A;padding:14px 10px}
.faq{margin-top:0;border-top:1px solid #24262A}
details{border-bottom:1px solid #24262A}
summary{font:900 14px "Montserrat",sans-serif;padding:20px 0;color:#F0EDE6}
details p{font-size:13.5px;line-height:1.75;color:#8E8B85}
.close .wrap{display:block;padding:96px 48px;text-align:center}
footer{border-bottom:0}
footer .wrap{padding:44px 28px;font-size:11.5px;letter-spacing:.14em;color:#6E6B66}
`,
  },

  // ── MengTo / orange-clean-paper-saas ───────────────────────────────────────
  // Warm off-white, cream and pale stone rather than stark white, with orange
  // as the single signal and action colour: step markers, primary actions,
  // highlight details, focus states. Generous radius, soft shadows, carefully
  // layered surfaces that read tactile without going skeuomorphic. Light body
  // weights and restrained hierarchy so it stays approachable.
  // NOT BUILT, DECLARED: the companion product-illustration region. Half of
  // this skill is a floating-card product panel beside the copy, and there is
  // no product imagery here, so that column stays out rather than being filled
  // with decoration.
  'mengto-orange-paper': {
    title: 'MengTo · orange-clean-paper-saas',
    note: 'warm off-white, cream and pale stone, never stark white · orange as the single signal colour for steps, actions and focal detail · generous radius, soft shadows, layered tactile surfaces · NOT BUILT, DECLARED: the companion product-illustration panel, half its identity, because there is no product imagery here',
    css: `
html,body{overflow-x:clip}
body{background:#FBF6EF;color:#33302C;font:400 16px/1.72 "Libre Baskerville",Georgia,serif}
.s{padding:92px 0}@media(min-width:900px){.s{padding:120px 0}}
.wrap{max-width:1120px}
h1,h2,h3{font-family:"Montserrat",sans-serif;font-weight:900;letter-spacing:-.03em;color:#221F1B}
h1{font-size:clamp(2.3rem,5vw,4rem);line-height:1.02;max-width:16ch}
h2{font-size:clamp(1.6rem,3vw,2.5rem);line-height:1.06;max-width:19ch}
h3{font-size:15px;line-height:1.4}
.lead{font-size:18px;line-height:1.72;max-width:56ch;color:#5E574E}
.eyebrow{display:inline-block;font:400 11px/1 "IBM Plex Mono",monospace;letter-spacing:.14em;
  text-transform:uppercase;color:#E2701F;background:#FCEBDA;border-radius:999px;padding:7px 14px;margin-bottom:20px}
.faq-s .eyebrow,.offer-s .eyebrow{background:none;padding:0;color:#A9A093}
.small{font:400 13.5px/1.65 "IBM Plex Mono",monospace;color:#A9A093}
.announce{background:#FCEBDA;color:#C25F14;text-align:center;padding:12px;
  font:400 12.5px/1 "IBM Plex Mono",monospace;letter-spacing:.06em}
.nav{background:rgba(251,246,239,.9);backdrop-filter:blur(10px);box-shadow:0 1px 0 rgba(51,48,44,.07)}
.nav .mark{font:900 15px "Montserrat",sans-serif}
.btn{background:#E2701F;color:#FFF;font:900 14px/1 "Montserrat",sans-serif;border-radius:12px;
  padding:17px 30px;white-space:nowrap;box-shadow:0 8px 20px rgba(226,112,31,.28)}
.btn:hover{background:#C25F14;transform:translateY(-1px);box-shadow:0 12px 26px rgba(226,112,31,.32)}
.btn--nav{padding:11px 18px;font-size:12.5px;border-radius:10px}
.act{margin-top:42px;gap:22px}
.band{background:#F5EDE2;padding:48px 0;border-radius:20px;margin:0 16px;box-shadow:inset 0 0 0 1px rgba(51,48,44,.05)}
.bullet{font-size:15.5px;line-height:1.7;color:#5E574E}
.badges{margin-top:32px;gap:10px 38px}
.recognition{gap:20px;max-width:56ch}.recognition p{font-size:18px;line-height:1.72;color:#5E574E}
.sample,.outcomes-s{background:#F5EDE2}
.links{gap:14px}
.link{font:900 15px "Montserrat",sans-serif;color:#E2701F}
.stats{margin-top:52px}
.stat{background:#FFFDF9;border-radius:18px;padding:28px;box-shadow:0 3px 14px rgba(51,48,44,.06)}
.stat b{display:block;font:900 clamp(2.6rem,4.2vw,3.4rem)/1 "Montserrat",sans-serif;letter-spacing:-.04em;color:#E2701F}
.stat i{display:block;font:400 11px/1 "IBM Plex Mono",monospace;letter-spacing:.14em;text-transform:uppercase;color:#A9A093;margin:10px 0 12px}
.reasons{margin-top:52px;gap:16px}
.reason{background:#FFFDF9;border-radius:18px;padding:28px;box-shadow:0 3px 14px rgba(51,48,44,.06)}
@media(min-width:900px){.reason{grid-template-columns:44px minmax(0,20ch) minmax(0,1fr);gap:28px}}
.reason .n{display:grid;place-items:center;width:32px;height:32px;border-radius:999px;
  background:#FCEBDA;color:#E2701F;font:900 13px/1 "Montserrat",sans-serif}
.reason p{font-size:15.5px;line-height:1.7;color:#5E574E}
.refusals{margin-top:50px;gap:16px}
.refusal{background:#FFFDF9;border-radius:18px;padding:26px;box-shadow:0 3px 14px rgba(51,48,44,.06)}
.refusal b{font:900 12.5px/1 "Montserrat",sans-serif;letter-spacing:.06em;color:#E2701F}
.refusal p{margin-top:10px;font-size:15.5px;line-height:1.7;color:#5E574E}
.outcomes p{font-size:15.5px;line-height:1.7;color:#5E574E;padding:13px 0}
.offer{gap:52px}
.price{font:900 clamp(3rem,4.6vw,3.8rem)/1 "Montserrat",sans-serif;letter-spacing:-.04em;margin:14px 0;color:#E2701F}
.includes{margin-top:26px;background:#FFFDF9;border-radius:18px;padding:8px 24px;box-shadow:0 3px 14px rgba(51,48,44,.06)}
.includes p{padding:16px 0;box-shadow:0 1px 0 rgba(51,48,44,.07);font-size:15.5px}
.includes p:last-child{box-shadow:none}
.note-line{margin-top:24px;max-width:50ch}
.step{background:#FFFDF9;border-radius:18px;padding:24px;box-shadow:0 3px 14px rgba(51,48,44,.06)}
.step .sn{display:grid;place-items:center;width:30px;height:30px;border-radius:999px;background:#E2701F;color:#FFF;
  font:900 13px/1 "Montserrat",sans-serif;margin-bottom:12px}
.step b{display:block;font:900 14.5px "Montserrat",sans-serif;margin-bottom:6px}
.step p{font-size:14.5px;line-height:1.65;color:#5E574E}
.banner{background:#221F1B;color:#FBF6EF;border-radius:24px;margin:0 16px}
.banner h2{color:#FBF6EF;max-width:24ch}
.bsub{color:#B3AA9D;margin:18px 0 32px;max-width:50ch;font-size:17px}
.banner .btn{background:#E2701F}
.tablewrap{background:#FFFDF9;border-radius:18px;box-shadow:0 3px 14px rgba(51,48,44,.06)}
table{font-size:14.5px;min-width:660px}
thead th{font:900 11.5px "Montserrat",sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#A9A093;padding:20px 18px}
tbody th{font:400 13.5px/1.6 "IBM Plex Mono",monospace;color:#A9A093;width:16%;padding:16px 18px}
td{padding:16px 18px}
tbody tr:nth-child(odd) td,tbody tr:nth-child(odd) th{background:#FBF6EF}
.faq{margin-top:42px}
details{background:#FFFDF9;border-radius:16px;margin-bottom:12px;padding:0 24px;box-shadow:0 3px 14px rgba(51,48,44,.06)}
summary{font:900 15.5px "Montserrat",sans-serif}
details p{font-size:15.5px;line-height:1.7;color:#5E574E}
.close{text-align:center}
footer{padding:56px 0;font:400 13.5px/1.7 "IBM Plex Mono",monospace;color:#A9A093}
`,
  },

  // ── MengTo / product-proof-saas ────────────────────────────────────────────
  // White to pale-blue surfaces, near-black text, soft grey grid lines and one
  // cool signal colour. Black primary actions, with the signal reserved for
  // active state, progress, selection and focus, exactly as it specifies.
  // 12-column rhythm, 12-16px radii, thin borders, product panels denser than
  // the marketing copy around them, footer resolving against a pale-blue fade.
  // Its Avoid list rules out decorative particles, floating and glowing orbs.
  // NOT BUILT, DECLARED: the product stage and the honest UI screenshots. This
  // skill is built around demonstrating one complete outcome in a real
  // screenshot, and the Compass reading is not shown on this page, so the
  // hero carries copy alone and the friction-proof module is not invented.
  'mengto-product-proof': {
    title: 'MengTo · product-proof-saas',
    note: 'white to pale-blue surfaces, near-black text, soft grey grid lines, one cool signal colour held for active, progress and focus while primary actions stay black · 12-16px radii, thin borders · NOT BUILT, DECLARED: the product stage and UI screenshots this skill is built around, because the reading is not shown on this page',
    css: `
html,body{overflow-x:clip}
body{background:#FFFFFF;color:#0D1117;font:400 15.5px/1.68 "IBM Plex Mono",monospace}
.s{padding:88px 0}@media(min-width:900px){.s{padding:112px 0}}
.wrap{max-width:1160px}
h1,h2,h3{font-family:"Montserrat",sans-serif;font-weight:900;letter-spacing:-.035em}
h1{font-size:clamp(2.3rem,4.9vw,3.9rem);line-height:1.02;max-width:17ch}
h2{font-size:clamp(1.6rem,2.9vw,2.4rem);line-height:1.08;max-width:20ch}
h3{font-size:14.5px;line-height:1.4}
.lead{font-size:17px;line-height:1.7;max-width:56ch;color:#4A5260}
.eyebrow{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#2563C9;margin-bottom:18px}
.small{font-size:13px;color:#6B7280}
.announce{background:#F2F6FC;color:#2563C9;text-align:center;padding:11px;font-size:12.5px;border-bottom:1px solid #E1E7F0}
.nav{background:rgba(255,255,255,.92);backdrop-filter:blur(10px);border-bottom:1px solid #E1E7F0}
.nav .mark{font:900 14.5px "Montserrat",sans-serif}
.btn{background:#0D1117;color:#FFFFFF;font:900 13.5px/1 "Montserrat",sans-serif;border-radius:12px;
  padding:16px 28px;white-space:nowrap}
.btn:hover{background:#2A313C}
.btn:focus-visible{outline:3px solid #2563C9;outline-offset:2px}
.btn--nav{padding:10px 17px;font-size:12px;border-radius:10px}
.act{margin-top:40px;gap:22px}
.band{background:#F8FAFD;border-top:1px solid #E1E7F0;border-bottom:1px solid #E1E7F0;padding:44px 0}
.bullet{font-size:14.5px;color:#4A5260}
.badges{margin-top:30px;gap:10px 36px}
.recognition{gap:20px;max-width:56ch}.recognition p{font-size:17px;line-height:1.7;color:#4A5260}
.sample,.outcomes-s{background:#F8FAFD;border-top:1px solid #E1E7F0;border-bottom:1px solid #E1E7F0}
.links{gap:14px}.link{font:900 14.5px "Montserrat",sans-serif;color:#2563C9}
/* Product panels denser than the marketing copy around them. */
.stats{margin-top:48px;gap:1px;background:#E1E7F0;border:1px solid #E1E7F0;border-radius:14px;overflow:hidden}
@media(min-width:760px){.stats{grid-template-columns:repeat(3,1fr);gap:1px}}
.stat{background:#FFFFFF;padding:24px}
.stat b{display:block;font:900 clamp(2.2rem,3.6vw,2.9rem)/1 "Montserrat",sans-serif;letter-spacing:-.04em}
.stat i{display:block;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#2563C9;margin:8px 0 10px}
.reasons{margin-top:48px;gap:12px}
.reason{border:1px solid #E1E7F0;border-radius:14px;padding:24px}
@media(min-width:900px){.reason{grid-template-columns:40px minmax(0,20ch) minmax(0,1fr);gap:24px}}
.reason .n{display:grid;place-items:center;width:28px;height:28px;border-radius:8px;background:#F2F6FC;color:#2563C9;font:900 12px/1 "Montserrat",sans-serif}
.reason p{font-size:14.5px;line-height:1.7;color:#4A5260}
.refusals{margin-top:46px;gap:12px}
.refusal{border:1px solid #E1E7F0;border-radius:14px;padding:22px;background:#F8FAFD}
.refusal b{font:900 12px/1 "Montserrat",sans-serif;letter-spacing:.06em;color:#2563C9}
.refusal p{margin-top:10px;font-size:14.5px;line-height:1.7;color:#4A5260}
.outcomes p{font-size:14.5px;line-height:1.7;color:#4A5260;padding:12px 0}
.offer{gap:48px}
.price{font:900 clamp(2.7rem,4.2vw,3.5rem)/1 "Montserrat",sans-serif;letter-spacing:-.04em;margin:12px 0}
.includes{margin-top:24px;border:1px solid #E1E7F0;border-radius:14px;padding:6px 22px}
.includes p{padding:15px 0;border-bottom:1px solid #EEF2F7;font-size:14.5px}
.includes p:last-child{border-bottom:0}
.note-line{margin-top:22px;max-width:50ch}
.step{border:1px solid #E1E7F0;border-radius:14px;padding:22px}
.step .sn{display:grid;place-items:center;width:26px;height:26px;border-radius:8px;background:#2563C9;color:#FFF;font:900 12px/1 "Montserrat",sans-serif;margin-bottom:10px}
.step b{display:block;font:900 13.5px "Montserrat",sans-serif;margin-bottom:6px}
.step p{font-size:13.5px;line-height:1.65;color:#4A5260}
.banner{background:#0D1117;color:#FFFFFF}
.banner h2{color:#FFFFFF;max-width:24ch}
.bsub{color:#9AA4B2;margin:16px 0 30px;max-width:50ch}
.banner .btn{background:#FFFFFF;color:#0D1117}
.tablewrap{border:1px solid #E1E7F0;border-radius:14px}
table{font-size:14px;min-width:660px}
thead th{font:900 11.5px "Montserrat",sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#6B7280;padding:18px 16px;border-bottom:1px solid #E1E7F0}
tbody th{color:#6B7280;width:16%;padding:15px 16px}
td{padding:15px 16px;border-bottom:1px solid #EEF2F7}
td:nth-child(3){background:#F8FAFD}
.faq{margin-top:40px;border-top:1px solid #E1E7F0}
details{border-bottom:1px solid #E1E7F0}
summary{font:900 15px "Montserrat",sans-serif;padding:22px 0}
details p{font-size:14.5px;line-height:1.7;color:#4A5260}
.close{text-align:center}
footer{padding:56px 0;font-size:13px;color:#6B7280;
  background:linear-gradient(180deg,#FFFFFF 0%,#F2F6FC 100%);border-top:1px solid #E1E7F0}
`,
  },

  // ── MengTo / technical-wireframe-info-layout ───────────────────────────────
  // Near-black monochrome with low-contrast patterning and very restrained
  // tonal shifts. The palette is almost entirely neutral, and emphasis comes
  // from brightness, line weight and spatial placement rather than colour,
  // which is this skill's explicit instruction. Compact technical type: small
  // labels, utility copy, metric text, and only one or two larger heading
  // moments per screen. Wide sparse layout with a lot of open space.
  // NOT BUILT, DECLARED, AND IT IS THE CENTREPIECE: the exploded wireframe
  // object with its routed connector lines and floating info pills. The skill
  // asks for real WebGL, Three.js, SVG or canvas linework. The variant pages
  // ship no JavaScript and no external libraries, and a flat fake of it would
  // be the thing the skill tells you not to do. So this page is the annotated
  // information layer without the object it annotates, and that is a real gap,
  // not a style choice.
  'mengto-wireframe': {
    title: 'MengTo · technical-wireframe-info-layout',
    note: 'near-black monochrome, low-contrast patterning, emphasis from brightness and line weight rather than colour, compact technical type with only one or two large heading moments · NOT BUILT, DECLARED, AND IT IS THE CENTREPIECE: the exploded WebGL wireframe object with its routed connectors and info pills, because these pages ship no JavaScript and a flat fake is what the skill tells you not to do',
    css: `
html,body{overflow-x:clip}
body{background:#0A0A0A;color:#8A8A8A;font:400 13.5px/1.7 "IBM Plex Mono",monospace;
  background-image:repeating-linear-gradient(0deg,rgba(255,255,255,.016) 0 1px,transparent 1px 4px)}
.s{padding:104px 0;position:relative}@media(min-width:900px){.s{padding:140px 0}}
.wrap{max-width:1380px;padding:0 40px}
@media(max-width:700px){.wrap{padding:0 22px}.s{padding:68px 0}}
h1,h2,h3{font-family:"Montserrat",sans-serif;font-weight:900;letter-spacing:-.04em;color:#F5F5F5}
h1{font-size:clamp(2.2rem,5vw,4rem);line-height:1;max-width:16ch}
/* Only one or two larger heading moments: the rest drop to label scale. */
h2{font-size:15px;line-height:1.4;letter-spacing:.14em;text-transform:uppercase;color:#C4C4C4;max-width:40ch;font-weight:900}
.offer-s h2,.close h2{font-size:clamp(1.8rem,3.4vw,2.8rem);line-height:1.04;letter-spacing:-.04em;text-transform:none;color:#F5F5F5}
h3{font-size:13px;line-height:1.4;letter-spacing:.06em;color:#D4D4D4}
.lead{font-size:14px;line-height:1.8;max-width:50ch;color:#8A8A8A}
.eyebrow{font-size:10px;letter-spacing:.3em;text-transform:uppercase;color:#5A5A5A;margin-bottom:22px}
.small{font-size:11.5px;color:#5A5A5A}
.announce{background:#0A0A0A;color:#5A5A5A;text-align:center;padding:13px;font-size:10px;letter-spacing:.3em;text-transform:uppercase;border-bottom:1px solid #1E1E1E}
.nav{background:rgba(10,10,10,.92);backdrop-filter:blur(8px);border-bottom:1px solid #1E1E1E}
.nav .mark{font:900 13px "Montserrat",sans-serif;color:#F5F5F5}
.btn{background:#F5F5F5;color:#0A0A0A;font:900 11.5px/1 "Montserrat",sans-serif;border-radius:3px;
  padding:15px 26px;white-space:nowrap;letter-spacing:.08em;text-transform:uppercase}
.btn:hover{background:#FFFFFF}
.btn--nav{padding:10px 16px;font-size:10px}
.act{margin-top:44px;gap:22px}
.band{border-top:1px solid #1E1E1E;border-bottom:1px solid #1E1E1E;padding:30px 0}
.band-grid{gap:0}
@media(min-width:820px){.band-grid{grid-template-columns:repeat(3,1fr);gap:0}}
/* Info pills, the one part of the annotation layer that stands without the object. */
.bullet{font-size:12px;color:#8A8A8A;padding:10px 18px;border:1px solid #1E1E1E;border-radius:999px;
  display:inline-block;background:#111111}
.badges{margin-top:26px;gap:8px 32px}
.recognition{gap:20px;max-width:50ch}.recognition p{font-size:14px;line-height:1.8}
.links{gap:12px}
.link{font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:#F5F5F5;border-bottom:1px solid #3A3A3A;padding-bottom:4px}
.stats{margin-top:56px;gap:1px;background:#1E1E1E;border:1px solid #1E1E1E}
@media(min-width:760px){.stats{grid-template-columns:repeat(3,1fr);gap:1px}}
.stat{background:#0A0A0A;padding:26px}
.stat b{display:block;font:900 clamp(2rem,3.4vw,2.7rem)/1 "Montserrat",sans-serif;letter-spacing:-.04em;color:#F5F5F5}
.stat i{display:block;font-size:10px;letter-spacing:.24em;text-transform:uppercase;color:#5A5A5A;margin:10px 0 10px}
.reasons{margin-top:56px;gap:0}
.reason{padding:26px 0;border-top:1px dashed #262626}
.reason:last-child{border-bottom:1px dashed #262626}
@media(min-width:900px){.reason{grid-template-columns:64px minmax(0,18ch) minmax(0,44ch);gap:40px}}
.reason .n{font-size:10px;letter-spacing:.22em;color:#5A5A5A}
.reason p{font-size:12.5px;line-height:1.8;color:#8A8A8A}
.refusals{margin-top:52px;gap:28px 56px}
.refusal{border-left:1px solid #262626;padding-left:20px}
.refusal b{font-size:10px;letter-spacing:.22em;color:#D4D4D4}
.refusal p{margin-top:10px;font-size:12.5px;line-height:1.8}
.outcomes{margin-top:44px;gap:20px 64px}
.outcomes p{font-size:12.5px;line-height:1.8;padding-left:16px;border-left:1px solid #262626}
.offer{gap:64px}
.price{font:900 clamp(2.6rem,4vw,3.4rem)/1 "Montserrat",sans-serif;letter-spacing:-.05em;margin:14px 0;color:#F5F5F5}
.includes{margin-top:26px;border-top:1px dashed #262626}
.includes p{padding:14px 0;border-bottom:1px dashed #262626;font-size:12.5px}
.note-line{margin-top:22px;max-width:48ch}
.step{border:1px solid #1E1E1E;padding:20px;background:#111111}
.step .sn{display:block;font-size:10px;letter-spacing:.24em;color:#5A5A5A;margin-bottom:10px}
.step b{display:block;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:#D4D4D4;margin-bottom:8px}
.step p{font-size:12px;line-height:1.75;color:#8A8A8A}
.banner{background:#111111;border-top:1px solid #1E1E1E;border-bottom:1px solid #1E1E1E}
.banner h2{font-size:clamp(1.6rem,3vw,2.4rem);line-height:1.06;letter-spacing:-.04em;text-transform:none;color:#F5F5F5;max-width:24ch}
.bsub{color:#5A5A5A;margin:16px 0 30px;max-width:48ch;font-size:13px}
table{font-size:12px;min-width:660px}
thead th{font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:#5A5A5A;border-bottom:1px solid #1E1E1E;padding:17px 12px}
tbody th{color:#5A5A5A;width:16%}
th,td{border-bottom:1px dashed #1E1E1E;padding:16px 12px}
.faq{margin-top:48px;border-top:1px dashed #262626}
details{border-bottom:1px dashed #262626}
summary{font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#D4D4D4;padding:22px 0;font-weight:400}
details p{font-size:12.5px;line-height:1.8}
.close{text-align:center}
footer{border-top:1px solid #1E1E1E;padding:64px 0;font-size:10.5px;letter-spacing:.24em;text-transform:uppercase;color:#5A5A5A}
`,
  },

  // ── MengTo / high-contrast-skeuomorphic-clean ──────────────────────────────
  // A light outer page framing a deep charcoal application shell. Dark premium
  // surfaces with subtle vertical gradients so panels read moulded rather than
  // flat, real skeuomorphic depth through top-edge highlights, inset shadow
  // stacks and soft outer falloff, nested object-like modules, and one
  // restrained signal accent driving status lights and focal emphasis.
  // Buttons and chips are built to look touchable: layered fill, inset edge,
  // measured hover brightness rather than glow, which its guidance is explicit
  // about. Kept clean and controlled, never ornamental.
  'mengto-skeuomorphic': {
    title: 'MengTo · high-contrast-skeuomorphic-clean',
    note: 'light outer page framing a deep charcoal app shell · moulded surfaces with vertical gradients, top-edge highlights, inset shadow stacks and soft outer falloff · touchable buttons with layered fill and bevel, hover by brightness not glow · one signal accent for status and focus',
    css: `
html,body{overflow-x:clip}
body{background:#DEDCD6;color:#B9B6AF;font:400 15px/1.7 "IBM Plex Mono",monospace;padding:16px 0}
.announce{background:#DEDCD6;color:#77746D;text-align:center;padding:10px;font-size:11px;letter-spacing:.2em;text-transform:uppercase}
/* The app shell: one dominant rounded container inside the light field. */
.nav{margin:0 16px;background:linear-gradient(180deg,#2C2B28 0%,#1E1D1B 100%);border-radius:20px 20px 0 0;
  border:1px solid #3A3936;border-bottom:0;box-shadow:inset 0 1px 0 rgba(255,255,255,.09);padding:0 24px}
.nav .mark{font:900 14px "Montserrat",sans-serif;color:#F2F0EA}
.s,.band{margin:0 16px;background:linear-gradient(180deg,#232220 0%,#1A1917 100%);
  border-left:1px solid #3A3936;border-right:1px solid #3A3936}
.s{padding:84px 0}@media(min-width:900px){.s{padding:108px 0}}
.wrap{max-width:1040px}
footer{margin:0 16px;background:linear-gradient(180deg,#1E1D1B 0%,#171614 100%);border-radius:0 0 20px 20px;
  border:1px solid #3A3936;box-shadow:0 26px 54px rgba(0,0,0,.34),inset 0 1px 0 rgba(255,255,255,.06);
  padding:52px 0;font-size:12.5px;color:#77746D;letter-spacing:.1em}
h1,h2,h3{font-family:"Montserrat",sans-serif;font-weight:900;letter-spacing:-.035em;color:#F7F5EF}
h1{font-size:clamp(2.2rem,4.8vw,3.8rem);line-height:1.02;max-width:17ch}
h2{font-size:clamp(1.55rem,2.8vw,2.3rem);line-height:1.08;max-width:20ch}
h3{font-size:14.5px;line-height:1.4;color:#EDEAE3}
.lead{font-size:17px;line-height:1.72;max-width:56ch;color:#B9B6AF}
.eyebrow{font-size:10.5px;letter-spacing:.22em;text-transform:uppercase;color:#C98A3C;margin-bottom:18px}
.small{font-size:12.5px;color:#77746D}
.btn{background:linear-gradient(180deg,#C98A3C 0%,#A96F2B 100%);color:#1A1917;
  font:900 13.5px/1 "Montserrat",sans-serif;border-radius:11px;padding:16px 28px;white-space:nowrap;
  border:1px solid #D9A05C;box-shadow:inset 0 1px 0 rgba(255,255,255,.34),0 4px 12px rgba(0,0,0,.38)}
.btn:hover{filter:brightness(1.12)}
.btn--nav{padding:10px 17px;font-size:12px;border-radius:9px}
.act{margin-top:40px;gap:22px}
.band{padding:40px 0;box-shadow:inset 0 1px 0 rgba(255,255,255,.055),inset 0 -1px 0 rgba(0,0,0,.4)}
.bullet{font-size:14px;color:#B9B6AF}
.badges{margin-top:28px;gap:10px 36px}
.recognition{gap:20px;max-width:56ch}.recognition p{font-size:17px;line-height:1.72}
.links{gap:14px}
.link{font:900 14px "Montserrat",sans-serif;color:#C98A3C}
/* Nested object-like modules: one-pixel wrapper, top highlight, inset stack. */
.stats{margin-top:48px}
.stat,.reason,.refusal,.step,.includes,.tablewrap,details{
  background:linear-gradient(180deg,#2A2926 0%,#201F1D 100%);border:1px solid #3A3936;border-radius:14px;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.075),inset 0 -12px 22px rgba(0,0,0,.24),0 5px 16px rgba(0,0,0,.3)}
.stat{padding:24px}
.stat b{display:block;font:900 clamp(2.2rem,3.6vw,2.9rem)/1 "Montserrat",sans-serif;letter-spacing:-.04em;color:#F7F5EF}
.stat i{display:block;font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;color:#C98A3C;margin:10px 0 10px}
.reasons{margin-top:48px;gap:14px}
.reason{padding:24px}
@media(min-width:900px){.reason{grid-template-columns:36px minmax(0,20ch) minmax(0,1fr);gap:24px}}
/* Status lights. */
.reason .n{display:grid;place-items:center;width:26px;height:26px;border-radius:999px;
  background:radial-gradient(circle at 40% 32%,#E3A75C 0%,#A96F2B 70%);color:#1A1917;
  font:900 11px/1 "Montserrat",sans-serif;box-shadow:0 0 9px rgba(201,138,60,.5),inset 0 1px 0 rgba(255,255,255,.4)}
.reason p{font-size:14px;line-height:1.72;color:#B9B6AF}
.refusals{margin-top:46px;gap:14px}
.refusal{padding:22px}
.refusal b{font:900 12px/1 "Montserrat",sans-serif;letter-spacing:.06em;color:#C98A3C}
.refusal p{margin-top:10px;font-size:14px;line-height:1.72;color:#B9B6AF}
.outcomes p{font-size:14px;line-height:1.72;color:#B9B6AF;padding:12px 0;border-bottom:1px solid #2E2D2A}
.offer{gap:48px}
.price{font:900 clamp(2.7rem,4.2vw,3.5rem)/1 "Montserrat",sans-serif;letter-spacing:-.04em;margin:12px 0;color:#C98A3C}
.includes{margin-top:24px;padding:6px 22px}
.includes p{padding:15px 0;border-bottom:1px solid #2E2D2A;font-size:14px}
.includes p:last-child{border-bottom:0}
.note-line{margin-top:22px;max-width:50ch}
.step{padding:22px}
.step .sn{display:grid;place-items:center;width:25px;height:25px;border-radius:7px;
  background:linear-gradient(180deg,#3A3936 0%,#2A2926 100%);border:1px solid #474642;
  color:#C98A3C;font:900 11.5px/1 "Montserrat",sans-serif;margin-bottom:10px;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.08)}
.step b{display:block;font:900 13.5px "Montserrat",sans-serif;margin-bottom:6px;color:#EDEAE3}
.step p{font-size:13px;line-height:1.68;color:#B9B6AF}
.banner{background:linear-gradient(180deg,#171614 0%,#111010 100%)}
.banner h2{max-width:24ch}
.bsub{color:#8B8880;margin:16px 0 30px;max-width:50ch}
table{font-size:13.5px;min-width:640px}
thead th{font:900 11px "Montserrat",sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#C98A3C;padding:18px 16px;border-bottom:1px solid #3A3936}
tbody th{color:#77746D;width:16%;padding:15px 16px}
td{padding:15px 16px;border-bottom:1px solid #2E2D2A}
.faq{margin-top:40px}
details{margin-bottom:12px;padding:0 22px}
summary{font:900 14.5px "Montserrat",sans-serif;color:#EDEAE3;padding:20px 0}
details p{font-size:14px;line-height:1.72;color:#B9B6AF}
.close{text-align:center}
`,
  },

  // ── MengTo / dark-blue-contrasting-clean ───────────────────────────────────
  // A near-black navy base with tonal variation rather than flat pure black,
  // with cobalt feature blocks used as the contrast moments: the CTA bands and
  // the offer. White type over pale-blue support copy. Thin outer rails,
  // border-x container lines and small corner squares hold the composition.
  // Blue glow stays soft and localised in background blooms and button
  // emphasis instead of flooding the page, which its guidance insists on.
  // Light to regular weights with small uppercase utility numbering.
  'mengto-dark-blue': {
    title: 'MengTo · dark-blue-contrasting-clean',
    note: 'near-black navy with tonal variation, cobalt feature blocks as the contrast moments, white type over pale-blue support · thin outer rails, border-x container lines, small corner squares · glow kept soft and localised rather than flooding the page · light weights, small uppercase numbering',
    css: `
html,body{overflow-x:clip}
body{background:#080B14;color:#93A3C4;font:400 15px/1.72 "IBM Plex Mono",monospace}
.s{padding:92px 0;position:relative}@media(min-width:900px){.s{padding:120px 0}}
/* Border-x container rails with corner squares. */
.wrap{max-width:1180px;border-left:1px solid #17203A;border-right:1px solid #17203A;position:relative}
.s > .wrap:before,.s > .wrap:after{content:"";position:absolute;width:5px;height:5px;background:#2B5BD7;top:-2px}
.s > .wrap:before{left:-3px}.s > .wrap:after{right:-3px}
h1,h2,h3{font-family:"Montserrat",sans-serif;font-weight:900;letter-spacing:-.035em;color:#FFFFFF}
h1{font-size:clamp(2.2rem,4.8vw,3.9rem);line-height:1.02;max-width:17ch}
h2{font-size:clamp(1.6rem,2.9vw,2.4rem);line-height:1.08;max-width:20ch}
h3{font-size:14.5px;line-height:1.4;color:#DCE4F5}
.lead{font-size:17px;line-height:1.75;max-width:56ch;color:#93A3C4}
.eyebrow{font-size:10.5px;letter-spacing:.26em;text-transform:uppercase;color:#5E84E8;margin-bottom:18px}
.small{font-size:12.5px;color:#61729A}
.announce{background:#080B14;color:#61729A;text-align:center;padding:12px;font-size:10.5px;letter-spacing:.26em;text-transform:uppercase;border-bottom:1px solid #17203A}
.nav{background:rgba(8,11,20,.9);backdrop-filter:blur(10px);border-bottom:1px solid #17203A}
.nav .mark{font:900 14px "Montserrat",sans-serif;color:#FFFFFF}
.btn{background:rgba(43,91,215,.16);color:#DCE4F5;border:1px solid #2B5BD7;border-radius:10px;
  font:900 13px/1 "Montserrat",sans-serif;padding:16px 28px;white-space:nowrap;
  box-shadow:0 0 22px rgba(43,91,215,.22)}
.btn:hover{background:#2B5BD7;color:#FFFFFF;box-shadow:0 0 30px rgba(43,91,215,.42)}
.btn--nav{padding:10px 17px;font-size:11.5px;border-radius:8px}
.act{margin-top:40px;gap:22px}
/* One localised background bloom, not a page-wide flood. */
.hero:before{content:"";position:absolute;left:50%;top:-18%;width:70vw;height:70vw;transform:translateX(-50%);
  background:radial-gradient(circle,rgba(43,91,215,.19) 0%,rgba(43,91,215,0) 62%);pointer-events:none}
.hero .wrap{position:relative;z-index:2}
.band{border-top:1px solid #17203A;border-bottom:1px solid #17203A;padding:42px 0;background:#0A0E1A}
.bullet{font-size:14px;color:#93A3C4}
.badges{margin-top:28px;gap:10px 36px}
.recognition{gap:20px;max-width:56ch}.recognition p{font-size:17px;line-height:1.75}
.links{gap:14px}
.link{font:900 14px "Montserrat",sans-serif;color:#5E84E8}
.stats{margin-top:48px}
.stat b{display:block;font:900 clamp(2.3rem,3.8vw,3rem)/1 "Montserrat",sans-serif;letter-spacing:-.04em;color:#FFFFFF}
.stat i{display:block;font-size:10.5px;letter-spacing:.22em;text-transform:uppercase;color:#5E84E8;margin:10px 0 10px}
.reasons{margin-top:48px;gap:0}
.reason{padding:26px 0;border-top:1px solid #17203A}
.reason:last-child{border-bottom:1px solid #17203A}
.reason .n{font-size:10.5px;letter-spacing:.22em;color:#5E84E8}
.reason p{font-size:14px;line-height:1.75;color:#93A3C4;max-width:52ch}
.refusals{margin-top:46px;gap:16px}
.refusal{border:1px solid #17203A;border-radius:12px;padding:22px;background:#0A0E1A}
.refusal b{font-size:10.5px;letter-spacing:.2em;color:#5E84E8}
.refusal p{margin-top:10px;font-size:14px;line-height:1.75;color:#93A3C4}
.outcomes p{font-size:14px;line-height:1.75;color:#93A3C4;padding:12px 0;border-bottom:1px solid #17203A}
/* Cobalt feature block: the offer. */
.offer-s{background:linear-gradient(180deg,#12275E 0%,#0C1A40 100%)}
.offer-s .wrap{border-color:rgba(255,255,255,.14)}
.offer-s .eyebrow{color:#A9C0F5}
.offer{gap:48px}
.price{font:900 clamp(2.8rem,4.4vw,3.6rem)/1 "Montserrat",sans-serif;letter-spacing:-.04em;margin:12px 0;color:#FFFFFF}
.includes{margin-top:24px;border:1px solid rgba(255,255,255,.16);border-radius:12px;padding:6px 22px;background:rgba(255,255,255,.04)}
.includes p{padding:15px 0;border-bottom:1px solid rgba(255,255,255,.1);font-size:14px;color:#DCE4F5}
.includes p:last-child{border-bottom:0}
.note-line{margin-top:22px;max-width:50ch;color:#A9C0F5}
.offer-s .btn{background:#FFFFFF;color:#12275E;border-color:#FFFFFF}
.offer-s .btn:hover{background:#DCE4F5;color:#12275E}
.step{border:1px solid rgba(255,255,255,.16);border-radius:12px;padding:22px;background:rgba(255,255,255,.04)}
.step .sn{display:block;font-size:10.5px;letter-spacing:.22em;color:#A9C0F5;margin-bottom:10px}
.step b{display:block;font:900 13.5px "Montserrat",sans-serif;margin-bottom:6px;color:#FFFFFF}
.step p{font-size:13px;line-height:1.7;color:#A9C0F5}
/* Cobalt feature blocks: the CTA bands. */
.banner{background:linear-gradient(180deg,#1E3F9E 0%,#13296A 100%)}
.banner .wrap{border-color:rgba(255,255,255,.16)}
.banner h2{color:#FFFFFF;max-width:24ch}
.bsub{color:#BFD0F7;margin:16px 0 30px;max-width:50ch}
.banner .btn{background:#FFFFFF;color:#13296A;border-color:#FFFFFF}
table{font-size:13.5px;min-width:660px}
thead th{font:900 11px "Montserrat",sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#5E84E8;border-bottom:1px solid #17203A;padding:18px 14px}
tbody th{color:#61729A;width:16%}
th,td{border-bottom:1px solid #17203A;padding:16px 14px}
.faq{margin-top:42px;border-top:1px solid #17203A}
details{border-bottom:1px solid #17203A}
summary{font:900 14.5px "Montserrat",sans-serif;color:#DCE4F5;padding:22px 0}
details p{font-size:14px;line-height:1.75;color:#93A3C4}
.close{text-align:center}
footer{border-top:1px solid #17203A;padding:56px 0;font-size:11.5px;letter-spacing:.16em;color:#61729A}
`,
  },

};

const only = process.argv[2];
const list = only ? { [only]: THEMES[only] } : THEMES;
if (only && !THEMES[only]) { console.error(`no such theme: ${only}`); process.exit(1); }
auditShared();
for (const [slug, t] of Object.entries(list)) console.log(`wrote ${writeVariant(slug, t)}`);
