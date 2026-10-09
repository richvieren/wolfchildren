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

const MARK_COLOURS = ['#2F382B', '#495543', '#DA4635'];

export const css = `
/* Morning Memories ships three styles; the label is set in the script one.
   File: morning-memories-script.otf from the Morning Memories font duo,
   converted to woff2 and self-hosted beside the others. */
@font-face{font-family:"Morning Memories Script";
  src:url("/assets/fonts/morning-memories-script.woff2") format("woff2");
  font-weight:400;font-display:swap}
/* 2026-10-08, Richard: cream, with the paper's fibres multiplied over it. The
   paper is its own layer so its opacity can be set; multiply needs the band to
   be its own stacking context, or it would blend with the page behind it.
   paper.png is 768x956 but its fibres stop short of the edges, with clear
   margins of 18, 51, 46 and 20px, so tiling it leaves cream strips at every
   seam. paper-tile.png is its fully inked core, columns 50-715 and rows 47-908,
   666x862, drawn at its own size so the fibres stay sharp. */
.facts-s{position:relative;isolation:isolate;background:var(--b-tan);
  border-top:2px solid rgba(47,56,43,.4);border-bottom:2px solid rgba(47,56,43,.4);
  padding:64px 0}
/* 2026-10-08, Richard: kraft. Tan with the fibres multiplied over it.
   paper-kraft.png is paper-tile.png with every pixel's distance from white
   stretched by 4 (new = 255 - 4*(255 - old), clipped at 0): the sheet stays
   white and only the fibres darken, so the texture reads on tan. */
.facts-s::before{content:"";position:absolute;inset:0;z-index:-1;pointer-events:none;
  background:url(/assets/img/frames/paper-kraft.png) repeat 0 0/666px auto;
  /* the file is pale (mean luminance 235 of 255), so it needs the whole layer to
     read; at .55 the band measured only 2 points darker than flat cream. */
  mix-blend-mode:multiply;opacity:1}
.fa{display:grid;gap:40px;justify-items:center;text-align:center}
.fa-label{font-family:"Morning Memories Script",var(--b-display);font-weight:400;
  color:#2F382B;font-size:57px;line-height:1;margin:0}
.fa-list{list-style:none;margin:0;padding:0;display:grid;gap:40px;width:100%}
.fa-item{display:grid;gap:14px;justify-items:center;padding:0 24px}
.fa-star{display:block;width:34px;height:auto}
.fa-line{font-family:var(--b-body);font-size:13px;line-height:1.5;
  letter-spacing:.18em;color:#2F382B;margin:0}
/* each mark at its own angle */
.fa-item:nth-child(1) .fa-star{transform:rotate(9deg)}
.fa-item:nth-child(2) .fa-star{transform:rotate(-14deg)}
.fa-item:nth-child(3) .fa-star{transform:rotate(4deg)}
.fa-line-2{color:rgba(47,56,43,.75)}

/* mobile: the label on top, the facts stacked, a tan rule between them */
.fa-item + .fa-item{border-top:2px solid rgba(47,56,43,.4);padding-top:40px}

@media(min-width:900px){
  .facts-s{padding:76px 0}
  /* the row sits left to right; each fact still reads centred under its mark */
  .fa{grid-template-columns:auto 1fr;gap:56px;align-items:center;justify-items:start}
  .fa-label{font-size:57px}
  .fa-list{grid-template-columns:repeat(3,minmax(0,1fr));gap:0}
  .fa-item{padding:0 40px}
  .fa-item + .fa-item{border-top:0;border-left:2px solid rgba(47,56,43,.4);padding-top:0}
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
