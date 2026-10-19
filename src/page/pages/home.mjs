// The homepage, built from the Compass parts. Replaces src/pages/_retired/home.mjs. Richard, 2026-10-15: the Compass design on the main
// page; polaroids for the rounded photographs; the film behind a play button as
// the third section; his own hero (left still photo, right video loop); section
// two slides over the hero. Everything marked data-placeholder is a stand-in.
export default {
  id: 'home',
  url: '.',
  title: 'Wolf Children',
  titleSuffix: '',
  // the link preview on social: 1200x630, Richard's own file, never cropped
  og: {
    title: 'Wolf Children',
    description: 'An inspiring collection of tools, recipes and stories for families that don\u2019t want to fall into the trap of screen time.',
    url: 'https://wolfchildren.co/',
    image: 'https://wolfchildren.co/assets/img/social-preview.png',
  },
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
    { id: 'how-it-works', copy: 'S' },
    {
      id: 'home-film',
      copy: 'A',
      ground: 'dark',
      settings: {
        vimeoId: '1136626687',
        poster: { src: '/assets/img/home-film-poster.webp', w: 1920, h: 1080, alt: '' },
      },
    },
    {
      id: 'home-strip',
      copy: 'A',
      settings: {
        strip: [
          { src: '/assets/img/strip/reason-2.webp', w: 600, h: 800, alt: 'A child at a fence, reaching toward the alpacas' },
          { src: '/assets/img/strip/reason-3.webp', w: 600, h: 800, alt: 'A child running across grass towards the trees' },
          { src: '/assets/img/strip/offer.webp', w: 600, h: 800, alt: 'A child in a blue sweater, laughing in the doorway' },
          { src: '/assets/img/strip/hero-detail.webp', w: 600, h: 800, alt: 'A child on the grass, reaching into the green' },
          { src: '/assets/img/strip/reason-1.webp', w: 600, h: 800, alt: 'A child standing on a mossy rock in the forest' },
          { src: '/assets/img/strip/reason-4.webp', w: 600, h: 800, alt: 'A child walking down a path through the pines' },
          { src: '/assets/img/strip/hero.webp', w: 600, h: 800, alt: 'A child watching the sun go down over the sea' },
        ],
        gallery: [
          { src: '/assets/img/compass2/reason-2.webp', w: 1200, h: 1600, alt: 'A child at a fence, reaching toward the alpacas' },
          { src: '/assets/img/compass2/band-dusk.webp', w: 1600, h: 1200, alt: 'A child on the sand at dusk, a mountain behind' },
          { src: '/assets/img/compass2/reason-3.webp', w: 1200, h: 1600, alt: 'A child running across grass towards the trees' },
          { src: '/assets/img/compass2/close.webp', w: 1600, h: 1200, alt: 'A child on the beach under a sunset sky' },
          { src: '/assets/img/compass2/offer.webp', w: 1200, h: 1600, alt: 'A child in a blue sweater, laughing in the doorway' },
          { src: '/assets/img/compass2/band-season.webp', w: 1600, h: 1200, alt: 'A child playing in the pine forest' },
          { src: '/assets/img/compass2/hero-detail.webp', w: 1200, h: 1600, alt: 'A child on the grass, reaching into the green' },
          { src: '/assets/img/compass2/sample.webp', w: 1600, h: 1200, alt: 'A child building in the sand' },
          { src: '/assets/img/compass2/reason-1.webp', w: 1200, h: 1600, alt: 'A child standing on a mossy rock in the forest' },
          { src: '/assets/img/compass2/reason-4.webp', w: 1200, h: 1600, alt: 'A child walking down a path through the pines' },
          { src: '/assets/img/compass2/hero.webp', w: 1200, h: 1600, alt: 'A child watching the sun go down over the sea' },
        ],
      },
    },
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
    { id: 'home-band', copy: 'A' },
    { id: 'facts', copy: 'R' },
    {
      id: 'photo-close',
      copy: 'H',
      settings: {
        photo: { src: '/assets/compass/DSCF9381.jpg', w: 2048, h: 1536, alt: 'A child standing at the shoreline at dusk, beside a dark rock' },
      },
    },
    // the comparison is gone; the moon calendar sits where it was
    { id: 'home-signup', copy: 'A', ground: 'light', edge: 'wave-2' },
    { id: 'footer', copy: 'H' },
  ],
};
