// home-hero — the homepage's first screen. Left: a still photograph. Right: a
// video loop. The line over the join. Richard, 2026-10-15, from his reference:
// the two halves fill the window, so they are cropped (object-fit: cover); this
// is his call over the brand bible's "never crop" rule. The video is a
// placeholder until he supplies the loop: settings.right.video turns it on.
export const id = 'home-hero';
export const ground = 'neutral';

export const css = `
.home-hero{padding:0;box-sizing:border-box;position:relative;height:100vh;height:100svh;min-height:560px;overflow:hidden;
  display:grid;grid-template-columns:1fr 1fr;background:var(--b-shell)}
.hh-half{position:relative;overflow:hidden;margin:0}
.hh-half img,.hh-half video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
.hh-wash{position:absolute;inset:0;pointer-events:none;background:
  radial-gradient(58% 46% at 50% 50%,rgba(51,61,47,.62) 0%,rgba(51,61,47,.30) 60%,rgba(51,61,47,0) 100%)}
.hh-h{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:2;margin:0;
  width:min(92vw,20ch);text-align:center;font-family:var(--b-display);font-weight:400;
  font-size:clamp(2.1rem,4.6vw,4rem);line-height:1.04;letter-spacing:-.035em;color:var(--b-cream);
  text-wrap:balance}
@media (max-width:760px){
  .home-hero{grid-template-columns:1fr;grid-template-rows:1fr 1fr}
}
`;

function media(side, alt) {
  if (side.video) {
    return `<video src="${side.video}" poster="${side.src}" autoplay muted loop playsinline preload="metadata" aria-hidden="true"></video>`;
  }
  const ph = side.placeholder ? ` data-placeholder="${side.placeholder}"` : '';
  return `<img src="${side.src}" width="${side.w}" height="${side.h}" alt="${alt}"${ph} decoding="async">`;
}

export function markup(copy, settings = {}) {
  const g = settings.className ? ` ${settings.className}` : '';
  return `<section class="s home-hero${g}">
  <figure class="hh-half hh-left">${media(settings.left, settings.left.alt ?? '')}</figure>
  <figure class="hh-half hh-right">${media(settings.right, settings.right.alt ?? '')}</figure>
  <div class="hh-wash" aria-hidden="true"></div>
  <h1 class="hh-h">${copy.heading}</h1>
</section>`;
}
