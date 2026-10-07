// wave-demo — a plain section (heading, paragraph) whose top edge is a wave.
// For readings/compass/wave-test only.
//
// THE WAVE IS ITS OWN LAYER. A ::before sits entirely above the section
// (bottom:100%), carries the same gradient, and wears the mask. The mask is on
// that pseudo-element and nothing else: the section keeps its own background and
// its content is never masked, never clipped, never faded.
//
// mask-size:200% auto draws the file at twice the window width, so the swoop is
// about 151px tall at 1440px wide (76px at 100%). mask-position:top right shows
// the half of the file with the deepest swoop; the measured travel per half is
// left 124px, centre 122px, right 151px.
export const id = 'wave-demo';

// it paints its own ground, so it takes none and does not flip the alternation
export const ground = 'neutral';

export const css = `
/* The layer covers the swoop and 40px of solid colour under it, nothing more.
   Measured from the file's right half (the half mask-position:right shows):
   the swoop runs from row 179 to row 266 of 360, and one source row is
   200/1600 = 0.125vw at mask-size:200%. So the swoop is 87 x 0.125 = 10.875vw
   and the mask is pushed up 179 x 0.125 = 22.375vw to put its top edge at the
   top of the layer. Height: 197px at 1440, 82px at 390. */
.wd{--wd-swoop:10.875vw;--wd-wave-h:calc(var(--wd-swoop) + 40px);--wd-mask-y:-22.375vw;
  position:relative;z-index:1;
  background:var(--wd-gradient);background-size:100% 100%;background-repeat:no-repeat;
  min-height:70vh;padding:var(--s-space-section) 0}
/* bottom:calc(100% - 2px) laps the layer 2px over the section, so no hairline
   and no photograph can show between them. Both carry the same gradient at the
   same width, so the join is invisible. */
.wd::before{content:"";position:absolute;left:0;right:0;bottom:calc(100% - 2px);
  height:var(--wd-wave-h);background:var(--wd-gradient);
  background-size:100% 100%;background-repeat:no-repeat;pointer-events:none;
  -webkit-mask-image:url(/assets/img/frames/wave-edge.png);
  mask-image:url(/assets/img/frames/wave-edge.png);
  -webkit-mask-size:200% auto;mask-size:200% auto;
  -webkit-mask-position:right var(--wd-mask-y);mask-position:right var(--wd-mask-y);
  -webkit-mask-repeat:no-repeat;mask-repeat:no-repeat}
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
  <div class="wrap">
    <p class="wd-tag">${copy.tag}</p>
    <h2 class="wd-h">${copy.heading}</h2>
    <p class="wd-p">${copy.body}</p>
  </div>
</section>`;
}
