// photo-season — one module of the Compass page. Taken from the approved body in
// variants.mjs on 2026-10-06 and owned here from now on. Self-contained: it
// reads its own copy and its own settings and knows nothing about its
// neighbours or its position. The id is permanent and is never reused.
export const id = 'photo-season';

// No CSS of its own: the page skin in variants2.mjs styles this one. A new
// module puts its rules here, scoped to its own class.
export const css = '';

// A photograph is neutral: it takes no ground and the alternation skips it.
export const ground = 'neutral';

export function markup(copy, settings = {}) {
  void settings;
  return `<figure class="bleed"><figure class="ph tape-a ph-tilt-b"><img class="ph-photo" src="/assets/img/compass2/band-season.webp" width="1600" height="1200" alt="A forest path, a child small among the trees" loading="lazy" decoding="async"><img class="tape" src="/assets/img/frames/tape-1.png" alt="" aria-hidden="true" loading="lazy"></figure></figure>`;
}
