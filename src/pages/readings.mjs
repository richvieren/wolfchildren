// readings.mjs — /readings/, every reading on one page (2026-09-15 audit: /readings/ 404'd). Not a
// product page, so no prices here (build test): each reading's own page carries its price.
import { banner, header, footer, h } from '../components.mjs';
import { PRODUCTS } from '../../assets/js/registry.js';
import { FOOTER } from '../lib/reading-page.mjs';

export const path = '/readings/';
export const title = 'Readings | Wolf Children';
export const description = 'Every Wolf Children reading: Compass, North Star, Transits, Astrocartography, Solar Return, Numerology, Parent and Child, and all five written readings together.';
export const indexable = false;

const LINES = {
  'compass': 'One page about who your child is, from the birth date, time and place. On your portal within a minute.',
  'north-star': 'The full portrait of who your child is, written for you, with your three answers read against the chart.',
  'transits': 'The year ahead for your child, and a short note every week of it.',
  'astrocartography': 'Three places you choose, and what each one draws out in your child.',
  'solar-return': 'The year that starts on your child’s next birthday.',
  'numerology': 'The numbers in your child’s date of birth, and the year ahead.',
  'parent-child': 'Your chart and your child’s, read together.',
  'bundle-readings': 'All five written readings in one purchase, started when you are ready.',
};

const heading = (level, size, text) => h(level, { class: `display ${size}` }, text);   // as in components.mjs (not exported)

export function sections() {
  const readings = Object.keys(LINES).map((slug) => {
    const p = PRODUCTS[slug];
    if (!p || !p.salesUrl) throw new Error(`${slug} has no page in the registry`);
    return h('li', { class: 'tile' }, heading('h3', 't-sub', p.name), h('p', {}, LINES[slug]), h('a', { href: p.salesUrl }, `What is in ${p.name} →`));
  });
  return [
    ['banner', banner('Readings from Wolf Children: written for the parent, from the birth chart, about one child.')],
    ['header', header({ ctaLabel: 'See the readings', ctaHref: '#readings' })],
    ['readings', h('section', { class: 'section steps', id: 'readings' },
      h('div', { class: 'container l-stack' },
        h('div', { class: 'stack-head' }, h('p', { class: 'eyebrow' }, 'Readings'), heading('h1', 't-head', 'Every reading, and what each one is about.')),
        h('ol', { class: 'stack-body grid grid-3' }, ...readings)))],
    ['footer', FOOTER],
  ];
}
