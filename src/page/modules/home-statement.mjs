// home-statement — the second section of the homepage. It slides up over the hero
// (the page gives it edge: 'wave', so the hero lags beneath it). The sentence and
// the film-frame animation are the ones that were on the homepage already.
export const id = 'home-statement';

export const css = `
.home-statement .wrap{display:flex;flex-direction:column;align-items:center;gap:var(--s-space-block)}
.hs-text{margin:0;font-family:var(--b-body);color:var(--g-text);text-align:left;max-width:32.5ch;
  font-size:clamp(.92rem,1.6vw,1.24rem);line-height:1.45}
.hs-fig{margin:0;width:100%;max-width:424px}
.hs-fig img{display:block;width:100%;height:auto}
@media (min-width:900px){
  .home-statement .wrap{flex-direction:row-reverse;justify-content:center;gap:calc(var(--s-space-block) * 2)}
  .hs-text{flex:0 1 32.5ch}.hs-fig{flex:0 0 424px}
}
`;

export function markup(copy, settings = {}) {
  const g = settings.className ? ` ${settings.className}` : '';
  return `<section class="s home-statement${g}"><div class="wrap">
  <p class="hs-text">${copy.statement}</p>
  <figure class="hs-fig"><img src="/assets/img/home-module2.webp" alt="An animated film-frame photograph" width="848" height="750" loading="lazy" decoding="async"></figure>
</div></section>`;
}
