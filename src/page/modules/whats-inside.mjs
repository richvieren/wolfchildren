// whats-inside — module 3, rebuilt 2026-10-07 on Cato's direction page.
//
// Source: clients/Cato/cosmic-landing — the showcase block in
//   template/partials/showcase.html (markup and the row script, also in
//   dist/direction/index.html), its CSS in shared/styles.css (.showcase*,
//   .phone*), and the frame image shared/photography/phone-frame.png, copied to
//   assets/img/phone-frame.png. The phone geometry (screen inset 5.9% / 6.5% /
//   2.6% / 3.7%), the row grid, the tick mark and the row-to-phone interaction
//   are theirs. Every colour, face, radius and shadow here is a Wolf Children
//   brand, skin or ground token.
//
// Inside the phone the blocks render as the sample renders them: their own
// fonts, their own dimming, their full text. Last round's opacity, font and
// trimming overrides are gone.
import { WIDGETS as NORA, WIDGET_CSS } from '../../lib/compass-widgets.mjs';
import { WIDGETS as FINN } from '../../lib/compass-widgets-finn.mjs';
import { EXTRA } from '../../lib/compass-widgets-extra.mjs';

export const id = 'whats-inside';

/** One slider out of the three-lines card, with the card's own title. */
function oneSlider(html, poleA, poleB) {
  const label = html.match(/<div class="wlabel">[\s\S]*?<\/div>/)[0];
  const spec = html.split('<div class="spec">').slice(1).map((s) => '<div class="spec">' + s)
    .find((s) => s.includes(poleA) && s.includes(poleB));
  if (!spec) throw new Error(`whats-inside: no slider for ${poleA} / ${poleB}`);
  const end = spec.indexOf('</div>', spec.indexOf('spec-context'));
  return `<div class="card">${label}${spec.slice(0, end + 6)}</div></div>`;
}

const SCREENS = [
  { id: 'w-moon', label: 'The moon that night', who: 'Nora, 6', html: NORA['card-holding'].html },
  { id: 'w-elements', label: 'Elements', who: 'Finn, 6', html: FINN['card-elements'].html },
  { id: 'w-wired', label: "What's wired to what", who: 'Nora, 6', html: EXTRA['card-wired-nora'] },
  { id: 'w-starter', label: 'Starter or finisher', who: 'Finn, 6', html: oneSlider(FINN['card-three-lines'].html, 'Starter', 'Finisher') },
  { id: 'w-seen', label: 'Being seen', who: 'Nora, 6', html: NORA['card-being-seen'].html },
  { id: 'w-group', label: 'In a group', who: 'Finn, 6', html: FINN['badge-group'].html },
];

const TICK = '<svg viewBox="0 0 512 512" aria-hidden="true"><path d="M256 464c114.875 0 208-93.125 208-208S370.875 48 256 48 48 141.125 48 256s93.125 208 208 208zm-44-129-80-80 28-28 52 52 116-116 28 28-144 144z"/></svg>';

