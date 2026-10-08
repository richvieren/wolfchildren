// photo-close — one photograph across the window, with the last word and the
// button over it. Self-contained: markup, CSS from tokens, no script.
//
// The crop: the child walks a little right of centre and sits low in the frame,
// so object-position is 50% 55%. The photograph is 1400x1050 and the band is
// about 1.9:1, so cover takes the crop off the top and the bottom.
export const id = 'photo-close';

// it paints a photograph, so it takes no ground and does not flip the alternation
export const ground = 'neutral';

export const css = `
.pc{position:relative;height:85vh;min-height:520px;overflow:hidden;
  display:grid;place-items:center}
.pc-photo{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
  object-position:50% 55%;border:0}
/* the sky and the sand are bright, so cream type needs a wash under it. It is
   only under the text, from the middle outwards, and the photograph keeps its
   own edges. */
.pc-wash{position:absolute;left:0;right:0;top:18%;bottom:0;pointer-events:none;
  background:linear-gradient(180deg,rgba(51,61,47,0) 0%,rgba(51,61,47,.52) 46%,rgba(51,61,47,.62) 100%)}
.pc-inner{position:relative;z-index:2;text-align:center;padding:0 24px;max-width:22ch}
.pc-h{font-family:var(--b-display);font-weight:400;color:var(--b-cream);
  font-size:clamp(2.2rem,4.8vw,3.8rem);line-height:1.02;letter-spacing:-.035em;
  margin:0 0 var(--s-space-block)}
.pc-cta{display:inline-block;font-family:var(--b-body);font-size:var(--s-type-body);
  letter-spacing:.06em;text-transform:uppercase;text-decoration:none;
  padding:0 32px;height:54px;line-height:50px;
  background:var(--b-green);color:var(--b-cream);
  border:var(--s-hard-border);border-radius:var(--s-radius-btn-hard);
  box-shadow:var(--s-shadow-hard)}
.pc-cta:hover{filter:brightness(1.08)}
`;

export function markup(copy, settings = {}) {
  const g = settings.className ? ` ${settings.className}` : '';
  const p = settings.photo;
  return `<section class="s photo-close-s pc${g}">
  <img class="pc-photo" src="${p.src}" width="${p.w}" height="${p.h}" alt="${p.alt}" loading="lazy" decoding="async">
  <div class="pc-wash" aria-hidden="true"></div>
  <div class="pc-inner">
    <h2 class="pc-h">${copy.heading}</h2>
    <a class="pc-cta" href="#atf">${copy.cta}</a>
  </div>
</section>`;
}
