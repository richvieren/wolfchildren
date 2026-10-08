// how-it-works — three steps side by side, each under Lila's asterisk.
// Self-contained: markup, CSS from tokens, no script.
//
// The asterisk is her artwork, saved from lila-ray.showit.site/about as
// assets/img/frames/asterisk-lila.svg and used unredrawn. The file carries no
// fill of its own, so the colour comes from the CSS, as it does on her page.
import { readFileSync } from 'node:fs';

export const id = 'how-it-works';

const STAR = readFileSync(new URL('../../../assets/img/frames/asterisk-lila.svg', import.meta.url), 'utf8')
  .replace('<svg ', '<svg class="hw-star" aria-hidden="true" fill="currentColor" ')
  .trim();

export const css = `
.hiw{display:grid;gap:var(--s-space-section);justify-items:center;text-align:center}
.hiw-eyebrow{font-family:var(--b-body);font-size:var(--s-type-eyebrow);
  letter-spacing:var(--s-type-eyebrow-ls);text-transform:uppercase;color:var(--g-quiet);margin:0}
.hiw-rule{display:block;width:44px;height:1px;background:var(--b-tan);margin:10px auto 0}
.hiw-h{font-family:var(--b-display);font-weight:400;color:var(--g-text);
  font-size:var(--s-type-display);line-height:var(--s-type-display-lh);
  letter-spacing:var(--s-type-display-ls);max-width:none;margin:18px 0 0}
.hiw-steps{list-style:none;margin:0;padding:0;display:grid;gap:var(--s-space-block);width:100%}
.hiw-step{display:grid;gap:10px;justify-items:center;padding:0 24px}
.hw-star{display:block;width:34px;height:auto;color:var(--b-tan)}
.hiw-n{font-family:var(--b-body);font-size:var(--s-type-eyebrow);letter-spacing:var(--s-type-eyebrow-ls);
  color:var(--g-quiet);margin:0}
.hiw-t{font-family:var(--b-display);font-weight:400;font-size:22px;line-height:1.1;
  letter-spacing:var(--s-type-display-ls);color:var(--g-text);margin:0}
.hiw-p{font-family:var(--b-body);font-size:var(--s-type-body);line-height:var(--s-type-body-lh);
  color:var(--g-text);margin:0;max-width:30ch}
@media(min-width:900px){
  .hiw-steps{grid-template-columns:repeat(3,minmax(0,1fr));gap:48px}
  .hiw-step{padding:0}
}
`;

export function markup(copy, settings = {}) {
  const g = settings.className ? ` ${settings.className}` : '';
  const steps = copy.steps.map((s, i) => `      <li class="hiw-step">
        ${STAR}
        <p class="hiw-n">0${i + 1}</p>
        <h3 class="hiw-t">${s.title}</h3>
        <p class="hiw-p">${s.line}</p>
      </li>`).join('\n');

  return `<section class="s how-it-works-s${g}"><div class="wrap">
  <div class="hiw">
    <div>
      <p class="hiw-eyebrow">${copy.eyebrow}</p><span class="hiw-rule"></span>
      <h2 class="hiw-h">${copy.heading}</h2>
    </div>
    <ul class="hiw-steps">
${steps}
    </ul>
  </div>
</div></section>`;
}
