// parent-child.mjs — the parent-child product page (2026-09-15: the product was on sale with no page; see src/lib/reading-page.mjs).
import { readingPage } from '../lib/reading-page.mjs';

// The live Stripe Payment Link (plink_1UFYj1ED8VMwHJ640hO1EUqX, created 2026-09-14 by stripe_sync.py --links --live).
const page = readingPage({
  slug: 'parent-child',
  checkoutUrl: 'https://buy.stripe.com/8x29AT6GWaUA1JY6ma1kA06',
  description: 'Two charts read together, yours and your child’s: where you are alike, where your paces differ, and what you are likely to misread in each other.',
  bannerLine: 'your chart and your child’s, read together',
  eyebrowLine: 'you and one child',
  hero: {
    h1: 'Your chart and your child’s, read together.',
    sub: 'Parent and Child reads two birth charts side by side: yours and your child’s. It writes about the two of you: where you are alike, where your paces differ, what you give easily that your child needs, what your child needs that costs you, and what each of you is likely to misread in the other.',
    bullets: [
      'Where you are alike, and where your paces differ',
      'What you offer easily that your child needs, and what your child needs that costs you',
      'How each of you handles being upset, side by side',
      'What you are likely to misread in your child, and what your child pushes against in you',
    ],
  },
  needsHeading: 'Two sets of birth details and three answers.',
  needs: [
    { name: 'Your own details', key: true, tag: 'Given once for your account', line: 'Your birth date and place, and the time if you know it. Kept with your account and reused for any child.' },
    { name: 'Your child’s details', line: 'Your child’s birth date and place, and the time if you know it.' },
    { name: 'The two of you', line: 'What is easy between you, and what is not? When things go wrong between you, what does that usually look like?' },
    { name: 'What you wish', line: 'What do you wish you understood better about your child?' },
  ],
  insideHeading: 'Nine sections, about the two of you.',
  inside: [
    { title: 'Where you are alike', line: 'What the two charts share.' },
    { title: 'Your pace and your child’s', line: 'How fast each of you moves, decides and settles.' },
    { title: 'What you give and what it costs', line: 'Two sections: what you offer easily that your child needs, and what your child needs that costs you.' },
    { title: 'Being upset', line: 'How each of you handles it, and how the two meet.' },
    { title: 'Misreadings and pushback', line: 'Two sections: what you are likely to misread in your child, and what your child pushes against in you.' },
    { title: 'Where you recharge each other', line: 'What each of you gives the other back.' },
    { title: 'The two charts, explained', line: 'Every placement named in the reading, set out plainly at the end.' },
  ],
  tagline: 'Two charts, read for the two of you.',
  includes: [
    'A PDF of nine to eighteen pages about you and your child',
    'Your three answers about the two of you, read against both charts',
    'A page of questions to keep reading it with Claude or ChatGPT',
    'Your private portal, sign-in by email link',
  ],
  photos: {
    hero: { intent: 'A parent and a child outdoors, side by side, doing the same small thing differently.' },
    heroDetail: { intent: 'A detail: two pairs of boots, one large and one small, on the same muddy step.' },
    band: { intent: 'A parent and a child far off on a beach or a hill, walking at different paces.' },
    inside: { intent: 'The Parent and Child PDF open on a phone on a bench, two coffee cups.', crop: 'landscape, close, the phone screen readable' },
    offer: { intent: 'A parent reading at the end of the day, the child’s coat still on the hook.', crop: 'landscape, evening light' },
  },
  final: { heading: 'Read the two of you together.', sub: 'Your chart and your child’s, side by side.' },
});

export const path = page.path;
export const title = page.title;
export const description = page.description;
export const indexable = page.indexable;
export const sections = page.sections;
