// astrocartography.mjs — the astrocartography product page (2026-09-15: the product was on sale with no page; see src/lib/reading-page.mjs).
import { readingPage } from '../lib/reading-page.mjs';

// The live Stripe Payment Link (plink_1UFYizED8VMwHJ64Kfh4NnYZ, created 2026-09-14 by stripe_sync.py --links --live).
const page = readingPage({
  slug: 'astrocartography',
  checkoutUrl: 'https://buy.stripe.com/4gM8wPe9obYE0FU11Q1kA02',
  description: 'Three places you choose, and what each one draws out in your child, read from the birth chart as if born there.',
  bannerLine: 'three places you choose, and what each draws out in your child',
  eyebrowLine: 'one child · three places',
  hero: {
    h1: 'Three places, and what each one draws out in your child.',
    sub: 'You choose three places: a move you are weighing, family abroad, a summer you keep going back to. Astrocartography reads your child’s birth chart as if born in each of them and gives every place its own section, headed by its name, then says what travels with your child wherever you go.',
    bullets: [
      'A section for each place, headed by its name, so the three can be read side by side',
      'What each place brings forward in your child’s chart, in plain words',
      'What travels with your child anywhere, so a move is read against what stays the same',
      'Your three answers about the places, read against the chart',
    ],
  },
  needsHeading: 'The birth time, three places and three answers.',
  needs: [
    { name: 'The birth time', key: true, tag: 'Required for this reading', line: 'Places change the rising sign and the angles, which come from the birth time, so this reading needs it. The birth certificate or the hospital record usually has it.' },
    { name: 'Three places', line: 'Chosen from a list. Places at a similar longitude to the birthplace read almost the same; a place well to the east or west shows the most change.' },
    { name: 'Why these three', line: 'Why these three places? Has your child been to any of them, and what were they like there?' },
    { name: 'What you hope for', line: 'What are you hoping a place would give your child?' },
  ],
  insideHeading: 'What is in it, in the order you read it.',
  inside: [
    { title: 'How places work on a child', line: 'What changes with a place and what does not, so the three sections that follow make sense.' },
    { title: 'One section per place', line: 'Three sections, each headed by the place you chose, each saying what that place brings forward in your child.' },
    { title: 'What travels with your child anywhere', line: 'What in the chart stays the same wherever your child is.' },
    { title: 'The places, explained', line: 'Every placement named in the reading, set out plainly at the end.' },
  ],
  tagline: 'Three places, one section each, for one child.',
  includes: [
    'A PDF of six to twelve pages, headed by the three places you chose',
    'Your three answers, read against the chart',
    'A page of questions to keep reading it with Claude or ChatGPT',
    'Your private portal, sign-in by email link',
  ],
  photos: {
    hero: { intent: 'A child at a window or a harbour wall, looking out at somewhere new.' },
    heroDetail: { intent: 'A detail: a suitcase strap, a train ticket in a small hand, sand on a shoe.' },
    band: { intent: 'A coastline or a mountain road at the start of a trip, a child small in the frame.' },
    inside: { intent: 'The Astrocartography PDF open on a phone beside a folded paper map.', crop: 'landscape, close, the phone screen readable' },
    offer: { intent: 'A parent reading at a table with a map spread out, the evening outside.', crop: 'landscape, evening light' },
  },
  final: { heading: 'Weigh the places with your child in view.', sub: 'Three places you choose, one section each.' },
});

export const path = page.path;
export const title = page.title;
export const description = page.description;
export const indexable = page.indexable;
export const sections = page.sections;
