// transits.mjs — the transits product page (2026-09-15: the product was on sale with no page; see src/lib/reading-page.mjs).
import { readingPage } from '../lib/reading-page.mjs';

// The live Stripe Payment Link (plink_1UFYiyED8VMwHJ64dYBNguCQ, created 2026-09-14 by stripe_sync.py --links --live).
const page = readingPage({
  slug: 'transits',
  checkoutUrl: 'https://buy.stripe.com/4gM8wP1mC8MscoCfWK1kA01',
  description: 'The three months ahead for your child, month by month, read from the planets moving against the birth chart, with what is moving through slowly.',
  bannerLine: 'the next three months for your child, month by month',
  eyebrowLine: 'one child · the next three months',
  hero: {
    h1: 'The next three months for your child, one month at a time.',
    sub: 'Transits reads where the planets move over the three months from the day it is written, against your child’s own birth chart. It opens with the season as a whole, names what is moving through slowly, then gives each month its own section, headed by its dates.',
    bullets: [
      'What is moving through slowly, so a long stretch of change has a name before it arrives',
      'Each month on its own, headed by its dates, so you can read ahead to the one that matters',
      'Your three answers read against those months, so the reading starts from what you already see',
      'Every planet it names is explained where it appears, so there is nothing to look up',
    ],
  },
  needsHeading: 'The birth details and three answers.',
  needs: [
    { name: 'Date and place', key: true, tag: 'The birth time helps but is not required', line: 'The birth date and the place, chosen from a list. With the time, the reading can also say where in the chart each month lands.' },
    { name: 'What has changed', line: 'What has changed in your child over the last few months?' },
    { name: 'What is coming', line: 'What is coming up in the next three months that will matter to your child?' },
    { name: 'What is harder', line: 'What is your child finding harder than usual right now?' },
  ],
  insideHeading: 'What is in it, in the order you read it.',
  inside: [
    { title: 'The three months ahead', line: 'The season as a whole: what it asks of your child and where the weight sits.' },
    { title: 'What is moving through slowly', line: 'The slow planets and what they press on over these months, so a long pressure reads as one thing and not as a run of bad weeks.' },
    { title: 'One section per month', line: 'Three sections, each headed by its dates, each saying what that month brings to the chart.' },
    { title: 'The transits, explained', line: 'Every placement named in the reading, set out plainly at the end.' },
  ],
  tagline: 'Three months, month by month, for one child.',
  includes: [
    'A PDF of six to twelve pages, written for your child’s next three months',
    'Your three answers, read against the chart',
    'A page of questions to keep reading it with Claude or ChatGPT',
    'Your private portal, sign-in by email link',
  ],
  photos: {
    hero: { intent: 'A child walking a path in changing weather, seen from behind; the season visible in the light.' },
    heroDetail: { intent: 'A detail from the same walk: boots on wet leaves, a hand on a gate.' },
    band: { intent: 'A long field under a moving sky, one child far off.' },
    inside: { intent: 'The Transits PDF open on a phone beside a paper calendar on a table.', crop: 'landscape, close, the phone screen readable' },
    offer: { intent: 'A parent reading at a kitchen table in the morning, a school bag by the door.', crop: 'landscape, morning light' },
  },
  final: { heading: 'Read the season before it arrives.', sub: 'Three months, one section each.' },
});

export const path = page.path;
export const title = page.title;
export const description = page.description;
export const indexable = page.indexable;
export const sections = page.sections;
