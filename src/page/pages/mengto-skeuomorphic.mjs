// The live page. Reordering, adding, removing or swapping a module or the ATF's
// copy cell is an edit to this file and nothing else.
export default {
  id: 'mengto-skeuomorphic',
  url: 'readings/compass/mengto-skeuomorphic',
  title: 'MengTo · high-contrast-skeuomorphic-clean',
  brand: 'wolf-children',                 // src/page/brands/
  skin: 'mengto',                         // src/page/skins/
  atfMarkupFrom: 'mengto-skeuomorphic',   // the ATF's markup transform, variants2.mjs
  atf: { cell: 'control' },               // a cell in src/lib/atf-copy.mjs
  modules: [
    // 2026-10-07, Richard: the page is these four modules and nothing else.
    // Every other module stays in src/page/modules/ and in the system, simply
    // not named here: support-band, photo-dusk, hero, sample, stats, reasons,
    // gallery, refusal, outcomes, offer, banner-one, compare, banner-two,
    // photo-season, faq, photo-close, close.
    {
      id: 'recognition',
      copy: 'A',
      // the wave sits on its top edge and laps over the block above it, which
      // moves at 0.3 so the testimonial cards stay in view longer
      edge: 'wave',
      edgeSpeed: 0.3,
      settings: {
        // One line to swap the photograph. Three candidates are named in
        // src/page/README.md; all three are portrait, 1200x1600.
        photo: {
          src: '/assets/img/compass2/reason-2.webp',
          w: 1200,
          h: 1600,
          alt: 'A child at a fence, absorbed in the animals on the other side',
        },
        // the small photograph crossfades through these three, 3.5s apart
        slideshow: [
          { src: '/assets/img/compass2/reason-3.webp', w: 1200, h: 1600, alt: 'A child running across grass towards the trees' },
          { src: '/assets/img/compass2/reason-4.webp', w: 1200, h: 1600, alt: 'A child small on a path between tall pines' },
          { src: '/assets/img/compass2/reason-1.webp', w: 1200, h: 1600, alt: 'A child standing on a rock in a forest, looking back' },
        ],
      },
    },
    { id: 'how-it-works', copy: 'A' },
    {
      id: 'whats-inside',
      copy: 'A',
      // 2026-10-08, Richard: how-it-works left the alternation, which would have
      // flipped this back to light; it keeps the dark ground it had.
      ground: 'dark',
      settings: {
        // flipped horizontally in CSS so the child faces the phone
        photo: {
          src: '/assets/img/compass2/reason-1.webp',
          w: 1200,
          h: 1600,
          alt: 'A child standing on a rock in a forest, looking back',
        },
      },
    },
    // 2026-10-07, Richard: the offer block sits on the dark green ground.
    // the quick-facts band paints its own ground, so the alternation steps over it
    { id: 'facts', copy: 'A' },
    { id: 'offer-v2', copy: 'A', ground: 'dark' },
    { id: 'testimonials', copy: 'A' },
    // built, and hidden until the films exist: settings.show turns it on
    { id: 'videos', copy: 'A', settings: { show: false } },
    {
      id: 'photo-close',
      copy: 'A',
      settings: {
        photo: {
          src: '/assets/compass/DSCF9381.jpg',
          w: 2048,
          h: 1536,
          alt: 'A child standing at the shoreline at dusk, beside a dark rock',
        },
      },
    },
    // the second wave, from the top of jadem.co.nz's "hey, i'm jade!" section
    { id: 'compare', copy: 'A', edge: 'wave-2' },
    { id: 'footer', copy: 'A' },
  ],
};
