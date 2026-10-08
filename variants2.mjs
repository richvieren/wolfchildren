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

import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BASE, FONTS, auditShared, writeVariant } from './variants.mjs';

// ─── mengto-skeuomorphic, desktop above the fold ──────────────────────────────
//
// Richard, 2026-10-05: a desktop composition for this one variant, modelled on
// the Grüns hero. Layout, order and proportions are theirs; the colours, the two
// faces and the photo frame are ours.
//
// Nothing here runs under 900px. The two elements that do not exist in the
// section (the rating line and the reviews) are hidden by default and only
// shown inside the desktop query, so the phone layout keeps the bytes it had.
//
// The reviews are invented. They are marked data-placeholder="review" and a test
// fails if that attribute ever reaches readings/compass/index.html.

export const WC_REVIEWS = [
  { q: 'I read it twice in one sitting. It described the bedtime battle we have been having for two years, and then told me what sits underneath it.',
    by: 'Marieke D.' },
  { q: 'I expected something vague. What came back was specific enough that I read parts of it out loud to my partner.',
    by: 'Sanne V.' },
  { q: 'The section on how my child handles change was uncomfortably accurate. We have changed how we do mornings because of it.',
    by: 'Priya R.' },
];

const STARS = '<span class="wc-stars" aria-hidden="true">★★★★★</span>';

const MENGTO_RATING = `
<p class="wc-rating" data-placeholder="review">${STARS}<span class="wc-rated">4.8/5 Based on dozens of users</span></p>`;

const MENGTO_TAPE =
  '<img class="wc-tape" src="/assets/img/frames/tape-1.png" alt="" aria-hidden="true" width="447" height="108">';

// The card: the review, then one bottom row with a photo placeholder, the five
// stars and the name. The placeholder carries its own data-placeholder marker,
// like every other invented element here.
const MENGTO_REVIEWS = `
<section class="wc-reviews" data-placeholder="review">
${WC_REVIEWS.map((r) => `  <figure class="wc-review" data-placeholder="review">
    <blockquote>${r.q}</blockquote>
    <figcaption><span class="wc-face" data-placeholder="review"></span>${STARS}<span class="wc-by">${r.by}</span></figcaption>
  </figure>`).join('\n')}
</section>`;

// Three insertions into the section's own markup. Each asserts its anchor count,
// because a replace that matches nothing changes nothing and says nothing.
// The fourth slide is a shot brief, not a photograph: `{ src: null, brief: ... }`
// in src/lib/atf-copy.mjs. It renders a dashed empty box, and the dots are one
// per slide, so three photographs carried four dots. It is hidden in the desktop
// query, not removed, because the phone layout must not change: the brief is
// still a slide there. The assertion below is what the CSS rule depends on.

// The stage: the photograph plus the arrows and the dots that point at it. The
// frame now also holds the thumbnail strip, and arrows positioned against the
// frame would centre on frame+strip rather than on the photograph. Styled only
// above 900px, so the phone keeps the geometry it had.
const STAGE = /<div class="slides"[\s\S]*?<div class="dots">[\s\S]*?<\/div>/;

/** One preview per photograph, from the slides already rendered. Same files, so
 *  the browser serves them from cache; CSS does the sizing. */
function mengtoThumbs(stage) {
  const shots = [...stage.matchAll(/<img src="([^"]+)"[^>]*alt="([^"]*)"/g)];
  if (!shots.length) throw new Error('mengtoAtf: no photographs to build thumbnails from');
  return `\n  <div class="wc-thumbs">${shots.map(([, src, alt], i) =>
    `<button class="wc-thumb${i ? '' : ' on'}" type="button" aria-current="${i ? 'false' : 'true'}"`
    + ` aria-label="Show photograph ${i + 1}"><img src="${src}" alt="${alt}" width="1400" height="1050" loading="lazy"></button>`,
  ).join('')}</div>`;
}

