// terms.mjs — the terms of sale and use. Entity, governing law (Wyoming) and the
// refund rules are Richard's decisions, 2026-09-14. What a reading is and is not
// follows the readings' own frame: a description of how a child is wired, never
// a prediction. Privacy is its own page; this one links to it rather than repeating it.

import { banner, header, prose, footer, h } from '../components.mjs';

export const path = '/legal/terms/';
export const title = 'Terms | Wolf Children';
export const description = 'What you buy from Wolf Children, what it needs from you, how it is delivered, and the rules that apply.';
export const indexable = true;

const MAIL = h('a', { href: 'mailto:hello@wolfchildren.co' }, 'hello@wolfchildren.co');

export function sections() {
  return [
    ['banner', banner('Plain words about what you buy and how it works. Questions: hello@wolfchildren.co')],
    ['header', header({ ctaLabel: 'Back to the readings', ctaHref: '/' })],

    ['who', prose({
      eyebrow: 'Who you buy from',
      heading: 'Terms at Wolf Children.',
      paragraphs: [
        'Last changed: 14 September 2026.',
        'Wolf Children is operated by Autism Central LLC, 1309 Coffeen Avenue STE 1200, Sheridan, Wyoming 82801, United States. These terms apply to every purchase on wolfchildren.co and to the portal where your readings live. Buying a reading means you accept them.',
      ],
    })],

    ['what', prose({
      eyebrow: 'What you buy',
      heading: 'A reading, written for one child.',
      paragraphs: [
        'Each product on this site is a written reading for one child, delivered as a PDF in your portal. The product page says what the reading covers and what it costs. The price you see at checkout is the price you pay.',
        'A reading describes how a child is wired, from the positions of the planets at the moment and place of birth. It does not predict events, diagnose anything, or replace a doctor, a teacher or a therapist. It is written for you, the parent, to read and keep.',
      ],
    })],

    ['needs', prose({
      eyebrow: 'What it needs from you',
      heading: 'Birth details, entered by you.',
      paragraphs: [
        'After you buy, the portal asks for your child’s first name, date of birth, time of birth if you know it, place of birth and pronouns, and three optional questions about your child. The reading is written from what you enter, so check the details before you submit them. A wrong entry is rewritten once at no cost within 30 days; the refund page says how.',
        h('span', {}, 'What happens to those details is on the ', h('a', { href: '/legal/privacy/' }, 'privacy page'), '.'),
      ],
    })],

    ['delivery', prose({
      eyebrow: 'Delivery',
      heading: 'Within 24 hours of your details arriving.',
      paragraphs: [
        'We email you when the reading is ready, within 24 hours of your details arriving. The reading is in your portal as a PDF. Download it and keep it. If 48 hours pass without delivery, the refund page applies.',
      ],
    })],

    ['refunds', prose({
      eyebrow: 'Refunds',
      heading: 'Final once the reading is being written.',
      paragraphs: [
        h('span', {}, 'A purchase is refunded in full before you submit the details, and is final once you have. A mistake of ours is redone or refunded. The rules are on the ', h('a', { href: '/legal/refunds/' }, 'refund page'), '.'),
        'If you are in the EU or UK, you agree at checkout that the reading is written as soon as you submit the details, and you give up the 14-day right of withdrawal for digital content by asking us to start.',
      ],
    })],

    ['use', prose({
      eyebrow: 'Using the reading',
      heading: 'Yours to read, keep and share with family.',
      paragraphs: [
        'The reading is for your personal, non-commercial use. You can print it, keep it and share it with your family. You cannot sell it, publish it, or pass it off as your own work. The text and design stay ours; the details about your child stay yours.',
      ],
    })],

    ['account', prose({
      eyebrow: 'Your account',
      heading: 'No password. A link that lasts 48 hours.',
      paragraphs: [
        'You sign in with a link we email you. It works once and stops working 48 hours after we sent it. Anyone with the link can open your portal, so do not forward it. You can delete a child, and everything written about them, from the portal at any time.',
      ],
    })],

    ['payment', prose({
      eyebrow: 'Payment',
      heading: 'Through Stripe. We never see your card.',
      paragraphs: [
        'Payments are taken by Stripe on their checkout page. Card details never reach us. Prices are in US dollars; your bank sets the exchange rate and any fee.',
      ],
    })],

    ['law', prose({
      eyebrow: 'The rules that apply',
      heading: 'Wyoming law, and your own consumer rights.',
      paragraphs: [
        'These terms are governed by the laws of the State of Wyoming, United States. If you buy as a consumer, the protections of the country you live in apply as well, and nothing here takes them away.',
        'We can change these terms. The date at the top of the page changes when we do, and a purchase is covered by the terms in force on the day you bought.',
        h('span', {}, 'Questions about any of this: ', MAIL, '. A person reads every reply.'),
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
