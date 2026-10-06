// outcomes — one module of the Compass page. Taken from the approved body in
// variants.mjs on 2026-10-06 and owned here from now on. Self-contained: it
// reads its own copy and its own settings and knows nothing about its
// neighbours or its position. The id is permanent and is never reused.
export const id = 'outcomes';

// No CSS of its own: the page skin in variants2.mjs styles this one. A new
// module puts its rules here, scoped to its own class.
export const css = '';

export function markup(copy, settings = {}) {
  const g = settings.ground ? ` wc-ground-${settings.ground}` : '';
  return `<section class="s outcomes-s${g}"><div class="wrap">
  <h2>${copy.outcomes.h2}</h2>
  <div class="outcomes">${copy.outcomes.items.map((o) => `<p>${o}</p>`).join('')}</div>
</div></section>`;
}
