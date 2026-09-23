// home.mjs — the homepage. Richard, 2026-09-14, in order: the film full width
// (Vimeo background mode: autoplay, muted, looping, no chrome); the quote in
// the statement in IBM Plex Sans beside a small photo on a white ground; a full-width photo; the
// moon-calendar signup (Loops, src/lib/signup.mjs). The two photographs are the
// Compass nature photos for now. The page stays noindex until the design is done.
//
// The signup's own gate (docs/loops-signup-form.md): the Loop that sends the
// calendar is still a Draft in Loops. The page is noindex, so no visitor reaches
// the form yet; Richard switches the Loop on before the page is indexed.

import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { h } from '../components.mjs';
import { signup } from '../lib/signup.mjs';

// stamp-assets.sh stamps hand-written HTML; a built page must carry the same
// stamp from its source, or the build would undo it. Same hash: md5, 8 chars.
const SIGNUP_JS = `/assets/js/signup.js?v=${createHash('md5').update(readFileSync(new URL('../../assets/js/signup.js', import.meta.url))).digest('hex').slice(0, 8)}`;

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

    ['quote', h('section', { class: 'quote-photo' },
      h('div', { class: 'container' },
        h('p', { class: 'statement' }, 'Wolf Children is a collection of stories, tools and recipes to help parents avoid the trap of screentime.'),
        h('figure', {},
          h('img', { src: '/assets/img/home-module2.gif', alt: 'An animated film-frame photograph', width: '550', height: '456', loading: 'lazy' }))))],

    ['photo', h('section', { class: 'photo-full', 'aria-label': 'Photograph' },
      h('img', { src: '/assets/img/home-band.jpg', alt: 'No child will ever remember spending their best day in front of a screen, set in large letters with four photographs of a child outdoors', width: '1920', height: '876', loading: 'lazy' }))],

    // 2026-09-23, Richard: the paper (assets/img/bg.avif) is the last module.
    // He fills the rest of it later; for now it carries the newsletter and the calendar.
    ['paper', h('div', { class: 'section home-paper' },
      h('div', { class: 'container home-signup-row' },
        h('figure', { class: 'home-signup-media' },
          h('img', { src: '/assets/img/home-calendar.webp', alt: 'The 2027 moon calendar, one printed page with every moon phase and its date', width: '1400', height: '1292', loading: 'lazy' })),
        signup({ eyebrow: 'Free', heading: 'The 2027 moon calendar', sub: 'Every new moon, first quarter, full moon and last quarter of 2027 on one page. Print it and put it where your child can see it.' })),
      h('script', { src: SIGNUP_JS, defer: true }, ''))],
  ];
}

export function body() {
  return sections().map(([, html]) => String(html)).join('\n');
}
