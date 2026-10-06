// hero — one module of the Compass page. Taken from the approved body in
// variants.mjs on 2026-10-06 and owned here from now on. Self-contained: it
// reads its own copy and its own settings and knows nothing about its
// neighbours or its position. The id is permanent and is never reused.
export const id = 'hero';

// No CSS of its own: the page skin in variants2.mjs styles this one. A new
// module puts its rules here, scoped to its own class.
export const css = '';

export function markup(copy, settings = {}) {
  void settings;
  return `<section class="s hero"><div class="wrap">
  <h1>${copy.hero.h1}</h1>
  <p class="lead">${copy.hero.sub}</p>
  <div class="act"><a class="btn" href="#offer">${copy.hero.cta}</a><p class="small">${copy.hero.ctaSub}</p></div>
  <div class="hero-media">
    <figure class="ph tape-a ph-tilt-a shot"><img class="ph-photo" src="/assets/img/compass2/hero.webp" width="1200" height="1600" alt="A child alone on the sand, a silhouette against the setting sun" loading="eager" fetchpriority="high" decoding="async"><img class="tape" src="/assets/img/frames/tape-1.png" alt="" aria-hidden="true" loading="lazy"></figure>
    <figure class="ph tape-b ph-tilt-b shot shot--detail"><img class="ph-photo" src="/assets/img/compass2/hero-detail.webp" width="1200" height="1600" alt="The same evening, close: a child crouched in long grass" loading="lazy" decoding="async"><img class="tape" src="/assets/img/frames/tape-4.png" alt="" aria-hidden="true" loading="lazy"></figure>
  </div>
</div></section>`;
}
