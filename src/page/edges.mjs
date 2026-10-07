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

/** The edge keeps the file's own shape: the mask is drawn at the window width
    and its height follows (1600x360, so 22.5vw). Squashing it into a fixed
    height flattened the wave to about 12px of travel; at its natural ratio the
    edge travels 76px at 1440px wide, measured from the file. */
export const css = `
:root{--wc-edge-h:22.5vw}
.wc-edge-wave{position:relative;z-index:1;
  margin-top:calc(var(--wc-edge-h) * -1);padding-top:var(--wc-edge-h);
  -webkit-mask-image:url(/assets/img/frames/wave-edge.png),linear-gradient(#000,#000);
  mask-image:url(/assets/img/frames/wave-edge.png),linear-gradient(#000,#000);
  -webkit-mask-size:100% auto,100% calc(100% - var(--wc-edge-h) + 1px);
  mask-size:100% auto,100% calc(100% - var(--wc-edge-h) + 1px);
  -webkit-mask-position:top center,bottom center;mask-position:top center,bottom center;
  -webkit-mask-repeat:no-repeat,no-repeat;mask-repeat:no-repeat,no-repeat;
  mask-composite:add}
/* isolation:isolate makes the section its own stacking context, so a positioned
   child (the phone carries z-index:2) can no longer paint above the section
   that covers it. The section's contents are clipped, so the lag stays inside. */
`;

/** The motion layer, shipped only to a page with a parallax setting. */
export const motionCss = `
.wc-parallax{position:relative;isolation:isolate;z-index:0;overflow:hidden}
.wc-parallax > .wc-move{will-change:transform}
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
