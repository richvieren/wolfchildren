// reasons — one module of the Compass page. Taken from the approved body in
// variants.mjs on 2026-10-06 and owned here from now on. Self-contained: it
// reads its own copy and its own settings and knows nothing about its
// neighbours or its position. The id is permanent and is never reused.
export const id = 'reasons';

// No CSS of its own: the page skin in variants2.mjs styles this one. A new
// module puts its rules here, scoped to its own class.
export const css = '';

export function markup(copy, settings = {}) {
  void settings;
  return `<section class="s reasons-s"><div class="wrap">
  <h2>${copy.reasons.h2}</h2>
  <div class="reasons">${copy.reasons.items.map(([t, p], i) => `<div class="reason"><span class="n">${String(i + 1).padStart(2, '0')}</span><h3>${t}</h3><p>${p}</p></div>`).join('')}</div>
</div></section>`;
}
