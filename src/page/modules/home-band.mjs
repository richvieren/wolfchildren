// home-band — the full-width photograph that was on the homepage already: the line
// in large letters over four photographs of a child outdoors. Shown whole, never cropped.
export const id = 'home-band';
export const ground = 'neutral';

export const css = `.home-band{padding:0;background:var(--b-green);line-height:0}
.home-band img{display:block;width:100%;height:auto}`;

export function markup(copy, settings = {}) {
  const g = settings.className ? ` ${settings.className}` : '';
  return `<section class="s home-band${g}" aria-label="Photograph">
  <img src="/assets/img/home-band.jpg" alt="${copy.alt}" width="1920" height="876" loading="lazy" decoding="async">
</section>`;
}
