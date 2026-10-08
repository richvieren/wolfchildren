// testimonials — the review band: a gold rule above and below, an underlined
// eyebrow, then three columns, each a square photograph with an asterisk on it,
// a large quote and a small name. Self-contained: markup, CSS from tokens.
//
// The reference Richard named is the "Real results, real transformations" band
// on lila-ray.showit.site/about. That page carries no such band (checked in a
// browser on 2026-10-08: no matching text on /about or the home page), so this
// is built to his written description, in Wolf Children's colours and faces.
//
// Every quote, name and photograph carries data-placeholder="review": the words
// are the three review lines already on the page and the photographs are plain
// tan squares until real ones exist.
import { readFileSync } from 'node:fs';

export const id = 'testimonials';

const STAR = readFileSync(new URL('../../../assets/img/frames/asterisk-lila.svg', import.meta.url), 'utf8')
  .replace('<svg ', '<svg class="tm-star" aria-hidden="true" fill="currentColor" ')
  .trim();

export const css = `
.testimonials-s{border-top:2px solid var(--b-gold);border-bottom:2px solid var(--b-gold)}
.tm{display:grid;gap:var(--s-space-section);justify-items:center;text-align:center}
.tm-eyebrow{font-family:var(--b-body);font-size:var(--s-type-eyebrow);
  letter-spacing:var(--s-type-eyebrow-ls);text-transform:uppercase;color:var(--g-quiet);
  margin:0;padding-bottom:6px;border-bottom:1px solid var(--b-gold);display:inline-block}
.tm-h{font-family:var(--b-display);font-weight:400;color:var(--g-text);
  font-size:var(--s-type-display);line-height:var(--s-type-display-lh);
  letter-spacing:var(--s-type-display-ls);max-width:none;margin:18px 0 0}
.tm-list{list-style:none;margin:0;padding:0;display:grid;gap:var(--s-space-section);width:100%}
.tm-item{display:grid;gap:18px;justify-items:center}
.tm-shot{position:relative;width:100%;aspect-ratio:1/1;background:var(--b-tan);
  border-radius:var(--s-radius-btn-hard);margin:0}
.tm-star{position:absolute;right:-14px;top:-14px;width:40px;height:auto;color:var(--b-cream)}
.tm-q{font-family:var(--b-display);font-weight:400;font-size:21px;line-height:1.25;
  letter-spacing:var(--s-type-display-ls);color:var(--g-text);margin:0;max-width:30ch}
.tm-name{font-family:var(--b-body);font-size:var(--s-type-eyebrow);
  letter-spacing:var(--s-type-eyebrow-ls);text-transform:uppercase;color:var(--g-quiet);margin:0}
@media(min-width:900px){
  .tm-list{grid-template-columns:repeat(3,minmax(0,1fr));gap:48px}
}
`;

export function markup(copy, settings = {}) {
  const g = settings.className ? ` ${settings.className}` : '';
  const items = copy.reviews.map((r) => `      <li class="tm-item">
        <figure class="tm-shot" data-placeholder="review" role="img" aria-label="A photograph goes here">${STAR}</figure>
        <blockquote class="tm-q" data-placeholder="review">&ldquo;${r.quote}&rdquo;</blockquote>
        <p class="tm-name" data-placeholder="review">${r.name}</p>
      </li>`).join('\n');

  return `<section class="s testimonials-s${g}"><div class="wrap">
  <div class="tm">
    <div>
      <p class="tm-eyebrow">${copy.eyebrow}</p>
      <h2 class="tm-h">${copy.heading}</h2>
    </div>
    <ul class="tm-list">
${items}
    </ul>
  </div>
</div></section>`;
}
