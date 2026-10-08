// offer-v2 — the product block: a full-bleed split on paper, the photograph on
// the left and the buy box on a white card on the right, after MUD\WTR's
// product page. Self-contained: markup, CSS from tokens, script.
//
// 2026-10-08, Richard: one type system. Inter is gone, with its Google Fonts
// call; the buy box reads in the page's own two faces.
//
// THE CHECKOUT MAP is imported from offer-card, so one map still decides where
// the button goes. Every tier is selectable; a tier with no URL turns the button
// off instead of carrying a target of its own.
import { CHECKOUT } from './offer-card.mjs';

export const id = 'offer-v2';
// the stroke recognition draws around a word, here around the tier 3 label
const RING = '<svg class="ov-ring" viewBox="0 0 220 72" fill="none" stroke="currentColor"'
  + ' stroke-width="4" stroke-linecap="round" preserveAspectRatio="none" aria-hidden="true">'
  + '<path d="M62 8C30 11 8 22 6 36c-2 15 22 28 62 30 42 2 96-2 132-13 22-7 26-18 18-26'
  + 'C208 17 178 9 146 6"/></svg>';


const TIERS = [
  { key: 'one', name: 'One child', price: '$27', each: null, save: null, note: null },
  { key: 'two', name: 'Two children', price: '$47', each: '$23.50 each', save: 'Save $7', note: null },
  { key: 'three', name: 'Buy two, get one free', price: '$54', each: '$18 each', save: 'Save $27',
    note: 'Keep one as a gift, or for later', best: 'Best value' },
];

const PHOTO = {
  src: '/assets/img/compass2/offer.webp',
  w: 1200,
  h: 1600,
  alt: 'A child in a doorway at the end of the day, boots muddy',
};

export const css = `
/* 2026-10-08, Richard: the ground recognition carried until 7749d3c — the dark
   ground with the squared sheet blended over it. The buy box keeps its own
   white card, so its text stays on white. */
.offer-v2-s{background-image:var(--s-texture);background-size:cover;
  background-position:center;background-blend-mode:var(--s-texture-blend);
  padding:0 0 var(--s-space-section)}
.ov{display:grid}
.ov-left{display:grid;place-items:center;padding:32px 24px}
.ov-left img{display:block;max-width:100%;max-height:80vh;width:auto;height:auto;
  object-fit:contain;border:0;border-radius:24px}
.ov-right{padding:32px 24px}
/* the buy box keeps its own light card, so its text stays on light */
.ov-box{max-width:480px;margin:0 auto;background:#FFFFFF;
  border-radius:16px;padding:32px}

/* the page's two faces: Morning Memories on the title, Special Elite elsewhere */
.ov-title{font-family:var(--b-display);color:var(--b-green);
  font-size:var(--s-type-display);line-height:var(--s-type-display-lh);
  letter-spacing:var(--s-type-display-ls);margin:0 0 10px}
.ov-rating{display:flex;align-items:baseline;gap:9px;margin:0 0 12px;font-family:var(--b-body)}
.ov-stars{color:var(--b-gold);font-size:19px;letter-spacing:.14em}
.ov-rated{color:var(--b-green);font-size:var(--s-type-body)}
.ov-line{font-family:var(--b-body);font-size:var(--s-type-body);line-height:1.5;
  color:var(--b-green);margin:0 0 20px}

/* the tiers */
/* the hand-drawn circle around the label on the last tier */
.ov-best{position:relative;display:inline-block;margin-left:10px;color:var(--b-green);
  font-family:var(--b-body);font-size:12.5px;line-height:1;white-space:nowrap}
.ov-ring{position:absolute;left:-.5em;top:50%;transform:translateY(-50%);
  width:calc(100% + 1em);height:2.1em;overflow:visible;pointer-events:none;color:var(--b-tan)}
.ov-tiers{list-style:none;margin:0 0 20px;padding:0;display:grid;gap:10px}
.ov-tier input{position:absolute;opacity:0;width:0;height:0}
.ov-tier-box{display:grid;grid-template-columns:1fr auto;gap:2px 16px;align-items:center;
  padding:16px;background:#FFFFFF;border:1px solid var(--b-tan);border-radius:10px;cursor:pointer}
.ov-tier input:checked + .ov-tier-box{border:2px solid var(--b-green);padding:15px}
.ov-tier input:focus-visible + .ov-tier-box{outline:2px solid var(--b-green);outline-offset:2px}
.ov-name{display:flex;align-items:center;gap:10px;font-family:var(--b-body);
  font-size:var(--s-type-body);line-height:1.3;color:var(--b-green)}
.ov-dot{flex:0 0 16px;width:16px;height:16px;border-radius:50%;border:1px solid var(--b-green)}
.ov-tier input:checked + .ov-tier-box .ov-dot{background:var(--b-green);box-shadow:inset 0 0 0 3px #FFFFFF}
.ov-price{font-family:var(--b-body);font-size:20px;line-height:1;
  color:var(--b-green);text-align:right}
.ov-each{grid-column:1;display:flex;align-items:center;gap:8px;flex-wrap:wrap;
  font-family:var(--b-body);font-size:12.5px;line-height:1.5;
  color:var(--b-green);padding-left:26px}
.ov-save{font-family:var(--b-body);font-size:12.5px;color:var(--b-green);
  background:rgba(73,85,67,.1);border-radius:999px;padding:2px 8px}
.ov-note{grid-column:1;font-family:var(--b-body);font-size:13px;
  line-height:1.5;color:var(--b-green);padding-left:26px}
.ov-more{grid-column:1/-1;display:none;margin:12px 0 0;padding:0;list-style:none}
.ov-tier input:checked + .ov-tier-box .ov-more{display:grid;gap:8px}
.ov-more li{display:grid;grid-template-columns:14px 1fr;gap:10px;align-items:start;
  font-family:var(--b-body);font-size:12.5px;line-height:1.45;color:var(--b-green)}
.ov-tick{width:14px;height:14px;margin-top:3px;border:1px solid var(--b-green);
  border-radius:50%;position:relative}
.ov-tick:after{content:"";position:absolute;left:4px;top:2px;width:3.5px;height:7px;
  border-right:1.5px solid var(--b-green);border-bottom:1.5px solid var(--b-green);transform:rotate(42deg)}

/* the button */
.ov-cta{width:100%}
.ov-cta[aria-disabled="true"]{opacity:.45;box-shadow:none;cursor:default;pointer-events:none}
.ov-secure{font-family:var(--b-body);font-size:12.5px;line-height:1.6;
  color:var(--b-green);text-align:center;margin:12px 0 0}

/* the FAQ */
.ov-faq{margin-top:32px}
.ov-faq .ov-q{background:none;border:0;border-radius:0;box-shadow:none;margin:0;padding:0;
  border-top:1px solid var(--b-tan)}
.ov-faq .ov-q:last-child{border-bottom:1px solid var(--b-tan)}
.ov-faq .ov-q summary{list-style:none;cursor:pointer;display:flex;gap:16px;
  align-items:baseline;justify-content:space-between;padding:16px 0;
  font-family:var(--b-body);font-size:var(--s-type-body);line-height:1.4;color:var(--b-green)}
.ov-faq .ov-q summary::-webkit-details-marker{display:none}
.ov-faq .ov-q summary::after{content:"+";font-size:16px;color:var(--b-tan)}
.ov-faq .ov-q[open] summary::after{content:"\\2013"}
.ov-faq .ov-q summary:focus{outline:none}
.ov-faq .ov-q summary:focus-visible{outline:2px solid var(--b-green);outline-offset:2px}
.ov-faq .ov-a{font-family:var(--b-body);font-size:15px;line-height:1.6;
  color:var(--b-green);opacity:.8;margin:0 0 18px;max-width:60ch}

@media(min-width:900px){
  .ov{grid-template-columns:50% 50%}
  .ov-left{padding:48px}
  .ov-right{padding:32px 48px}
  .ov-box{margin:0}
}
`;

