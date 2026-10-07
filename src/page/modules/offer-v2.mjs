// offer-v2 — the product block: a gallery on the left and a buy box on the
// right, after MUD\WTR's and Glamory's product pages. A fresh design; offer-card
// stays in the system, unused. Self-contained: markup, CSS from tokens, script.
//
// THE CHECKOUT MAP is imported from offer-card, so one map still decides where
// the button goes. A tier with no URL is not rendered at all here.
import { WIDGETS as NORA, WIDGET_CSS } from '../../lib/compass-widgets.mjs';
import { CHECKOUT } from './offer-card.mjs';

export const id = 'offer-v2';

const TIERS = [
  { key: 'one', name: 'One child', price: '$27', each: null, save: null, note: null },
  { key: 'two', name: 'Two children', price: '$47', each: '$23.50 each', save: 'Save $7', note: null },
  { key: 'three', name: 'Buy two, get one free', price: '$54', each: '$18 each', save: 'Save $27',
    note: 'Keep one as a gift, or for later' },
];
const LIVE = TIERS.filter((t) => CHECKOUT[t.key]);

const SLIDES = [
  { src: '/assets/img/atf/slide-0.webp', alt: 'A child on a beach at sunset, with the zodiac wheel drawn across the sky' },
  { src: '/assets/img/atf/slide-1.webp', alt: 'Four cards from the reading, floating above a child walking on a beach' },
  { src: '/assets/img/atf/slide-2.webp', alt: 'Two cards from the reading, beside a child standing at the shoreline' },
];
const MOON = NORA['card-holding'].html;

