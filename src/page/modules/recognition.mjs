// recognition — the second module. Restyled 2026-10-06 against Richard's "Meet
// your coach" reference, flipped: the text column on the left, the photo cluster
// on the right. Self-contained: its own markup, its own CSS from tokens, its own
// script, and nothing about where it sits. The id is the one it has always had.
export const id = 'recognition';

// Every colour, radius, shadow and tilt is a brand (--b-), skin (--s-) or
// ground (--g-) token. The percentages are layout, not look.
export const css = `
/* the paper: the squared sheet the homepage uses, blended over the ground so a
   dark module stays dark and a light one reads as paper. One token turns it off. */
.recognition-s{background-image:var(--s-texture);background-size:cover;
  background-position:center;background-blend-mode:var(--s-texture-blend)}
.rec{display:grid;gap:var(--s-space-block)}

/* the text column */
.rec-eyebrow{font-family:var(--b-body);color:var(--g-quiet);
  font-size:var(--s-type-eyebrow);letter-spacing:var(--s-type-eyebrow-ls);
  text-transform:uppercase;line-height:1.4}
.rec-rule{display:block;width:44px;height:1px;background:var(--b-tan);
  margin:10px 0 var(--s-space-block)}
.rec h2{font-family:var(--b-display);font-weight:400;color:var(--g-text);
  font-size:var(--s-type-display);line-height:var(--s-type-display-lh);
  letter-spacing:var(--s-type-display-ls);max-width:none}
.rec-lead{font-family:var(--b-body);color:var(--g-text);
  font-size:var(--s-type-lead);line-height:var(--s-type-lead-lh);
  letter-spacing:var(--s-type-body-ls);max-width:46ch;margin-top:var(--s-space-block)}
.rec-body{font-family:var(--b-body);color:var(--g-text);
  font-size:var(--s-type-body);line-height:var(--s-type-body-lh);
  letter-spacing:var(--s-type-body-ls);max-width:60ch;margin-top:var(--s-space-para)}
.rec-cta{display:inline-block;margin-top:var(--s-space-block);
  font-family:var(--b-body);font-size:var(--s-type-body);letter-spacing:.06em;
  text-transform:uppercase;text-decoration:none;cursor:pointer;
  padding:0 26px;height:54px;line-height:50px;
  background:var(--b-green);color:var(--b-cream);
  border:var(--s-hard-border);border-radius:var(--s-radius-btn-hard);
  box-shadow:var(--s-shadow-hard)}

/* the photo cluster: one large photograph, one small one overlapping its lower
   outer corner on a backing card, and two drawn marks. */
.rec-cluster{position:relative;padding:0 0 18% 0}
.rec-large{margin:0;transform:rotate(var(--s-tilt-a))}
.rec-large img{display:block;width:100%;height:auto;object-fit:contain;
  border:0;border-radius:var(--s-radius-photo)}
.rec-small{position:absolute;right:-4%;bottom:0;width:45%;margin:0;
  transform:rotate(var(--s-tilt-b))}
.rec-small-backing{position:absolute;inset:0;transform:translate(10px,10px);
  background:var(--b-cta);border-radius:var(--s-radius-photo)}
.rec-slides{position:relative;aspect-ratio:3/4}
.rec-slides img{position:absolute;inset:0;width:100%;height:100%;
  object-fit:contain;border:0;border-radius:var(--s-radius-photo);
  opacity:0;transition:opacity 900ms ease}
.rec-slides img.on{opacity:1}
.rec-mark{position:absolute;color:var(--b-tan);pointer-events:none}
.rec-mark svg{display:block;width:100%;height:auto}
.rec-mark-star{width:34px;right:-6%;top:-5%}
.rec-mark-squiggle{width:72px;right:38%;bottom:12%}
@media(prefers-reduced-motion:reduce){
  .rec-slides img{transition:none}
}
@media(min-width:900px){
  .rec{grid-template-columns:40% 45%;justify-content:space-between;
    align-items:start;gap:0}
}
`;

const STAR = '<span class="rec-mark rec-mark-star" aria-hidden="true"><svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M20 6v28M8.5 12.5l23 15M31.5 12.5l-23 15"/></svg></span>';
const SQUIGGLE = '<span class="rec-mark rec-mark-squiggle" aria-hidden="true"><svg viewBox="0 0 90 26" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M3 18c9-14 17 6 26-6s17 14 26 2 13 2 13 2"/></svg></span>';

export function markup(copy, settings = {}) {
  const g = settings.className ? ` ${settings.className}` : '';
  const big = settings.photo;
  const slides = settings.slideshow ?? [];
  return `<section class="s recognition-s${g}"><div class="wrap">
  <div class="rec">
    <div class="rec-text">
      <p class="rec-eyebrow">${copy.eyebrow}</p><span class="rec-rule"></span>
      <h2>${copy.h2}</h2>
      <p class="rec-lead">${copy.body[0]}</p>
      <p class="rec-body">${copy.body[1]}</p>
      <a class="rec-cta" href="#atf" data-rec-cta>${copy.cta}</a>
    </div>
    <div class="rec-cluster">
      <figure class="rec-large"><img src="${big.src}" width="${big.w}" height="${big.h}" alt="${big.alt}" loading="lazy" decoding="async"></figure>
      ${STAR}
      <figure class="rec-small"><span class="rec-small-backing" aria-hidden="true"></span>
        <span class="rec-slides">${slides.map((s, i) => `<img class="${i ? '' : 'on'}" src="${s.src}" width="${s.w}" height="${s.h}" alt="${i ? '' : s.alt}"${i ? ' aria-hidden="true"' : ''} loading="lazy" decoding="async">`).join('')}</span>
      </figure>
      ${SQUIGGLE}
    </div>
  </div>
</div></section>
<script>
(function(){
  // the button: back to the birth form, and the first field takes focus. The
  // fields are spans in the section's own markup, so focus needs a tabindex,
  // set here at runtime rather than by changing the ATF.
  var b=document.querySelector('[data-rec-cta]');
  if(b) b.addEventListener('click',function(e){
    var form=document.querySelector('#atf .form'); if(!form) return;
    e.preventDefault();
    form.scrollIntoView({behavior:'smooth',block:'center'});
    var f=form.querySelector('.field'); if(!f) return;
    if(!f.hasAttribute('tabindex')) f.setAttribute('tabindex','-1');
    setTimeout(function(){ f.focus({preventScroll:true}); },600);
  });
  // the small photograph crossfades; it stands still when the reader asks for
  // less motion.
  var imgs=[].slice.call(document.querySelectorAll('.rec-slides img'));
  if(imgs.length<2) return;
  if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var i=0;
  setInterval(function(){
    imgs[i].classList.remove('on');
    i=(i+1)%imgs.length;
    imgs[i].classList.add('on');
  },3500);
})();
</script>`;
}
