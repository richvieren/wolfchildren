// home-film — the film, behind a play button. Standard "facade" pattern: a poster
// and a button; the Vimeo player loads only when the visitor presses play, and
// then plays with sound and controls. Replaces the autoplay background film.
// The poster is a placeholder until Richard supplies one.
export const id = 'home-film';

export const css = `
.hf-frame{position:relative;width:100%;max-width:1040px;margin:0 auto;aspect-ratio:16/9;background:var(--b-shell)}
.hf-frame iframe,.hf-play,.hf-play img{position:absolute;inset:0;width:100%;height:100%;border:0;display:block}
.hf-play{padding:0;cursor:pointer;background:none}
.hf-play img{object-fit:cover}
.hf-tri{position:absolute;left:50%;top:50%;width:84px;height:84px;margin:-42px 0 0 -42px;
  border-radius:999px;border:2px solid var(--b-cream);background:rgba(51,61,47,.55)}
.hf-tri::after{content:"";position:absolute;left:50%;top:50%;margin:-13px 0 0 -8px;
  border-left:24px solid var(--b-cream);border-top:13px solid transparent;border-bottom:13px solid transparent}
.hf-play:hover .hf-tri{background:var(--b-cta)}
.hf-play:focus-visible{outline:2px solid var(--b-cream);outline-offset:-6px}
`;

export function markup(copy, settings = {}) {
  const g = settings.className ? ` ${settings.className}` : '';
  const p = settings.poster;
  const ph = p.placeholder ? ` data-placeholder="${p.placeholder}"` : '';
  const src = `https://player.vimeo.com/video/${settings.vimeoId}?autoplay=1&dnt=1&title=0&byline=0&portrait=0`;
  return `<section class="s home-film${g}"><div class="wrap">
  <div class="hf-frame" data-film-src="${src}">
    <button class="hf-play" type="button" aria-label="${copy.label}">
      <img src="${p.src}" width="${p.w}" height="${p.h}" alt=""${ph} loading="lazy" decoding="async">
      <span class="hf-tri" aria-hidden="true"></span>
    </button>
  </div>
</div>
<script>
document.querySelectorAll('[data-film-src]').forEach(function(f){
  f.querySelector('.hf-play').addEventListener('click',function(){
    var i=document.createElement('iframe');
    i.src=f.getAttribute('data-film-src');i.title='${copy.label}';
    i.allow='autoplay; fullscreen; picture-in-picture';
    i.setAttribute('referrerpolicy','strict-origin-when-cross-origin');
    f.replaceChildren(i);
  });
});
</script></section>`;
}
