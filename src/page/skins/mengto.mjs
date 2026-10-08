// The mengto skin: the look as it shipped. Radii, shadows, borders, button and
// card shape, the photo frame and the spacing scale, as tokens — then the rules
// that use them. It names no colour of its own: every colour is a brand or a
// ground token.
export const id = 'mengto';

export const tokens = `
  --s-radius-card:14px; --s-radius-card-lg:20px; --s-radius-btn:11px;
  --s-radius-btn-sm:9px; --s-radius-btn-hard:6px; --s-radius-chip:7px;
  --s-radius-panel:12px; --s-radius-pill:999px; --s-radius-shell:20px;
  --s-border:1px solid var(--g-rule);
  --s-frame-border:1px solid var(--b-tan);
  --s-hard-border:2px solid var(--b-green-deep);
  --s-btn-border:1px solid #C4452F;
  --s-btn-fill:linear-gradient(180deg,var(--b-cta) 0%,#8F2419 100%);
  --s-chip-fill:radial-gradient(circle at 40% 32%,#C4452F 0%,#8F2419 70%);
  --s-shadow-card:0 5px 16px var(--g-shade);
  --s-shadow-btn:inset 0 1px 0 rgba(255,255,255,.34),0 4px 12px rgba(0,0,0,.38);
  --s-shadow-hard:5px 5px 0 var(--b-green-deep);
  --s-shadow-drop:0 4px 0 var(--b-green-deep);
  --s-shadow-shell:0 26px 54px var(--g-shade),inset 0 1px 0 rgba(255,255,255,.06);
  --s-shadow-shell-top:inset 0 1px 0 rgba(255,255,255,.09);
  --s-shadow-band:inset 0 1px 0 rgba(255,255,255,.055),inset 0 -1px 0 rgba(0,0,0,.4);
  --s-shadow-chip:0 0 9px rgba(201,138,60,.5),inset 0 1px 0 rgba(255,255,255,.4);
  --s-shadow-chip-flat:inset 0 1px 0 rgba(255,255,255,.08);
  --s-paper:var(--b-paper); --s-field-bg:#FFFFFF; --s-star:var(--b-gold);
  --s-space-section:84px; --s-space-section-wide:108px; --s-pad-card:24px;
  --s-type-display:clamp(32px,3vw,44px); --s-type-display-lh:.98; --s-type-display-ls:-.02em;
  --s-type-body:15px; --s-type-body-lh:1.5; --s-type-body-ls:-.01em;
  --s-space-block:24px; --s-space-para:18px;
  --s-radius-photo:24px; --s-tilt-a:-2deg; --s-tilt-b:2.5deg;
  --s-type-lead:19.5px; --s-type-lead-lh:1.45;
  --s-type-eyebrow:12px; --s-tighten:-.06em; --s-type-eyebrow-ls:.22em;
  --s-texture:url("/assets/img/bg.avif"); --s-texture-blend:soft-light;
`;

