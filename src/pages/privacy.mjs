// privacy.mjs — the privacy page. A second page type assembled from the same
// components (stack sections of prose), which is the point of the composer.
//
// Facts here come from the spec (§10) and the reader's design addendum
// (2026-09-09 §3, Richard's option C). Business identity is a placeholder
// until Richard supplies it; the page stays noindex until then.

import { banner, header, prose, footer, ph, h } from '../components.mjs';

export const path = '/legal/privacy/';
export const title = 'Privacy | Wolf Children';
export const description = 'What Wolf Children collects about you and your child, where it goes, and how to have it deleted.';
export const indexable = false;

const ANTHROPIC_TERMS = 'https://www.anthropic.com/legal/commercial-terms';

export function sections() {
  return [
    ['banner', banner('Plain words about what we hold and where it goes. Questions: hello@wolfchildren.co')],
    ['header', header({ ctaLabel: 'Back to the readings', ctaHref: '/' })],

    ['who', prose({
      eyebrow: 'Who we are',
      heading: 'Privacy at Wolf Children.',
      paragraphs: [
        h('span', {}, 'Wolf Children is operated by ', ph('BUSINESS NAME'), ', ', ph('ADDRESS'), '. This page says what we collect, what we do with it, where it is stored, and how you have it removed. It is written to be read, not scrolled past.'),
      ],
    })],

    ['collect', prose({
      eyebrow: 'What we collect',
      heading: 'Your email, and what you tell us about your child.',
      paragraphs: [
        'Your email address, to sign you in by link and to tell you when a reading is ready.',
        'For a reading: your child’s first name, date of birth, time of birth if you know it, place of birth, and pronouns. The place is chosen from a list so the coordinates are the ones you confirmed; we never look a place up again on your behalf.',
        'Optionally, your own observations about your child: six short questions on the form. They are optional; the reading is written without them if you leave them blank.',
        'Payment details go to Stripe and never reach us. We hold the record that a purchase happened and which reading it was for.',
      ],
    })],

    ['stays', prose({
      eyebrow: 'What stays on our server',
      heading: 'Your child’s name, date of birth and birthplace never leave our server.',
      paragraphs: [
        'The birth details are used on our own server to compute the chart. The chart is a list of planetary positions; it is what the writing model receives. Your child’s name is not sent with it. The reading is written with a placeholder where the name goes, and the name is put in on our server when the document is made.',
        'Our email service receives your email address and the fact that a reading is ready. Our newsletter service, if you are on it, receives your email address and which reading you bought. Neither receives anything about your child.',
      ],
    })],

    ['observations', prose({
      eyebrow: 'Your observations',
      heading: 'What you write about your child is sent to the writing model.',
      paragraphs: [
        'The six optional questions exist so the portrait can point at things you have already seen and say where in the chart they come from. To do that, what you write is sent to the writing model together with the chart. Before it is sent, your child’s name is replaced with a placeholder. Nothing else in your text is changed, so please do not include other names, places, dates, or anything you would not want a third party to hold. The form says this again, where you type.',
        h('span', {}, 'The writing model is provided by Anthropic. Your text is processed under Anthropic’s commercial terms, which you can read at ', h('a', { href: ANTHROPIC_TERMS }, ANTHROPIC_TERMS), '. We do not use your text for anything except writing your reading.'),
        'You can leave every one of these questions blank. You can also change or clear your answers at any time from your child’s page in the portal, and deleting the child clears them with everything else.',
      ],
    })],

    ['keep', prose({
      eyebrow: 'How long',
      heading: 'While your account is active. Gone on request.',
      paragraphs: [
        'We keep your child’s details and readings while your account is active, so a second reading for the same child does not ask you again and so you can download what you bought.',
        'When you delete a child in the portal, the birth details, the observations and the generated readings are removed. The record that a purchase happened stays, without any of your child’s details, so our accounts reconcile.',
        'Daily backups of our server exist and are kept for fourteen days; a deletion works its way out of them on that schedule.',
      ],
    })],

    ['rights', prose({
      eyebrow: 'Your rights',
      heading: 'Ask, and we answer.',
      paragraphs: [
        h('span', {}, 'You can ask what we hold about you, ask for a copy, ask for a correction, or ask for deletion, by writing to ', h('a', { href: 'mailto:hello@wolfchildren.co' }, 'hello@wolfchildren.co'), '. Deleting a child from the portal does the deletion yourself, immediately.'),
        h('span', {}, ph('JURISDICTION AND SUPERVISORY AUTHORITY LINE')),
      ],
    })],

    ['footer', footer({
      contact: 'hello@wolfchildren.co',
      legal: [
        { label: 'Privacy', href: '/legal/privacy/' },
        { label: 'Terms', href: '/legal/terms.html', placeholder: 'terms page (not written)' },
        { label: 'Refunds', href: '/legal/refunds.html', placeholder: 'refunds page (not written)' },
      ],
      fine: `© ${new Date().getFullYear()} Wolf Children. Readings are written for parents and describe how a child is wired; they do not predict events.`,
    })],
  ];
}

export function body() {
  return sections().map(([, html]) => String(html)).join('\n');
}
