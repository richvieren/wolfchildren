// The homepage, built from the Compass parts. Replaces src/pages/_retired/home.mjs. Richard, 2026-10-15: the Compass design on the main
// page; polaroids for the rounded photographs; the film behind a play button as
// the third section; his own hero (left still photo, right video loop); section
// two slides over the hero. Everything marked data-placeholder is a stand-in.
export default {
  id: 'home',
  url: '.',
  title: 'Wolf Children',
  titleSuffix: '',
  brand: 'wolf-children',
  skin: 'home',                  // the Compass skin, polaroid photographs
  atfMarkupFrom: 'mengto-skeuomorphic',
  atf: false,                    // the Compass ATF is not used here
  ctaHref: '/readings/compass/', // the Compass buttons go to the Compass page
  modules: [
    {
      id: 'home-hero',
      copy: 'A',
      settings: {
        // PLACEHOLDERS: swap for Richard's still photograph and his video loop
        // (right.video: '/assets/video/...mp4' turns the loop on).
        left: { src: '/assets/img/compass2/reason-2.webp', w: 1200, h: 1600, alt: 'A child at a fence', placeholder: 'photo' },
        right: { src: '/assets/img/compass2/reason-4.webp', w: 1200, h: 1600, alt: '', placeholder: 'video-loop' },
      },
    },
    // slides up over the hero; the hero lags at 0.4 of scroll speed
    { id: 'home-statement', copy: 'A', ground: 'light', edge: 'wave', edgeSpeed: 0.4 },
    {
      id: 'home-film',
      copy: 'A',
      ground: 'dark',
      settings: {
        vimeoId: '1136626687',
        poster: { src: '/assets/img/home-film-poster.webp', w: 1920, h: 1080, alt: '' },
      },
    },
    { id: 'how-it-works', copy: 'S' },
    {
      id: 'recognition',
      copy: 'L',
      ground: 'light',
      settings: {
        photo: { src: '/assets/img/compass2/reason-2.webp', w: 1200, h: 1600, alt: 'A child at a fence, absorbed in the animals on the other side' },
        slideshow: [
          { src: '/assets/img/compass2/reason-3.webp', w: 1200, h: 1600, alt: 'A child running across grass towards the trees' },
          { src: '/assets/img/compass2/reason-4.webp', w: 1200, h: 1600, alt: 'A child small on a path between tall pines' },
          { src: '/assets/img/compass2/reason-1.webp', w: 1200, h: 1600, alt: 'A child standing on a rock in a forest, looking back' },
        ],
      },
    },
    { id: 'home-day-night', copy: 'A' },
    {
      id: 'whats-inside',
      copy: 'L',
      ground: 'dark',
      settings: {
        lorem: true,
        photo: { src: '/assets/img/compass2/reason-1.webp', w: 1200, h: 1600, alt: 'A child standing on a rock in a forest, looking back' },
      },
    },
    { id: 'home-band', copy: 'A' },
    { id: 'facts', copy: 'L' },
    { id: 'offer-v2', copy: 'L', ground: 'dark' },
    { id: 'testimonials', copy: 'L', ground: 'light' },
    {
      id: 'photo-close',
      copy: 'B',
      settings: {
        photo: { src: '/assets/compass/DSCF9381.jpg', w: 2048, h: 1536, alt: 'A child standing at the shoreline at dusk, beside a dark rock' },
      },
    },
    // the comparison is gone; the moon calendar sits where it was
    { id: 'home-signup', copy: 'A', ground: 'light', edge: 'wave-2' },
    { id: 'footer', copy: 'A' },
  ],
};