export const css = `



html,body{overflow-x:clip}
body{background:var(--b-cream);color:rgba(223,215,195,.82);font:400 15px/1.7 var(--b-body);padding:0 0 16px}
.announce{background:var(--b-cream);color:rgba(223,215,195,.62);text-align:center;padding:10px;font-size:11px;letter-spacing:.2em;text-transform:uppercase}
/* The app shell: one dominant rounded container inside the light field. */
.nav{margin:0 16px;background:linear-gradient(180deg,#3F4A39 0%,#3A4435 100%);border-radius:var(--s-radius-shell) var(--s-radius-shell) 0 0;
  border:1px solid var(--b-green);border-bottom:0;box-shadow:var(--s-shadow-shell-top);padding:0 24px}
.nav .mark{font:400 14px var(--b-display);color:var(--b-cream)}
/* 2026-10-07, Richard, standing rules: no section ever gets side borders, and
   every section runs edge to edge. The cream strips either side were this
   margin, not a border. */
.s,.band{margin:0;background:var(--g-bg);color:var(--g-text)}
.s{padding:var(--s-space-section) 0}@media(min-width:900px){.s{padding:var(--s-space-section-wide) 0}}
.wrap{max-width:1040px}
footer{margin:0 16px;background:var(--g-bg);border-radius:0 0 var(--s-radius-shell) var(--s-radius-shell);
  border:var(--s-border);box-shadow:var(--s-shadow-shell);
  padding:52px 0;font-size:12.5px;color:var(--g-quiet);letter-spacing:.1em}
h1,h2,h3{font-family:var(--b-display);font-weight:400;letter-spacing:-.035em;color:var(--g-text)}
h1{font-size:clamp(2.2rem,4.8vw,3.8rem);line-height:1.02;max-width:17ch}
h2{font-size:clamp(1.55rem,2.8vw,2.3rem);line-height:1.08;max-width:20ch}
h3{font-size:14.5px;line-height:1.4;color:var(--g-text)}
.lead{font-size:17px;line-height:1.72;max-width:56ch;color:var(--g-text)}
.eyebrow{font-size:10.5px;letter-spacing:.22em;text-transform:uppercase;color:var(--g-accent);margin-bottom:18px}
.small{font-size:12.5px;color:var(--g-quiet)}
.btn{background:var(--s-btn-fill);color:var(--b-cream);
  font:400 13.5px/1 var(--b-display);border-radius:var(--s-radius-btn);padding:16px 28px;white-space:nowrap;
  border:var(--s-btn-border);box-shadow:var(--s-shadow-btn)}
.btn:hover{filter:brightness(1.12)}
.btn--nav{padding:10px 17px;font-size:12px;border-radius:var(--s-radius-btn-sm)}
.act{margin-top:40px;gap:22px}
.band{padding:40px 0;box-shadow:var(--s-shadow-band)}
.bullet{font-size:14px;color:var(--g-text)}
.badges{margin-top:28px;gap:10px 36px}
.recognition{gap:20px;max-width:56ch}.recognition p{font-size:17px;line-height:1.72}
.links{gap:14px}
.link{font:400 14px var(--b-display);color:var(--g-accent)}
/* Nested object-like modules: one-pixel wrapper, top highlight, inset stack. */
.stats{margin-top:48px}
.stat,.reason,.refusal,.step,.includes,.tablewrap,details{
  background:var(--g-surface);border:var(--s-border);border-radius:var(--s-radius-card);
  box-shadow:var(--s-shadow-card)}
.stat{padding:var(--s-pad-card)}
.stat b{display:block;font:400 clamp(2.2rem,3.6vw,2.9rem)/1 var(--b-display);letter-spacing:-.04em;color:var(--g-text)}
.stat i{display:block;font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;color:var(--g-accent);margin:10px 0 10px}
.reasons{margin-top:48px;gap:14px}
.reason{padding:var(--s-pad-card)}
@media(min-width:900px){.reason{grid-template-columns:36px minmax(0,20ch) minmax(0,1fr);gap:24px}}
/* Status lights. */
.reason .n{display:grid;place-items:center;width:26px;height:26px;border-radius:var(--s-radius-pill);
  background:var(--s-chip-fill);color:var(--b-cream);
  font:400 11px/1 var(--b-display);box-shadow:var(--s-shadow-chip)}
.reason p{font-size:14px;line-height:1.72;color:var(--g-text)}
.refusals{margin-top:46px;gap:14px}
.refusal{padding:22px}
.refusal b{font:400 12px/1 var(--b-display);letter-spacing:.06em;color:var(--g-accent)}
.refusal p{margin-top:10px;font-size:14px;line-height:1.72;color:var(--g-text)}
.outcomes p{font-size:14px;line-height:1.72;color:var(--g-text);padding:12px 0;border-bottom:1px solid var(--g-rule)}
.offer{gap:48px}
.price{font:400 clamp(2.7rem,4.2vw,3.5rem)/1 var(--b-display);letter-spacing:-.04em;margin:12px 0;color:var(--g-accent)}
.includes{margin-top:24px;padding:6px 22px}
.includes p{padding:15px 0;border-bottom:1px solid var(--g-rule);font-size:14px}
.includes p:last-child{border-bottom:0}
.note-line{margin-top:22px;max-width:50ch}
.step{padding:22px}
.step .sn{display:grid;place-items:center;width:25px;height:25px;border-radius:var(--s-radius-chip);
  background:var(--g-bg);border:var(--s-border);
  color:var(--g-accent);font:400 11.5px/1 var(--b-display);margin-bottom:10px;
  box-shadow:var(--s-shadow-chip-flat)}
.step b{display:block;font:400 13.5px var(--b-display);margin-bottom:6px;color:var(--g-text)}
.step p{font-size:13px;line-height:1.68;color:var(--g-text)}
.banner{background:var(--g-bg)}
.banner h2{max-width:24ch}
.bsub{color:var(--g-text);margin:16px 0 30px;max-width:50ch}
table{font-size:13.5px;min-width:640px}
thead th{font:400 11px var(--b-display);letter-spacing:.14em;text-transform:uppercase;color:var(--g-accent);padding:18px 16px;border-bottom:1px solid var(--g-rule)}
tbody th{color:var(--g-quiet);width:16%;padding:15px 16px}
td{padding:15px 16px;border-bottom:1px solid var(--g-rule)}
.faq{margin-top:40px}
details{margin-bottom:12px;padding:0 22px}
summary{font:400 14.5px var(--b-display);color:var(--g-text);padding:20px 0}
details p{font-size:14px;line-height:1.72;color:var(--g-text)}
.close{text-align:center}
`;