const MENGTO_THUMB_JS = `
<script>
(function(){
  var sc=document.getElementById('slides'); if(!sc) return;
  var th=[].slice.call(document.querySelectorAll('.wc-thumb')); if(!th.length) return;
  var at=function(){ return Math.round(sc.scrollLeft/sc.clientWidth); };
  th.forEach(function(b,i){ b.addEventListener('click',function(){
    sc.scrollTo({left:sc.clientWidth*i,behavior:'smooth'}); }); });
  var mark=function(){ var i=at(); th.forEach(function(b,j){
    b.classList.toggle('on', j===i); b.setAttribute('aria-current', j===i?'true':'false'); }); };
  sc.addEventListener('scroll',mark,{passive:true}); mark();
})();
(function(){
  var bar=document.querySelector('.wc-topbar'), btn=document.querySelector('.wrap .cta');
  if(!bar||!btn||!('IntersectionObserver' in window)) return;
  // #atf is moved by the parallax on desktop, and a transformed ancestor is the
  // containing block for a fixed child, so the bar would scroll away with it.
  // It lives on the body instead; its rules are not scoped to #atf.
  if(bar.parentElement!==document.body) document.body.appendChild(bar);
  // Off screen is not enough: with the photograph first the button starts below
  // the fold, which is also not intersecting. The header belongs to the state
  // where the button has gone past the TOP of the viewport, so the test is its
  // bottom edge above 0. The observer fires once on observe, so a page opened
  // already scrolled gets the right state too.
  new IntersectionObserver(function(e){
    var r=e[0];
    bar.classList.toggle('on', !r.isIntersecting && r.boundingClientRect.bottom < 0);
  },{threshold:0}).observe(btn);
})();
</script>`;

