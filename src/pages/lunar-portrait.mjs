// lunar-portrait.mjs — the Lunar Portrait landing page.
//
// Section order is fixed by the conversion audit (Richard, 2026-09-09) and is
// the order of sections() below. Copy lives here beside the structure. Every
// image is a named photo slot (ratio, crop, intent, minimum size), so the shot
// list is `node build.mjs --shots`. The build refuses to make this page
// indexable while any placeholder remains.

import {
  banner, header, hero, photoBand, gallery, testimonials, prose, steps, peek,
  comparison, faq, offer, finalCta, footer, slot, slotGrid, ph, h,
} from '../components.mjs';
import { PRODUCTS } from '../../assets/js/registry.js';

const product = PRODUCTS['lunar-portrait'];
if (!product || product.priceCents == null) throw new Error('lunar-portrait missing from registry');
const PRICE = `$${product.priceCents / 100}`;          // from the catalog, never typed here

export const path = '/readings/lunar-portrait/';
export const title = `${product.name} | Wolf Children`;
export const description = 'A reading of how your child is wired: their emotional nature, what settles them, how they learn, and where they will push back. Written for the parent raising them.';
export const indexable = false;                          // flips to true when no placeholders remain

const CTA_LABEL = `Get the ${product.name}`;
const theCta = (extra = {}) => ({ label: CTA_LABEL, href: '#offer', ...extra });

// Photo slots: id, ratio, crop, intent, min. Medium-format, natural light.
const PHOTOS = {
  hero:      { id: 'hero',      ratio: '4x5',  crop: 'portrait, subject in the upper two thirds, room below', intent: 'One child outdoors, absorbed in something small (a stone, a stick, water). Face turned away or half-seen; the parent is the viewer.', min: '1600×2000' },
  heroDetail: { id: 'hero-detail', ratio: '2x3', crop: 'portrait, loose; this slot stretches to the height of the copy, so the crop runs from 2:3 to about 1:2 on wide screens', intent: 'A detail from the same scene as the hero: hands, a pocket of stones, wet boots, grass. Texture, not a face.', min: '2400×1600' },
  band:      { id: 'band',      ratio: '21x9', crop: 'wide, horizon in the top third, child small in the frame', intent: 'A child alone in a large landscape: field, coast, forest edge. Scale over detail.', min: '2400×1030' },
  mockup:    { id: 'mockup',    ratio: '4x5',  crop: 'flat lay, document open, shot from above', intent: 'The printed Portrait open on a table, a hand at the edge of the frame.', min: '1600×2000' },
  beforeAfter: { id: 'before-after', ratio: '1x1', crop: 'square, diptych or single frame', intent: 'The same room at bedtime: chaos and calm. One image or a pair.', min: '1600×1600' },
  spread:    { id: 'spread',    ratio: '3x2',  crop: 'landscape, two pages visible', intent: 'A spread of the Portrait close enough to read a sentence, far enough that the type is texture.', min: '2400×1600' },
  child1:    { id: 'child-1',   ratio: '4x5',  crop: 'portrait, tight, eye level', intent: 'Four children, four temperaments. This one: watchful.', min: '1200×1500' },
  child2:    { id: 'child-2',   ratio: '4x5',  crop: 'portrait, tight, eye level', intent: 'This one: mid-laugh.', min: '1200×1500' },
  child3:    { id: 'child-3',   ratio: '4x5',  crop: 'portrait, tight, eye level', intent: 'This one: stubborn, arms crossed.', min: '1200×1500' },
  child4:    { id: 'child-4',   ratio: '4x5',  crop: 'portrait, tight, eye level', intent: 'This one: dreaming, looking past the camera.', min: '1200×1500' },
  guarantee: { id: 'guarantee', ratio: '1x1',  crop: 'square, centred object', intent: 'A physical token of the guarantee: a stamp, a seal, a handwritten card.', min: '1200×1200' },
  collage:   { id: 'collage',   ratio: '3x2',  crop: 'landscape', intent: 'Printed messages from parents pinned to a board, or handwritten notes on a table.', min: '2400×1600' },
  why:       { id: 'why',       ratio: '3x2',  crop: 'landscape, low angle', intent: 'A stack of parenting books on a bedside table, spines out, one lying open face-down.', min: '2400×1600' },
  offer:     { id: 'offer',     ratio: '3x2',  crop: 'landscape, warm evening light', intent: 'A parent reading the Portrait at a kitchen table, child asleep or out of frame.', min: '2400×1600' },
};