export const css = `${WIDGET_CSS}
.ov{display:grid;gap:var(--s-space-section)}

/* the gallery */
.ov-stage{position:relative;border-radius:var(--s-radius-card);overflow:hidden}
.ov-slide{display:none}
.ov-slide.on{display:block}
.ov-slide img.ov-flat{display:block;width:100%;height:auto;object-fit:contain;border:0}
/* slide 1: the phone on a photograph, built here rather than shot */
.ov-shot{position:relative;display:grid;place-items:center;aspect-ratio:4/3;overflow:hidden}
.ov-shot-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border:0}
.ov-phone{position:relative;width:38%;max-width:260px;aspect-ratio:969/1959;z-index:2;
  filter:drop-shadow(0 20px 36px var(--g-shade))}
.ov-frame{position:absolute;inset:0;width:100%;height:100%;z-index:0;border:0;pointer-events:none}
.ov-screen{position:absolute;left:5.9%;right:6.5%;top:2.6%;bottom:3.7%;border-radius:12px;
  overflow:hidden;background:var(--b-green);z-index:2}
.ov-screen .ov-scroll{height:100%;overflow:hidden;padding:16% 6% 6%}
/* the screen is the reading inverted, the same four tokens the phone module swaps */
.ov-screen .wc-live{--green:var(--b-cream);--cream:var(--b-green);
  --tan:rgba(223,215,195,.35);--tan-soft:rgba(223,215,195,.18);color:var(--b-cream)}
.ov-screen .wc-live .card{background:none;border:0;padding:0}
.ov-screen .wc-live .wlabel{color:rgba(223,215,195,.65)}
.ov-screen .wc-live .moon{width:54px;height:54px}
.ov-screen .wc-live .moon-sky{fill:var(--b-green)}
.ov-screen .wc-live .moon-dark{fill:rgba(223,215,195,.18)}
.ov-screen .wc-live .moon-lit{fill:var(--b-cream)}
.ov-screen .wc-live .moon-pit{fill:var(--b-green);opacity:.34}
.ov-screen .wc-live .moon-ring{stroke:rgba(223,215,195,.35)}
.ov-screen .wc-live .moon-line,.ov-screen .wc-live .bar-footer{font-size:9px;line-height:1.5}
.ov-thumbs{display:flex;gap:10px;margin-top:12px}
.ov-thumb{flex:1;padding:0;border:var(--s-border);border-radius:var(--s-radius-btn-hard);
  background:none;cursor:pointer;overflow:hidden;line-height:0}
.ov-thumb img{display:block;width:100%;height:auto;object-fit:cover;aspect-ratio:4/3;border:0}
.ov-thumb[aria-pressed="true"]{border:2px solid var(--g-text)}
.ov-thumb:focus{outline:none}
.ov-thumb:focus-visible{outline:2px solid var(--g-text);outline-offset:2px}

/* the buy box */
.ov-pill{display:inline-block;font-family:var(--b-body);font-size:var(--s-type-eyebrow);
  letter-spacing:var(--s-type-eyebrow-ls);text-transform:uppercase;color:var(--g-text);
  background:var(--b-tan);border-radius:999px;padding:5px 12px;margin:0 0 var(--s-space-para)}
.ov-title{font-family:var(--b-display);font-weight:400;color:var(--g-text);
  font-size:var(--s-type-display);line-height:var(--s-type-display-lh);
  letter-spacing:var(--s-type-display-ls);margin:0 0 10px}
.ov-rating{display:flex;align-items:baseline;gap:9px;margin:0 0 12px;font-family:var(--b-body)}
.ov-stars{color:var(--b-gold);font-size:19px;letter-spacing:.14em}
.ov-rated{color:var(--g-text);font-size:var(--s-type-body)}
.ov-line{font-family:var(--b-body);font-size:var(--s-type-body);line-height:1.5;
  color:var(--g-quiet);margin:0 0 var(--s-space-block)}

.ov-tiers{list-style:none;margin:0 0 var(--s-space-block);padding:0;display:grid;gap:10px}
.ov-tier input{position:absolute;opacity:0;width:0;height:0}
.ov-box{display:grid;grid-template-columns:1fr auto;gap:4px 16px;align-items:center;
  padding:16px;border:var(--s-border);border-radius:var(--s-radius-btn-hard);cursor:pointer}
.ov-tier input:checked + .ov-box{border:2px solid var(--b-green);padding:15px}
.ov-tier input:focus-visible + .ov-box{outline:2px solid var(--b-green);outline-offset:2px}
.ov-name{display:flex;align-items:center;gap:10px;font-family:var(--b-body);
  font-size:var(--s-type-body);color:var(--g-text)}
.ov-dot{flex:0 0 16px;width:16px;height:16px;border-radius:50%;border:1px solid var(--g-text)}
.ov-tier input:checked + .ov-box .ov-dot{background:var(--b-green);box-shadow:inset 0 0 0 3px var(--b-paper)}
.ov-price{font-family:var(--b-display);font-weight:400;font-size:var(--s-type-lead);
  line-height:1;color:var(--g-text);text-align:right}
.ov-each{grid-column:2;font-family:var(--b-body);font-size:var(--s-type-eyebrow);
  line-height:1.5;color:var(--g-quiet);text-align:right}
.ov-note{grid-column:1;font-family:var(--b-body);font-size:var(--s-type-eyebrow);
  line-height:1.5;color:var(--g-quiet)}
.ov-more{grid-column:1/-1;display:none;margin:10px 0 0;padding:0;list-style:none}
.ov-tier input:checked + .ov-box .ov-more{display:grid;gap:7px}
.ov-more li{display:grid;grid-template-columns:14px 1fr;gap:10px;align-items:start;
  font-family:var(--b-body);font-size:var(--s-type-eyebrow);line-height:1.5;color:var(--g-text)}
.ov-tick{width:14px;height:14px;margin-top:2px;border:1px solid var(--g-text);border-radius:50%;position:relative}
.ov-tick:after{content:"";position:absolute;left:4px;top:2px;width:3.5px;height:7px;
  border-right:1.5px solid var(--g-text);border-bottom:1.5px solid var(--g-text);transform:rotate(42deg)}

.ov-cta{display:block;width:100%;text-align:center;font-family:var(--b-body);
  font-size:var(--s-type-body);letter-spacing:.06em;text-transform:uppercase;text-decoration:none;
  height:54px;line-height:50px;background:var(--b-green);color:var(--b-cream);
  border:var(--s-hard-border);border-radius:var(--s-radius-btn-hard);box-shadow:var(--s-shadow-hard)}
.ov-secure,.ov-fine{font-family:var(--b-body);font-size:var(--s-type-eyebrow);line-height:1.6;
  color:var(--g-quiet);text-align:center}
.ov-secure{margin:12px 0 0}
.ov-fine{margin:8px 0 0}

/* the FAQ: rules, a plus, nothing else */
.ov-faq{margin-top:var(--s-space-section);border-top:1px solid var(--b-tan)}
.ov-q{border-bottom:1px solid var(--b-tan)}
.ov-q summary{list-style:none;cursor:pointer;padding:16px 0;display:flex;gap:16px;
  align-items:baseline;justify-content:space-between;font-family:var(--b-body);
  font-size:var(--s-type-body);line-height:1.4;color:var(--g-text)}
.ov-q summary::-webkit-details-marker{display:none}
.ov-q summary:after{content:"+";color:var(--g-quiet)}
.ov-q[open] summary:after{content:"\\2013"}
.ov-q summary:focus{outline:none}
.ov-q summary:focus-visible{outline:2px solid var(--g-text);outline-offset:2px}
.ov-a{font-family:var(--b-body);font-size:var(--s-type-body);line-height:var(--s-type-body-lh);
  color:var(--g-text);margin:0 0 16px;max-width:60ch}

@media(min-width:900px){
  .ov{grid-template-columns:55% 45%;gap:var(--s-space-section);align-items:start}
  .ov-left{position:sticky;top:40px}
}
`;

