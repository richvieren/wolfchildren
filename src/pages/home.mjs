// home.mjs — the homepage. 2026-09-14, Richard: the hero only, nothing else.
// A full-width Vimeo film (autoplay, muted, looping, no chrome: Vimeo's
// background mode, available on the Plus account the film is on), then one
// quote standing alone with room around it. The rest of the design comes later;
// the page stays noindex until it does.

import { h } from '../components.mjs';

export const path = '/';
export const title = 'Wolf Children';
export const description = 'Wolf Children.';
export const indexable = false;

const VIMEO_ID = '1136626687';
// background=1 removes every control and loops; the rest is belt and braces for
// players that ignore background mode. The film is 16:9 (426×240 per oEmbed).
const SRC = `https://player.vimeo.com/video/${VIMEO_ID}?background=1&autoplay=1&muted=1&loop=1&autopause=0&controls=0&title=0&byline=0&portrait=0&dnt=1`;

export function sections() {
  return [
    ['film', h('section', { class: 'film', 'aria-label': 'Film' },
      h('div', { class: 'film-frame' },
        h('iframe', {
          src: SRC, title: 'Wolf Children', allow: 'autoplay; fullscreen; picture-in-picture', loading: 'eager',
          referrerpolicy: 'strict-origin-when-cross-origin',
        }, '')))],

    ['quote', h('section', { class: 'quote-alone' },
      h('div', { class: 'container' },
        h('blockquote', { class: 'display t-title' },
          h('p', {}, 'No child will ever remember spending their best day in front of a screen'))))],
  ];
}

export function body() {
  return sections().map(([, html]) => String(html)).join('\n');
}
