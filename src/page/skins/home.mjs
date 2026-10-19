// The home skin: the Compass skin with the rounded photographs swapped for the
// polaroid frame Richard saved (widget-all.mjs, PHOTO_CSS): paper margin 8.3% at
// the sides, 16.4% on top, 29.2% underneath, a strip of tape, a slight tilt.
// Richard, 2026-10-15: "the rounded photos, change those into the polaroids."
import { tokens as base, css as baseCss, atfCss } from './mengto.mjs';

export const id = 'home';
export const tokens = base.replace('--s-radius-photo:24px', '--s-radius-photo:0px');
export { atfCss };

export const css = `${baseCss}
/* the polaroid: the paper is the figure, the photograph sits inside its margins */
body .rec-large{background:var(--b-paper);padding:16.4% 8.3% 29.2%;position:relative;
  box-shadow:var(--s-shadow-card)}
body .rec-large::before,body .rec-small::before{content:"";position:absolute;z-index:4;
  top:-13px;left:50%;width:46%;aspect-ratio:4/1;transform:translateX(-50%) rotate(-2.4deg);
  background:var(--b-tan);opacity:.86;
  clip-path:polygon(0 14%,4% 0,8% 16%,92% 5%,96% 0,100% 18%,96% 100%,92% 85%,8% 97%,4% 100%,0 84%)}
/* percentage padding is of the cluster's width, not the card's, and the card is 45% of it:
   3.4% = 7.5% of the card, 10.8% = 24% of it, the proportions of a real polaroid */
body .rec-small{background:var(--b-paper);padding:3.4% 3.4% 10.8%;box-shadow:var(--s-shadow-card)}
body .rec-small-backing{display:none}
`;
