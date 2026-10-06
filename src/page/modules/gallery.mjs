// gallery — one module of the Compass page. Taken from the approved body in
// variants.mjs on 2026-10-06 and owned here from now on. Self-contained: it
// reads its own copy and its own settings and knows nothing about its
// neighbours or its position. The id is permanent and is never reused.
export const id = 'gallery';

// No CSS of its own: the page skin in variants2.mjs styles this one. A new
// module puts its rules here, scoped to its own class.
export const css = '';

export function markup(copy, settings = {}) {
  const g = settings.ground ? ` wc-ground-${settings.ground}` : '';
  return `<section class="s gallery-s${g}"><div class="wrap">
  <div class="gallery">
    <figure class="ph tape-b ph-tilt-a shot"><img class="ph-photo" src="/assets/img/compass2/reason-1.webp" width="1200" height="1600" alt="A child standing on a rock in a forest, looking back" loading="lazy" decoding="async"><img class="tape" src="/assets/img/frames/tape-4.png" alt="" aria-hidden="true" loading="lazy"></figure>
    <figure class="ph tape-c ph-tilt-b shot"><img class="ph-photo" src="/assets/img/compass2/reason-2.webp" width="1200" height="1600" alt="A child at a fence, absorbed in the animals on the other side" loading="lazy" decoding="async"><img class="tape" src="/assets/img/frames/tape-7.png" alt="" aria-hidden="true" loading="lazy"></figure>
    <figure class="ph tape-a ph-tilt-a shot"><img class="ph-photo" src="/assets/img/compass2/reason-3.webp" width="1200" height="1600" alt="A child running across grass towards the trees" loading="lazy" decoding="async"><img class="tape" src="/assets/img/frames/tape-1.png" alt="" aria-hidden="true" loading="lazy"></figure>
    <figure class="ph tape-b ph-tilt-b shot"><img class="ph-photo" src="/assets/img/compass2/reason-4.webp" width="1200" height="1600" alt="A child small on a path between tall pines" loading="lazy" decoding="async"><img class="tape" src="/assets/img/frames/tape-4.png" alt="" aria-hidden="true" loading="lazy"></figure>
  </div>
</div></section>`;
}
