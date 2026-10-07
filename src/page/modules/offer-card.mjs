// offer-card — the product block: Grüns/MUD\WTR's two columns inside one card,
// with the Lila free-guide card styling. Self-contained: markup, CSS from
// tokens, and its own script. The id is the one it was built with.
//
// THE CHECKOUT MAP. One place decides where the button goes. A tier with no URL
// is not selectable and shows "Coming soon", so the button can never point at a
// product that does not exist yet.
import { WIDGETS as NORA, WIDGET_CSS } from '../../lib/compass-widgets.mjs';

export const CHECKOUT = {
  one: 'https://buy.stripe.com/00w00j0iy7Iobky11Q1kA07',   // the live Compass link
  two: null,                                               // no link yet
  three: null,                                             // no link yet
};

export const id = 'offer-card';

const TIERS = [
  { key: 'one', label: 'One child', price: '$27', each: null, save: null, note: null },
  { key: 'two', label: 'Two children', price: '$47', each: '$23.50 each', save: 'Save $7', note: null },
  { key: 'three', label: 'Buy two, get one free', price: '$54', each: '$18 each', save: 'Save $27',
    note: 'Keep one as a gift, or for later' },
];

const SHOTS = [
  { src: '/assets/img/atf/slide-0.webp', alt: 'A child on a beach at sunset, with the zodiac wheel drawn across the sky' },
  { src: '/assets/img/atf/slide-1.webp', alt: 'Four cards from the reading, floating above a child walking on a beach' },
  { src: '/assets/img/atf/slide-2.webp', alt: 'Two cards from the reading, beside a child standing at the shoreline' },
];

// the visual of three blocks, lifted out of the published sample; no text
const visual = (html, re) => html.match(re)[0];
const MINIS = [
  { title: 'The moon that night', html: visual(NORA['card-holding'].html, /<div class="moon-wrap">[\s\S]*?<\/div>/) },
  { title: 'Elements', html: visual(NORA['card-elements'].html, /<div class="bar-rows">[\s\S]*?<\/div>\s*<\/div>/) },
  { title: 'Being seen', html: visual(NORA['card-being-seen'].html, /<svg[\s\S]*?<\/svg>/) },
];

// the same single open stroke the recognition module draws
const RING = '<svg viewBox="0 0 220 72" fill="none" stroke="currentColor" stroke-width="3"'
  + ' stroke-linecap="round" preserveAspectRatio="none" aria-hidden="true">'
  + '<path d="M62 8C30 11 8 22 6 36c-2 15 22 28 62 30 42 2 96-2 132-13 22-7 26-18 18-26'
  + 'C208 17 178 9 146 6"/></svg>';

const BADGE = `<div class="oc-badge" aria-hidden="true">
  <svg viewBox="0 0 120 120"><defs><path id="oc-badge-path" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0"></path></defs>
  <text><textPath href="#oc-badge-path">INSTANT &middot; YOURS TO KEEP &middot; INSTANT &middot; YOURS TO KEEP &middot; </textPath></text></svg>
  <span class="oc-badge-star">*</span></div>`;

