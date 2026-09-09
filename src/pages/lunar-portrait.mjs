// lunar-portrait.mjs — the Lunar Portrait landing page.
//
// Structure is fixed by the conversion audit (Richard, 2026-09-09) and is
// the order of the calls in body() below. Copy lives here, beside the
// structure. Imagery, testimonials, the rating, the delivery time, the page
// count, the guarantee, the checkout URL and the legal links are placeholders
// until Richard supplies them; the build refuses to make this page indexable
// while any remain.

import {
  banner, header, hero, carousel, testimonials, prose, steps, peek,
  comparison, faq, offer, finalCta, footer, placeholder, ph, cta, join, h,
} from '../components.mjs';
import { PRODUCTS } from '../../assets/js/registry.js';

const product = PRODUCTS['lunar-portrait'];
if (!product || product.priceCents == null) throw new Error('lunar-portrait missing from registry');
const PRICE = `$${product.priceCents / 100}`;          // "$199", from the catalog, never typed here

export const path = '/readings/lunar-portrait/';
export const title = `${product.name} | Wolf Children`;
export const description = 'A reading of how your child is wired: their emotional nature, what settles them, how they learn, and where they will push back. Written for the parent raising them.';
export const indexable = false;                          // flips to true when no placeholders remain

const CTA_LABEL = `Get the ${product.name}`;

const theCta = (extra = {}) => ({
  label: CTA_LABEL,
  href: '#offer',
  ...extra,
});

