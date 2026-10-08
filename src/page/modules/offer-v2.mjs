// offer-v2 — the product block: a full-bleed split on paper, the photograph on
// the left and the buy box on a white card on the right, after MUD\WTR's
// product page. Self-contained: markup, CSS from tokens, script.
//
// Inter comes from Google Fonts, by Richard's instruction 2026-10-07. The brand
// bible forbids a third-party font call; that rule exists for the portal, which
// carries a child's birth details. This page is a landing page. The link sits in
// the module, because the renderer gives a module no way into <head>.
//
// THE CHECKOUT MAP is imported from offer-card, so one map still decides where
// the button goes. Every tier is selectable; a tier with no URL turns the button
// off instead of carrying a target of its own.
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
/* 2026-10-08, Richard: paper, flat. No gradient and no grain. */
.offer-v2-s{background:var(--b-paper);padding:0 0 var(--s-space-section)}
.ov{display:grid}
.ov-left{display:grid;place-items:center;padding:32px 24px}
.ov-left img{display:block;max-width:100%;max-height:80vh;width:auto;height:auto;
  object-fit:contain;border:0;border-radius:24px}
.ov-right{padding:32px 24px}
/* the buy box keeps its own light card, so its text stays on light */
.ov-box{max-width:480px;margin:0 auto;background:#FFFFFF;
  border-radius:16px;padding:32px}

/* Inter inside the buy box only; the title keeps Morning Memories */
.ov-box{--ov-ui:'Inter',system-ui,sans-serif}
.ov-title{font-family:var(--b-display);font-weight:400;color:var(--b-green);
  font-size:var(--s-type-display);line-height:var(--s-type-display-lh);
  letter-spacing:var(--s-type-display-ls);margin:0 0 10px}
.ov-rating{display:flex;align-items:baseline;gap:9px;margin:0 0 12px;font-family:var(--b-body)}
.ov-stars{color:var(--b-gold);font-size:19px;letter-spacing:.14em}
.ov-rated{color:var(--b-green);font-size:var(--s-type-body)}
.ov-line{font-family:var(--ov-ui);font-weight:400;font-size:15px;line-height:1.5;
  color:var(--b-green);margin:0 0 20px}

/* the tiers */
.ov-tiers{list-style:none;margin:0 0 20px;padding:0;display:grid;gap:10px}
.ov-tier input{position:absolute;opacity:0;width:0;height:0}
.ov-tier-box{display:grid;grid-template-columns:1fr auto;gap:2px 16px;align-items:center;
  padding:16px;background:#FFFFFF;border:1px solid var(--b-tan);border-radius:10px;cursor:pointer}
.ov-tier input:checked + .ov-tier-box{border:2px solid var(--b-green);padding:15px}
.ov-tier input:focus-visible + .ov-tier-box{outline:2px solid var(--b-green);outline-offset:2px}
.ov-name{display:flex;align-items:center;gap:10px;font-family:var(--ov-ui);font-weight:600;
  font-size:16px;line-height:1.3;color:var(--b-green)}
.ov-dot{flex:0 0 16px;width:16px;height:16px;border-radius:50%;border:1px solid var(--b-green)}
.ov-tier input:checked + .ov-tier-box .ov-dot{background:var(--b-green);box-shadow:inset 0 0 0 3px #FFFFFF}
.ov-price{font-family:var(--ov-ui);font-weight:600;font-size:20px;line-height:1;
  color:var(--b-green);text-align:right}
.ov-each{grid-column:1;display:flex;align-items:center;gap:8px;flex-wrap:wrap;
  font-family:var(--ov-ui);font-weight:400;font-size:13px;line-height:1.5;
  color:var(--b-green);padding-left:26px}
.ov-save{font-family:var(--ov-ui);font-weight:600;font-size:13px;color:var(--b-green);
  background:rgba(73,85,67,.1);border-radius:999px;padding:2px 8px}
.ov-note{grid-column:1;font-family:var(--ov-ui);font-weight:400;font-size:13px;
  line-height:1.5;color:var(--b-green);padding-left:26px}
.ov-more{grid-column:1/-1;display:none;margin:12px 0 0;padding:0;list-style:none}
.ov-tier input:checked + .ov-tier-box .ov-more{display:grid;gap:8px}
.ov-more li{display:grid;grid-template-columns:14px 1fr;gap:10px;align-items:start;
  font-family:var(--ov-ui);font-weight:400;font-size:14px;line-height:1.45;color:var(--b-green)}
.ov-tick{width:14px;height:14px;margin-top:3px;border:1px solid var(--b-green);
  border-radius:50%;position:relative}
.ov-tick:after{content:"";position:absolute;left:4px;top:2px;width:3.5px;height:7px;
  border-right:1.5px solid var(--b-green);border-bottom:1.5px solid var(--b-green);transform:rotate(42deg)}

/* the button */
.ov-cta{display:block;width:100%;text-align:center;font-family:var(--ov-ui);font-weight:600;
  font-size:16px;letter-spacing:.02em;text-decoration:none;height:54px;line-height:50px;
  background:var(--b-green);color:var(--b-cream);border:2px solid var(--b-green-deep);
  border-radius:6px;box-shadow:4px 4px 0 var(--b-green-deep)}
.ov-cta[aria-disabled="true"]{opacity:.45;box-shadow:none;cursor:default;pointer-events:none}
.ov-secure{font-family:var(--ov-ui);font-weight:400;font-size:13px;line-height:1.6;
  color:var(--b-green);text-align:center;margin:12px 0 0}

/* the FAQ */
.ov-faq{margin-top:32px}
.ov-faq .ov-q{background:none;border:0;border-radius:0;box-shadow:none;margin:0;padding:0;
  border-top:1px solid var(--b-tan)}
.ov-faq .ov-q:last-child{border-bottom:1px solid var(--b-tan)}
.ov-faq .ov-q summary{list-style:none;cursor:pointer;display:flex;gap:16px;
  align-items:baseline;justify-content:space-between;padding:16px 0;
  font-family:var(--ov-ui);font-weight:600;font-size:15px;line-height:1.4;color:var(--b-green)}
.ov-faq .ov-q summary::-webkit-details-marker{display:none}
.ov-faq .ov-q summary::after{content:"+";font-weight:400;font-size:16px;color:var(--b-tan)}
.ov-faq .ov-q[open] summary::after{content:"\\2013"}
.ov-faq .ov-q summary:focus{outline:none}
.ov-faq .ov-q summary:focus-visible{outline:2px solid var(--b-green);outline-offset:2px}
.ov-faq .ov-a{font-family:var(--ov-ui);font-weight:400;font-size:15px;line-height:1.6;
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
            <span class="ov-name"><span class="ov-dot" aria-hidden="true"></span>${t.name}</span>
            <span class="ov-price">${t.price}</span>
            ${t.each || t.save ? `<span class="ov-each">${t.each ? `<span>${t.each}</span>` : ''}${t.save ? `<span class="ov-save">${t.save}</span>` : ''}</span>` : ''}
            ${t.note ? `<span class="ov-note">${t.note}</span>` : ''}
            <ul class="ov-more">
${copy.includes.map((x) => `              <li><span class="ov-tick" aria-hidden="true"></span><span>${x}</span></li>`).join('\n')}
            </ul>
          </label>
        </li>`).join('\n');

  return `<section class="s offer-v2-s${g}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap">
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
        <a class="ov-cta" data-ov-cta${firstLive ? ` href="${CHECKOUT[first.key]}"` : ' aria-disabled="true"'}>${copy.cta} ${first.price}</a>
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
