// compass.mjs — the Compass landing page ($27, one page from a child's chart).
//
// Rebuilt 2026-09-14 on Richard's instruction: one reader, no history, no proof
// that does not exist. The reader is a mother who wants to give her child the
// best possible upbringing; she reads about parenting, she pays attention, and
// she wants to understand her child rather than manage her. Carter's method for
// the page (copy-methods skill): the one reader, the onlyness stated as what
// Compass is, feature-so-benefit bullets, North Star's price as the anchor in
// the comparison, the refund promise beside the price, each objection answered
// where it arises. Voice: brand-bible §7 (a brand, not a person; no credentials).
//
// What is "in the product" is read off the real Compass render
// (api/scripts/compass_page.py, 2026-09-13): the 24 widgets (the wheel added
// 2026-09-15), 22 of them with text. Prices come from the registry, never typed here. No testimonials until
// real ones exist; the photo slots are marked placeholders, so the page stays
// noindex until the photographs are in.

import {
  banner, header, hero, photoBand, gallery, prose, steps, peek,
  comparison, faq, offer, finalCta, footer, slot, h, eyebrow,
} from '../components.mjs';
import { PRODUCTS } from '../../assets/js/registry.js';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { raw } from '../lib/html.mjs';

// The live wheel: a sample chart for a child who does not exist (12 January 2020,
// 14:30, Ghent), computed by the API's own natal_chart(); never a real child's chart.
const WHEEL_DATA = readFileSync(new URL('../../assets/data/wheel-sample.json', import.meta.url), 'utf8').trim();
const stamp = (rel) => createHash('md5').update(readFileSync(new URL(rel, import.meta.url))).digest('hex').slice(0, 8);
const heading = (level, size, text) => h(level, { class: `display ${size}` }, text);   // as in components.mjs (not exported)
const WHEEL_JS = `/assets/js/wheel-sample.js?v=${stamp('../../assets/js/wheel-sample.js')}`;

const product = PRODUCTS['compass'];
const northStar = PRODUCTS['north-star'];
if (!product || product.priceCents == null) throw new Error('compass missing from registry');
if (!northStar || northStar.priceCents == null) throw new Error('north-star missing from registry');
const PRICE = `$${product.priceCents / 100}`;          // from the catalog, never typed here
const NS_PRICE = `$${northStar.priceCents / 100}`;     // the anchor: the full reading's price beside the page's

export const path = '/readings/compass/';
export const title = `${product.name} | Wolf Children`;
export const description = 'One page about who your child is, in plain words, from the birth date, time and place: what settles her, how she takes things in, where her energy goes, and one question to sit with.';
export const indexable = false;                          // flips to true when no placeholders remain

// The live Stripe Payment Link (plink_1UFymCED8VMwHJ648PIte8XX, created 2026-09-15 by stripe_sync.py
// --links --live: metadata.slug=compass, terms consent, promotion codes, the sibling as an optional item).
const CHECKOUT_URL = 'https://buy.stripe.com/00w00j0iy7Iobky11Q1kA07';
const CTA_LABEL = `Get ${product.name}`;
const SAMPLE_URL = '/readings/compass/sample/';   // a whole Compass for a child who does not exist
const theCta = (extra = {}) => ({ label: CTA_LABEL, href: '#offer', ...extra });
const REFUNDS = h('a', { href: '/legal/refunds/' }, 'refund page');

// Photo slots: id, ratio, crop, intent, min. Richard's own photography; nothing
// celestial (brand-bible §6). The photographs carry what the copy does not claim.
const PHOTOS = {
  hero:       { id: 'hero',        ratio: '4x5',  crop: 'portrait, the child in the lower half, sky or trees above', intent: 'One child outside at dusk, looking up. Face half-seen; the parent is the viewer.', min: '1600×2000' },
  heroDetail: { id: 'hero-detail', ratio: '2x3',  crop: 'portrait, loose; stretches to the copy height on wide screens', intent: 'A detail from the same evening: a hand on a fence, wet grass, a sleeve. Texture, not a face.', min: '2400×1600' },
  band:       { id: 'band',        ratio: '21x9', crop: 'wide, horizon low, a child small in the frame', intent: 'A field or a beach at the end of the day, one child walking away from the camera.', min: '2400×1030' },
  page:       { id: 'page',        ratio: '4x5',  crop: 'a phone held in a hand, the Compass page on screen, shot from above at a kitchen table', intent: 'The Compass page as it opens on a phone. A real page only with the parent’s permission and the name changed; until then, the sample render.', min: '1600×2000' },
  settles:    { id: 'settles',     ratio: '3x2',  crop: 'landscape, close, the phone screen readable', intent: 'The “What settles her” widget on screen, close enough to read the first line.', min: '2400×1600' },
  how:        { id: 'how',         ratio: '3x2',  crop: 'landscape, warm evening light', intent: 'A parent at a table with a birth certificate and a phone, entering details.', min: '2400×1600' },
  offer:      { id: 'offer',       ratio: '3x2',  crop: 'landscape, evening light', intent: 'A parent reading the page on a phone in a quiet kitchen, the child out of frame.', min: '2400×1600' },
};