export function markup(copy, settings = {}) {
  const g = settings.className ? ` ${settings.className}` : '';
  const first = TIERS[0];
  const firstLive = Boolean(CHECKOUT[first.key]);

  const tiers = TIERS.map((t, i) => `        <li class="ov-tier">
          <input type="radio" name="ov-tier" id="ov-${t.key}" value="${t.key}"${i ? '' : ' checked'}>
          <label class="ov-tier-box" for="ov-${t.key}">
            <span class="ov-name"><span class="ov-dot" aria-hidden="true"></span>${t.name}${t.best ? `<span class="ov-best">${t.best}${RING}</span>` : ''}</span>
            <span class="ov-price">${t.price}</span>
            ${t.each || t.save ? `<span class="ov-each">${t.each ? `<span>${t.each}</span>` : ''}${t.save ? `<span class="ov-save">${t.save}</span>` : ''}</span>` : ''}
            ${t.note ? `<span class="ov-note">${t.note}</span>` : ''}
            <ul class="ov-more">
${copy.includes.map((x) => `              <li><span class="ov-tick" aria-hidden="true"></span><span>${x}</span></li>`).join('\n')}
            </ul>
          </label>
        </li>`).join('\n');

  return `<section class="s offer-v2-s${g}">
  <div class="ov">
    <div class="ov-left">
      <img src="${PHOTO.src}" width="${PHOTO.w}" height="${PHOTO.h}" alt="${PHOTO.alt}" loading="lazy" decoding="async">
    </div>

    <div class="ov-right">
      <div class="ov-box">
        <h2 class="ov-title">${copy.title}</h2>
        <p class="ov-rating" data-placeholder="review"><span class="ov-stars" aria-hidden="true">★★★★★</span><span class="ov-rated">${copy.rating}</span></p>
        <p class="ov-line">${copy.line}</p>
        <ul class="ov-tiers">
${tiers}
        </ul>
        <a class="wc-cta wc-cta--full ov-cta" data-ov-cta${firstLive ? ` href="${CHECKOUT[first.key]}"` : ' aria-disabled="true"'}>${copy.cta} ${first.price}</a>
        <p class="ov-secure">${copy.secure}</p>
        <div class="ov-faq">
${copy.faq.map(([q, a]) => `          <details class="ov-q" data-ov-q><summary>${q}</summary><p class="ov-a">${a}</p></details>`).join('\n')}
        </div>
      </div>
    </div>
  </div>
</section>
<script>
(function(){
  var links=${JSON.stringify(CHECKOUT)};
  var prices=${JSON.stringify(Object.fromEntries(TIERS.map((t) => [t.key, t.price])))};
  var label=${JSON.stringify(copy.cta)};
  var cta=document.querySelector('[data-ov-cta]');
  [].forEach.call(document.querySelectorAll('input[name="ov-tier"]'), function(r){
    r.addEventListener('change', function(){
      if(!cta) return;
      var url=links[r.value];
      cta.textContent=label + ' ' + prices[r.value];
      if(url){ cta.setAttribute('href', url); cta.removeAttribute('aria-disabled'); }
      // no link yet: the button carries no target at all
      else { cta.removeAttribute('href'); cta.setAttribute('aria-disabled','true'); }
    });
  });
  var qs=[].slice.call(document.querySelectorAll('[data-ov-q]'));
  qs.forEach(function(d){
    d.addEventListener('toggle', function(){
      if(!d.open) return;
      qs.forEach(function(o){ if(o!==d) o.open=false; });
    });
  });
})();
</script>`;
}
