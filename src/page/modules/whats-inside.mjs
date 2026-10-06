// whats-inside — module 3, after the MUD\WTR "It's what's inside that counts"
// grid. Six tiles, each one a real Compass block from a published sample.
// Self-contained: markup, CSS and the blocks it names. The id is permanent.
//
// The blocks arrive with the reading's own stylesheet, which is written for a
// full-width reading page, not for a tile. Three things are neutralised here and
// nowhere else: the widgets' dimmed states, their intrinsic widths, and their
// serif. Each tile keeps its title, its visual and the first sentence of its own
// text; everything after that first sentence is dropped.
import { WIDGETS as NORA, WIDGET_CSS } from '../../lib/compass-widgets.mjs';
import { WIDGETS as FINN } from '../../lib/compass-widgets-finn.mjs';
import { EXTRA } from '../../lib/compass-widgets-extra.mjs';

export const id = 'whats-inside';

/** The first sentence of a run of text, verbatim. */
function firstSentence(text) {
  const m = text.match(/^[\s\S]*?[.!?](?=\s|$)/);
  return (m ? m[0] : text).trim();
}

/** One tile's worth of a block: the title, the visual, one sentence. */
function tileHtml(html) {
  let out = html;
  // secondary lines go: the footer under a bar set, the badge's rule, its
  // placement line and its second paragraph.
  for (const cls of ['bar-footer', 'badge-rule', 'badge-placement', 'badge-basis']) {
    out = out.replace(new RegExp(`<(div|p) class="${cls}"[^>]*>[\\s\\S]*?</\\1>`, 'g'), '');
  }
  // the first text block is trimmed to its first sentence; later ones go.
  const TEXT = /<(div|p) class="(moon-line|wcontext|spec-context|badge-desc)"[^>]*>([\s\S]*?)<\/\1>/g;
  let first = true;
  out = out.replace(TEXT, (whole, tag, cls, inner) => {
    if (!first) return '';
    first = false;
    return `<${tag} class="${cls}">${firstSentence(inner)}</${tag}>`;
  });
  return out;
}

/** One slider out of the three-lines card, with the card's own title. */
function oneSlider(html, poleA, poleB) {
  const label = html.match(/<div class="wlabel">[\s\S]*?<\/div>/)[0];
  const spec = html.split('<div class="spec">').slice(1)
    .map((s) => '<div class="spec">' + s)
    .find((s) => s.includes(poleA) && s.includes(poleB));
  if (!spec) throw new Error(`whats-inside: no slider for ${poleA} / ${poleB}`);
  // the slider ends with its own context line; keep both.
  const end = spec.indexOf('</div>', spec.indexOf('spec-context'));
  return `<div class="card">${label}${spec.slice(0, end + 6)}</div></div>`;
}

// Six tiles, two rows of three.
const TILES = [
  { child: 'Nora', html: tileHtml(NORA['card-holding'].html) },     // the moon that night
  { child: 'Finn', html: tileHtml(FINN['card-elements'].html) },    // elements
  { child: 'Nora', html: tileHtml(EXTRA['card-wired-nora']) },      // what's wired to what
  { child: 'Finn', html: tileHtml(oneSlider(FINN['card-three-lines'].html, 'Starter', 'Finisher')) },
  { child: 'Nora', html: tileHtml(NORA['card-being-seen'].html) },  // being seen
  { child: 'Finn', html: tileHtml(FINN['badge-group'].html) },      // in a group
];

export const css = `${WIDGET_CSS}
.wi-head{text-align:center}
.wi-head h2{font-family:var(--b-display);font-weight:400;color:var(--g-text);
  font-size:var(--s-type-display);line-height:var(--s-type-display-lh);
  letter-spacing:var(--s-type-display-ls);max-width:none;margin:0 auto}
.wi-sub{font-family:var(--b-body);color:var(--g-text);font-size:var(--s-type-body);
  line-height:var(--s-type-body-lh);letter-spacing:var(--s-type-body-ls);
  margin:var(--s-space-para) auto 0;max-width:46ch}
.wi-grid{display:grid;grid-template-columns:1fr;gap:var(--s-space-block);
  grid-auto-rows:1fr;align-items:stretch;margin-top:var(--s-space-section)}
.wi-tile{background:var(--b-paper);border-radius:var(--s-radius-card);
  padding:var(--s-pad-card);display:flex;flex-direction:column;gap:10px;
  aspect-ratio:1/1;min-width:0;overflow:hidden}
.wi-who{font-family:var(--b-body);font-size:var(--s-type-eyebrow);
  letter-spacing:var(--s-type-eyebrow-ls);text-transform:uppercase;color:var(--b-bark)}

/* a — the blocks' dimmed states. The reading dims an inactive pole to .45, an
   inactive quadrant to .55 and a moon crater to .34, which on a tile reads as
   text that is barely there. Nothing here is a scroll reveal: the reading ships
   no such script. Everything in a tile is fully opaque. */
.wi-tile .wc-live *{opacity:1;visibility:visible}

/* b — the blocks' own widths. The reading sets max-widths of 360px and 620px on
   its text and draws its gauges at their natural size, so a block overflowed its
   grid cell and ran across the row. No rule in the reading's CSS sets
   grid-column; the overflow was the cause. */
.wi-tile .wc-live,.wi-tile .wc-live *{max-width:100%;min-width:0;grid-column:auto}
.wi-tile .wc-live .card{background:none;border:0;padding:0}
.wi-tile .wc-live svg{max-width:100%;height:auto}
.wi-tile .wc-live .moon{width:88px;height:88px}
.wi-tile .wc-live .gauge,.wi-tile .wc-live .badge-halo{max-width:116px}
.wi-tile .wc-live .badge-halo{width:52px;height:52px}

/* c — the serif. The reading sets Libre Baskerville on its prose and Montserrat
   900 on its labels and numbers. Inside a tile the page's own faces are used:
   Special Elite for text, and the page's label treatment for labels. */
.wi-tile .wc-live,.wi-tile .wc-live p,.wi-tile .wc-live div,.wi-tile .wc-live span,
.wi-tile .wc-live text{font-family:var(--b-body)}
.wi-tile .wc-live .letter-text,.wi-tile .wc-live .wcontext,.wi-tile .wc-live .spec-context,
.wi-tile .wc-live .hemi-footer,.wi-tile .wc-live .badge-desc,.wi-tile .wc-live .moon-line{
  font-family:var(--b-body);font-size:var(--s-type-body);line-height:var(--s-type-body-lh);
  letter-spacing:var(--s-type-body-ls);color:var(--g-text);max-width:none}
.wi-tile .wc-live .wlabel,.wi-tile .wc-live .badge-label,.wi-tile .wc-live .big3-word,
.wi-tile .wc-live .badge-type,.wi-tile .wc-live .bar-name,.wi-tile .wc-live .pole{
  font-family:var(--b-body);font-weight:400;letter-spacing:var(--s-type-eyebrow-ls);
  text-transform:uppercase;color:var(--b-bark)}
.wi-tile .wc-live .bar-count,.wi-tile .wc-live .pill-text{font-family:var(--b-body);font-weight:400}

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
