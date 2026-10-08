// edges.mjs — the shared edge and motion layer. A page config asks for these on
// a module entry; no module reaches into its neighbour.
//
//   { id: 'offer-v2', edge: 'wave' }        a masked wave along the top edge,
//                                           overlapping the section above it
//   { id: 'whats-inside', parallax: 0.5 }   its contents lag at half scroll speed
//
// The wave edge is assets/img/frames/wave-edge.png, reduced to its alpha channel,
// used as a mask: the section keeps its own colours and takes the edge's shape
// and grain.

/** One feTurbulence, inline, no file. A section may paint it over its ground. */
export const GRAIN = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23g)' opacity='.21'/%3E%3C/svg%3E\")";

/** The wave edge. The mask is drawn at 115% of the window width, so the file
    keeps its own proportions and the grain its own shape; nothing is squashed.
    Measured from assets/img/frames/wave-edge.png (1600x360) over the columns
    that show at that size (208..1600, the right 87%): the swoop rises 87 rows,
    which is 90px at 1440 and 120px at 1920, and the first inked pixel is on
    row 1. One source row is 115/1600 = 0.071875vw. The layer holds every inked
    row (1 to 266, so 265 rows = 19.0469vw) and 40px of solid colour under it:
    314px at 1440, 114px at 390. Holding the spray too is what keeps it off the
    content above.

    The layer is its own element, never a mask on the section: the renderer puts
    one inside a module that asks for edge: 'wave', and it inherits the section's
    background, so the two carry the same gradient at the same width. It laps 2px
    over the section so no hairline can show between them. */
export const css = `
:root{--wc-mask:url(/assets/img/frames/wave-edge.png);
  --wc-mask-w:115%;--wc-ink:19.0469vw;--wc-mask-y:-0.071875vw;
  /* The mask is drawn 115% x 100vw wide, so it is 115% x 22.5vw = 25.875vw tall.
     The layer must never be taller than that, or its bottom strip carries no
     mask and the ground behind shows through: at 390px wide the mask is 100.8px
     and ink + 40px asks for 114.3px, which left an 8px cream band across the
     page. min() takes whichever is smaller. */
  --wc-wave-h:min(calc(var(--wc-ink) + 40px),25.875vw)}
.wc-edge-wave,.wc-edge-wave-2{position:relative;z-index:1}
/* The second edge, taken from the top of the "hey, i'm jade!" section on
   jadem.co.nz: that section's top element is strip_1.png, kept as its alpha and
   cropped to the band where it turns from clear to solid (rows 172 to 298 of
   512), saved as wave-edge-2.png, 1600x126. At 115% of the window width one
   source row is 0.071875vw, so the layer is 126 x 0.071875 = 9.0562vw, which is
   exactly the height the mask is drawn at: 130px at 1440, 35px at 390. Its edge
   rises 53px at 1440. The layer takes its colour from the section it belongs
   to, so a section with a flat ground gives a flat wave. */
.wc-edge-wave-2{--wc-mask:url(/assets/img/frames/wave-edge-2.png);
  --wc-wave-h:9.0562vw;--wc-mask-y:0}
/* The block above a wave keeps room for it, less the trailing margin that block
   already carries: the ATF's last section (.wc-reviews) has 108px of margin
   under it, so 105px comes off the padding and the wave's first inked pixel
   lands about 5px under the cards at 1440. max() keeps it at zero on a phone,
   where the layer is shorter than that margin anyway. body > #atf beats the
   ATF's own #atf rule on specificity, wherever it sits in the stylesheet. */
body > #atf{padding-bottom:max(0px,calc(var(--wc-wave-h) - 105px))}
.wc-wave{position:absolute;left:0;right:0;bottom:calc(100% - 2px);
  height:var(--wc-wave-h);background:inherit;pointer-events:none;
  -webkit-mask-image:var(--wc-mask);mask-image:var(--wc-mask);
  -webkit-mask-size:var(--wc-mask-w) auto;mask-size:var(--wc-mask-w) auto;
  -webkit-mask-position:right var(--wc-mask-y);mask-position:right var(--wc-mask-y);
  -webkit-mask-repeat:no-repeat;mask-repeat:no-repeat}
`;

/** The motion layer, shipped only to a page with a parallax setting. */
export const motionCss = `
.wc-parallax{position:relative;isolation:isolate;z-index:0;overflow:hidden;
  padding-top:0;padding-bottom:0}
/* the wrapper carries the section's own vertical padding, so a full-height
   panel inside it still spans the section, and the bottom padding carries the
   whole wave layer, spray included: the last line clears the wave's highest
   inked pixel by the section's padding plus the 2px lap. */
.wc-parallax > .wc-move{will-change:transform;position:static;
  padding-top:var(--s-space-section);
  padding-bottom:calc(var(--s-space-section) + var(--wc-wave-h))}
@media(min-width:900px){
  .wc-parallax > .wc-move{padding-top:var(--s-space-section-wide);
    padding-bottom:calc(var(--s-space-section-wide) + var(--wc-wave-h))}
}
@media(prefers-reduced-motion:reduce){.wc-parallax > *{transform:none!important}}
`;

