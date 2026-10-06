// support-band — one module of the Compass page. Taken from the approved body in
// variants.mjs on 2026-10-06 and owned here from now on. Self-contained: it
// reads its own copy and its own settings and knows nothing about its
// neighbours or its position. The id is permanent and is never reused.
export const id = 'support-band';

// No CSS of its own: the page skin in variants2.mjs styles this one. A new
// module puts its rules here, scoped to its own class.
export const css = '';

export function markup(copy, settings = {}) {
  void settings;
  return `<div class="band"><div class="wrap band-grid">
  ${copy.support.bullets.map((b) => `<p class="bullet">${b}</p>`).join('')}
</div><div class="wrap"><div class="badges">${copy.support.badges.map((b) => `<span class="small">${b}</span>`).join('')}</div></div></div>`;
}