export function markup(copy, settings = {}) {
  const g = settings.className ? ` ${settings.className}` : '';
  const first = LIVE[0];

  const tiers = LIVE.map((t, i) => `        <li class="ov-tier">
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
      <div class="ov-stage">
        <div class="ov-slide on" data-ov-slide="0">
          <div class="ov-shot">
            <img class="ov-shot-bg" src="/assets/compass/nature-2.jpg" alt="A forest floor in low light" loading="lazy" decoding="async">
            <div class="ov-phone">
              <img class="ov-frame" src="/assets/img/phone-frame.png" alt="" width="969" height="1959" aria-hidden="true">
              <div class="ov-screen"><div class="ov-scroll"><div class="wc-live">${MOON}</div></div></div>
            </div>
          </div>
        </div>
${SLIDES.map((s, i) => `        <div class="ov-slide" data-ov-slide="${i + 1}"><img class="ov-flat" src="${s.src}" width="1400" height="1050" alt="${s.alt}" loading="lazy" decoding="async"></div>`).join('\n')}
      </div>
      <div class="ov-thumbs">
        <button type="button" class="ov-thumb" data-ov-thumb="0" aria-pressed="true" aria-label="Show the reading on a phone"><img src="/assets/compass/nature-2.jpg" alt="" loading="lazy" decoding="async"></button>
${SLIDES.map((s, i) => `        <button type="button" class="ov-thumb" data-ov-thumb="${i + 1}" aria-pressed="false" aria-label="Show picture ${i + 2}"><img src="${s.src}" alt="" loading="lazy" decoding="async"></button>`).join('\n')}
      </div>
    </div>

    <div class="ov-right">
      <p class="ov-pill">${copy.pill}</p>
      <h2 class="ov-title">${copy.title}</h2>
      <p class="ov-rating" data-placeholder="review"><span class="ov-stars" aria-hidden="true">★★★★★</span><span class="ov-rated">${copy.rating}</span></p>
      <p class="ov-line">${copy.line}</p>
      <ul class="ov-tiers">
${tiers}
      </ul>
      <a class="ov-cta" data-ov-cta href="${CHECKOUT[first.key]}">${copy.cta} ${first.price}</a>
      <p class="ov-secure">${copy.secure}</p>
      <p class="ov-fine">${copy.fine}</p>
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
      var url=links[r.value];
      if(!url || !cta) return;
      cta.setAttribute('href', url);
      cta.textContent=label + ' ' + prices[r.value];
    });
  });
  var slides=[].slice.call(document.querySelectorAll('[data-ov-slide]'));
  var thumbs=[].slice.call(document.querySelectorAll('[data-ov-thumb]'));
  thumbs.forEach(function(b){
    b.addEventListener('click', function(){
      var i=b.getAttribute('data-ov-thumb');
      slides.forEach(function(s){ s.classList.toggle('on', s.getAttribute('data-ov-slide')===i); });
      thumbs.forEach(function(o){ o.setAttribute('aria-pressed', o===b ? 'true' : 'false'); });
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