export const css = `${WIDGET_CSS}
/* the ground: green to tan across the window, and one cream-white card on it */
.offer-card-s{border-left:0;border-right:0;margin-left:0;margin-right:0;
  background:linear-gradient(90deg,var(--b-green) 0%,var(--b-tan) 100%)}
.oc{max-width:1200px;margin:0 auto;background:var(--b-paper);border-radius:32px;
  padding:var(--s-pad-card);display:grid;gap:var(--s-space-section)}

/* left: the gallery and its badge */
.oc-gallery{position:relative;margin:0}
.oc-shot{margin:0;border-radius:var(--s-radius-card);overflow:hidden}
.oc-shot img{display:block;width:100%;height:auto;object-fit:contain;border:0}
.oc-thumbs{display:flex;gap:10px;margin-top:12px}
.oc-thumb{flex:1;padding:0;border:var(--s-border);border-radius:var(--s-radius-btn-hard);
  background:none;cursor:pointer;overflow:hidden;line-height:0}
.oc-thumb img{display:block;width:100%;height:auto;object-fit:contain;border:0}
.oc-thumb[aria-pressed="true"]{border:2px solid var(--b-green)}
.oc-thumb:focus{outline:none}
.oc-thumb:focus-visible{outline:2px solid var(--b-green);outline-offset:2px}
.oc-badge{position:absolute;top:-26px;left:-26px;width:108px;height:108px;z-index:2;
  display:grid;place-items:center;color:var(--b-tan)}
.oc-badge svg{position:absolute;inset:0;width:100%;height:100%;
  animation:oc-spin 26s linear infinite}
.oc-badge text{font-family:var(--b-body);font-size:11px;letter-spacing:.14em;fill:currentColor}
.oc-badge-star{font-family:var(--b-body);font-size:20px;color:var(--b-tan);line-height:1}
@keyframes oc-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
@media(prefers-reduced-motion:reduce){.oc-badge svg{animation:none}}

/* right column */
.oc-eyebrow{font-family:var(--b-body);font-size:var(--s-type-eyebrow);
  letter-spacing:var(--s-type-eyebrow-ls);text-transform:uppercase;color:var(--b-bark);margin:0}
.oc-rule{display:block;width:44px;height:1px;background:var(--b-tan);margin:10px 0 var(--s-space-block)}
.oc-title{font-family:var(--b-display);font-weight:400;color:var(--b-green);
  font-size:var(--s-type-display);line-height:var(--s-type-display-lh);
  letter-spacing:var(--s-type-display-ls);margin:0 0 var(--s-space-block)}
.oc-hook{position:relative;display:inline-block;color:inherit}
.oc-hook svg{position:absolute;left:-.16em;top:50%;transform:translateY(-50%);
  width:calc(100% + .32em);height:1.25em;overflow:visible;pointer-events:none;color:var(--b-tan)}

.oc-tiers{list-style:none;margin:0 0 var(--s-space-block);padding:0;display:grid;gap:10px}
.oc-tier input{position:absolute;opacity:0;width:0;height:0}
.oc-row{display:flex;align-items:flex-start;gap:12px;padding:14px 16px;cursor:pointer;
  border:var(--s-border);border-radius:var(--s-radius-btn-hard);background:none}
.oc-tier input:checked + .oc-row{border:2px solid var(--b-green);padding:13px 15px}
.oc-tier input:focus-visible + .oc-row{outline:2px solid var(--b-green);outline-offset:2px}
.oc-dot{flex:0 0 16px;width:16px;height:16px;margin-top:3px;border-radius:50%;border:1px solid var(--b-green)}
.oc-tier input:checked + .oc-row .oc-dot{background:var(--b-green);box-shadow:inset 0 0 0 3px var(--b-paper)}
.oc-main{font-family:var(--b-body);font-size:var(--s-type-body);
  line-height:var(--s-type-body-lh);color:var(--b-green)}
.oc-note{display:block;font-size:var(--s-type-eyebrow);line-height:1.5;color:var(--b-bark);margin-top:4px}
.oc-save{margin-left:auto;align-self:center;font-family:var(--b-body);
  font-size:var(--s-type-eyebrow);letter-spacing:var(--s-type-eyebrow-ls);text-transform:uppercase;
  color:var(--b-green);border:var(--s-border);border-radius:999px;padding:3px 10px;white-space:nowrap}
.oc-tier.is-soon .oc-row{cursor:default;opacity:.65}
.oc-soon{margin-left:8px;align-self:center;font-family:var(--b-body);font-size:var(--s-type-eyebrow);
  letter-spacing:var(--s-type-eyebrow-ls);text-transform:uppercase;color:var(--b-bark);white-space:nowrap}

/* "Inside every Compass": three dark cards, the phone screen's theme, visuals only */
.oc-inside{margin:0 0 var(--s-space-block)}
.oc-inside-head{font-family:var(--b-body);font-size:var(--s-type-eyebrow);
  letter-spacing:var(--s-type-eyebrow-ls);text-transform:uppercase;color:var(--b-bark);margin:0 0 12px}
.oc-minis{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;list-style:none;margin:0;padding:0}
.oc-mini{display:grid;gap:8px}
.oc-mini-card{background:var(--b-green);border-radius:var(--s-radius-btn-hard);
  padding:14px;display:grid;place-items:center;aspect-ratio:1/1;overflow:hidden}
.oc-mini-card .wc-live{width:100%;
  --green:var(--b-cream);--cream:var(--b-green);
  --tan:rgba(223,215,195,.35);--tan-soft:rgba(223,215,195,.18);color:var(--b-cream)}
.oc-mini-card .wc-live svg{max-width:100%;height:auto}
.oc-mini-card .wc-live .moon{width:62px;height:62px}
.oc-mini-card .wc-live .moon-sky{fill:var(--b-green)}
.oc-mini-card .wc-live .moon-dark{fill:rgba(223,215,195,.18)}
.oc-mini-card .wc-live .moon-lit{fill:var(--b-cream)}
.oc-mini-card .wc-live .moon-pit{fill:var(--b-green);opacity:.34}
.oc-mini-card .wc-live .moon-ring{stroke:rgba(223,215,195,.35)}
.oc-mini-card .wc-live [stroke="#495543"]{stroke:var(--b-cream)}
.oc-mini-card .wc-live [fill="#495543"]{fill:var(--b-cream)}
.oc-mini-card .wc-live [stroke="#CDB494"]{stroke:rgba(223,215,195,.35)}
.oc-mini-card .wc-live .bar-name,.oc-mini-card .wc-live .bar-count{color:rgba(223,215,195,.65);font-size:10px}
.oc-mini-title{font-family:var(--b-body);font-size:var(--s-type-eyebrow);line-height:1.4;
  color:var(--b-bark);text-align:center}

.oc-list{list-style:none;margin:0 0 var(--s-space-block);padding:0;display:grid;gap:8px}
.oc-item{display:grid;grid-template-columns:14px 1fr;gap:10px;align-items:start;
  font-family:var(--b-body);font-size:var(--s-type-body);line-height:1.45;color:var(--b-green)}
.oc-tick{width:14px;height:14px;margin-top:3px;border:1px solid var(--b-green);border-radius:50%;position:relative}
.oc-tick:after{content:"";position:absolute;left:4px;top:2px;width:3.5px;height:7px;
  border-right:1.5px solid var(--b-green);border-bottom:1.5px solid var(--b-green);transform:rotate(42deg)}
.oc-cta{display:block;width:100%;text-align:center;font-family:var(--b-body);
  font-size:var(--s-type-body);letter-spacing:.06em;text-transform:uppercase;text-decoration:none;
  height:54px;line-height:50px;background:var(--b-green);color:var(--b-cream);
  border:var(--s-hard-border);border-radius:var(--s-radius-btn-hard);box-shadow:var(--s-shadow-hard)}
.oc-fine{font-family:var(--b-body);font-size:var(--s-type-eyebrow);line-height:1.6;
  color:var(--b-bark);margin:14px 0 0;text-align:center}

/* the FAQ */
.oc-faq{margin-top:var(--s-space-section);border-top:var(--s-border)}
.oc-q{border-bottom:var(--s-border)}
.oc-q summary{list-style:none;cursor:pointer;padding:16px 0;font-family:var(--b-body);
  font-size:var(--s-type-body);line-height:1.4;color:var(--b-green);display:flex;
  align-items:baseline;justify-content:space-between;gap:16px}
.oc-q summary::-webkit-details-marker{display:none}
.oc-q summary:after{content:"+";font-family:var(--b-body);color:var(--b-bark)}
.oc-q[open] summary:after{content:"\\2013"}
.oc-q summary:focus{outline:none}
.oc-q summary:focus-visible{outline:2px solid var(--b-green);outline-offset:2px}
.oc-a{font-family:var(--b-body);font-size:var(--s-type-body);line-height:var(--s-type-body-lh);
  color:var(--b-green);margin:0 0 16px;max-width:60ch}

@media(min-width:900px){
  .oc{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:var(--s-space-section);
    padding:48px;align-items:start}
  .oc-left{position:sticky;top:40px}
  .oc-badge{width:132px;height:132px;top:-34px;left:-34px}
}
`;

