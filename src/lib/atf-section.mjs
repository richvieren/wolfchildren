// atf-section.mjs — the above-the-fold block: its CSS, its markup and its script.
//
// It lives in its own module because atf-preview.mjs imports PIXEL and DATASET
// from variants.mjs, so variants.mjs importing the section back from there would
// be a cycle. One source either way: the preview page and the five variants
// render the same bytes. 2026-10-05.

// The above-the-fold section, exported so a variant embeds the real thing rather
// than a copy of it. Richard, 2026-10-05: "Put the new ATF section at the top,
// exactly as it is. Don't rebuild it, don't adjust it." One source, so it cannot
// drift between the preview and the five pages.
export const ATF_CSS = `
@font-face{font-family:"Morning Memories";src:url("/assets/fonts/morning-memories-400.woff2") format("woff2");font-weight:400;font-display:swap}
@font-face{font-family:"Special Elite";src:url("/assets/fonts/special-elite-400.woff2") format("woff2");font-weight:400;font-display:swap}

/* Re-grounded on the brand bible, 2026-10-05, Richard's call: the palette stands
   and only the faces changed. Not one of the eleven values this section used
   before was a bible colour. Mapped by role:
     paper  #F8F5EC -> cream  #DFD7C3   the only page background
     ink    #131613 -> green  #495543   all running text
     rust   #8B4133 -> cta    #AC2E20   button and announce fill, 4.63:1 with cream
     sienna #995A3D -> bark   #6B4A2F   the quiet accent, added to the bible for this
     olive  #828951 -> green  #495543   the moon; the section's one orange is the CTA
     line   sienna@28% -> tan #CDB494   tan is structure and never text
     muted  ink@68%    -> green           green at any alpha that still reads as
                                       muted fails small text on cream: .72 gives
                                       3.14:1 and even .90 only reaches 4.47. The
                                       bible's rule settles it, since only green
                                       carries running text. The secondary tone is
                                       gone and the hierarchy is size instead.
     field  #FDFBF5    -> cream           the bible: fields are cream with a tan border */
:root{
  --cream:#DFD7C3; --green:#495543; --tan:#CDB494; --orange:#DA4635;
  --cta:#AC2E20; --bark:#6B4A2F;
  --line:var(--tan); --muted:var(--green);
}
*{box-sizing:border-box}
html,body{overflow-x:clip}
body{margin:0;background:var(--cream);color:var(--green);
  font:400 15px/1.55 "Special Elite","Courier New",monospace;-webkit-font-smoothing:antialiased}
.wrap{padding:0 20px}

/* 1 announce */
.announce{background:var(--cta);color:var(--cream);text-align:center;
  padding:6px 16px;font-size:12px;letter-spacing:.01em}

/* 2 header */
.hdr{height:0;position:relative;z-index:3}
.mark{position:absolute;left:20px;top:10px;height:24px;width:124px;background:var(--green);
  -webkit-mask:url("/assets/img/logo/wolfchildren-logo-mask-1200.png") no-repeat left center/contain;
          mask:url("/assets/img/logo/wolfchildren-logo-mask-1200.png") no-repeat left center/contain}

/* 3 moon + eyebrow */
.badge{text-align:center;padding-top:8px}
.moon{width:18px;height:18px;color:var(--green);display:block;margin:0 auto -3px}
.moon svg{display:block;width:100%;height:100%}
.eyebrow{margin:0;font-size:12px;letter-spacing:.02em;color:var(--muted)}
.stem{width:1px;height:16px;background:var(--line);margin:5px auto 0}

/* 4 headline + sub */
h1{margin:4px 0 0;font-family:"Morning Memories",Georgia,serif;font-weight:400;
  font-size:36px;line-height:.98;letter-spacing:-.02em;text-align:center;text-wrap:balance}
.sub{margin:7px auto 0;max-width:48ch;text-align:center;font-size:13.5px;line-height:1.36;letter-spacing:-.01em;color:var(--muted)}

/* 5 carousel. The slide was a fixed 240px tall with a fluid width, so its ratio
   drifted from 1.33 on a 375px phone to 1.56 on a 430px one and no single image
   ratio could fit it. It is pinned now, so one delivered ratio fits every phone.
   4:3, because that is what Richard's own composites are and cropping his files
   to fit a box of mine is the wrong way round. */
.carousel{margin:8px 20px 0;position:relative}
.slides{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none}
.slides::-webkit-scrollbar{display:none}
.slide{flex:0 0 100%;scroll-snap-align:center;aspect-ratio:4/3;position:relative}
.slide img{display:block;width:100%;height:100%;object-fit:contain}
.empty{position:absolute;inset:0;display:grid;place-items:center;text-align:center;padding:18px;
  border:1px dashed var(--line);color:var(--bark);opacity:.75;font-size:11.5px;line-height:1.4}
.arrow{position:absolute;top:50%;transform:translateY(-50%);width:30px;height:30px;padding:0;
  border:1px solid var(--line);background:rgba(223,215,195,.94);color:var(--bark);border-radius:50%;
  font:400 17px/28px "Special Elite",monospace;cursor:pointer;z-index:2}
.arrow.prev{left:4px}.arrow.next{right:4px}
.dots{position:absolute;left:0;right:0;bottom:2px;display:flex;justify-content:center;gap:7px}
.dot{width:7px;height:7px;padding:0;border:0;border-radius:50%;background:var(--line);cursor:pointer}
.dot.on{background:var(--bark)}
.tag{position:absolute;left:0;top:0;background:rgba(223,215,195,.94);color:var(--bark);
  font-size:10.5px;letter-spacing:.09em;text-transform:uppercase;padding:5px 9px;border:1px solid var(--line)}

/* 6 birth details */
.form{margin-top:8px}
.flabel{font-size:11.5px;letter-spacing:.09em;text-transform:uppercase;color:var(--bark);margin-bottom:6px}
.row{display:flex;gap:6px}
.field{flex:1;height:44px;border:1px solid var(--line);background:var(--cream);border-radius:3px;
  padding:0 12px;font:400 13.5px/44px "Special Elite",monospace;color:var(--muted)}
.field + .field{flex:0 0 118px}
.field.full{margin-top:6px;flex:1 1 auto}

/* 7 CTA */
.cta{display:block;margin-top:8px;width:100%;height:50px;border:0;border-radius:3px;
  background:var(--cta);color:var(--cream);font:400 15px/50px "Special Elite",monospace;
  letter-spacing:.06em;text-align:center;text-decoration:none}
.under{margin-top:7px;text-align:center;font-size:11.5px;color:var(--muted)}
.under a{color:var(--bark)}

/* 8 reassurance */
.fuds{margin:12px 0 0;padding:10px 12px;border:1px solid var(--line);border-radius:4px;
  display:grid;grid-template-columns:1fr 1fr;gap:7px 12px}
.fud{display:grid;grid-template-columns:12px 1fr;gap:6px;font-size:10.5px;line-height:1.28;color:var(--muted)}
.fud b{color:var(--green);font-weight:400}
.tick{width:12px;height:12px;margin-top:1px;border:1px solid var(--bark);border-radius:50%;position:relative}
.tick:after{content:"";position:absolute;left:3.5px;top:1.5px;width:3px;height:6px;
  border-right:1.5px solid var(--bark);border-bottom:1.5px solid var(--bark);transform:rotate(42deg)}

/* 9 sticky bar */
.sticky{position:fixed;left:0;right:0;bottom:0;background:rgba(223,215,195,.96);
  border-top:1px solid var(--line);padding:9px 20px;display:flex;align-items:center;gap:12px;
  backdrop-filter:blur(8px)}
.sticky .price{font-size:13px;color:var(--muted);white-space:nowrap}
.sticky .price b{color:var(--green);font-weight:400}
.sticky .cta{margin:0;height:44px;line-height:44px;font-size:14px;flex:1}
.spacer{height:74px}
`;

