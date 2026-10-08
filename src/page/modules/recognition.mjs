// recognition — the second module. Restyled 2026-10-06 against Richard's "Meet
// your coach" reference, flipped: the text column on the left, the photo cluster
// on the right. Self-contained: its own markup, its own CSS from tokens, its own
// script, and nothing about where it sits. The id is the one it has always had.
import { GRAIN } from '../edges.mjs';

export const id = 'recognition';

// Every colour, radius, shadow and tilt is a brand (--b-), skin (--s-) or
// ground (--g-) token. The percentages are layout, not look.
export const css = `
/* the paper: the squared sheet the homepage uses, blended over the ground so a
   dark module stays dark and a light one reads as paper. One token turns it off. */
/* 2026-10-08, Richard: one gradient with the same grain the wave carries, in
   place of the dark ground and the squared sheet. The text column is on the
   left, over the green end. */
.recognition-s{--rec-gradient:linear-gradient(90deg,#495543,#CDB494);
  background-image:${GRAIN},var(--rec-gradient);
  background-size:220px 220px,100% 100%;background-repeat:repeat,no-repeat;
  background-blend-mode:normal}
.rec{display:grid;gap:var(--s-space-block)}

/* the text column */
.rec-eyebrow{font-family:var(--b-body);color:var(--g-text);
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
.rec-cta{margin-top:var(--s-space-block)}

/* the photo cluster: one large photograph, one small one overlapping its lower
   outer corner on a backing card, and two drawn marks. */
.rec-cluster{position:relative;padding:0 0 18% 0}
.rec-large{margin:0;transform:rotate(var(--s-tilt-a))}
.rec-large img{display:block;width:100%;height:auto;object-fit:contain;
  border:0;border-radius:var(--s-radius-photo)}
.rec-small{position:absolute;left:-4%;bottom:0;width:45%;margin:0;
  transform:rotate(var(--s-tilt-b))}
.rec-small-backing{display:block;position:absolute;inset:0;transform:translate(10px,10px);
  background:var(--b-tan);border-radius:var(--s-radius-photo)}
/* display:block, because a span is an inline box: aspect-ratio and the
   absolutely positioned slides inside it had no height, so the small
   photograph, its backing card and the squiggle beside them rendered as
   nothing. That was the bug, 2026-10-06. */
.rec-slides{display:block;position:relative;aspect-ratio:3/4}
/* the crossfade: the outgoing photograph keeps full opacity underneath while the
   incoming one fades in on top of it, so the card behind never shows through.
   .under is the one being left; .on is the one arriving. */
.rec-slides img{position:absolute;inset:0;width:100%;height:100%;
  object-fit:contain;border:0;border-radius:var(--s-radius-photo);
  opacity:0;z-index:0;transition:opacity 900ms ease}
.rec-slides img.under{opacity:1;z-index:1;transition:none}
.rec-slides img.on{opacity:1;z-index:2}
.rec-mark{position:absolute;color:var(--b-tan);pointer-events:none;z-index:3}
.rec-mark svg{display:block;width:100%;height:auto}
.rec-mark-star{width:34px;right:-6%;top:-5%}
/* the hook: a drawn ring around one word. inline-block keeps it attached to the
   word when the line wraps, and the em sizing makes it scale with the headline.
   Morning Memories carries no ornament of its own (GSUB: liga only, GPOS: kern,
   330 glyphs, no swsh/ornm/salt and no ornament files), so it is drawn here. */
.rec-tight{margin-left:var(--s-tighten)}
.rec-hook{position:relative;display:inline-block;color:inherit}
.rec-hook svg{position:absolute;left:-.16em;top:50%;transform:translateY(-50%);
  width:calc(100% + .32em);height:1.25em;overflow:visible;pointer-events:none;
  color:var(--b-tan)}
/* where the two photographs meet, on the inner side, and above them: at
   right:38% it was behind the small photograph, which is why it read as
   missing once that photograph started rendering. */
.rec-mark-squiggle{width:144px;left:34%;bottom:4%}
@media(prefers-reduced-motion:reduce){
  .rec-slides img{transition:none}
}
@media(min-width:900px){
  .rec{grid-template-columns:40% 45%;justify-content:space-between;
    align-items:start;gap:0}
}
`;

const STAR = '<span class="rec-mark rec-mark-star" aria-hidden="true"><svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M20 6v28M8.5 12.5l23 15M31.5 12.5l-23 15"/></svg></span>';
const SQUIGGLE = '<span class="rec-mark rec-mark-squiggle" aria-hidden="true"><svg viewBox="0 0 90 26" fill="none" stroke="currentColor" stroke-width="4.8" stroke-linecap="round"><path d="M3 18c9-14 17 6 26-6s17 14 26 2 13 2 13 2"/></svg></span>';

// One stroke, open where the pen starts and ends, drawn in tan.
const RING = '<svg viewBox="0 0 220 72" fill="none" stroke="currentColor" stroke-width="3"'
  + ' stroke-linecap="round" preserveAspectRatio="none" aria-hidden="true">'
  + '<path d="M62 8C30 11 8 22 6 36c-2 15 22 28 62 30 42 2 96-2 132-13 22-7 26-18 18-26'
  + 'C208 17 178 9 146 6"/></svg>';

/** Tightens one named word gap in the headline. The words are untouched: the
 *  pair to tighten is a field beside the copy, and the fix is one negative
 *  margin on the second word. Richard reads an extra space between "chart" and
 *  "a"; the served bytes carry one 0x20, so this is optical, not a double
 *  space, and it is reversible by deleting the field. */
function tighten(text, pair) {
  if (!pair || !text.includes(pair)) return text;
  const [a, b] = pair.split(' ');
  return text.replace(pair, `${a} <span class="rec-tight">${b}</span>`);
}

/** Wraps one word of the headline in the drawn ring. The copy itself is never
 *  edited: the word to mark is a field beside it. */
function hook(text, word) {
  if (!word || !text.includes(word)) return text;
  return text.replace(word, `<span class="rec-hook">${word}${RING}</span>`);
}

export function markup(copy, settings = {}) {
  const g = settings.className ? ` ${settings.className}` : '';
  const big = settings.photo;
  const slides = settings.slideshow ?? [];
  return `<section class="s recognition-s${g}"><div class="wrap">
  <div class="rec">
    <div class="rec-text">
      <p class="rec-eyebrow">${copy.eyebrow}</p><span class="rec-rule"></span>
      <h2>${hook(tighten(copy.h2, copy.tighten), copy.hook)}</h2>
      <p class="rec-lead">${copy.body[0]}</p>
      <p class="rec-body">${copy.body[1]}</p>
      <a class="wc-cta rec-cta" href="#atf" data-rec-cta>${copy.cta}</a>
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
    var out=imgs[i];
    i=(i+1)%imgs.length;
    var into=imgs[i];
    out.classList.remove('on'); out.classList.add('under');   // stays fully visible
    into.classList.remove('under');
    void into.offsetWidth;                                     // start the fade from 0
    into.classList.add('on');
    setTimeout(function(){ out.classList.remove('under'); }, 900);
  },3500);
})();
</script>`;
}