export function sections() {
  return [
    ['banner', banner(`Now open: the ${product.name}. A reading of who your child is, written for the parent raising them.`)],

    ['header', header({ ctaLabel: CTA_LABEL, ctaHref: '#offer' })],

    ['hero', hero({
      eyebrow: `The ${product.name} · one child · ${PRICE}`,
      h1: 'Know how your child is wired, in one evening, from the sky on the day they were born.',
      sub: `The ${product.name} turns your child’s birth chart into plain words: their emotional nature, what settles them, how they learn, and where they will push back. Every sign and planet is explained where it appears, so there is nothing to decode and nothing to study first.`,
      bullets: [
        'Why the meltdown starts, and what brings them back',
        'How they take in the world, so teaching stops being a fight',
        'Where they will dig in, and how to meet it without a war',
        'The words for who they are, before they can say it themselves',
      ],
      cta: theCta({ subtext: h('span', {}, 'One child, one reading, yours to keep. Delivered to your private portal ', ph('DELIVERY TIME'), '.') }),
      rating: h('span', { 'data-placeholder': 'rating anchor (no reviews exist yet)' }, '★★★★★ ', ph('RATING · COUNT'), ' from parents'),
      badges: ['Secure checkout by Stripe', 'Your child’s details stay on our own server', h('span', {}, ph('GUARANTEE'))],
      media: [slot(PHOTOS.hero), slot(PHOTOS.heroDetail)],
    })],

    ['photo-band', photoBand(PHOTOS.band)],

    ['gallery', gallery({
      label: 'Product images',
      items: [
        { media: slot(PHOTOS.mockup), caption: h('span', {}, `The ${product.name}: `, ph('PAGE COUNT'), ' pages, written for your child by name.') },
        { media: slot(PHOTOS.beforeAfter), caption: 'Before: a bedtime that ends in tears, and no idea why. After: you know what their Moon needs at seven in the evening.' },
        { media: slot(PHOTOS.spread), caption: 'Written in plain sentences. Each sign and planet is explained where it appears, so you need no background to read it.' },
        { media: slotGrid([PHOTOS.child1, PHOTOS.child2, PHOTOS.child3, PHOTOS.child4]), caption: 'Four children, four charts, four different bedtimes.' },
        { media: slot(PHOTOS.guarantee), caption: h('span', {}, ph('GUARANTEE TERMS')) },
        { media: slot(PHOTOS.collage), caption: h('span', {}, 'From parents who have read theirs. ', ph('TESTIMONIALS')) },
      ],
    })],

    ['testimonials', testimonials({
      eyebrow: 'From parents',
      heading: 'What changed after they read it.',
      items: [1, 2, 3].map((n) => ({
        placeholder: `testimonial ${n} (none collected yet)`,
        quote: `[TESTIMONIAL ${n}: a parent, in their own words, on one specific thing that changed at home.]`,
        who: '[Parent name, child’s age]',
      })),
    })],

    ['why', prose({
      eyebrow: 'Why the books stop working',
      heading: 'Parenting books describe an average child. You are raising a specific one.',
      media: slot(PHOTOS.why),
      paragraphs: [
        'Every method you have tried was written for a child who does not exist: a composite, built from thousands of kids, with the edges sanded off. When the method fails, the book says you applied it wrong. Often you applied it perfectly, to the wrong child.',
        'A child with the Moon in a water sign melts down because a feeling got too big. A child with the Moon in an air sign melts down because nobody explained the plan. The same tantrum, two different fixes, and the book gives you one.',
        `The ${product.name} starts from the other end. It begins with your child’s chart, then tells you which of the things you have already read apply to them, and which never will.`,
      ],
    })],

    ['how', steps({
      eyebrow: 'How it works',
      heading: 'Four placements, read for a parent.',
      items: [
        { name: 'Sun', line: 'The core of them: what they are here to grow into, and what they need in order to feel seen.' },
        { name: 'Moon', key: true, tag: 'The tantrum key', line: 'Their emotional nature. What overwhelms them, what soothes them, and what brings them back.' },
        { name: 'Mercury', line: 'How they think and learn: the way they take in a story, a rule, or a maths problem.' },
        { name: 'Rising', line: 'How they meet the world: the first face they show a room, and the armour they reach for when unsure.' },
      ],
      after: h('span', {}, 'You add your child’s birth details once, in your private portal. The Portrait is written from those and delivered ', ph('DELIVERY TIME'), '.'),
    })],

    ['inside', peek({
      eyebrow: 'Inside the Portrait',
      heading: 'A document you will read twice: once now, and once when they are fifteen.',
      media: slot(PHOTOS.spread),
      items: [
        { title: 'Their emotional weather', line: 'What overwhelms them, what soothes them, and the shape of a hard evening. Read from the Moon.' },
        { title: 'How they learn', line: 'How they take in new things, and how to explain something so it lands. Read from Mercury.' },
        { title: 'Where they push back', line: 'The fights worth having, the ones to let go, and how to tell them apart. Read from the Sun and the Rising sign.' },
        { title: 'What they need from you', line: 'One page written for the parent: the few things that make the biggest difference with this child.' },
        { title: 'The chart itself, explained', line: 'Every placement in a sentence, for the day they ask what any of it means.' },
      ],
    })],

    ['compare', comparison({
      eyebrow: 'Compared',
      heading: 'Where it sits next to what you have tried.',
      columns: ['Parenting books', 'A traditional chart reading', product.name],
      rows: [
        { label: 'Written for', cells: ['An average child', 'An adult client', 'Your child, by name, for you'] },
        { label: 'What you get', cells: ['A method to apply', 'A live session and your notes', 'A document you keep and reread'] },
        { label: 'Language', cells: ['Plain, but generic', 'Glyphs, houses, aspects', 'Plain sentences, each term explained where it appears'] },
        { label: 'Time from you', cells: ['Hours of reading, then trial and error', 'A session you schedule and attend', 'One evening to read it'] },
        { label: 'When it applies', cells: ['When your child matches the book', 'Until you forget the session', 'At five, at nine, at fifteen'] },
        { label: 'Price', price: true, cells: ['Varies', 'Varies', PRICE] },
      ],
    })],

    ['faq', faq({
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
    })],

    ['offer', offer({
      eyebrow: 'The offer',
      name: product.name,
      price: PRICE,
      tagline: 'One child, one reading, yours to keep.',
      media: slot(PHOTOS.offer),
      includes: [
        h('span', {}, 'The full Portrait as a PDF, ', ph('PAGE COUNT'), ' pages'),
        'Every placement explained in plain words, where it appears',
        'One page written for you, the parent',
        'Your private portal, sign-in by email link',
        h('span', {}, ph('GUARANTEE')),
      ],
      cta: theCta({ href: '#', placeholderWhat: 'checkout URL (Stripe not live)', size: 'btn-lg' }),
      note: 'Two children? Each child is their own Portrait.',
    })],

    ['final', finalCta({
      heading: 'Understand the child you already have.',
      sub: `The ${product.name}, ${PRICE}. Read it tonight, and again in ten years.`,
      cta: theCta({ size: 'btn-lg' }),
      guarantee: h('span', {}, ph('GUARANTEE, one line')),
    })],

    ['footer', footer({
      contact: 'hello@wolfchildren.co',
      legal: [
        { label: 'Privacy', href: '/legal/privacy.html', placeholder: 'privacy page (not written)' },
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