function mengtoAtf(html) {
  const put = (s, anchor, add, where) => {
    const n = s.split(anchor).length - 1;
    if (n !== 1) throw new Error(`mengtoAtf: anchor ${JSON.stringify(anchor)} matched ${n} times, expected 1`);
    return where === 'after' ? s.replace(anchor, anchor + add) : s.replace(anchor, add + anchor);
  };
  let out = put(html, '</header>', MENGTO_RATING, 'after');
  out = put(out, '<div class="carousel">', MENGTO_TAPE, 'after');

  // The desktop rules hide the last slide and the last dot. Both assume the shot
  // brief is the last slide and that there is exactly one of it.
  const empties = (out.match(/<span class="empty">/g) || []).length;
  if (empties !== 1) throw new Error(`mengtoAtf: expected 1 empty slide, found ${empties}`);
  if (!/<span class="empty">[^<]*<\/span><\/div>\s*<\/div>/.test(out)) {
    throw new Error('mengtoAtf: the empty slide is no longer the last one; the desktop rule would hide a photograph');
  }
  const dots = (out.match(/<button class="dot/g) || []).length;
  const slides = (out.match(/<div class="slide">/g) || []).length;
  if (dots !== slides) throw new Error(`mengtoAtf: ${dots} dots for ${slides} slides`);

  // 5 — "Or read a whole one free before you decide." goes, at every width.
  // Removed here, not in src/lib/atf-copy.mjs, so the other variants and the
  // page we sell from keep the approved copy.
  const under = out.match(/\s*<p class="under">[\s\S]*?<\/p>/g) || [];
  if (under.length !== 1) throw new Error(`mengtoAtf: expected 1 .under line, found ${under.length}`);
  out = out.replace(under[0], '');

  // 4 — the fixed bottom bar and the spacer that cleared it go; a slim pinned
  // header takes their place. Its button carries the section's own CTA label,
  // so no new copy is invented here.
  const sticky = out.match(/\s*<div class="spacer"><\/div>\s*<div class="sticky">[\s\S]*?<\/div>/);
  if (!sticky) throw new Error('mengtoAtf: the sticky bar was not found');
  out = out.replace(sticky[0], '');
  const label = out.match(/<a class="cta" href="#">([^<]+)<\/a>/);
  if (!label) throw new Error('mengtoAtf: the buy button was not found');
  out += `\n<div class="wc-topbar"><span class="mark"></span>`
    + `<a class="cta wc-cta" href="#">${label[1]}</a></div>`;

  const stage = out.match(STAGE);
  if (!stage) throw new Error('mengtoAtf: the carousel stage was not found');
  out = out.replace(STAGE, `<div class="wc-stage">${stage[0]}</div>${mengtoThumbs(stage[0])}`);

  return out + MENGTO_REVIEWS + MENGTO_THUMB_JS;
}

// MENGTO_ATF_CSS moved to src/page/skins/mengto.mjs (atfCss) on 2026-10-06.

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

  // ── MengTo / clean-minimal-beige-light-mode ────────────────────────────────
  // Layered beige, stone, cream and off-white with very low-contrast borders, a
  // centred master container, a painted radial wash behind the page rather than
  // flat white, thin dividers, low-radius understated buttons, and the accent
  // used only as a signal. Its "Avoid" list rules out heavy shadows and
  // high-saturation accents, so there are none.

  // ── MengTo / book-serif-index ──────────────────────────────────────────────
  // Two-zone composition: a dark outer interface shell with a warm paper
  // reading surface centred inside it. Serif body with generous leading, mono
  // section labels with heavy tracking, a drop cap, folio markers on the
  // reasons, edge and crease shading on the paper, and a subdued oxblood accent,
  // which is one of the three the skill names when no brand accent exists.
  // NOT BUILT, DECLARED: the index rail. It asks for sidebar chapter lists and
  // archive groupings. The Compass page has one linear scroll and no chapters,
  // so a rail would be invented navigation pointing at nothing.

  // ── MengTo / editorial-tech ────────────────────────────────────────────────
  // Asymmetric editorial composition on controlled dark neutrals: offset
  // alignment rather than a centred SaaS hero, exposed grid traces and section
  // rules so the page reads engineered, mono utility labels against one large
  // display moment per section, and a single accent that punctuates rather than
  // fills. Its Avoid list rules out neon, HUD chrome and multi-colour palettes.
  // NOT BUILT, DECLARED: the cinematic media bands and inset photography
  // panels. They are half of this skill's identity and there is no photography
  // in the variant skeleton, so the layout carries the rhythm alone.

  // ── MengTo / light-mode-paper-technical ────────────────────────────────────
  // A darker outer field with a framed paper interior: generous radius on the
  // master container, soft shadow, a low-contrast diagonal texture across the
  // large paper regions so the surface reads material, thin inset rules,
  // L-brackets and corner marks, and one accent that punctuates.

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

  // ── MengTo / agency-grid-layout-minimal ────────────────────────────────────
  // A disciplined multi-column grid with large open spans and generous negative
  // space. Oversized headlines with tight tracking are the anchor; tiny
  // uppercase metadata sits in adjacent columns. Surfaces stay minimal: light
  // neutrals, thin separators, very restrained accent, understated buttons with
  // small uppercase labels rather than loud pills. Its Avoid list rules out
  // repeated cards, heavy borders and filling every gap, so gaps are left.

  // ── MengTo / split-layout-technical ────────────────────────────────────────
  // Two near-equal vertical panels on desktop, each with a distinct role: one
  // atmospheric and spatial, the other dense and informational. Thin frame
  // lines, inset boundary rules, corner markers and measured padding so each
  // panel reads as a technical display surface. Mono utility labelling on the
  // rails against quiet editorial headlines. Panels stack on small screens
  // without losing the sense of separate zones, which is its own instruction.

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
    v2: true,
    title: 'MengTo · high-contrast-skeuomorphic-clean',
    atfV2: mengtoAtf,
    note: 'light outer page framing a deep charcoal app shell · moulded surfaces with vertical gradients, top-edge highlights, inset shadow stacks and soft outer falloff · touchable buttons with layered fill and bevel, hover by brightness not glow · one signal accent for status and focus',
    // The look moved to src/page/skins/mengto.mjs on 2026-10-06, so there is one
    // source for it. What stays here is the ATF's markup transform above, which
    // this page's renderer still calls. The CSS that was here is gone, not
    // copied: two copies of a skin is how a page starts drifting from itself.
    css: '',

  },

  // ── MengTo / dark-blue-contrasting-clean ───────────────────────────────────
  // A near-black navy base with tonal variation rather than flat pure black,
  // with cobalt feature blocks used as the contrast moments: the CTA bands and
  // the offer. White type over pale-blue support copy. Thin outer rails,
  // border-x container lines and small corner squares hold the composition.
  // Blue glow stays soft and localised in background blooms and button
  // emphasis instead of flooding the page, which its guidance insists on.
  // Light to regular weights with small uppercase utility numbering.

};

// Only when run directly, so build-mengto.mjs can import THEMES without this
// file writing fifteen pages as a side effect of the import.
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const only = process.argv[2];
  const list = only ? { [only]: THEMES[only] } : THEMES;
  if (only && !THEMES[only]) { console.error(`no such theme: ${only}`); process.exit(1); }
  auditShared();
  for (const [slug, t] of Object.entries(list)) {
    // mengto-skeuomorphic is assembled from modules now (src/page/) and built by
    // build-mengto.mjs. Writing it from here would put the pre-refactor bytes
    // back and lose the variant id, so this file keeps only its skin.
    if (slug === 'mengto-skeuomorphic') { console.log('skipped mengto-skeuomorphic: build it with node build-mengto.mjs'); continue; }
    console.log(`wrote ${writeVariant(slug, t)}`);
  }
}
