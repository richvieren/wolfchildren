// recognition — one module of the Compass page. Taken from the approved body in
// variants.mjs on 2026-10-06 and owned here from now on. Self-contained: it
// reads its own copy and its own settings and knows nothing about its
// neighbours or its position. The id is permanent and is never reused.
export const id = 'recognition';

// No CSS of its own: the page skin in variants2.mjs styles this one. A new
// module puts its rules here, scoped to its own class.
export const css = '';

export function markup(copy, settings = {}) {
  const g = settings.ground ? ` wc-ground-${settings.ground}` : '';
  return `<section class="s recognition-s${g}"><div class="wrap">
  <h2>${copy.recognition.h2}</h2>
  <div class="recognition">${copy.recognition.body.map((t) => `<p>${t}</p>`).join('')}</div>
</div></section>`;
}
