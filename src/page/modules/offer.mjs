// offer — one module of the Compass page. Taken from the approved body in
// variants.mjs on 2026-10-06 and owned here from now on. Self-contained: it
// reads its own copy and its own settings and knows nothing about its
// neighbours or its position. The id is permanent and is never reused.
export const id = 'offer';

// No CSS of its own: the page skin in variants2.mjs styles this one. A new
// module puts its rules here, scoped to its own class.
export const css = '';

export function markup(copy, settings = {}) {
  const g = settings.ground ? ` wc-ground-${settings.ground}` : '';
  return `<section class="s offer-s${g}" id="offer"><div class="wrap">
  <figure class="offer-shot"><figure class="ph tape-c ph-tilt-a shot"><img class="ph-photo" src="/assets/img/compass2/offer.webp" width="1200" height="1600" alt="A child in a doorway at the end of the day, boots muddy" loading="lazy" decoding="async"><img class="tape" src="/assets/img/frames/tape-7.png" alt="" aria-hidden="true" loading="lazy"></figure></figure>
  <div class="offer">
    <div class="offer-main">
      <h2>${copy.offer.h2}</h2>
      <p class="price">${copy.offer.price}</p>
      <p class="lead">${copy.offer.tagline}</p>
      <div class="includes">${copy.offer.includes.map((i) => `<p>${i}</p>`).join('')}</div>
      <div class="act"><a class="btn" href="#">${copy.offer.cta}</a></div>
      <p class="small note-line">${copy.offer.note}</p>
    </div>
    <div class="steps">${copy.offer.how.map(([t, p], i) => `<div class="step"><span class="sn">${i + 1}</span><b>${t}</b><p>${p}</p></div>`).join('')}</div>
  </div>
</div></section>`;
}