// This page's own above-the-fold layer. The section's shared base lives in
// src/lib/atf-section.mjs and is not a skin: twenty-five other pages render it.
export const atfCss = `
/* The two elements the section does not have. Hidden everywhere, shown only in
   the desktop query below, so nothing under 900px moves. */
#atf .wc-rating,#atf .wc-reviews,#atf .wc-tape,#atf .wc-thumbs{display:none}
/* The pinned header is hidden everywhere and shown only below 900px, so no
   desktop rule is needed for it at all. */
#atf .wc-topbar{display:none}
/* ── 1. The announce bar is flush to the top of the window, at every width ──
   Every box above it, with its value:
     html            no rule here and no UA margin              0
     body            BASE sets margin:0; this theme's padding
                     is 0 0 16px, bottom only                   0
     #atf            margin:0 (scopedAtfCss) and margin:0
                     again on the wrapper rule                  0
     #atf::before    none exists; the only ::before rule on
                     the page sets font-synthesis               0
     .announce       padding 6px 16px, inside the bar           0 above
     .announce       ATF_GUARD's #atf p{margin:revert}. The bar
                     is a <p>, revert restores the UA
                     margin-block of 1em, and the bar is 12px   12px above
   On a phone #atf is a block with no border and no padding, so that 12px
   collapses through it and shows as the cream gap above the bar. On desktop
   #atf is a grid, so it shows as 12px of #atf's own cream. This is the only
   source, and it goes. Only the block margins: margin:0 also wiped the
   margin-left:calc(50% - 50vw) that atfDesktopCss sets for the full-bleed, so
   the bar started at the text column and ran off the right edge. Flush, not
   sticky: no position is set here. */
#atf>.announce{margin-block:0}

/* ── 2. The tick list ───────────────────────────────────────────────────────
   Every property that puts vertical space between two items, with its value:
     .fuds   margin        12px 0 0        above the list, not between items
     .fuds   padding       10px 12px (0 above 900px)   around, not between
     .fuds   border        1px (0 above 900px)         around, not between
     .fuds   display:grid  gap 7px 12px; 5px above 900px        7px / 5px
     .fud    display:grid  gap 6px, column gap to the tick      0 vertical
     .fud    line-height   1.28 on 10.5px = 13.44px;
                           on 13px above 900px = 16.64px        the line box
     .fud    margin        ATF_GUARD's #atf p{margin:revert}
                           restores the UA 1em: 10.5px, and
                           13px above 900px, above AND below    26px above 900px
     .tick   margin-top    1px, inside the row                  0
     ::before/::after      .tick:after is the tick mark,
                           position:absolute                    0
   Baseline to baseline above 900px that is 16.64 + 13 + 5 + 13 = 47.6px, and
   the grid does not collapse margins. The 8px to 5px change moved 5px of that
   47.6px, which is why nothing visible happened. The reverted UA margin is the
   source and it goes; the gap then is the whole distance between items.
   The headline-to-subline step is .sub's own margin-top of 7px, which beats
   #atf p because a class is more specific, so the 5px gap sits under it. */
#atf .fud{margin:0}

/* ── 3. Green where red was ─────────────────────────────────────────────────
   The announce bar, the buy button and the sticky bar's button. Both buttons
   carry class .cta, so one rule covers them. --cta #AC2E20 is no longer used
   inside the section. Cream on green is 5.50:1. */
#atf .announce{background:var(--green);color:var(--cream)}
#atf .cta{background:var(--green);color:var(--cream)}

/* ── 4. The buy button: a pill with a hard offset shadow in the darker green.
   #3A4435 is the bible's hover green. The brand bible allows no shadow heavier
   than 0 1px 2px and the design skill says zero shadows; this is Richard's
   instruction and it overrules both. Only the buy button in .wrap: the sticky
   bar's button keeps the shape it had, with the new colour. Full width here;
   two thirds of the column above 900px. */
#atf .wrap .cta{border-radius:var(--s-radius-pill);box-shadow:var(--s-shadow-drop)}

/* ── 6. The birth-detail fields read as inputs at every width. The bible has
   fields as cream with a tan border; white is Richard's instruction. */
#atf .field{background:var(--s-field-bg)}

@media(max-width:899px){
  /* ── 1. THE MOBILE REORDER ─────────────────────────────────────────────
     This is the line. The photograph's order value is the whole thing: -1
     lifts the framed carousel above the eyebrow, the headline, the subline,
     the fields, the button and the ticks, and below the announce bar and the
     logo row, which are pinned ahead of it. Put it back under the headline
     with: #atf{--m-photo:0} */
  #atf{--m-photo:-1}
  #atf{display:flex;flex-direction:column}
  #atf>.announce{order:-3}
  #atf>.hdr{order:-2}
  #atf>.carousel{order:var(--m-photo)}

  /* ── 1b. the divider under the eyebrow: 16px tall, now 8px. */
  #atf .stem{height:8px}

  /* ── 2. the desktop frame, on the phone: the matte, the hairline, the tape.
     The slides stay object-fit:contain from the section's own rule. */
  /* the logo sits in a zero-height header and floats over whatever follows it.
     With the photograph first, that is the frame, so the frame clears it:
     the mark is 24px tall at top:10px, and 44px puts the frame under it. */
  #atf>.carousel{background:var(--s-paper);border:var(--s-frame-border);padding:3.5%;margin-top:44px}
  #atf .wc-tape{display:block;position:absolute;top:-19px;left:50%;width:24%;
    height:auto;z-index:3;transform:translateX(-50%) rotate(-2deg);border:0;padding:0}

  /* ── 3. the buy button, as it is above 900px, full width. 46px of line-height
     inside 50px with 2px borders centres the label on both axes. */
  /* 1 — and more air around it: 8px above the button becomes 20px. */
  #atf .wrap .cta{border:var(--s-hard-border);border-radius:var(--s-radius-btn-hard);line-height:46px;
    box-shadow:var(--s-shadow-hard);margin-top:20px}

  /* ── 4. the slim pinned header, shown by the observer when the buy button
     has left the screen. The announce bar is not part of it. */
  #atf .wc-topbar{position:fixed;left:0;right:0;top:0;z-index:5;
    align-items:center;justify-content:space-between;gap:12px;
    background:var(--cream);border-bottom:1px solid var(--tan);padding:8px 16px}
  #atf .wc-topbar.on{display:flex}
  #atf .wc-topbar .mark{position:static;left:auto;top:auto;height:20px;width:46px}
  /* the label sat 2px high: line-height 30px inside a content box of 34px,
     which is the 38px height less the 2px borders top and bottom. */
  #atf .wc-topbar .cta{margin:0;width:auto;height:38px;line-height:34px;
    padding:0 16px;font-size:12px;border:var(--s-hard-border);border-radius:var(--s-radius-btn-hard);
    box-shadow:var(--s-shadow-hard)}

  /* ── 4. the tick list as it is above 900px: one column, no box, 10px between
     items, and 20px between the button and the list. */
  /* 2 — the ticks in a soft panel, and 24px under the button. One column and
     10px between items stand. */
  #atf .fuds{grid-template-columns:1fr;gap:10px;border:0;background:var(--s-paper);
    border-radius:var(--s-radius-panel);padding:16px 18px;margin-top:24px}

  /* ── 5. the ATF ends on cream, 40px clear of the module below it, which
     starts hard against the tick list today. */
  #atf{padding-bottom:40px}

  /* the fields take the tick panel's ground. The tan border stands, so they
     still read as inputs. Above 900px they stay white. */
  #atf .field{background:var(--s-paper)}
}

@media(min-width:900px){
  /* 1 — the announce bar reaches both edges of the window. It already carried
     width:100vw and a negative margin from atfDesktopCss(), and was clipped back
     to 1120px by the rule #atf{overflow-x:clip} — scopedAtfCss() maps the
     section's own html,body{overflow-x:clip} onto the wrapper, and clip clips to
     the padding box. The page keeps its own html,body clip, so releasing it here
     cannot give the document a sideways scrollbar. */
  #atf{overflow-x:visible}

  /* 2 — a thin cream header row, the logo at its left, nothing else in it. */
  /* 2 — the logo centred in the row. 3 — the tan rule under it goes. */
  #atf>.hdr{background:var(--cream);border-bottom:0;
    height:60px;display:flex;align-items:center;justify-content:center;margin:0 0 28px;padding:0}
  /* The mask is 1200x522 with no transparent padding, so at mask-size:contain
     inside a 146x27 box it paints 62x27 and mask-position:left center parks it
     against the left edge: the ink's centre sat 42px left of the element's
     centre, which is centred. The box stays 146px; the ink is centred in it. */
  #atf .mark{position:static;left:auto;top:auto;height:27px;width:146px;margin:0;
    -webkit-mask-position:center;mask-position:center}

  /* 3 — two columns, text left and photograph right, both starting on one line.
     The carousel spans the three left-hand rows and starts at their top. */
  /* 7 — a wider container, so the carousel grows with it. 80% of the window,
     never narrower than the 1120px it had, capped at 1380px. At 1280px the
     container stays 1120px and the carousel 513.5px; at 1728px the container is
     1380px and the carousel 647.3px, where it was 1120px and 513.5px. */
  #atf{width:max(1120px,80%);max-width:1380px;
    grid-template-columns:minmax(0,var(--w1)) minmax(0,var(--w2));column-gap:58px;
    /* The left column spread because of #atf>.carousel{grid-row:3/span 3}: a
       grid item taller than the rows it spans has its extra height shared
       equally between those rows, and rows 3, 4 and 5 are the rating, the
       headline block and the form block. align-content:start does not stop it;
       it places rows, it does not size them. Naming the rows fixes where the
       slack goes: rows 3 and 4 are min-content, row 5 takes the rest, so the
       column packs to the top and whatever the carousel's height is lands
       under the form. The six rows are announce, header, rating, headline
       block, form block, reviews; the spacer and the sticky bar are
       display:none here and make no row. */
    grid-template-rows:auto auto min-content min-content 1fr auto}
  #atf>.wc-rating{grid-column:var(--text)}
  #atf>.carousel{grid-column:var(--photo);grid-row:3/span 3;align-self:start;margin:0}
  #atf>:not(.carousel,.announce,.hdr,.wc-reviews){grid-column:var(--text)}

  /* ── 1. THE COLUMN SWAP ────────────────────────────────────────────────
     This is the line. --photo and --text are the two grid columns and --w1
     and --w2 the two track widths, so one declaration decides which side the
     framed carousel is on. Put the photograph back on the right with:
       #atf{--photo:2;--text:1;--w1:1fr;--w2:1.06fr}
     Nothing else moves: every element keeps its own rules, both columns still
     start on row 3, and grid-template-rows still packs the text column up. */
  #atf{--photo:1;--text:2;--w1:1.06fr;--w2:1fr}
  #atf>.wc-reviews{grid-column:1/-1}

  /* 4 — the left column, top to bottom. */
  #atf .wc-rating{display:flex;align-items:baseline;gap:9px;margin:0 0 15px}
  #atf .wc-stars{color:var(--bark);font-size:13px;letter-spacing:.14em}
  /* 4 — the rating row only: bigger, and a muted warm yellow. #9C7A2B is a
     bronze-mustard, 2.80:1 on cream; the stars are aria-hidden decoration, and
     the 4.8/5 beside them carries the meaning in green at 5.50:1. The review
     cards below keep the 13px bark stars they had. */
  #atf .wc-rating .wc-stars{font-size:19px;color:var(--s-star)}
  #atf .wc-rated{color:var(--green);font-size:15px}

  /* moon and eyebrow on one line; the divider is a mobile device and goes. */
  #atf .badge{display:flex;align-items:center;gap:9px;padding-top:0;text-align:left}
  #atf .moon,#atf .eyebrow{margin:0}
  /* 5 — the moon on the line. Two things put it low, both measured from the
     source, and both under 1.5px together:
       .moon{margin:0 auto -3px} — a -3px bottom margin from the phone layout.
         The rule above already zeroes it here, so it is not the live cause.
       the mask itself — circle(24,24,r15) minus circle(33,20,r14). The bite is
         taken 4 units above centre, so the crescent's area centroid sits at
         y 26.59 of 48, which is 0.97px below the middle of an 18px box.
       the text — the eyebrow's ink centre sits 0.47px above the middle of its
         18.6px line box (Special Elite, 12px, ascent 1440 descent -608 of 2048).
     align-items:center lines up the boxes, so the ink misses by the sum. */
  #atf .badge .moon{position:relative;top:-1.4px}
  #atf .stem{display:none}

  /* sized so the section's own line break is the only break there is. */
  #atf h1{font-size:clamp(32px,3vw,44px);text-align:left;margin-top:12px}

  /* 2026-10-08, Richard, desktop only: one measure for every text block in the
     copy column, and one vertical rhythm. 34rem is 544px at the 16px root.
     Headline 12, subline 10, without 24, benefits 8 apart, label 32, fields 12,
     button 20, logistics 12. */
  #atf .sub,#atf .sub-also,#atf .fuds,#atf .logistics{max-width:34rem;margin-left:0;margin-right:0}
  #atf .sub{text-align:left;font-size:15px;line-height:1.5;color:var(--green);margin-top:12px}
  #atf .sub-also{text-align:left;font-size:13.5px;line-height:1.45;opacity:.75;margin-top:10px}
  #atf .form{margin-top:32px}
  #atf .flabel{margin-bottom:12px}
  #atf .field.full{margin-top:12px}
  #atf .cta{height:54px;line-height:54px;font-size:16px;border-radius:var(--s-radius-pill)}
  /* 6 — a rectangle with a 6px radius, a dark green outline and a hard shadow
     down and to the right. The label centres on both axes: text-align:center
     from the section, and line-height 50px inside 54px with 2px borders. */
  #atf .wrap .cta{width:66%;border:var(--s-hard-border);border-radius:var(--s-radius-btn-hard);
    line-height:50px;box-shadow:var(--s-shadow-hard);margin-top:20px}
  /* the logistics line centres on the button's centre and holds one line. Its
     box is the button's, so the text spills evenly past both edges rather than
     wrapping. */
  #atf .logistics{width:66%;max-width:66%;text-align:center;white-space:nowrap;margin-top:12px}

  /* ── the pinned buy bar on desktop. Same element and same observer as the
     phone's: it appears once the ATF's buy button has passed the top of the
     window. The logo sits left, the page's standard button right. */
  #atf .wc-topbar{position:fixed;left:0;right:0;top:0;z-index:50;
    align-items:center;justify-content:space-between;gap:16px;
    background:var(--cream);border-bottom:1px solid var(--tan);padding:8px 32px}
  #atf .wc-topbar.on{display:flex}
  #atf .wc-topbar .mark{position:static;left:auto;top:auto;height:22px;width:114px}
  #atf .wc-topbar .cta{margin:0;width:auto}
  #atf .under{text-align:left}

  /* the benefits as a check list rather than a bordered well. 2026-10-08: they
     are the selling list now, so they read at the subline's size. */
  #atf .fuds{grid-template-columns:1fr;gap:8px;padding:0;border:0;background:none;margin-top:24px}
  #atf .fud{font-size:15px;line-height:1.45}

  /* 5 — the carousel in the frame the photographs on this page already wear:
     a cream matte, a tan hairline, and one piece of tape. No crop and no cover;
     the slides are 1400x1050 inside a 4:3 box, so contain fits exactly. */
  /* 5 — the carousel in the frame the photographs on this page already wear:
     a cream matte, a tan hairline, and one piece of tape. No crop and no cover;
     the slides are 1400x1050 inside a 4:3 box, so contain fits exactly. */
  /* the gallery centres against the copy column. Measured at 1440: it overhangs
     68px at the top and 113px at the bottom, so its centre sits 22px above the
     copy's. Narrowing the span to rows 3/5 was tried and reads worse: the
     gallery then starts above the badge. */
  #atf>.carousel{grid-row:3/span 5;align-self:center;
    background:var(--s-paper);border:var(--s-frame-border);
    padding:3.5%;overflow:visible}
  #atf .wc-stage{position:relative}
  /* the dots leave the photograph and sit in the flow, above the strip, so the
     strip cannot be covered by them. */
  #atf .dots{position:static;margin-top:10px}
  /* 5b — the strip: one preview per photograph, inside the frame. */
  #atf .wc-thumbs{display:flex;justify-content:center;gap:8px;margin-top:10px}
  #atf .wc-thumb{width:74px;aspect-ratio:4/3;padding:0;background:var(--s-paper);
    border:var(--s-frame-border);cursor:pointer;opacity:.7}
  #atf .wc-thumb img{display:block;width:100%;height:100%;object-fit:contain}
  #atf .wc-thumb.on{border-color:var(--bark);opacity:1}
  /* 6 — three photographs, three dots. The fourth slide is the shot brief for a
     photograph nobody has taken yet, and its dot came with it. Both are hidden
     here and both still stand on the phone. */
  #atf .slide:has(.empty){display:none}
  #atf .dots .dot:last-child{display:none}
  #atf .wc-tape{display:block;position:absolute;top:-19px;left:50%;width:24%;
    height:auto;z-index:3;transform:translateX(-50%) rotate(-2deg);border:0;padding:0}
  #atf .slide img{object-fit:contain;width:100%;height:100%}

  /* 6 — three reviews across the full width, under both columns. */
  /* 3 — the tan rule above the testimonials goes with it.
     2 — and the step down to them halves: it was margin-top 44px plus
     padding-top 28px, 72px in all; it is 22px plus 14px, 36px. */
  #atf>.wc-reviews{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));
    gap:18px;margin-top:22px;padding-top:14px;border-top:0;
    /* 2 — the module below is a .s section with 108px of top padding, so the
       testimonials sat 108px from it while two .s modules sit 108 + 108 = 216px
       apart. 108px below the cards makes it the same 216px. */
    margin-bottom:108px}
  /* 3 — the cards take the stat cards' radius and hairline from further down
     the page (.stat: border-radius 14px, border 1px solid #495543), on white,
     with the stat cards' outer shadow geometry tinted to the palette's green
     instead of black, because these sit on cream and not on the dark shell. */
  /* 1 — the buy button's treatment on the cards: white, a 20px radius, a 2px
     #3A4435 outline and the same hard offset shadow down and to the right. */
  #atf .wc-review{margin:0;padding:22px 20px;background:var(--s-paper);text-align:center;
    border:var(--s-hard-border);border-radius:var(--s-radius-card-lg);
    box-shadow:var(--s-shadow-hard)}
  #atf .wc-review blockquote{margin:0;color:var(--green);font-size:13.5px;line-height:1.55}
  /* the bottom row: the placeholder circle, the stars, the name. */
  #atf .wc-review figcaption{display:flex;align-items:center;justify-content:center;
    gap:12px;margin-top:16px;color:var(--bark);font-size:10.5px;
    letter-spacing:.09em;text-transform:uppercase}
  #atf .wc-face{width:40px;height:40px;flex:0 0 40px;border-radius:50%;background:var(--tan)}
  /* the stars as the rating row above the headline wears them. */
  #atf .wc-review .wc-stars{display:inline-block;margin:0;color:var(--s-star);
    font-size:19px;letter-spacing:.14em}
}`;
