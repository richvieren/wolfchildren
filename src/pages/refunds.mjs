// refunds.mjs — the refund policy. Richard's decisions, 2026-09-14: full refund
// before the details are submitted; final once the reading is being written; a
// mistake of ours is redone or refunded within 30 days; one free rewrite for a
// parent's own wrong birth entry within 30 days; refund on request when nothing
// has been delivered 48 hours after the details arrived. Entity per the privacy page.

import { banner, header, prose, footer, h } from '../components.mjs';

export const path = '/legal/refunds/';
export const title = 'Refunds | Wolf Children';
export const description = 'When a Wolf Children reading is refunded, when it is rewritten, and how to ask.';
export const indexable = true;

const MAIL = h('a', { href: 'mailto:hello@wolfchildren.co' }, 'hello@wolfchildren.co');

export function sections() {
  return [
    ['banner', banner('Plain words about refunds. Questions: hello@wolfchildren.co')],
    ['header', header({ ctaLabel: 'Back to the readings', ctaHref: '/' })],

    ['before', prose({
      eyebrow: 'Before the details',
      heading: 'Nothing has been made yet. A full refund.',
      paragraphs: [
        h('span', {}, 'A reading is written for one child from the details you give us. Before you submit those details, nothing has been made. Write to ', MAIL, ' and we refund the purchase in full.'),
      ],
    })],

    ['after', prose({
      eyebrow: 'After the details',
      heading: 'The reading is being written. The purchase is final.',
      paragraphs: [
        'Once you submit the details, the reading is being written for your child and the purchase is final.',
        'If you are in the EU or UK, you agree to this at checkout, and you give up the 14-day right of withdrawal for digital content by asking us to start.',
      ],
    })],

    ['ours', prose({
      eyebrow: 'A mistake of ours',
      heading: 'We redo it or refund it. Your choice.',
      paragraphs: [
        h('span', {}, 'If the reading arrives with a mistake that is ours, such as a wrong chart from a correct birth entry, a missing section, or a file that does not open, write to ', MAIL, ' within 30 days of delivery and we redo it or refund it, your choice.'),
      ],
    })],

    ['yours', prose({
      eyebrow: 'A wrong birth entry',
      heading: 'One rewrite at no cost.',
      paragraphs: [
        'If you entered the birth details wrong, write to us within 30 days of submitting them and we rewrite the reading once at no cost, from the corrected details.',
      ],
    })],

    ['late', prose({
      eyebrow: 'Late delivery',
      heading: 'Not delivered within 48 hours? Refund on request.',
      paragraphs: [
        'We email you when the reading is ready, within 24 hours of your details arriving. If 48 hours pass and nothing has been delivered, write to us and we refund the purchase on request.',
      ],
    })],

    ['how', prose({
      eyebrow: 'How refunds arrive',
      heading: 'Back to the card you paid with.',
      paragraphs: [
        'Refunds go back to the card you paid with, through Stripe, within 5 to 10 working days. We confirm by email when it is sent.',
      ],
    })],

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

export function body() {
  return sections().map(([, html]) => String(html)).join('\n');
}
