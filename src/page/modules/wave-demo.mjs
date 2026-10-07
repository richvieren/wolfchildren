// wave-demo — a plain section (heading, paragraph) whose top edge is a wave.
// For readings/compass/wave-test only.
//
// THE WAVE IS ITS OWN LAYER. One empty div sits above the section, carries the
// same gradient, and wears the mask. The mask is on that div and nothing else:
// the section keeps its own background and its content is never masked, never
// clipped, never faded. It is an element rather than a ::before so the parallax
// script can measure its height.
//
// mask-size:200% auto draws the file at twice the window width, so the swoop is
// about 151px tall at 1440px wide (76px at 100%). mask-position:top right shows
// the half of the file with the deepest swoop; the measured travel per half is
// left 124px, centre 122px, right 151px.
export const id = 'wave-demo';

// it paints its own ground, so it takes none and does not flip the alternation
export const ground = 'neutral';

export const css = `
/* The mask is drawn at 115% of the window width, so the file keeps its own
   proportions and the grain its own shape; nothing is squashed. Measured from
   the file over the columns that show at that size (208..1600 of 1600, the
   right 87%): the swoop rises 87 rows, which is 90px at 1440 and 120px at 1920,
   and the first inked pixel is on row 1. One source row is 115/1600 = 0.071875vw.
   The layer holds every inked row (1 to 266, so 265 rows = 19.0469vw) and 40px
   of solid colour under it: 314px at 1440, 114px at 390. Holding the spray too
   is what keeps it off the sample link above.
   The tokens sit on :root because the section above reads the height too. */
:root{--wd-mask-w:115%;--wd-ink:19.0469vw;--wd-wave-h:calc(var(--wd-ink) + 40px);
  --wd-mask-y:-0.071875vw}
.wd{position:relative;z-index:1;
  background:var(--wd-gradient);background-size:100% 100%;background-repeat:no-repeat;
  min-height:70vh;padding:var(--s-space-section) 0}
/* bottom:calc(100% - 2px) laps the layer 2px over the section, so no hairline
   and no photograph can show between them. Both carry the same gradient at the
   same width, so the join is invisible. It is a real element, not a ::before,
   so the parallax script can measure its height. */
.wd-wave{position:absolute;left:0;right:0;bottom:calc(100% - 2px);
  height:var(--wd-wave-h);background:var(--wd-gradient);
  background-size:100% 100%;background-repeat:no-repeat;pointer-events:none;
  -webkit-mask-image:url(/assets/img/frames/wave-edge.png);
  mask-image:url(/assets/img/frames/wave-edge.png);
  -webkit-mask-size:var(--wd-mask-w) auto;mask-size:var(--wd-mask-w) auto;
  -webkit-mask-position:right var(--wd-mask-y);mask-position:right var(--wd-mask-y);
  -webkit-mask-repeat:no-repeat;mask-repeat:no-repeat}

/* ── the section above, on this bench only ────────────────────────────────
   The parallax script wraps a section's children in .wc-move and moves that
   one element, so nothing inside changes its stacking order. Three of
   whats-inside's rules name a direct child of the section, so they are
   repeated here for the wrapped shape, and the section's vertical padding
   moves to the wrapper, which keeps the photo panel at full height. The
   bottom padding carries the wave's height, so no row, button or link can
   end up under the wave. */
.wc-parallax{padding-top:0;padding-bottom:0}
.wc-parallax > .wc-move{position:static;
  padding-top:var(--s-space-section);
  padding-bottom:calc(var(--s-space-section) + var(--wd-wave-h))}
@media(min-width:900px){
  .wc-parallax > .wc-move{padding-top:var(--s-space-section-wide);
    padding-bottom:calc(var(--s-space-section-wide) + var(--wd-wave-h))}
  .whats-inside-s>.wc-move>.wrap{max-width:none;padding-left:40px;padding-right:40px}
  .whats-inside-s>.wc-move>.wi-photo{display:block;position:absolute;top:0;bottom:0;
    right:50%;left:calc(50% - 50vw);margin:0;padding:0;overflow:hidden;z-index:1}
  .whats-inside-s>.wc-move>.wi-photo img{display:block;width:100%;height:100%;
    object-fit:cover;object-position:50% 35%;border:0;transform:scaleX(-1)}
}
.wd-h{font-family:var(--b-display);font-weight:400;font-size:var(--s-type-display);
  line-height:var(--s-type-display-lh);letter-spacing:var(--s-type-display-ls);
  color:var(--b-green);margin:0 0 var(--s-space-para)}
.wd-p{font-family:var(--b-body);font-size:var(--s-type-body);
  line-height:var(--s-type-body-lh);color:var(--b-green);margin:0;max-width:60ch}
.wd-tag{font-family:var(--b-body);font-size:var(--s-type-eyebrow);
  letter-spacing:var(--s-type-eyebrow-ls);text-transform:uppercase;
  color:var(--b-bark);margin:0 0 10px}
`;

export function markup(copy, settings = {}) {
  const g = settings.className ? ` ${settings.className}` : '';
  return `<section class="s wave-demo-s wd${g}" style="--wd-gradient:${settings.gradient}">
  <div class="wd-wave" data-cover aria-hidden="true"></div>
  <div class="wrap">
    <p class="wd-tag">${copy.tag}</p>
    <h2 class="wd-h">${copy.heading}</h2>
    <p class="wd-p">${copy.body}</p>
  </div>
</section>`;
}
