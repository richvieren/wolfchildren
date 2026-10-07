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
export const GRAIN = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23g)' opacity='.42'/%3E%3C/svg%3E\")";

/** The edge height is one token, so a page can change the overlap in one line. */
export const css = `
:root{--wc-edge-h:220px}
@media(max-width:899px){:root{--wc-edge-h:110px}}
.wc-edge-wave{position:relative;z-index:1;
  margin-top:calc(var(--wc-edge-h) * -1);padding-top:var(--wc-edge-h);
  -webkit-mask-image:url(/assets/img/frames/wave-edge.png),linear-gradient(#000,#000);
  mask-image:url(/assets/img/frames/wave-edge.png),linear-gradient(#000,#000);
  -webkit-mask-size:100% var(--wc-edge-h),100% calc(100% - var(--wc-edge-h) + 1px);
  mask-size:100% var(--wc-edge-h),100% calc(100% - var(--wc-edge-h) + 1px);
  -webkit-mask-position:top center,bottom center;mask-position:top center,bottom center;
  -webkit-mask-repeat:no-repeat,no-repeat;mask-repeat:no-repeat,no-repeat;
  mask-composite:add}
.wc-parallax{z-index:0}
.wc-parallax > *{will-change:transform}
@media(prefers-reduced-motion:reduce){.wc-parallax > *{transform:none!important}}
`;

/** The motion: the contents of a .wc-parallax section lag while it is on screen. */
export const script = `<script>
(function(){
  var secs=[].slice.call(document.querySelectorAll('.wc-parallax'));
  if(!secs.length) return;
  var mq=window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var narrow=window.matchMedia ? window.matchMedia('(max-width: 899px)') : null;
  var ticking=false;
  function off(){ secs.forEach(function(s){ var c=s.firstElementChild; if(c) c.style.transform=''; }); }
  function frame(){
    ticking=false;
    if(mq && mq.matches) return off();
    var h=window.innerHeight;
    // the cap keeps the lag inside the overlap the next section's edge covers
    var cap=narrow && narrow.matches ? 110 : 220;
    secs.forEach(function(s){
      var c=s.firstElementChild;
      if(!c) return;
      var r=s.getBoundingClientRect();
      if(r.bottom < 0 || r.top > h) return;             // only while it is on screen
      var speed=parseFloat(s.getAttribute('data-parallax')) || 0.5;
      var passed=Math.max(0, -r.top);                   // how far its top went by
      var lag=Math.min(passed * speed, cap);
      c.style.transform='translate3d(0,' + lag.toFixed(1) + 'px,0)';
    });
  }
  function onScroll(){ if(!ticking){ ticking=true; requestAnimationFrame(frame); } }
  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', onScroll);
  if(mq && mq.addEventListener) mq.addEventListener('change', function(){ off(); onScroll(); });
  frame();
})();
</script>`;
