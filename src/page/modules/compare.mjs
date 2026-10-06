// compare — one module of the Compass page. Taken from the approved body in
// variants.mjs on 2026-10-06 and owned here from now on. Self-contained: it
// reads its own copy and its own settings and knows nothing about its
// neighbours or its position. The id is permanent and is never reused.
export const id = 'compare';

// No CSS of its own: the page skin in variants2.mjs styles this one. A new
// module puts its rules here, scoped to its own class.
export const css = '';

export function markup(copy, settings = {}) {
  const g = settings.className ? ` ${settings.className}` : '';
  return `<section class="s compare-s${g}"><div class="wrap">
  <h2>${copy.compare.h2}</h2>
  <div class="tablewrap"><table>
    <thead><tr><th></th>${copy.compare.cols.map((c) => `<th>${c}</th>`).join('')}</tr></thead>
    <tbody>${copy.compare.rows.map((r) => `<tr><th>${r[0]}</th>${r.slice(1).map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>
  </table></div>
</div></section>`;
}
