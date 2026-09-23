// weekly-unsubscribe.mjs — /weekly/unsubscribe/, the page the footer link in a weekly email opens.
//
// Richard, 2026-09-23: no sign-in, no email address asked for, the report stays in the portal. The
// page carries nothing about the child (spec §10): the signed token in the URL is the whole story,
// and assets/js/weekly-unsubscribe.js hands it to the API.
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { banner, header, footer, h } from '../components.mjs';

const stamp = (rel) => createHash('md5').update(readFileSync(new URL(rel, import.meta.url))).digest('hex').slice(0, 8);
const SCRIPT = `/assets/js/weekly-unsubscribe.js?v=${stamp('../../assets/js/weekly-unsubscribe.js')}`;

export const path = '/weekly/unsubscribe/';
export const title = 'Weekly emails | Wolf Children';
export const description = 'Turn off the weekly emails for a Wolf Children reading. The report and every note stay in your portal.';
export const indexable = false;

const heading = (level, size, text) => h(level, { class: `display ${size}` }, text);   // as in components.mjs (not exported)

export function sections() {
  return [
    ['banner', banner('Weekly emails')],
    ['header', header({ ctaLabel: 'Your readings', ctaHref: '/portal/' })],
    ['unsubscribe', h('section', { class: 'section prose-section' },
      h('div', { class: 'container l-split' },
        h('div', { class: 'split-head' },
          h('p', { class: 'eyebrow' }, 'Weekly emails'),
          heading('h1', 't-head', 'Turning the weekly emails off.')),
        h('div', { class: 'split-body prose-body' },
          h('p', { id: 'weekly-unsubscribe-status', class: 'serif' }, 'One moment…'),
          h('p', { class: 'serif' }, 'The notes themselves live in your portal, one for each week of the year. Turning the emails off only stops us telling you a new one is there.'),
          h('p', { class: 'small' }, h('a', { href: '/portal/' }, 'Open your readings →')),
          h('script', { type: 'module', src: SCRIPT }, ''))))],
    ['footer', footer({
      contact: 'hello@wolfchildren.co',
      legal: [
        { label: 'Privacy', href: '/legal/privacy/' },
        { label: 'Terms', href: '/legal/terms/' },
        { label: 'Refunds', href: '/legal/refunds/' },
      ],
      fine: `© ${new Date().getFullYear()} Wolf Children. Readings are written for parents and describe how a child is wired; they do not predict events.`,
    })],
  ];
}
