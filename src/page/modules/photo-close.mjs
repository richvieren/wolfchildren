// photo-close — one photograph across the window, with the last word and the
// button over it. Self-contained: markup, CSS from tokens, no script of its own.
//
// The crop: the child stands at about 88% of the width and the centred text ends
// at about 76%, so the two never meet; object-position stays 50% 50% and the
// whole child is in frame. The rock mass sits centre-left and low enough that
// the headline clears it.
//
// The parallax moves the photograph only, never the section. The photograph is
// --pc-over taller than the section and starts that much above it, so as it
// slides down by at most --pc-over the section's ground can never show at the
// top or the bottom. --pc-over is 25vh + 3vw, which is a little more than the
// largest lag the page can produce at 0.25 of scroll speed.
export const id = 'photo-close';

// it paints a photograph, so it takes no ground and does not flip the alternation
export const ground = 'neutral';

export const css = `
.pc{--pc-over:calc(25vh + 3vw);
  position:relative;height:85vh;min-height:520px;overflow:hidden;
  display:grid;place-items:center}
.pc-photo{position:absolute;left:0;right:0;top:calc(var(--pc-over) * -1);
  width:100%;height:calc(100% + var(--pc-over));object-fit:cover;
  object-position:50% 50%;border:0;will-change:transform}
/* the sky and the sand are bright, so cream type needs a wash under it. It is
   only under the text, from the middle outwards, and the photograph keeps its
   own edges. */
.pc-wash{position:absolute;inset:0;pointer-events:none;background:
  radial-gradient(62% 52% at 50% 52%,rgba(51,61,47,.66) 0%,rgba(51,61,47,.34) 58%,rgba(51,61,47,0) 100%),
  linear-gradient(180deg,rgba(51,61,47,.20) 0%,rgba(51,61,47,.10) 38%,rgba(51,61,47,.42) 100%)}
.pc-inner{position:relative;z-index:2;text-align:center;padding:0 24px;max-width:760px}
.pc-h{font-family:var(--b-display);font-weight:400;color:var(--b-cream);
  font-size:clamp(2.2rem,4.8vw,3.8rem);line-height:1.02;letter-spacing:-.035em;
  max-width:16ch;margin:0 auto var(--s-space-block);text-wrap:balance}
/* the three prices, one line under the headline */
.pc-prices{font-family:var(--b-body);font-size:var(--s-type-body);line-height:1.5;
  color:var(--b-cream);margin:0 0 var(--s-space-block)}
.pc-cta{position:relative;z-index:2}
`;

export function markup(copy, settings = {}) {
  const g = settings.className ? ` ${settings.className}` : '';
  const p = settings.photo;
  return `<section class="s photo-close-s pc${g}">
  <img class="pc-photo" data-parallax-photo data-speed="0.25" src="${p.src}" width="${p.w}" height="${p.h}" alt="${p.alt}" loading="lazy" decoding="async">
  <div class="pc-wash" aria-hidden="true"></div>
  <div class="pc-inner">
    <h2 class="pc-h">${copy.heading}</h2>
    <p class="pc-prices">${copy.prices}</p>
    <a class="wc-cta pc-cta" href="#atf">${copy.cta}</a>
  </div>
</section>`;
}