export function markup(copy, settings = {}) {
  const g = settings.className ? ` ${settings.className}` : '';
  const live = (k) => Boolean(CHECKOUT[k]);
  const firstLive = TIERS.find((t) => live(t.key));

  const tiers = TIERS.map((t, i) => {
    const on = live(t.key) && !TIERS.slice(0, i).some((p) => live(p.key));
    return `        <li class="oc-tier${live(t.key) ? '' : ' is-soon'}">
          <input type="radio" name="oc-tier" id="oc-${t.key}" value="${t.key}"${on ? ' checked' : ''}${live(t.key) ? '' : ' disabled'}>
          <label class="oc-row" for="oc-${t.key}">
            <span class="oc-dot" aria-hidden="true"></span>
            <span class="oc-main">${t.label} <span aria-hidden="true">&middot;</span> ${t.price}${t.each ? ` <span aria-hidden="true">&middot;</span> ${t.each}` : ''}${t.note ? `<span class="oc-note">${t.note}</span>` : ''}</span>
            ${t.save ? `<span class="oc-save">${t.save}</span>` : ''}${live(t.key) ? '' : '<span class="oc-soon">Coming soon</span>'}
          </label>
        </li>`;
  }).join('\n');

  return `<section class="s offer-card-s${g}"><div class="wrap">
  <div class="oc">
    <div class="oc-left">
      <div class="oc-gallery">
        ${BADGE}
        <figure class="oc-shot"><img data-oc-shot src="${SHOTS[0].src}" width="1400" height="1050" alt="${SHOTS[0].alt}" loading="lazy" decoding="async"></figure>
        <div class="oc-thumbs">
${SHOTS.map((s, i) => `          <button type="button" class="oc-thumb" data-oc-thumb="${i}" aria-pressed="${i ? 'false' : 'true'}" aria-label="Show picture ${i + 1}"><img src="${s.src}" width="1400" height="1050" alt="" loading="lazy" decoding="async"></button>`).join('\n')}
        </div>
      </div>
    </div>
    <div class="oc-right">
      <p class="oc-eyebrow">${copy.eyebrow}</p><span class="oc-rule"></span>
      <h2 class="oc-title">${copy.title.replace(copy.hook, `<span class="oc-hook">${copy.hook}${RING}</span>`)}</h2>
      <ul class="oc-tiers">
${tiers}
      </ul>
      <div class="oc-inside">
        <p class="oc-inside-head">${copy.insideHead}</p>
        <ul class="oc-minis">
${MINIS.map((m) => `          <li class="oc-mini"><div class="oc-mini-card"><div class="wc-live">${m.html}</div></div><p class="oc-mini-title">${m.title}</p></li>`).join('\n')}
        </ul>
      </div>
      <ul class="oc-list">
${copy.includes.map((t) => `        <li class="oc-item"><span class="oc-tick" aria-hidden="true"></span><span>${t}</span></li>`).join('\n')}
      </ul>
      <a class="oc-cta" data-oc-cta href="${CHECKOUT[firstLive.key]}">${copy.cta} ${firstLive.price}</a>
      <p class="oc-fine">${copy.fine}</p>
      <div class="oc-faq">
${copy.faq.map(([q, a]) => `        <details class="oc-q" data-oc-q><summary>${q}</summary><p class="oc-a">${a}</p></details>`).join('\n')}
      </div>
    </div>
  </div>
</div></section>
<script>
(function(){
  var links=${JSON.stringify(CHECKOUT)};
  var prices=${JSON.stringify(Object.fromEntries(TIERS.map((t) => [t.key, t.price])))};
  var shots=${JSON.stringify(SHOTS)};
  var label=${JSON.stringify(copy.cta)};
  var cta=document.querySelector('[data-oc-cta]');
  // the tiers: a tier with no link never moves the button
  [].forEach.call(document.querySelectorAll('input[name="oc-tier"]'), function(r){
    r.addEventListener('change', function(){
      var url=links[r.value];
      if(!url || !cta) return;
      cta.setAttribute('href', url);
      cta.textContent=label + ' ' + prices[r.value];
    });
  });
  // the gallery
  var big=document.querySelector('[data-oc-shot]');
  var thumbs=[].slice.call(document.querySelectorAll('[data-oc-thumb]'));
  thumbs.forEach(function(b){
    b.addEventListener('click', function(){
      var i=Number(b.getAttribute('data-oc-thumb'));
      if(!big || !shots[i]) return;
      big.setAttribute('src', shots[i].src);
      big.setAttribute('alt', shots[i].alt);
      thumbs.forEach(function(o){ o.setAttribute('aria-pressed', o===b ? 'true' : 'false'); });
    });
  });
  // the FAQ: one open at a time
  var qs=[].slice.call(document.querySelectorAll('[data-oc-q]'));
  qs.forEach(function(d){
    d.addEventListener('toggle', function(){
      if(!d.open) return;
      qs.forEach(function(o){ if(o!==d) o.open=false; });
    });
  });
})();
</script>`;
}
