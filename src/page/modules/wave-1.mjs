// wave-1 — the transition between whats-inside and offer-v2. A full-bleed band
// on one gradient token, with a grainy wave along its top edge. It also owns the
// pin: whats-inside sticks once its bottom edge meets the bottom of the window,
// and this band scrolls up over it. The pin lives here, not in whats-inside, so
// the transition is one module you can drop in or take out.
//
// THE GRADIENT IS ONE LINE. --wave-gradient below. Variant C is
// linear-gradient(90deg,#CDB494,#D9A15A,#DA4635).
//
// The edge is assets/img/frames/wave-edge.png, used as a mask, so the band takes
// the edge's shape and grain and keeps our own colours. The file was downloaded
// from static.showit.co and reduced to its alpha channel, so the original
// colours are not in the repository at all.
export const id = 'wave-1';

// a photograph takes no ground; this band paints its own, so it does the same
// and leaves the light/dark alternation either side of it untouched.
export const ground = 'neutral';

// the grain: one feTurbulence, inline, no file
const GRAIN = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23g)' opacity='.42'/%3E%3C/svg%3E\")";

export const css = `
.wave-1-s{--wave-gradient:linear-gradient(90deg,#495543,#D9A15A,#AC2E20);
  --wave-edge-h:220px;--wave-h:45vh;
  padding:0;border:0;background:none;
  height:var(--wave-h);margin-top:calc(var(--wave-edge-h) * -1)}
/* the band: grain over the gradient, both cut by the edge mask */
.wave-1-band{height:100%;width:100%;
  background-image:${GRAIN},var(--wave-gradient);
  background-size:220px 220px,100% 100%;background-repeat:repeat,no-repeat;
  -webkit-mask-image:url(/assets/img/frames/wave-edge.png),linear-gradient(#000,#000);
  mask-image:url(/assets/img/frames/wave-edge.png),linear-gradient(#000,#000);
  -webkit-mask-size:100% var(--wave-edge-h),100% calc(100% - var(--wave-edge-h) + 1px);
  mask-size:100% var(--wave-edge-h),100% calc(100% - var(--wave-edge-h) + 1px);
  -webkit-mask-position:top center,bottom center;mask-position:top center,bottom center;
  -webkit-mask-repeat:no-repeat,no-repeat;mask-repeat:no-repeat,no-repeat;
  mask-composite:add}

/* the pin: whats-inside holds still, this band and everything after it ride over */
.whats-inside-s{z-index:0}
.wave-1-s,.wave-1-s ~ *{position:relative;z-index:1}

@media(max-width:899px){
  .wave-1-s{--wave-edge-h:110px;--wave-h:32vh}
}
@media(prefers-reduced-motion:reduce){
  .whats-inside-s{position:static!important;top:auto!important}
}
`;

export function markup(copy, settings = {}) {
  const g = settings.className ? ` ${settings.className}` : '';
  return `<section class="s wave-1-s${g}" aria-hidden="true">
  <div class="wave-1-band"></div>
</section>
<script>
(function(){
  var pinned=document.querySelector('.whats-inside-s');
  if(!pinned) return;
  var mq=window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  function place(){
    if(mq && mq.matches){ pinned.style.position=''; pinned.style.top=''; return; }
    // stick once the section's bottom edge reaches the bottom of the window
    pinned.style.position='sticky';
    pinned.style.top=(window.innerHeight - pinned.offsetHeight) + 'px';
  }
  place();
  window.addEventListener('resize', place);
  if(mq && mq.addEventListener) mq.addEventListener('change', place);
})();
</script>`;
}
