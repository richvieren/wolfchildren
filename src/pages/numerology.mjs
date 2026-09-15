// numerology.mjs — the numerology product page (2026-09-15: the product was on sale with no page; see src/lib/reading-page.mjs).
import { readingPage } from '../lib/reading-page.mjs';

// The live Stripe Payment Link (plink_1UFYj0ED8VMwHJ64Qv3Q6Nwe, created 2026-09-14 by stripe_sync.py --links --live).
const page = readingPage({
  slug: 'numerology',
  checkoutUrl: 'https://buy.stripe.com/4gMaEXfds9Qw4Wa7qe1kA04',
  description: 'The numbers in your child’s date of birth, how they sit together, and the year ahead, worked out from the date alone.',
  bannerLine: 'the numbers in your child’s date of birth, and the year ahead',
  eyebrowLine: 'one child · the date of birth',
  hero: {
    h1: 'The numbers in your child’s date of birth, and the year ahead.',
    sub: 'Numerology works from the date of birth alone: no birth time, no place, no name. It reads the number your child was born with, the birthday number, how the two sit together, and the calendar year ahead for your child.',
    bullets: [
      'The number your child was born with, from every digit of the date',
      'The birthday number, from the day of the month',
      'How the two sit together, where they agree and where they pull apart',
      'The year ahead for your child, from the date and that year',
    ],
  },
  needsHeading: 'The date of birth and three answers.',
  needs: [
    { name: 'The date of birth', key: true, tag: 'Nothing else about the birth', line: 'Only the date. No time, no place, no name goes into the numbers.' },
    { name: 'What comes easily', line: 'What comes easily to your child that nobody taught them?' },
    { name: 'Where it sticks', line: 'What does your child get stuck on, again and again?' },
    { name: 'The same way', line: 'What does your child do the same way every time, whatever you say?' },
  ],
  insideHeading: 'What is in it, in the order you read it.',
  inside: [
    { title: 'The number your child was born with', line: 'The life path number, from every digit of the date of birth.' },
    { title: 'The birthday number', line: 'The day of the month on its own, and what it adds.' },
    { title: 'How the two sit together', line: 'Where the two numbers agree and where they pull in different directions.' },
    { title: 'The year ahead', line: 'The personal year for your child: the coming calendar year, or the current one before October.' },
    { title: 'The numbers, explained', line: 'Each number and how it was worked out, set out plainly at the end.' },
  ],
  tagline: 'The numbers in one date of birth.',
  includes: [
    'A PDF of six to twelve pages, from your child’s date of birth',
    'Your three answers, read against the numbers',
    'A page of questions to keep reading it with Claude or ChatGPT',
    'Your private portal, sign-in by email link',
  ],
  photos: {
    hero: { intent: 'A child counting something outdoors: stones in a row, steps on a path.' },
    heroDetail: { intent: 'A detail: small hands laying out shells or pine cones in a pattern.' },
    band: { intent: 'A long row of fence posts or trees along a path, a child walking the line.' },
    inside: { intent: 'The Numerology PDF open on a phone beside a handwritten date.', crop: 'landscape, close, the phone screen readable' },
    offer: { intent: 'A parent reading at a table, a child’s drawing of numbers beside the phone.', crop: 'landscape, warm light' },
  },
  final: { heading: 'The numbers your child was born with.', sub: 'From the date of birth alone.' },
});

export const path = page.path;
export const title = page.title;
export const description = page.description;
export const indexable = page.indexable;
export const sections = page.sections;
