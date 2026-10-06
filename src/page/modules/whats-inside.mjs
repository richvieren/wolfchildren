// whats-inside — module 3, after the MUD\WTR "It's what's inside that counts"
// grid. The tiles are the real Compass blocks, copied from the two published
// samples by scripts/extract-widgets.py, not redrawn. Self-contained: markup,
// CSS and the blocks it names. The id is permanent.
import { WIDGETS as NORA, WIDGET_CSS } from '../../lib/compass-widgets.mjs';
import { WIDGETS as FINN } from '../../lib/compass-widgets-finn.mjs';
import { EXTRA } from '../../lib/compass-widgets-extra.mjs';

export const id = 'whats-inside';

// Nine tiles, strongest first, mixing the two children. Each title and each
// sentence is inside the block itself, exactly as the sample renders it.
const TILES = [
  { child: 'Nora', html: NORA['card-holding'].html },        // the moon that night
  { child: 'Finn', html: FINN['card-elements'].html },       // elements
  { child: 'Nora', html: EXTRA['card-wired-nora'] },    // what's wired to what
  { child: 'Finn', html: EXTRA['card-quick-finn'] },    // quick and slow
  { child: 'Nora', html: NORA['card-three-lines'].html },    // three lines
  { child: 'Finn', html: FINN['card-energy'].html },         // where the energy goes
  { child: 'Nora', html: NORA['card-being-seen'].html },     // being seen
  { child: 'Finn', html: FINN['badge-group'].html },         // in a group
  { child: 'Nora', html: NORA['badge-explains'].html },      // how they explain themselves
];

// The blocks bring their own stylesheet, already scoped to .wc-live by the
// extractor. Everything this module adds is a brand, skin or ground token.
export const css = `${WIDGET_CSS}
.wi-head{text-align:center}
.wi-head h2{font-family:var(--b-display);font-weight:400;color:var(--g-text);
  font-size:var(--s-type-display);line-height:var(--s-type-display-lh);
  letter-spacing:var(--s-type-display-ls);max-width:none;margin:0 auto}
.wi-sub{font-family:var(--b-body);color:var(--g-text);font-size:var(--s-type-body);
  line-height:var(--s-type-body-lh);letter-spacing:var(--s-type-body-ls);
  margin:var(--s-space-para) auto 0;max-width:46ch}
.wi-grid{display:grid;grid-template-columns:1fr;gap:var(--s-space-block);
  align-items:stretch;margin-top:var(--s-space-section)}
.wi-tile{background:var(--b-paper);border-radius:var(--s-radius-card);
  padding:var(--s-pad-card);display:flex;flex-direction:column;gap:12px}
.wi-who{font-family:var(--b-body);font-size:var(--s-type-eyebrow);
  letter-spacing:var(--s-type-eyebrow-ls);text-transform:uppercase;
  color:var(--b-bark)}
.wi-tile .wc-live{flex:1}
.wi-tile .wc-live .card{background:none;border:0;padding:0}
.wi-links{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;
  gap:12px;margin-top:var(--s-space-section);font-family:var(--b-body);
  font-size:var(--s-type-body);color:var(--g-text)}
.wi-links a{color:var(--g-text);text-underline-offset:4px}
@media(min-width:900px){
  .wi-grid{grid-template-columns:repeat(3,minmax(0,1fr))}
}
`;

export function markup(copy, settings = {}) {
  const g = settings.className ? ` ${settings.className}` : '';
  return `<section class="s whats-inside-s${g}"><div class="wrap">
  <div class="wi-head">
    <h2>${copy.h2}</h2>
    <p class="wi-sub">${copy.sub}</p>
  </div>
  <div class="wi-grid">
${TILES.map((t) => `    <div class="wi-tile"><p class="wi-who">${t.child}</p><div class="wc-live">${t.html}</div></div>`).join('\n')}
  </div>
  <p class="wi-links">${copy.links.map(([label, href]) => `<a href="${href}">${label}</a>`).join('<span aria-hidden="true">&middot;</span>')}</p>
</div></section>`;
}