export function body() {
  return join([
    banner(`Now open: the ${product.name}. A reading of who your child is, written for the parent raising them.`),

    header({ ctaLabel: `${CTA_LABEL} · ${PRICE}`, ctaHref: '#offer' }),

    hero({
      eyebrow: `The ${product.name} · one child · ${PRICE}`,
      h1: 'Know how your child is wired, in one evening, from the sky on the day they were born.',
      sub: `The ${product.name} turns your child's birth chart into plain words: their emotional nature, what settles them, how they learn, and where they will push back. Every sign and planet is explained where it appears, so there is nothing to decode and nothing to study first.`,
      bullets: [
        'Why the meltdown starts, and what brings them back',
        'How they take in the world, so teaching stops being a fight',
        'Where they will dig in, and how to meet it without a war',
        'The words for who they are, before they can say it themselves',
      ],
      cta: theCta({
        subtext: h('span', {}, 'One child, one reading, yours to keep. Delivered to your private portal ', ph('DELIVERY TIME'), '.'),
      }),
      rating: h('span', { 'data-placeholder': 'rating anchor (no reviews exist yet)', class: 'ph-block' },
        '★★★★★ ', ph('RATING · COUNT'), ' from parents'),
      badges: [
        'Secure checkout by Stripe',
        'Your child’s details stay on our own server',
        h('span', {}, ph('GUARANTEE')),
      ],
      mockup: placeholder({ what: 'hero product mockup (the Portrait, open)', ratio: '4 / 5', size: 'placeholder-hero' }),
    }),

    carousel({
      items: [
        { media: placeholder({ what: 'hero mockup' }),
          caption: h('span', {}, `The ${product.name}: `, ph('PAGE COUNT'), ' pages, written for your child by name.') },
        { media: placeholder({ what: 'before / after transformation' }),
          caption: 'Before: a bedtime that ends in tears, and no idea why. After: you know what their Moon needs at seven in the evening.' },
        { media: placeholder({ what: 'objection handler: a page spread showing plain sentences, no glyphs' }),
          caption: 'Written in plain sentences. Each sign and planet is explained where it appears, so you need no background to read it.' },
        { media: placeholder({ what: 'four-child grid' }),
          caption: 'Four children, four charts, four different bedtimes.' },
        { media: placeholder({ what: 'guarantee badge', ratio: '1 / 1' }),
          caption: h('span', {}, ph('GUARANTEE TERMS')) },
        { media: placeholder({ what: 'testimonial collage' }),
          caption: h('span', {}, 'From parents who have read theirs. ', ph('TESTIMONIALS')) },
      ],
    }),

    testimonials({
      eyebrow: 'From parents',
      heading: 'What changed after they read it.',
      items: [1, 2, 3].map((n) => ({
        placeholder: `testimonial ${n} (none collected yet)`,
        quote: `[TESTIMONIAL ${n}: a parent, in their own words, on one specific thing that changed at home.]`,
        who: `[Parent name, child’s age]`,
      })),
    }),

    prose({
      eyebrow: 'Why the books stop working',
      heading: 'Parenting books describe an average child. You are raising a specific one.',
      paragraphs: [
        'Every method you have tried was written for a child who does not exist: a composite, built from thousands of kids, with the edges sanded off. When the method fails, the book says you applied it wrong. Often you applied it perfectly, to the wrong child.',
        'A child with the Moon in a water sign melts down because a feeling got too big. A child with the Moon in an air sign melts down because nobody explained the plan. The same tantrum, two different fixes, and the book gives you one.',
        `The ${product.name} starts from the other end. It begins with your child’s chart, then tells you which of the things you have already read apply to them, and which never will.`,
      ],
    }),

    steps({
      eyebrow: 'How it works',
      heading: 'Four placements, read for a parent.',
      items: [
        { name: 'Sun', line: 'The core of them: what they are here to grow into, and what they need in order to feel seen.' },
        { name: 'Moon', key: true, tag: 'The tantrum key', line: 'Their emotional nature. What overwhelms them, what soothes them, and what brings them back.' },
        { name: 'Mercury', line: 'How they think and learn: the way they take in a story, a rule, or a maths problem.' },
        { name: 'Rising', line: 'How they meet the world: the first face they show a room, and the armour they reach for when unsure.' },
      ],
      after: h('span', {}, 'You add your child’s birth details once, in your private portal. The Portrait is written from those and delivered ', ph('DELIVERY TIME'), '.'),
    }),

    peek({
      eyebrow: 'Inside the Portrait',
      heading: 'A document you will read twice: once now, and once when they are fifteen.',
      media: placeholder({ what: 'sneak peek: two spreads of the document', ratio: '3 / 2' }),
      items: [
        { title: 'Their emotional weather', line: 'What overwhelms them, what soothes them, and the shape of a hard evening. Read from the Moon.' },
        { title: 'How they learn', line: 'How they take in new things, and how to explain something so it lands. Read from Mercury.' },
        { title: 'Where they push back', line: 'The fights worth having, the ones to let go, and how to tell them apart. Read from the Sun and the Rising sign.' },
        { title: 'What they need from you', line: 'One page written for the parent: the few things that make the biggest difference with this child.' },
        { title: 'The chart itself, explained', line: 'Every placement in a sentence, for the day they ask what any of it means.' },
      ],
    }),

    comparison({
      eyebrow: 'Compared',
      heading: 'Where it sits next to what you have tried.',
      columns: ['Parenting books', 'A traditional chart reading', product.name],
      rows: [
        { label: 'Written for', cells: ['An average child', 'An adult client', 'Your child, by name, for you'] },
        { label: 'What you get', cells: ['A method to apply', 'A live session and your notes', 'A document you keep and reread'] },
        { label: 'Language', cells: ['Plain, but generic', 'Glyphs, houses, aspects', 'Plain sentences, each term explained where it appears'] },
        { label: 'Time from you', cells: ['Hours of reading, then trial and error', 'A session you schedule and attend', 'One evening to read it'] },
        { label: 'When it applies', cells: ['When your child matches the book', 'Until you forget the session', 'At five, at nine, at fifteen'] },
        { label: 'Price', cells: ['Varies', 'Varies', PRICE] },
      ],
    }),

    faq({
      eyebrow: 'Questions',
      heading: 'Before you decide.',
      items: [
        { q: 'We do not know the exact birth time. Does it still work?',
          a: ['Yes. The Sun, Moon and Mercury are read from the date and place, so the Portrait still covers emotional nature, learning, and where they push back. The Rising sign needs a time. Without one, that section is left out and the price is the same. Tick “birth time unknown” when you add your child.'] },
        { q: 'Is it doom and gloom?',
          a: ['No. It reads how your child is wired and what they need from you. It says nothing about the future, about health, or about who they will become in any way that closes a door. Where a chart holds a hard placement, the Portrait says what that placement asks of you as a parent.'] },
        { q: 'Does it work for teenagers?',
          a: ['Yes. The chart is the same at fifteen as at five; what changes is how much of it has shown up. For a teenager, the section on where they push back is usually the one to read first.'] },
        { q: 'How is it delivered?',
          a: [h('span', {}, 'As a PDF in your private portal. You add the birth details once, and the Portrait arrives ', ph('DELIVERY TIME'), '. You get an email when it is ready. Sign-in is by email link, with no password to remember.')] },
      ],
    }),

    offer({
      eyebrow: 'The offer',
      name: product.name,
      price: PRICE,
      tagline: 'One child, one reading, yours to keep.',
      includes: [
        h('span', {}, 'The full Portrait as a PDF, ', ph('PAGE COUNT'), ' pages'),
        'Every placement explained in plain words, where it appears',
        'One page written for you, the parent',
        'Your private portal, sign-in by email link',
        h('span', {}, ph('GUARANTEE')),
      ],
      cta: theCta({ href: '#', placeholderWhat: 'checkout URL (Stripe not live)', size: 'btn-lg' }),
      note: 'Two children? Each child is their own Portrait.',
    }),

    finalCta({
      heading: 'Understand the child you already have.',
      sub: `The ${product.name}, ${PRICE}. Read it tonight, and again in ten years.`,
      cta: theCta({ href: '#offer', size: 'btn-lg' }),
      guarantee: h('span', {}, ph('GUARANTEE, one line')),
    }),

    footer({
      contact: 'hello@wolfchildren.co',
      legal: [
        { label: 'Privacy', href: '/legal/privacy.html', placeholder: 'privacy page (not written)' },
        { label: 'Terms', href: '/legal/terms.html', placeholder: 'terms page (not written)' },
        { label: 'Refunds', href: '/legal/refunds.html', placeholder: 'refunds page (not written)' },
      ],
    }),
  ]).toString();
}
