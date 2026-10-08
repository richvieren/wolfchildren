// videos — five portrait slots in a row, built and hidden until real videos
// exist. The page config turns it on with settings.show = true. Every slot
// carries data-placeholder="review", so the build refuses to index the page
// while they are empty.
export const id = 'videos';

export const css = `
.videos-s{display:none}
.videos-s.is-on{display:block}
.vid{list-style:none;margin:0;padding:0;display:grid;gap:14px;
  grid-template-columns:repeat(2,minmax(0,1fr))}
.vid-slot{position:relative;aspect-ratio:9/16;background:var(--g-surface);
  border:var(--s-border);border-radius:var(--s-radius-btn-hard);display:grid;place-items:center}
.vid-label{font-family:var(--b-body);font-size:var(--s-type-eyebrow);
  letter-spacing:var(--s-type-eyebrow-ls);text-transform:uppercase;color:var(--g-quiet)}
@media(min-width:900px){
  .vid{grid-template-columns:repeat(5,minmax(0,1fr));gap:18px}
}
`;

export function markup(copy, settings = {}) {
  const g = settings.className ? ` ${settings.className}` : '';
  const on = settings.show ? ' is-on' : '';
  const slots = Array.from({ length: 5 }, (_, i) => `      <li class="vid-slot" data-placeholder="review">
        <span class="vid-label">${copy.label} ${i + 1}</span>
      </li>`).join('\n');
  return `<section class="s videos-s${on}${g}" aria-hidden="${settings.show ? 'false' : 'true'}"><div class="wrap">
  <ul class="vid">
${slots}
  </ul>
</div></section>`;
}
