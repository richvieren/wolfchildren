// sample — one module of the Compass page. Taken from the approved body in
// variants.mjs on 2026-10-06 and owned here from now on. Self-contained: it
// reads its own copy and its own settings and knows nothing about its
// neighbours or its position. The id is permanent and is never reused.
export const id = 'sample';

// No CSS of its own: the page skin in variants2.mjs styles this one. A new
// module puts its rules here, scoped to its own class.
export const css = '';

export function markup(copy, settings = {}) {
  const g = settings.className ? ` ${settings.className}` : '';
  return `<section class="s sample${g}"><div class="wrap">
  <h2>${copy.sample.h2}</h2>
  <p class="lead">${copy.sample.body}</p>
  <figure class="sample-shot"><figure class="ph tape-a ph-tilt-b shot"><img class="ph-photo" src="/assets/img/compass2/sample.webp" width="1600" height="1200" alt="A child building a sandcastle at the end of the day" loading="lazy" decoding="async"><img class="tape" src="/assets/img/frames/tape-1.png" alt="" aria-hidden="true" loading="lazy"></figure></figure>
  <div class="links">${copy.sample.links.map(([l, h]) => `<a class="link" href="${h}">${l}</a>`).join('')}</div>
</div></section>`;
}
