// solar-return.mjs — the solar-return product page (2026-09-15: the product was on sale with no page; see src/lib/reading-page.mjs).
import { readingPage } from '../lib/reading-page.mjs';

// The live Stripe Payment Link (plink_1UFYizED8VMwHJ647p5vhQfE, created 2026-09-14 by stripe_sync.py --links --live).
const page = readingPage({
  slug: 'solar-return',
  checkoutUrl: 'https://buy.stripe.com/8x228r4yOgeU74i5i61kA03',
  description: 'The year that starts on your child’s next birthday, read from the chart for that birthday against the birth chart.',
  bannerLine: 'the year that starts on your child’s next birthday',
  eyebrowLine: 'one child · the year from the next birthday',
  hero: {
    h1: 'The year that starts on your child’s next birthday.',
    sub: 'Every year the Sun returns to where it was at birth, on or near the birthday. Solar Return reads the chart for that moment against your child’s birth chart and writes about the year it opens: what is different, how your child is likely to feel through it, and where the year presses.',
    bullets: [
      'What is different about this year, so a change in your child reads as the year and not as a problem',
      'The emotional weather of the year, so you know what the harder weeks are made of',
      'Where the year presses, and what that pressure is asking for',
      'Your three answers about the year behind, read against the year ahead',
    ],
  },
  needsHeading: 'The birth details and three answers.',
  needs: [
    { name: 'Date and place', key: true, tag: 'The birth time adds one section', line: 'The birth date and the place, chosen from a list. With the time, the reading adds a section on how your child meets the year.' },
    { name: 'The year behind', line: 'What was this last year like for your child, in a sentence?' },
    { name: 'Grown out of', line: 'What has your child grown out of this year?' },
    { name: 'The year ahead', line: 'What do you hope changes for your child in the year ahead?' },
  ],
  insideHeading: 'What is in it, in the order you read it.',
  inside: [
    { title: 'The year that starts on the birthday', line: 'The year as a whole, from the chart of the return.' },
    { title: 'What is different this year', line: 'What the return chart brings that the birth chart does not.' },
    { title: 'The emotional weather this year', line: 'How the year is likely to feel from the inside.' },
    { title: 'How your child meets the year', line: 'With a birth time only: the face your child turns to the year.' },
    { title: 'Where the year presses', line: 'Where the year asks the most, and what the pressure is for.' },
    { title: 'The return chart, explained', line: 'Every placement named in the reading, set out plainly at the end.' },
  ],
  tagline: 'One year, from one birthday to the next.',
  includes: [
    'A PDF of six to twelve pages, written for the year from your child’s next birthday',
    'Your three answers, read against the chart',
    'A page of questions to keep reading it with Claude or ChatGPT',
    'Your private portal, sign-in by email link',
  ],
  photos: {
    hero: { intent: 'A child outdoors on a birthday morning, no cake, no candles: the light and the child.' },
    heroDetail: { intent: 'A detail: a pencil mark of height on a door frame, grass on bare knees.' },
    band: { intent: 'A tree through one full year, or a wide field at the turn of a season.' },
    inside: { intent: 'The Solar Return PDF open on a phone on a garden table.', crop: 'landscape, close, the phone screen readable' },
    offer: { intent: 'A parent reading on the steps outside at the end of a birthday.', crop: 'landscape, evening light' },
  },
  final: { heading: 'Meet the year before it starts.', sub: 'From one birthday to the next.' },
});

export const path = page.path;
export const title = page.title;
export const description = page.description;
export const indexable = page.indexable;
export const sections = page.sections;
