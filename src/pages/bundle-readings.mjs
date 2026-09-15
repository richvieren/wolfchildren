// bundle-readings.mjs — the All Readings page (2026-09-15: on sale with no page; see src/lib/reading-page.mjs).
import { readingPage, price } from '../lib/reading-page.mjs';
import { h } from '../components.mjs';

const read = (slug, name) => h('span', {}, h('a', { href: `/readings/${slug}/` }, name), `, ${price(slug)} on its own`);

// The live Stripe Payment Link (plink_1UFYj1ED8VMwHJ64sFQvWORa, created 2026-09-14 by stripe_sync.py --links --live).
const page = readingPage({
  slug: 'bundle-readings',
  checkoutUrl: 'https://buy.stripe.com/00w6oHe9o5AgfAO11Q1kA05',
  description: 'All five written readings in one purchase: North Star, Transits, Astrocartography, Solar Return and Numerology, each started when you are ready.',
  bannerLine: 'all five written readings in one purchase',
  eyebrowLine: 'five readings',
  hero: {
    h1: 'All five written readings, started one at a time, when you are ready.',
    sub: 'All Readings is one purchase of the five written readings: North Star, Transits, Astrocartography, Solar Return and Numerology. Each one waits on your portal until you give its details, so you can start North Star now and Transits in the spring, for one child or for different children.',
    bullets: [
      'North Star, the full portrait of who your child is',
      'Transits, the next three months, month by month',
      'Astrocartography, three places you choose',
      'Solar Return and Numerology, the year from the next birthday and the numbers in the date of birth',
    ],
  },
  needsHeading: 'Each reading asks for its own details, when you start it.',
  needs: [
    { name: 'One purchase', key: true, tag: 'Five readings on your portal', line: 'All five appear on your portal at once, each waiting for its details.' },
    { name: 'Start each one', line: 'Open a reading, choose the child and answer its three questions. Nothing starts until you do.' },
    { name: 'The birth time', line: 'Astrocartography needs it. The other four use it when you have it and are written without it when you do not.' },
    { name: 'Delivered one by one', line: 'Each reading is written after its details are in, and is on your portal within 24 hours of them.' },
  ],
  insideHeading: 'The five readings.',
  inside: [
    { title: 'North Star', line: read('north-star', 'Who your child is, in eight sections') },
    { title: 'Transits', line: read('transits', 'The next three months, month by month') },
    { title: 'Astrocartography', line: read('astrocartography', 'Three places you choose') },
    { title: 'Solar Return', line: read('solar-return', 'The year from the next birthday') },
    { title: 'Numerology', line: read('numerology', 'The numbers in the date of birth') },
  ],
  tagline: 'Five readings, each started when you are ready.',
  includes: [
    'North Star, Transits, Astrocartography, Solar Return and Numerology, each as its own PDF',
    'Each reading for the child you choose when you start it',
    'A page of questions with each, to keep reading it with Claude or ChatGPT',
    'Your private portal, sign-in by email link',
  ],
  photos: {
    hero: { intent: 'A child outdoors across a whole day: one frame, wide, morning to evening light if a composite is honest, else late afternoon.' },
    heroDetail: { intent: 'A detail: five smooth stones in a row on a wooden table.' },
    band: { intent: 'A landscape through the seasons, a child small in the frame.' },
    inside: { intent: 'Five printed readings fanned out on a table, the covers readable, no names visible.', crop: 'landscape, from above' },
    offer: { intent: 'A parent at a kitchen table with a notebook, planning, the child out of frame.', crop: 'landscape, warm light' },
  },
  final: { heading: 'Every written reading, in your own time.', sub: 'Five readings, one purchase.' },
});

export const path = page.path;
export const title = page.title;
export const description = page.description;
export const indexable = page.indexable;
export const sections = page.sections;
