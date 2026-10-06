// banner-two — one module of the Compass page. Taken from the approved body in
// variants.mjs on 2026-10-06 and owned here from now on. Self-contained: it
// reads its own copy and its own settings and knows nothing about its
// neighbours or its position. The id is permanent and is never reused.
export const id = 'banner-two';

// No CSS of its own: the page skin in variants2.mjs styles this one. A new
// module puts its rules here, scoped to its own class.
export const css = '';

export function markup(copy, settings = {}) {
  const g = settings.ground ? ` wc-ground-${settings.ground}` : '';
  return `<section class="s banner banner--two${g}"><div class="wrap">
  <h2>${copy.banner2[0]}</h2><p class="bsub">${copy.banner2[1]}</p><a class="btn" href="#offer">Get Compass</a>
</div></section>`;
}
