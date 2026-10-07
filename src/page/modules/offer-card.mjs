// offer-card — the offer box, after MUD\WTR's with Glamory's tier picker.
// Self-contained: its own markup, its own CSS from tokens, its own script.
//
// The id is offer-card, not offer: `offer` is the body's existing offer section
// and an id is permanent, never reused (src/page/README.md).
//
// THE CHECKOUT MAP. One place decides where the button goes. A tier with no URL
// is not selectable and shows "Coming soon", so the button can never point at a
// product that does not exist yet.
export const CHECKOUT = {
  one: 'https://buy.stripe.com/00w00j0iy7Iobky11Q1kA07',   // the live Compass link
  two: null,                                               // no link yet
  three: null,                                             // no link yet
};

export const id = 'offer-card';

const TIERS = [
  { key: 'one', label: 'One child', price: '$27', each: null, note: null },
  { key: 'two', label: 'Two children', price: '$47', each: '$23.50 each', note: null },
  { key: 'three', label: 'Buy two, get one free', price: '$54', each: '$18 each',
    note: 'Keep one as a gift, or for later' },
];

export const css = `
.oc{max-width:560px;margin:0 auto;background:var(--b-paper);
  border-radius:var(--s-radius-card);padding:var(--s-pad-card)}
.oc-title{font-family:var(--b-display);font-weight:400;color:var(--b-green);
  font-size:var(--s-type-display);line-height:var(--s-type-display-lh);
  letter-spacing:var(--s-type-display-ls);margin:0 0 var(--s-space-block);text-align:center}
.oc-tiers{list-style:none;margin:0 0 var(--s-space-block);padding:0;display:grid;gap:10px}
.oc-tier{display:block}
.oc-tier input{position:absolute;opacity:0;width:0;height:0}
.oc-row{display:flex;align-items:flex-start;gap:12px;padding:14px 16px;cursor:pointer;
  border:var(--s-border);border-radius:var(--s-radius-btn-hard);background:none}
.oc-tier input:checked + .oc-row{border:2px solid var(--b-green);padding:13px 15px}
.oc-tier input:focus-visible + .oc-row{outline:2px solid var(--b-green);outline-offset:2px}
.oc-dot{flex:0 0 16px;width:16px;height:16px;margin-top:3px;border-radius:50%;
  border:1px solid var(--b-green)}
.oc-tier input:checked + .oc-row .oc-dot{background:var(--b-green);
  box-shadow:inset 0 0 0 3px var(--b-paper)}
.oc-main{font-family:var(--b-body);font-size:var(--s-type-body);
  line-height:var(--s-type-body-lh);color:var(--b-green)}
.oc-note{display:block;font-size:var(--s-type-eyebrow);line-height:1.5;color:var(--b-bark);
  margin-top:4px}
.oc-tier.is-soon .oc-row{cursor:default;opacity:.65}
.oc-soon{font-family:var(--b-body);font-size:var(--s-type-eyebrow);
  letter-spacing:var(--s-type-eyebrow-ls);text-transform:uppercase;color:var(--b-bark);
  margin-left:auto;white-space:nowrap}
.oc-list{list-style:none;margin:0 0 var(--s-space-block);padding:0;display:grid;gap:8px}
.oc-item{display:grid;grid-template-columns:14px 1fr;gap:10px;align-items:start;
  font-family:var(--b-body);font-size:var(--s-type-body);line-height:1.45;color:var(--b-green)}
.oc-tick{width:14px;height:14px;margin-top:3px;border:1px solid var(--b-green);
  border-radius:50%;position:relative}
.oc-tick:after{content:"";position:absolute;left:4px;top:2px;width:3.5px;height:7px;
  border-right:1.5px solid var(--b-green);border-bottom:1.5px solid var(--b-green);
  transform:rotate(42deg)}
.oc-add{font-family:var(--b-body);font-size:var(--s-type-eyebrow);line-height:1.6;
  color:var(--b-bark);margin:0 0 var(--s-space-block)}
.oc-cta{display:block;width:100%;text-align:center;font-family:var(--b-body);
  font-size:var(--s-type-body);letter-spacing:.06em;text-transform:uppercase;
  text-decoration:none;height:54px;line-height:50px;background:var(--b-green);
  color:var(--b-cream);border:var(--s-hard-border);border-radius:var(--s-radius-btn-hard);
  box-shadow:var(--s-shadow-hard)}
.oc-fine{font-family:var(--b-body);font-size:var(--s-type-eyebrow);line-height:1.6;
  color:var(--b-bark);margin:14px 0 0;text-align:center}
`;

export function markup(copy, settings = {}) {
  const g = settings.className ? ` ${settings.className}` : '';
  const rows = TIERS.map((t, i) => {
    const live = Boolean(CHECKOUT[t.key]);
    const first = live && !TIERS.slice(0, i).some((p) => CHECKOUT[p.key]);
    return `      <li class="oc-tier${live ? '' : ' is-soon'}">
        <input type="radio" name="oc-tier" id="oc-${t.key}" value="${t.key}"${first ? ' checked' : ''}${live ? '' : ' disabled'}>
        <label class="oc-row" for="oc-${t.key}">
          <span class="oc-dot" aria-hidden="true"></span>
          <span class="oc-main">${t.label} <span aria-hidden="true">&middot;</span> ${t.price}${t.each ? ` <span aria-hidden="true">&middot;</span> ${t.each}` : ''}${t.note ? `<span class="oc-note">${t.note}</span>` : ''}</span>
          ${live ? '' : '<span class="oc-soon">Coming soon</span>'}
        </label>
      </li>`;
  }).join('\n');

  const firstLive = TIERS.find((t) => CHECKOUT[t.key]);
  return `<section class="s offer-card-s${g}"><div class="wrap">
  <div class="oc">
    <h2 class="oc-title">${copy.title}</h2>
    <ul class="oc-tiers">
${rows}
    </ul>
    <ul class="oc-list">
${copy.includes.map((t) => `      <li class="oc-item"><span class="oc-tick" aria-hidden="true"></span><span>${t}</span></li>`).join('\n')}
    </ul>
    <p class="oc-add">${copy.addon}</p>
    <a class="oc-cta" data-oc-cta href="${CHECKOUT[firstLive.key]}">${copy.cta} ${firstLive.price}</a>
    <p class="oc-fine">${copy.fine}</p>
  </div>
</div></section>
<script>
(function(){
  var links=${JSON.stringify(CHECKOUT)};
  var prices=${JSON.stringify(Object.fromEntries(TIERS.map((t) => [t.key, t.price])))};
  var label=${JSON.stringify(copy.cta)};
  var cta=document.querySelector('[data-oc-cta]');
  if(!cta) return;
  [].forEach.call(document.querySelectorAll('input[name="oc-tier"]'), function(r){
    r.addEventListener('change', function(){
      var url=links[r.value];
      if(!url) return;                       // a tier with no link never moves the button
      cta.setAttribute('href', url);
      cta.textContent=label + ' ' + prices[r.value];
    });
  });
})();
</script>`;
}