export const css = `${WIDGET_CSS}
.wi{position:relative}
.wi-head{text-align:left}
.wi-eyebrow{font-family:var(--b-body);color:var(--g-text);font-size:var(--s-type-eyebrow);
  letter-spacing:var(--s-type-eyebrow-ls);text-transform:uppercase;margin:0 0 var(--s-space-para)}
.wi-head h2{font-family:var(--b-display);font-weight:400;color:var(--g-text);
  font-size:var(--s-type-display);line-height:var(--s-type-display-lh);
  letter-spacing:var(--s-type-display-ls);max-width:none;margin:0}
.wi-sub{font-family:var(--b-body);color:var(--g-text);font-size:var(--s-type-body);
  line-height:var(--s-type-body-lh);letter-spacing:var(--s-type-body-ls);
  margin:var(--s-space-para) 0 0;max-width:52ch}

/* the phone, Cato's geometry on our tokens */
.wi-phone{position:relative;width:100%;max-width:307px;aspect-ratio:969/1959;margin:var(--s-space-section) auto 0;
  filter:drop-shadow(0 30px 40px var(--g-shade))}
/* the frame PNG is opaque where the screen sits (its centre alpha is 255), so it
   goes under the screen, as Cato's .phone__frame{z-index:0} does. Painted over
   the screen it hid every pane, which is why the phone read as empty and why
   hover and tap looked dead: they were swapping panes nobody could see. */
.wi-phone img.wi-frame{position:absolute;inset:0;width:100%;height:100%;display:block;
  pointer-events:none;z-index:0;border:0;border-radius:0}
.wi-screen{position:absolute;left:5.9%;right:6.5%;top:2.6%;bottom:3.7%;border-radius:17px;
  overflow:hidden;background:var(--b-cream);z-index:2}
.wi-scroll{height:100%;overflow-y:auto;padding:38px 12px 18px;scrollbar-width:none}
.wi-scroll::-webkit-scrollbar{display:none}
.wi-who{position:absolute;left:0;right:0;top:0;z-index:2;text-align:center;padding:14px 0 8px;
  background:var(--b-cream);font-family:var(--b-body);font-size:var(--s-type-eyebrow);
  letter-spacing:var(--s-type-eyebrow-ls);text-transform:uppercase;color:var(--b-bark)}
.wi-pane{display:none}
.wi-pane.on{display:block}

/* the rows, Cato's grid */
.wi-listhead{font-family:var(--b-display);font-weight:400;color:var(--g-text);
  font-size:var(--s-type-lead);line-height:var(--s-type-lead-lh);margin:var(--s-space-block) 0 12px}
.wi-list{list-style:none;margin:0;padding:0;border-top:var(--s-border)}
.wi-item{border-bottom:var(--s-border)}
.wi-row{display:grid;grid-template-columns:54px minmax(0,1fr) 26px;align-items:center;
  width:100%;height:64px;padding:0;background:none;border:0;cursor:pointer;text-align:left}
.wi-num{font-family:var(--b-display);font-size:var(--s-type-lead);line-height:1;color:var(--g-quiet)}
.wi-label{font-family:var(--b-body);font-size:var(--s-type-body);line-height:1.2;color:var(--g-text)}
/* an unchosen tick is the hairline tone, so six of them do not read as six
   ticked boxes; the chosen one is green. */
.wi-mark svg{display:block;width:22px;height:22px;fill:var(--g-rule)}
.wi-row:hover .wi-mark svg,.wi-item.is-active .wi-mark svg{fill:var(--b-green)}
.wi-item.is-active .wi-label{color:var(--g-text)}
.wi-row:focus{outline:none}
.wi-row:focus-visible{outline:2px solid var(--g-text);outline-offset:3px}
.wi-cta{display:inline-block;margin-top:var(--s-space-block);font-family:var(--b-body);
  font-size:var(--s-type-body);letter-spacing:.06em;text-transform:uppercase;text-decoration:none;
  cursor:pointer;padding:0 26px;height:54px;line-height:50px;background:var(--b-green);
  color:var(--b-cream);border:var(--s-hard-border);border-radius:var(--s-radius-btn-hard);
  box-shadow:var(--s-shadow-hard)}
.wi-photo{display:none}

@media(min-width:900px){
  /* the photograph fills the left half of the section, top to bottom, and bleeds
     past the wrap to the window's left edge. The phone sits in the horizontal
     centre, straddling the photograph's right edge; the words sit to its right.
     Filling a half-height panel needs a crop, so this panel alone is cropped,
     centred on the child (object-fit:cover, object-position 50% 40%). */
  .wi{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);
    column-gap:var(--s-space-section);align-items:center;min-height:620px}
  .wi-photo{display:block;position:absolute;top:0;bottom:0;right:50%;
    left:calc(50% - 50vw);margin:0;overflow:hidden}
  .wi-photo img{display:block;width:100%;height:100%;object-fit:cover;
    object-position:50% 40%;border:0;transform:scaleX(-1)}
  .wi-phone{position:relative;z-index:2;margin:0 auto}
  .wi-text{grid-column:2;position:relative;z-index:2}
}
`;

