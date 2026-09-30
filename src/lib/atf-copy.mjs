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

export const SLOTS = {
  announce:   ['Buy two and get one free.'],
  eyebrow:    ['For the parent who goes deeper'],
  // <br> marks the line break. Richard's preview breaks after "child's".
  headline:   [`Discover your child's<br>astrology cheat sheet`],
  sub:        ['The Compass helps you understand and empower your child based on their unique astrology chart.'],
  slideTag:   ['Their chart'],
  formLabel:  ['Start with their birth details'],
  fieldDate:  ['Date of birth'],
  fieldTime:  ['Time'],
  fieldPlace: ['Place of birth'],
  cta:        ['Get their Compass · $27'],
  under:      ['Or <a href="/readings/compass/sample/nora/">read a whole one free</a> before you decide.'],
  // Each entry is a whole set, so a test can swap the order or the wording together.
  fuds: [[
    ['One payment', 'of $27. No subscription, nothing recurring.'],
    ['Ready in minutes', 'delivered straight to your private portal.'],
    ['Yours to keep', 'come back to it as they grow.'],
    ['Stays on our server', 'their details are never shared or sold.'],
  ]],
  stickyName:  ['Compass'],
  stickyPrice: ['$27'],
  stickyCta:   ['Get their Compass'],
};

/** Named test cells. `control` takes index 0 everywhere. */
export const CELLS = {
  control: {},
  // Example of the shape, commented until Richard writes the variant copy:
  // 'h2': { headline: 1 },
  // 'h2-sub2': { headline: 1, sub: 1 },
};

/** Resolve one cell to a flat map of strings. Throws if a variant is missing. */
export function resolve(cellName) {
  const cell = CELLS[cellName];
  if (!cell) throw new Error(`no such cell: ${cellName}`);
  const out = {};
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
