// offer-v2 — the product block: one large photograph on the left, the buy box on
// the right, after MUD\WTR's and Glamory's product pages. Self-contained:
// markup, CSS from tokens, script. It sits on the dark green ground.
//
// THE CHECKOUT MAP is imported from offer-card, so one map still decides where
// the button goes. Every tier is selectable; a tier with no URL turns the button
// off instead of carrying a label of its own.
import { CHECKOUT } from './offer-card.mjs';

export const id = 'offer-v2';

const TIERS = [
  { key: 'one', name: 'One child', price: '$27', each: null, save: null, note: null },
  { key: 'two', name: 'Two children', price: '$47', each: '$23.50 each', save: 'Save $7', note: null },
  { key: 'three', name: 'Buy two, get one free', price: '$54', each: '$18 each', save: 'Save $27',
    note: 'Keep one as a gift, or for later' },
];

const PHOTO = {
  src: '/assets/img/compass2/offer.webp',
  w: 1200,
  h: 1600,
  alt: 'A child in a doorway at the end of the day, boots muddy',
};

export const css = `
.ov{display:grid;gap:var(--s-space-section)}

/* left: one photograph, as large as the column allows, uncropped */
.ov-photo{margin:0;border-radius:var(--s-radius-photo)}
.ov-photo img{display:block;width:100%;height:auto;object-fit:contain;border:0;
  border-radius:var(--s-radius-photo)}

/* right: cream text on the dark ground */
.ov-title{font-family:var(--b-display);font-weight:400;color:var(--g-text);
  font-size:var(--s-type-display);line-height:var(--s-type-display-lh);
  letter-spacing:var(--s-type-display-ls);margin:0 0 10px}
.ov-rating{display:flex;align-items:baseline;gap:9px;margin:0 0 12px;font-family:var(--b-body)}
.ov-stars{color:var(--b-tan);font-size:19px;letter-spacing:.14em}
.ov-rated{color:var(--g-text);font-size:var(--s-type-body)}
.ov-line{font-family:var(--b-body);font-size:var(--s-type-body);line-height:1.5;
  color:var(--g-text);opacity:.85;margin:0 0 var(--s-space-block)}

/* the tier boxes stay light, with green text */
.ov-tiers{list-style:none;margin:0 0 var(--s-space-block);padding:0;display:grid;gap:10px}
.ov-tier input{position:absolute;opacity:0;width:0;height:0}
.ov-box{display:grid;grid-template-columns:1fr auto;gap:4px 16px;align-items:center;
  padding:16px;background:var(--b-paper);color:var(--b-green);
  border:1px solid var(--b-tan);border-radius:var(--s-radius-btn-hard);cursor:pointer}
.ov-tier input:checked + .ov-box{border:2px solid var(--b-green);padding:15px}
.ov-tier input:focus-visible + .ov-box{outline:2px solid var(--b-paper);outline-offset:2px}
.ov-name{display:flex;align-items:center;gap:10px;font-family:var(--b-body);
  font-size:var(--s-type-body);color:var(--b-green)}
.ov-dot{flex:0 0 16px;width:16px;height:16px;border-radius:50%;border:1px solid var(--b-green)}
.ov-tier input:checked + .ov-box .ov-dot{background:var(--b-green);box-shadow:inset 0 0 0 3px var(--b-paper)}
.ov-price{font-family:var(--b-display);font-weight:400;font-size:var(--s-type-lead);
  line-height:1;color:var(--b-green);text-align:right}
.ov-each{grid-column:2;font-family:var(--b-body);font-size:var(--s-type-eyebrow);
  line-height:1.5;color:var(--b-bark);text-align:right}
.ov-note{grid-column:1;font-family:var(--b-body);font-size:var(--s-type-eyebrow);
  line-height:1.5;color:var(--b-bark)}
.ov-more{grid-column:1/-1;display:none;margin:10px 0 0;padding:0;list-style:none}
.ov-tier input:checked + .ov-box .ov-more{display:grid;gap:7px}
.ov-more li{display:grid;grid-template-columns:14px 1fr;gap:10px;align-items:start;
  font-family:var(--b-body);font-size:var(--s-type-eyebrow);line-height:1.5;color:var(--b-green)}
.ov-tick{width:14px;height:14px;margin-top:2px;border:1px solid var(--b-green);border-radius:50%;position:relative}
.ov-tick:after{content:"";position:absolute;left:4px;top:2px;width:3.5px;height:7px;
  border-right:1.5px solid var(--b-green);border-bottom:1.5px solid var(--b-green);transform:rotate(42deg)}

/* the button reads on the dark ground: cream fill, green label */
.ov-cta{display:block;width:100%;text-align:center;font-family:var(--b-body);
  font-size:var(--s-type-body);letter-spacing:.06em;text-transform:uppercase;text-decoration:none;
  height:54px;line-height:50px;background:var(--b-paper);color:var(--b-green);
  border:2px solid var(--b-green-deep);border-radius:var(--s-radius-btn-hard);
  box-shadow:var(--s-shadow-hard)}
.ov-cta[aria-disabled="true"]{opacity:.45;box-shadow:none;cursor:default;pointer-events:none}
.ov-secure{font-family:var(--b-body);font-size:var(--s-type-eyebrow);line-height:1.6;
  color:var(--g-text);opacity:.75;text-align:center;margin:12px 0 0}

/* the FAQ: rows and one rule between them. No fill, no border, no shadow. */
.ov-faq{margin-top:var(--s-space-section)}
.ov-faq .ov-q{background:none;border:0;border-radius:0;box-shadow:none;
  margin:0;padding:0;border-top:1px solid var(--b-tan)}
.ov-faq .ov-q:last-child{border-bottom:1px solid var(--b-tan)}
.ov-faq .ov-q summary{list-style:none;cursor:pointer;display:flex;gap:16px;
  align-items:baseline;justify-content:space-between;padding:18px 0;
  font-family:var(--b-display);font-weight:400;font-size:20px;line-height:1.3;
  letter-spacing:var(--s-type-display-ls);color:var(--g-text)}
.ov-faq .ov-q summary::-webkit-details-marker{display:none}
.ov-faq .ov-q summary::after{content:"+";font-family:var(--b-body);font-size:16px;color:var(--b-tan)}
.ov-faq .ov-q[open] summary::after{content:"\\2013"}
.ov-faq .ov-q summary:focus{outline:none}
.ov-faq .ov-q summary:focus-visible{outline:2px solid var(--b-paper);outline-offset:2px}
.ov-faq .ov-a{font-family:var(--b-body);font-size:var(--s-type-body);
  line-height:var(--s-type-body-lh);color:var(--g-text);opacity:.8;
  margin:0 0 20px;padding:0 0 0 20px;max-width:60ch}

@media(min-width:900px){
  .ov{grid-template-columns:55% 45%;gap:var(--s-space-section);align-items:start}
  .ov-left{position:sticky;top:40px}
}
`;

