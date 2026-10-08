// atf-copy.mjs — every word on the above-the-fold section, as a slot with variants.
//
// Richard, 2026-09-30: "all the text needs to be modular and basically I wanna
// AB test the fuck out of all of this."
//
// HOW IT WORKS
//   SLOTS  every text position on the page, each an ARRAY of variants.
//          Index 0 is the live copy. Add a variant by appending a string.
//   CELLS  a named test cell picks an index per slot. Anything it does not
//          name falls back to 0, so a cell that changes one headline is one line.
//
// Each cell builds to its own URL, so a test is a real page: cacheable, shareable,
// and attributable in the pixel via the data-cell attribute on <body>.
//
// RULE: copy in here is Richard's, verbatim. Nothing is reworded, shortened or
// "improved" on the way through. Typos are raised with him, never silently fixed.
// One exception, on his instruction (2026-10-08): the three `sub` variants were
// written here, with the copywriting skill and the brand bible's §7 voice. He
// picks; index 0 is live until he says otherwise. Everything else stays his.

export const SLOTS = {
  announce:   ['Buy two and get one free.'],
  eyebrow:    ['For the parent who goes deeper'],
  // <br> marks the line break. Richard's preview breaks after "child's".
  // [1] is not new copy. It is the sub line below, reused verbatim as a headline
  // for the A/B demo, because every slot in here still has exactly one variant
  // and nothing may be written for Richard (see the RULE above).
  headline:   [`Discover your child's<br>astrology cheat sheet`,
               'The Compass helps you understand and empower your child based on their unique astrology chart.'],
  // [0] is Richard's own, live from 2026-10-08. The three below it were written
  // here on his instruction that day and stay in the file, unused, so he can
  // switch one in by moving an index.
  sub: [
    'One page about how your child is wired, read from the moment and place they were born. Ready in seconds',
    "Read your child's whole birth chart in plain words, written for you in minutes from their date, time and place of birth.",
    'One page about your child, written from their date, time and place of birth, and ready to read minutes after you enter them.',
    'Give their birth details and read one page that says how your child is wired, in plain words, in minutes.',
  ],
  // sits directly under the sub line
  subAlso: ['Without waiting weeks, reading fifty pages or learning astrology yourself.'],
  formLabel:  ['Start with their birth details'],
  fieldDate:  ['Date of birth'],
  fieldTime:  ['Time'],
  fieldPlace: ['Place of birth'],
  cta:        ['Get their Compass · $27'],
  under:      ['Or <a href="/readings/compass/sample/nora/">read a whole one free</a> before you decide.'],
  // Each entry is a whole set, so a test can swap the order or the wording together.
  // 2026-10-08, Richard: the tick list carries the five benefits. The logistics
  // moved to one small line under the button (see `logistics` below).
  fuds: [[
    ['Know what actually settles them after a hard day.'],
    ['Understand why bedtime goes the way it goes.'],
    ['Stop taking the meltdowns personally.'],
    ['See where their energy goes, and what drains it.'],
    ["A page you'll reread as they grow, and still find true."],
  ]],
  logistics: ['One payment of $27 &middot; Ready in minutes &middot; Yours to keep &middot; Private'],
  stickyName:  ['Compass'],
  stickyPrice: ['$27'],
  stickyCta:   ['Get their Compass'],
};

/** The gallery. `src` null means the slide is an empty frame with its brief showing.
 *  Square, 1440 x 1440 when supplied. Order is the order they appear. */
// Richard's own composites, delivered 2026-10-02 from NIGHT/LP. His filenames are
// kept exactly as he exports them, so a re-export drops straight in. All three are
// 4:3, which is why the slide box is 4:3: his files are not cropped to fit a box.
// Shipped at 1400 wide as WebP, which is 69% lighter than the JPEGs at the same
// quality. The alt text is mine, since it describes a picture rather than selling
// anything; the copy slots above are his.
export const SLIDES = [
  { src: '/assets/img/atf/slide-0.webp', w: 1400, h: 1050,
    alt: 'A child on a beach at sunset, with the zodiac wheel drawn across the sky' },
  { src: '/assets/img/atf/slide-1.webp', w: 1400, h: 1050,
    alt: 'Four cards from the reading, floating above a child walking on a beach' },
  { src: '/assets/img/atf/slide-2.webp', w: 1400, h: 1050,
    alt: 'Two cards from the reading, beside a child standing at the shoreline' },
  { src: null, brief: 'What you get: the reading on a phone' },
];

/** The offer block. Index 0 is the single $27 offer and renders no selector.
 *  A future set uses mode 'select' with an options array, for the buy-two tests. */
export const OFFERS = [
  { mode: 'single' },
  // { mode: 'select', options: [
  //   { label: 'Buy two, get one free', sub: 'Three children', price: '$54', badge: 'Most popular' },
  //   { label: 'Buy once',              sub: 'One child',     price: '$27' },
  // ] },
];

/** Named test cells. `control` takes index 0 everywhere. */
export const CELLS = {
  control: {},
  // The A/B demo page: the headline takes variant 1.
  'ab-demo': { headline: 1 },
  // Example of the shape, commented until Richard writes the variant copy:
  // 'h2': { headline: 1 },
  // 'h2-sub2': { headline: 1, sub: 1 },
};

/** Resolve one cell to a flat map of strings. Throws if a variant is missing. */
export function resolve(cellName) {
  const cell = CELLS[cellName];
  if (!cell) throw new Error(`no such cell: ${cellName}`);
  const out = { offer: OFFERS[cell.offer ?? 0], slides: SLIDES };
  if (!out.offer) throw new Error(`cell "${cellName}" wants offer[${cell.offer}], which does not exist`);
  for (const [slot, variants] of Object.entries(SLOTS)) {
    const i = cell[slot] ?? 0;
    if (variants[i] === undefined) throw new Error(`cell "${cellName}" wants ${slot}[${i}], which does not exist`);
    out[slot] = variants[i];
  }
  return out;
}

/** Every slot that currently has more than one variant, for the test log. */
export function testable() {
  return Object.entries(SLOTS).filter(([, v]) => v.length > 1).map(([k, v]) => `${k} (${v.length})`);
}
