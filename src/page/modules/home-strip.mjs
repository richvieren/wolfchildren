// home-strip — the photo strip and the gallery behind it, brought over from
// vieren.studio (Richard, 2026-10-17). The strip is a 35mm film band: sprocket holes
// above and below, a frame counter under it, Prev/Next, and an autoplay that stops
// when the visitor takes over. Pressing the strip opens the gallery: the photo
// diary's feed, one column, with its +/- zoom (1 = full width, 2 and 3 = narrower
// columns). Strip frames are 3:4, the ratio of the portrait photographs, so none is cropped.
// The photographs are stand-ins from the Compass set until Richard's own set arrives.
export const id = 'home-strip';
export const ground = 'neutral';

export const css = `
.home-strip{padding:0;position:relative;background:#1a1a1a}
.hstrip-bar{display:flex;justify-content:flex-end;gap:24px;padding:14px clamp(16px,3vw,40px) 4px}
.hstrip-bar button{font-family:var(--b-body);font-size:13px;letter-spacing:.14em;text-transform:uppercase;
  color:var(--b-cream);background:none;border:0;padding:4px 0;cursor:pointer}
.hstrip-bar button:hover{color:var(--b-tan)}
.hstrip-open{display:block;cursor:pointer;background:#1a1a1a;overflow:hidden}
.hstrip-open:focus-visible{outline:2px solid var(--b-green);outline-offset:3px}
.hstrip-holes{height:clamp(20px,2.8vw,38px);display:flex;align-items:center;justify-content:space-between;
  padding:0 .5vw;overflow:hidden}
.hstrip-holes i{width:clamp(6px,1.1vw,15px);height:clamp(10px,1.7vw,24px);background:#c9c5ba;border-radius:2px;flex:none}
.hstrip-track{display:flex;gap:clamp(4px,.7vw,10px);padding:0 .4vw;transition:transform .5s ease}
.hstrip-slide{flex:0 0 auto;width:clamp(180px,22vw,340px);aspect-ratio:3/4;overflow:hidden;margin:0}
.hstrip-slide img{display:block;width:100%;height:100%;object-fit:cover}
.hstrip-count{background:#1a1a1a;height:clamp(16px,1.8vw,24px);display:flex;align-items:center;padding:0 .5vw;
  font-family:var(--b-body);font-size:clamp(5px,.6vw,8px);letter-spacing:.04em;color:rgba(152,145,82,.6);
  text-transform:uppercase;overflow:hidden;white-space:nowrap;transform:rotate(180deg)}
.hstrip-count span{margin-right:80px;display:inline-block}

.hstrip-gal{position:fixed;inset:0;z-index:1000;background:#0a0a0a;color:#EEE8D8;overflow-y:auto;overscroll-behavior:contain}
.hstrip-gal[hidden]{display:none}
.hstrip-gtop{position:sticky;top:0;z-index:2;height:0;mix-blend-mode:difference;color:#fff}
.hstrip-gin{display:flex;align-items:flex-start;justify-content:space-between;padding:18px clamp(16px,3vw,40px)}
.hstrip-gin span,.hstrip-gin button{font-family:var(--b-body);font-size:14px;letter-spacing:.1em;text-transform:uppercase;
  color:inherit;background:none;border:0;padding:4px 0;cursor:pointer}
.hstrip-gin .z{display:flex;gap:10px;align-items:center}
.hstrip-logo{display:block;width:clamp(72px,8vw,110px);height:auto;margin:0 0 6px;filter:brightness(0) invert(1)}
.hstrip-feed{transition:width .4s ease,margin .4s ease}
.hstrip-feed img{display:block;width:100%;height:auto}
.hstrip-gal.z1 .hstrip-feed{width:100%}
.hstrip-gal.z2 .hstrip-feed{width:35%;margin:0 15% 0 auto}
.hstrip-gal.z2 .hstrip-feed img{margin-bottom:12px}
.hstrip-gal.z3 .hstrip-feed{width:15%;margin:0 15% 0 auto}
.hstrip-gal.z3 .hstrip-feed img{margin-bottom:16px}
.hstrip-gal.z2 .hstrip-feed,.hstrip-gal.z3 .hstrip-feed{padding-top:110px}
@media (max-width:760px){
  .hstrip-gal.z2 .hstrip-feed{width:70%;margin:0 auto}
  .hstrip-gal.z3 .hstrip-feed{width:40%;margin:0 auto}
}
`;

