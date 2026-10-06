// recognition — the second module. Rebuilt 2026-10-06 against MUD\WTR's "WTF is
// MUD\WTR" section: two columns on a wide screen, text left and one tall
// photograph right, both starting on the same line; one column on a phone with
// the photograph under the words. Self-contained: its own markup, its own CSS,
// and nothing about where it sits. The id is the one it has always had.
export const id = 'recognition';

// Every value is a brand (--b-), skin (--s-) or ground (--g-) token.
export const css = `
.rec{display:grid;gap:var(--s-space-block)}
.rec h2{font-family:var(--b-display);font-weight:400;color:var(--g-text);
  font-size:var(--s-type-display);line-height:var(--s-type-display-lh);
  letter-spacing:var(--s-type-display-ls);max-width:none}
.rec-copy{margin-top:var(--s-space-block)}
.rec-copy p{font-family:var(--b-body);color:var(--g-text);
  font-size:var(--s-type-body);line-height:var(--s-type-body-lh);
  letter-spacing:var(--s-type-body-ls);max-width:60ch}
.rec-copy p + p{margin-top:var(--s-space-para)}
.rec-photo{margin:0}
.rec-photo img{display:block;width:100%;height:auto;object-fit:contain;border:0}
@media(min-width:900px){
  .rec{grid-template-columns:40% 45%;justify-content:space-between;
    align-items:start;gap:0}
}
`;

export function markup(copy, settings = {}) {
  const g = settings.className ? ` ${settings.className}` : '';
  const p = settings.photo;
  return `<section class="s recognition-s${g}"><div class="wrap">
  <div class="rec">
    <div class="rec-text">
      <h2>${copy.h2}</h2>
      <div class="rec-copy">${copy.body.map((t) => `<p>${t}</p>`).join('')}</div>
    </div>
    <figure class="rec-photo"><img src="${p.src}" width="${p.w}" height="${p.h}" alt="${p.alt}" loading="lazy" decoding="async"></figure>
  </div>
</div></section>`;
}
