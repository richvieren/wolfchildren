// facts — the quick-facts band. One row: a label, then three facts separated by
// tan rules, each under the same hand-drawn asterisk recognition uses.
// Self-contained: markup, CSS from tokens, no script.
import { readFileSync } from 'node:fs';

export const id = 'facts';

// it paints its own ground, so it takes none and does not flip the alternation
export const ground = 'neutral';

// the same stroke as recognition's mark, drawn here in its own colour
// Lila's own asterisk, saved from lila-ray.showit.site/about as
// assets/img/frames/asterisk-lila.svg and used unredrawn. The file carries no
// fill, so the colour comes from the CSS, as it does on her page.
const STAR = readFileSync(new URL('../../../assets/img/frames/asterisk-lila.svg', import.meta.url), 'utf8')
  .replace('<svg ', '<svg class="fa-star" aria-hidden="true" fill="currentColor" ')
  .trim();

const MARK_COLOURS = ['var(--b-tan)', 'var(--b-cream)', '#DA4635'];

export const css = `
/* Morning Memories ships three styles; the label is set in the script one.
   File: morning-memories-script.otf from the Morning Memories font duo,
   converted to woff2 and self-hosted beside the others. */
@font-face{font-family:"Morning Memories Script";
  src:url("/assets/fonts/morning-memories-script.woff2") format("woff2");
  font-weight:400;font-display:swap}
.facts-s{background:#262E23;
  border-top:2px solid var(--b-tan);border-bottom:2px solid var(--b-tan);
  padding:64px 0}
.fa{display:grid;gap:40px;justify-items:center;text-align:center}
.fa-label{font-family:"Morning Memories Script",var(--b-display);font-weight:400;
  color:var(--b-cream);font-size:38px;line-height:1;margin:0}
.fa-list{list-style:none;margin:0;padding:0;display:grid;gap:40px;width:100%}
.fa-item{display:grid;gap:14px;justify-items:center;padding:0 24px}
.fa-star{display:block;width:34px;height:auto}
.fa-line{font-family:var(--b-body);font-size:13px;line-height:1.5;
  letter-spacing:.18em;text-transform:uppercase;color:var(--b-cream);margin:0}
.fa-line-2{color:rgba(223,215,195,.75)}

/* mobile: the label on top, the facts stacked, a tan rule between them */
.fa-item + .fa-item{border-top:2px solid var(--b-tan);padding-top:40px}

@media(min-width:900px){
  .facts-s{padding:76px 0}
  /* the row sits left to right; each fact still reads centred under its mark */
  .fa{grid-template-columns:auto 1fr;gap:56px;align-items:center;justify-items:start}
  .fa-label{font-size:38px}
  .fa-list{grid-template-columns:repeat(3,minmax(0,1fr));gap:0}
  .fa-item{padding:0 40px}
  .fa-item + .fa-item{border-top:0;border-left:2px solid var(--b-tan);padding-top:0}
}
`;

export function markup(copy, settings = {}) {
  const g = settings.className ? ` ${settings.className}` : '';
  const items = copy.facts.map((f, i) => `      <li class="fa-item">
        <span style="color:${MARK_COLOURS[i]}">${STAR}</span>
        <p class="fa-line">${f[0]}</p>
        <p class="fa-line fa-line-2">${f[1]}</p>
      </li>`).join('\n');

  return `<section class="s facts-s${g}"><div class="wrap">
  <div class="fa">
    <p class="fa-label">${copy.label}</p>
    <ul class="fa-list">
${items}
    </ul>
  </div>
</div></section>`;
}
