// home-day-night — PLACEHOLDER. Richard, 2026-10-15: "thinking about a day and
// night section", to carry the astrology. Two halves, day and night, nothing
// final. Every piece of it carries data-placeholder so it cannot be mistaken for
// finished work. No stars, moons or zodiac glyphs (brand bible §6).
export const id = 'home-day-night';
export const ground = 'neutral';

export const css = `
.home-dn{padding:0;display:grid;grid-template-columns:1fr 1fr;min-height:70vh}
.dn-half{display:grid;place-items:center;text-align:center;padding:var(--s-space-section) 24px}
.dn-day{background:var(--b-cream);color:var(--b-green)}
.dn-night{background:var(--b-shell);color:var(--b-cream)}
.dn-h{font-family:var(--b-display);font-weight:400;font-size:clamp(2rem,4vw,3.2rem);
  line-height:1.04;letter-spacing:-.035em;margin:0 0 var(--s-space-block)}
.dn-p{font-family:var(--b-body);font-size:var(--s-type-body);line-height:var(--s-type-body-lh);max-width:34ch;margin:0 auto}
@media (max-width:760px){.home-dn{grid-template-columns:1fr}}
`;

export function markup(copy, settings = {}) {
  return `<section class="s home-dn" data-placeholder="section">
  <div class="dn-half dn-day"><div><h2 class="dn-h">${copy.day.heading}</h2><p class="dn-p">${copy.day.text}</p></div></div>
  <div class="dn-half dn-night"><div><h2 class="dn-h">${copy.night.heading}</h2><p class="dn-p">${copy.night.text}</p></div></div>
</section>`;
}