export function markup(copy, settings = {}) {
  const g = settings.className ? ` ${settings.className}` : '';
  const first = TIERS[0];
  const firstLive = Boolean(CHECKOUT[first.key]);

  const tiers = TIERS.map((t, i) => `        <li class="ov-tier">
          <input type="radio" name="ov-tier" id="ov-${t.key}" value="${t.key}"${i ? '' : ' checked'}>
          <label class="ov-box" for="ov-${t.key}">
            <span class="ov-name"><span class="ov-dot" aria-hidden="true"></span>${t.name}</span>
            <span class="ov-price">${t.price}</span>
            ${t.each || t.save ? `<span class="ov-each">${[t.each, t.save].filter(Boolean).join(' &middot; ')}</span>` : ''}
            ${t.note ? `<span class="ov-note">${t.note}</span>` : ''}
            <ul class="ov-more">
${copy.includes.map((x) => `              <li><span class="ov-tick" aria-hidden="true"></span><span>${x}</span></li>`).join('\n')}
            </ul>
          </label>
        </li>`).join('\n');

  return `<section class="s offer-v2-s${g}"><div class="wrap">
  <div class="ov">
    <div class="ov-left">
      <figure class="ov-photo"><img src="${PHOTO.src}" width="${PHOTO.w}" height="${PHOTO.h}" alt="${PHOTO.alt}" loading="lazy" decoding="async"></figure>
    </div>

    <div class="ov-right">
      <h2 class="ov-title">${copy.title}</h2>
      <p class="ov-rating" data-placeholder="review"><span class="ov-stars" aria-hidden="true">★★★★★</span><span class="ov-rated">${copy.rating}</span></p>
      <p class="ov-line">${copy.line}</p>
      <ul class="ov-tiers">
${tiers}
      </ul>
      <a class="ov-cta" data-ov-cta${firstLive ? ` href="${CHECKOUT[first.key]}"` : ' aria-disabled="true"'}>${copy.cta} ${first.price}</a>
      <p class="ov-secure">${copy.secure}</p>
      <div class="ov-faq">
${copy.faq.map(([q, a]) => `        <details class="ov-q" data-ov-q><summary>${q}</summary><p class="ov-a">${a}</p></details>`).join('\n')}
      </div>
    </div>
  </div>
</div></section>
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