export function sections() {
  return [
    ['banner', banner(`${product.name}: one page about your child, ${PRICE}.`)],

    ['header', header({ ctaLabel: CTA_LABEL, ctaHref: '#offer' })],

    // Richard, 2026-09-24: the page opens on the parent's state, never on the product, and the
    // deliverable comes late. A parent buys direction, not improvement: she is guessing about
    // something specific and current and wants to stop. brand-bible §7's "headlines say what the
    // thing is" was updated the same day to match.
    ['hero', hero({
      eyebrow: `${product.name} · one child · one page · ${PRICE}`,
      h1: 'You are guessing, and you would like to stop.',
      sub: 'There is one thing your child does that you have never worked out. It happens most days. You have a theory, someone else in the house has a different one, and every few weeks you try a new approach and watch to see whether it helped. That is what wears you down. The guessing more than the behaviour.',
      bullets: [
        `${product.name} is one page about this child, written for you`,
        'It will not tell you who she will become',
        'It tells you what she is working with, so the next time it happens you are not starting from nothing',
      ],
      cta: theCta({ subtext: h('span', {}, 'Ready in minutes, on your phone, yours to keep.') }),
      badges: ['Secure checkout by Stripe', 'It needs her birth time', 'Her name, date and place never leave our own server'],
      media: [slot(PHOTOS.hero), slot(PHOTOS.heroDetail)],
    })],

    ['photo-band', photoBand(PHOTOS.band)],

    ['line', prose({
      eyebrow: 'The chart',
      heading: 'A birth chart is the same sky, read differently. The same night, one layer deeper.',
      paragraphs: [
        'Everyone born that week got the same sky. This is what it looked like from the place she arrived, at the minute she did.',
      ],
    })],

    // The refusal is the centre of the page, not a footnote: the promise not to label a child is
    // the product (Richard, 2026-09-24, from the grounded end of the market).
    ['will-not', steps({
      eyebrow: `What ${product.name} will not do`,
      heading: 'No labels. No verdicts. No diagnosis.',
      items: [
        { name: 'It does not diagnose', key: true, tag: 'Never a clinical opinion',
          line: 'Nothing here is a clinical opinion or a developmental assessment, and none of it replaces someone who knows your child in person. If something worries you, that is the conversation to have, and this page is not it.' },
        { name: 'It does not label her',
          line: 'No type, no score, no percentile, no word she has to carry into a parents’ evening. A label closes the question. This page keeps it open.' },
        { name: 'It does not predict',
          line: 'No year she will struggle, no subject she will be good at, no person she turns into. The chart describes the ground she is standing on, never the road ahead.' },
        { name: 'It does not tell you how to parent her',
          line: 'No plan, no routine, no list of things to change by Tuesday. You know her. This gives you something to think with.' },
      ],
      after: 'A page written about a child can go wrong in those four ways. This one is built to fail none of them.',
    })],

    ['for', prose({
      eyebrow: 'What it is for',
      heading: 'The thing that keeps happening.',
      paragraphs: [
        'Most of what is written from a birth chart is written about the person, as a summary: strengths, weaknesses, a future. This page is written about the week you are actually in.',
        'It starts where you already are. The hour that goes wrong. The refusal that arrives every single time. The change you did not expect her to take this hard. You are not looking for a description of her character. You are looking for a way to decide what to do on Thursday.',
        'So the page reads her the way a good teacher would after a term of watching her: what brings her back when the day has gone past her, how she takes things in, where her energy goes and what it costs her when it has nowhere to go. Those are the things you can act on this week.',
      ],
    })],

    // Greene gives the whole child report away at $69.90 (astro.com, read 2026-09-24). A written
    // product proves itself by sample, not by testimonial. The link is a plain one: the build test
    // allows a product page exactly one .btn label.
    ['sample', h('section', { class: 'section sample-section', id: 'sample' },
      h('div', { class: 'container l-stack' },
        h('div', { class: 'stack-head' },
          eyebrow('A whole one, free'),
          heading('h2', 't-head', 'Read one before you buy one.')),
        h('div', { class: 'stack-body' },
          h('p', { class: 'serif' }, 'This is a complete ', product.name, ', start to finish, for a child who does not exist: born 12 January 2020, at half past two in the afternoon, in Ghent. Nothing is held back and nothing is blurred.'),
          h('p', { class: 'serif' }, 'Read it. If it does not sound like a real child to you, do not buy one.'),
          h('p', {}, h('a', { class: 'link-lg', href: SAMPLE_URL }, `Read the whole sample ${product.name}`)))))],

    ['wheel', h('section', { class: 'section wheel-section', id: 'wheel' },
      h('div', { class: 'container l-split' },
        h('div', { class: 'split-head' },
          eyebrow('The wheel'),
          heading('h2', 't-head', 'Tap a planet.')),
        h('div', { class: 'split-body' },
          h('p', { class: 'serif' }, 'The page draws her chart as a wheel, the rising sign on the left where the horizon was when she was born. Tap a planet: the lines to the planets it connects with stay lit, and the centre says where it stood.'),
          h('div', { class: 'wheel-live', id: 'wheel-sample' }),
          h('p', { class: 'wheel-note' }, 'A sample chart for a child who does not exist: 12 January 2020, 14:30, Ghent.'),
          h('script', { type: 'application/json', id: 'wheel-sample-data' }, raw(WHEEL_DATA.replace(/</g, '\\u003c'))),
          h('script', { type: 'module', src: WHEEL_JS }, ''))))],

    ['gallery', gallery({
      label: 'The page',
      items: [
        { media: slot(PHOTOS.page), caption: 'The page, as it opens on a phone. One scroll, top to bottom.' },
        { media: slot(PHOTOS.settles), caption: 'Start with “What settles her”. It is the part written for the end of a hard day.' },
      ],
    })],

    ['inside', peek({
      eyebrow: `Inside ${product.name}`,
      heading: 'What is on it, in the order you scroll.',
      media: slot(PHOTOS.how),
      items: [
        { title: 'The wheel of her chart', line: 'Every placement marked, so the rest of the page has somewhere to point.' },
        { title: 'What settles her', line: 'Read from the Moon, so the next bad evening has a name and a way back.' },
        { title: 'How she takes things in', line: 'So you know when to explain, when to show her, and when to leave it alone.' },
        { title: 'Where her energy goes', line: 'Out in the world or kept at home, so a quiet day stops reading as a bad one.' },
        { title: 'What she is like under pressure', line: 'So the version of her you meet at the end of a long day is recognisable.' },
        { title: 'One question to sit with', line: 'So the page ends in your hands.' },
      ],
    })],

    ['compare', comparison({
      eyebrow: 'Compared',
      heading: 'Next to a horoscope, and next to the full reading.',
      columns: ['A horoscope app', product.name, 'North Star'],
      highlight: 1,
      rows: [
        { label: 'About', cells: ['Everyone born in a month', 'Your child, from her date, time and place', 'Your child in depth, with your own answers read in'] },
        { label: 'Length', cells: ['A line a day', 'One page you scroll', 'Nine to fifteen pages'] },
        { label: 'Needs from you', cells: ['A sign', 'Date, time and place', 'Date, time, place and three answers'] },
        { label: 'When it arrives', cells: ['Now', 'Minutes after the details are in', 'Within 24 hours'] },
        { label: 'Price', price: true, cells: ['Free', PRICE, NS_PRICE] },
      ],
    })],

    ['faq', faq({
      eyebrow: 'Questions',
      heading: 'Before you decide.',
      items: [
        { q: 'I am not sure I believe in astrology.',
          a: [h('span', {}, 'Then read ', h('a', { href: SAMPLE_URL }, 'the sample'), ' first and decide whether it describes a real child. That is the only test that counts here. If it reads like a horoscope, you have lost nothing.')] },
        { q: 'She is three. Is it too early?',
          a: ['No. The page describes how she meets the day, which is already true at three and will still be true at eleven.'] },
        { q: 'I do not have her exact birth time.',
          a: [`${product.name} needs it. The birth certificate usually has it, and the hospital will have it on file. Without the time the page would be guessing, which is the thing you came here to stop. If it cannot be found, North Star is the reading that works without it.`] },
        { q: 'What if it does not sound like her?',
          a: [h('span', {}, 'Then tell us and we refund it. A page that does not sound like your child is no use to you and no use to us. The ', REFUNDS, ' has the rules in full, and a person reads every reply.')] },
        { q: 'Will it say something I do not want to read?',
          a: ['It may say something you already suspected. It will not say she is difficult, or behind, or a type. There is no bad here to find.'] },
        { q: 'A digital product, to get us off screens?',
          a: ['The page is how it reaches you. What it is for happens away from the screen, in the hour that keeps going wrong.'] },
        { q: 'What happens to her details?',
          a: ['Her name, her date of birth and her place of birth are stored on our own server and never leave it. You can delete her from the portal at any time, and everything goes with her.'] },
      ],
    })],

    ['offer', offer({
      eyebrow: 'The offer',
      name: product.name,
      price: PRICE,
      tagline: 'One child, one page, yours to keep.',
      media: slot(PHOTOS.offer),
      includes: [
        'The full page for one child, on your phone or printed',
        'Ready in minutes, once you give her birth date, time and place',
        'A page of questions, so you can keep reading it with Claude or ChatGPT',
        'Her name, date and place of birth kept on our own server',
        'Two children? Each child is her own page',
      ],
      cta: theCta({ href: CHECKOUT_URL, size: 'btn-lg' }),
      note: h('span', {}, 'A mistake of ours is redone or refunded within 30 days; a wrong birth entry is rewritten once at no cost. The ', REFUNDS, ' says how. When one page is not enough: North Star, the full reading, ', NS_PRICE, '.'),
    })],

    // The golden thread closes on Richard's own line, which the 2026-09-14 rebuild had cut.
    ['final', finalCta({
      heading: 'The same night, one layer deeper.',
      sub: 'You already know this child. This is the same one, read from the night she arrived.',
      cta: theCta({ size: 'btn-lg' }),
      guarantee: 'A mistake of ours is redone or refunded within 30 days.',
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