/** The motion: the script wraps a .wc-parallax section's children in one
    .wc-move element and moves that, so nothing inside changes its stacking
    order. Moving the children one by one gave each its own stacking context and
    the phone fell behind the photograph. The lag starts when the top edge of
    whatever covers the section ([data-cover] in the next section) reaches the
    bottom of the window; before that the section scrolls normally. */
export const script = `<script>
(function(){
  var secs=[].slice.call(document.querySelectorAll('.wc-parallax'));
  if(!secs.length) return;
  var mq=window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var ticking=false;
  // One wrapper per section, made once: moving the children one by one gave each
  // of them its own stacking context, which dropped the phone behind the photo.
  function mover(s){
    var m=s.querySelector(':scope > .wc-move');
    if(m) return m;
    m=document.createElement('div');
    m.className='wc-move';
    while(s.firstChild) m.appendChild(s.firstChild);
    s.appendChild(m);
    return m;
  }
  // the height of whatever covers this section: the first [data-cover] layer
  // after it. A module may be followed by its own <script>, so the walk steps
  // over anything that holds no cover rather than looking at one sibling.
  function cover(s){
    for(var n=s.nextElementSibling; n; n=n.nextElementSibling){
      var c=n.matches && n.matches('[data-cover]') ? n : (n.querySelector && n.querySelector('[data-cover]'));
      if(c) return c.getBoundingClientRect().height;
    }
    return 0;
  }
  function off(){ secs.forEach(function(s){ mover(s).style.transform=''; }); }
  function frame(){
    ticking=false;
    if(mq && mq.matches) return off();
    var h=window.innerHeight;
    secs.forEach(function(s){
      var r=s.getBoundingClientRect();
      if(r.bottom < 0 || r.top > h) return;             // only while it is on screen
      var speed=parseFloat(s.getAttribute('data-parallax')) || 0.5;
      // the lag starts when the wave's own top edge reaches the bottom of the
      // window, which is the moment the cover begins to come over this section
      var travelled=Math.max(0, h - (r.bottom - cover(s)));
      var lag=travelled * speed;          // no cap: the section clips its own contents
      mover(s).style.transform='translate3d(0,' + lag.toFixed(1) + 'px,0)';
    });
  }
  function onScroll(){ if(!ticking){ ticking=true; requestAnimationFrame(frame); } }
  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', onScroll);
  if(mq && mq.addEventListener) mq.addEventListener('change', function(){ off(); onScroll(); });
  frame();
})();
</script>`;

/** The motion for a wave edge: the block above it moves down at half the scroll
    speed once the wave's top edge reaches the bottom of the window, so the wave
    rides up over it. The block itself is moved, not a wrapper, and nothing
    inside it is restructured. Desktop only: below 900px the ATF carries a fixed
    header, and a transform would make it a containing block and break it. */
export const edgeScript = `<script>
(function(){
  var pairs=[];
  [].forEach.call(document.querySelectorAll('[data-cover]'), function(wave){
    if(!wave.parentElement) return;
    var above=wave.parentElement.previousElementSibling;
    while(above && !above.getBoundingClientRect().height) above=above.previousElementSibling;
    if(above) pairs.push({ wave: wave, above: above });
  });
  if(!pairs.length) return;
  var wide=window.matchMedia ? window.matchMedia('(min-width: 900px)') : null;
  var still=window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var ticking=false;
  function clear(){ pairs.forEach(function(p){ if(p.above.style.transform) p.above.style.transform=''; }); }
  function frame(){
    ticking=false;
    if((wide && !wide.matches) || (still && still.matches)) return clear();
    pairs.forEach(function(p){
      // the scroll position at which the wave's top edge meets the bottom of the
      // window. On a tall window that moment is already behind the top of the
      // page, so it is clamped to 0: without that the block starts out moved and
      // leaves a strip above it.
      var waveTop=p.wave.getBoundingClientRect().top + window.scrollY;
      var trigger=Math.max(0, waveTop - window.innerHeight);
      var lag=Math.max(0, window.scrollY - trigger) * 0.5;
      if(lag<=0){ if(p.above.style.transform) p.above.style.transform=''; return; }
      p.above.style.transform='translate3d(0,' + lag.toFixed(1) + 'px,0)';
    });
  }
  function onScroll(){ if(!ticking){ ticking=true; requestAnimationFrame(frame); } }
  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', onScroll);
  [wide, still].forEach(function(mq){
    if(mq && mq.addEventListener) mq.addEventListener('change', function(){ clear(); onScroll(); });
  });
  frame();
})();
</script>`;