export const atfMarkup = (T) => `


<p class="announce">${T.announce}</p>

<header class="hdr"><span class="mark"></span></header>

<div class="wrap">
  <div class="badge">
    <span class="moon"><svg viewBox="0 0 48 48"><mask id="c"><rect width="48" height="48" fill="#000"/><circle cx="24" cy="24" r="15" fill="#fff"/><circle cx="33" cy="20" r="14" fill="#000"/></mask><rect width="48" height="48" fill="currentColor" mask="url(#c)"/></svg></span>
    <p class="eyebrow">${T.eyebrow}</p>
    <div class="stem"></div>
  </div>

  <h1>${T.headline}</h1>
  <p class="sub">${T.sub}</p>
</div>

<div class="carousel">
  <div class="slides" id="slides">
    ${T.slides.map((s, i) => s.src
      ? `<div class="slide"><img src="${s.src}" width="${s.w}" height="${s.h}" alt="${s.alt}" ${i ? 'loading="lazy"' : ''}></div>`
      : `<div class="slide"><span class="empty">${s.brief}</span></div>`).join('\n    ')}
  </div>
  ${T.slides.length > 1 ? `<button class="arrow prev" type="button" aria-label="Previous">&#8249;</button>
  <button class="arrow next" type="button" aria-label="Next">&#8250;</button>
  <div class="dots">${T.slides.map((_, i) => `<button class="dot${i ? '' : ' on'}" type="button" aria-label="Slide ${i + 1}"></button>`).join('')}</div>` : ''}
</div>

<div class="wrap">
  <div class="form">
    <p class="flabel">${T.formLabel}</p>
    <div class="row">
      <span class="field">${T.fieldDate}</span>
      <span class="field">${T.fieldTime}</span>
    </div>
    <span class="field full" style="display:block">${T.fieldPlace}</span>
  </div>

  <a class="cta" href="#">${T.cta}</a>
  <p class="under">${T.under}</p>

  <div class="fuds">
    ${T.fuds.map(([h, t]) => `<p class="fud"><span class="tick"></span><span><b>${h}</b> ${t}</span></p>`).join('\n    ')}
  </div>
</div>

<div class="spacer"></div>
<div class="sticky">
  <span class="price">${T.stickyName}<br><b>${T.stickyPrice}</b></span>
  <a class="cta" href="#">${T.stickyCta}</a>
</div>

`;

