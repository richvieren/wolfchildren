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
    { id: 'hero', copy: 'A' },
    { id: 'support-band', copy: 'A' },
    { id: 'photo-dusk', copy: 'A' },
    { id: 'recognition', copy: 'A' },
    { id: 'sample', copy: 'A' },
    { id: 'stats', copy: 'A' },
    { id: 'reasons', copy: 'A' },
    { id: 'gallery', copy: 'A' },
    { id: 'refusal', copy: 'A' },
    { id: 'outcomes', copy: 'A' },
    { id: 'offer', copy: 'A' },
    { id: 'banner-one', copy: 'A' },
    { id: 'compare', copy: 'A' },
    { id: 'banner-two', copy: 'A' },
    { id: 'photo-season', copy: 'A' },
    { id: 'faq', copy: 'A' },
    { id: 'photo-close', copy: 'A' },
    { id: 'close', copy: 'A' },
    { id: 'footer', copy: 'A' },
  ],
};