export function markup(copy, settings = {}) {
  const g = settings.className ? ` ${settings.className}` : '';
  const p = settings.photo;
  return `<section class="s whats-inside-s${g}" data-wi><div class="wrap">
  <div class="wi">
    <figure class="wi-photo"><img src="${p.src}" width="${p.w}" height="${p.h}" alt="${p.alt}" loading="lazy" decoding="async"></figure>
    <div class="wi-phone">
      <img class="wi-frame" src="/assets/img/phone-frame.png" alt="" width="969" height="1959" aria-hidden="true">
      <div class="wi-screen">
        <p class="wi-who" data-wi-who>${SCREENS[0].who}</p>
        <div class="wi-scroll" data-wi-screen>
${SCREENS.map((s, i) => `          <div class="wi-pane${i ? '' : ' on'}" data-pane="${s.id}" data-who="${s.who}"><div class="wc-live">${s.html}</div></div>`).join('\n')}
        </div>
      </div>
    </div>
    <div class="wi-text">
      <div class="wi-head">
        <p class="wi-eyebrow">${copy.eyebrow}</p>
        <h2>${copy.h2}</h2>
        <p class="wi-sub">${copy.sub}</p>
      </div>
      <p class="wi-listhead">${copy.listhead}</p>
      <ol class="wi-list">
${SCREENS.map((s, i) => `        <li class="wi-item${i ? '' : ' is-active'}"><button type="button" class="wi-row" data-section="${s.id}" aria-pressed="${i ? 'false' : 'true'}"><span class="wi-num">${String(i + 1).padStart(2, '0')}</span><span class="wi-label">${s.label}</span><span class="wi-mark" aria-hidden="true">${TICK}</span></button></li>`).join('\n')}
      </ol>
      <a class="wi-cta" href="#atf" data-wi-cta>${copy.cta}</a>
    </div>
  </div>
</div></section>
<script>
(function(){
  var root=document.querySelector('[data-wi]'); if(!root) return;
  var panes=root.querySelectorAll('[data-pane]'), rows=root.querySelectorAll('.wi-row');
  var who=root.querySelector('[data-wi-who]'), screen=root.querySelector('[data-wi-screen]');
  var phone=root.querySelector('.wi-phone');
  // matchMedia is missing in some environments (jsdom, for one); hover then
  // behaves as the wide screen it was written for rather than doing nothing.
  function wide(){ return window.matchMedia ? window.matchMedia('(min-width:900px)').matches : true; }
  function narrow(){ return window.matchMedia ? window.matchMedia('(max-width:899px)').matches : false; }
  function show(id, scroll){
    panes.forEach(function(p){
      var on=p.getAttribute('data-pane')===id;
      p.classList.toggle('on', on);
      if(on && who) who.textContent=p.getAttribute('data-who');
    });
    rows.forEach(function(b){
      var on=b.getAttribute('data-section')===id;
      b.setAttribute('aria-pressed', on?'true':'false');
      b.parentNode.classList.toggle('is-active', on);
    });
    if(screen) screen.scrollTop=0;
    // on a phone the rows sit under the frame; keep the frame in view on a tap
    if(scroll && phone && narrow()){
      var r=phone.getBoundingClientRect();
      if(r.top<0||r.bottom>window.innerHeight) phone.scrollIntoView({behavior:'smooth',block:'center'});
    }
  }
  rows.forEach(function(b){
    var id=b.getAttribute('data-section');
    b.addEventListener('click',function(){ show(id,true); });
    b.addEventListener('mouseenter',function(){ if(wide()) show(id,false); });
  });
  var cta=root.querySelector('[data-wi-cta]');
  if(cta) cta.addEventListener('click',function(e){
    var form=document.querySelector('#atf .form'); if(!form) return;
    e.preventDefault(); form.scrollIntoView({behavior:'smooth',block:'center'});
    var f=form.querySelector('.field'); if(!f) return;
    if(!f.hasAttribute('tabindex')) f.setAttribute('tabindex','-1');
    setTimeout(function(){ f.focus({preventScroll:true}); },600);
  });
})();
</script>`;
}