export const ATF_JS = `
<script>
(function(){
  var sc=document.getElementById('slides'); if(!sc) return;
  var dots=[].slice.call(document.querySelectorAll('.dot'));
  if(!dots.length) return;
  var at=function(){ return Math.round(sc.scrollLeft/sc.clientWidth); };
  var go=function(i){ i=Math.max(0,Math.min(dots.length-1,i)); sc.scrollTo({left:sc.clientWidth*i,behavior:'smooth'}); };
  dots.forEach(function(d,i){ d.addEventListener('click',function(){ go(i); }); });
  var p=document.querySelector('.arrow.prev'), n=document.querySelector('.arrow.next');
  if(p) p.addEventListener('click',function(){ go(at()-1); });
  if(n) n.addEventListener('click',function(){ go(at()+1); });
  sc.addEventListener('scroll',function(){
    var i=at(); dots.forEach(function(d,j){ d.classList.toggle('on', j===i); });
  },{passive:true});
})();
</script>
`;


/** The section's CSS, confined to one wrapper.
 *
 *  Embedded in a variant, the ATF styled `body` and `:root`, so the host page's
 *  own body rule won the cascade and the section rendered on the variant's dark
 *  ground instead of its paper. It also shared bare `h1`, `.cta` and `.field`
 *  with the page underneath. Scoping solves both directions at once: the section
 *  keeps its own ground and type, and it cannot reach anything outside itself.
 *
 *  @font-face and keyframes are left alone; everything else is prefixed.
 */
export function scopedAtfCss(root = '.atf-root') {
  const out = [];
  const re = /@font-face\s*\{[^}]*\}|@keyframes[^{]*\{(?:[^{}]*\{[^}]*\}\s*)*\}|@media[^{]*\{(?:[^{}]*\{[^}]*\}\s*)*\}|[^{}]+\{[^}]*\}/g;
  const scopeSel = (sel) => sel.split(',').map((s) => {
    const t = s.trim();
    if (!t) return t;
    if (t === ':root' || t === 'html' || t === 'body' || t === 'html,body') return root;
    if (t.startsWith('body ')) return `${root} ${t.slice(5)}`;
    return `${root} ${t}`;
  }).join(',');

  // Comments sit in selector position and would be scoped as if they were one,
  // so they go first. They are documentation for the source, not for the page.
  const src = ATF_CSS.replace(/\/\*[\s\S]*?\*\//g, '');
  for (const m of src.match(re) || []) {
    if (m.startsWith('@font-face') || m.startsWith('@keyframes')) { out.push(m); continue; }
    if (m.startsWith('@media')) {
      const head = m.slice(0, m.indexOf('{') + 1);
      const inner = m.slice(m.indexOf('{') + 1, m.lastIndexOf('}'));
      const rules = (inner.match(/[^{}]+\{[^}]*\}/g) || [])
        .map((r) => `${scopeSel(r.slice(0, r.indexOf('{')))}{${r.slice(r.indexOf('{') + 1)}`);
      out.push(`${head}${rules.join('')}}`);
      continue;
    }
    out.push(`${scopeSel(m.slice(0, m.indexOf('{')))}{${m.slice(m.indexOf('{') + 1)}`);
  }
  // The wrapper has to behave like the page body the section was written for.
  return `${out.join('\n')}\n${root}{display:block;width:100%;margin:0;position:relative}\n`;
}