const holes = (n) => '<i></i>'.repeat(n);

export function markup(copy, settings = {}) {
  const g = settings.className ? ` ${settings.className}` : '';
  const slides = settings.strip.map((p) =>
    `      <figure class="hstrip-slide"><img src="${p.src}" width="${p.w}" height="${p.h}" alt="${p.alt}" loading="lazy" decoding="async"></figure>`).join('\n');
  const feed = settings.gallery.map((p) =>
    `      <img src="${p.src}" width="${p.w}" height="${p.h}" alt="${p.alt}" loading="lazy" decoding="async">`).join('\n');
  let count = '';
  for (let c = 20; c >= 1; c--) count += `<span>◀▶    ${String(c).padStart(2, '0')}    ——    ${copy.code}</span>`;
  return `<section class="s home-strip${g}" aria-label="${copy.label}">
  <div class="hstrip-bar"><button type="button" data-hstrip-prev>${copy.prev}</button><button type="button" data-hstrip-next>${copy.next}</button></div>
  <div class="hstrip-open" role="button" tabindex="0" aria-label="${copy.open}">
    <div class="hstrip-holes" aria-hidden="true">${holes(41)}</div>
    <div class="hstrip-track">
${slides}
    </div>
    <div class="hstrip-holes" aria-hidden="true">${holes(41)}</div>
    <div class="hstrip-count" aria-hidden="true">${count}</div>
  </div>
  <div class="hstrip-gal z1" role="dialog" aria-modal="true" aria-label="${copy.label}" hidden>
    <div class="hstrip-gtop"><div class="hstrip-gin">
      <div><img class="hstrip-logo" src="/assets/img/logo/wolfchildren-logo-cream-1600.webp" width="1600" height="696" alt="Wolf Children"><span>${copy.label}</span></div>
      <span class="z"><button type="button" data-hstrip-zin aria-label="${copy.zoomIn}">+</button><span aria-hidden="true">/</span><button type="button" data-hstrip-zout aria-label="${copy.zoomOut}">\u2212</button></span>
      <button type="button" data-hstrip-close>${copy.close}</button></div></div>
    <div class="hstrip-feed">
${feed}
    </div>
  </div>
<script>
(function(){
  var sec=document.currentScript.parentNode,
      open=sec.querySelector('.hstrip-open'),track=sec.querySelector('.hstrip-track'),
      slides=track.children,gal=sec.querySelector('.hstrip-gal'),
      pos=0,zoom=1,timer,reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  function step(){return slides.length>1?slides[1].offsetLeft-slides[0].offsetLeft:0}
  function room(){return Math.max(0,track.scrollWidth-open.clientWidth)}
  function max(){return step()?Math.ceil(room()/step()):0}
  function show(){pos=Math.min(pos,max());track.style.transform='translateX('+(-Math.min(pos*step(),room()))+'px)'}
  function stop(){clearInterval(timer)}
  sec.querySelector('[data-hstrip-prev]').addEventListener('click',function(){pos=Math.max(0,pos-1);show();stop()});
  sec.querySelector('[data-hstrip-next]').addEventListener('click',function(){pos=Math.min(max(),pos+1);show();stop()});
  if(!reduce)timer=setInterval(function(){pos=pos+1>max()?0:pos+1;show()},3500);
  addEventListener('resize',show);
  function openGal(){stop();gal.hidden=false;document.body.style.overflow='hidden';gal.scrollTop=0;gal.querySelector('[data-hstrip-close]').focus()}
  function closeGal(){gal.hidden=true;document.body.style.overflow='';open.focus()}
  function setZoom(z){zoom=Math.max(1,Math.min(3,z));gal.className='hstrip-gal z'+zoom}
  open.addEventListener('click',openGal);
  open.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();openGal()}});
  gal.querySelector('[data-hstrip-close]').addEventListener('click',closeGal);
  gal.querySelector('[data-hstrip-zin]').addEventListener('click',function(){setZoom(zoom-1)});
  gal.querySelector('[data-hstrip-zout]').addEventListener('click',function(){setZoom(zoom+1)});
  addEventListener('keydown',function(e){if(e.key==='Escape'&&!gal.hidden)closeGal()});
})();
</script></section>`;
}
