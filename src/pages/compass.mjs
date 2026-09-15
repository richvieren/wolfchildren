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
    ['banner', banner(`${product.name}: one page about who your child is, from the birth chart, ${PRICE}.`)],

    ['header', header({ ctaLabel: CTA_LABEL, ctaHref: '#offer' })],

    ['hero', hero({
      eyebrow: `${product.name} · one child · one page · ${PRICE}`,
      h1: 'One page about who your child is. Plain words, from the night she was born.',
      sub: `You read about children, and you still want to understand this one rather than manage her. ${product.name} takes her birth date, time and place and builds one page from them: what settles her when the day has been too much, how she takes things in, where her energy goes, and one question worth sitting with. Every widget is headed by the placement it reads from, so nothing needs decoding first.`,
      bullets: [
        'What settles her, read from the Moon, so the next hard evening has a name and a way back',
        'How she takes things in, so you know when to explain, when to show, and when to wait',
        'Where her energy goes, out in the world or at home, so a quiet day stops reading as a bad one',
        'One question to sit with, from the chart’s own ruler, so the page ends in your hands and never in a verdict',
      ],
      cta: theCta({ subtext: h('span', {}, 'One child, one page, yours to keep on your phone. It needs the birth time.') }),
      badges: ['Secure checkout by Stripe', 'Her name, date and place never leave our own server', `The full reading is North Star, ${NS_PRICE}`],
      media: [slot(PHOTOS.hero), slot(PHOTOS.heroDetail)],
    })],

    ['photo-band', photoBand(PHOTOS.band)],

    ['what', prose({
      eyebrow: `What ${product.name} is`,
      heading: 'A reading written for the parent, in words you could say to her face.',
      paragraphs: [
        'Most things written from a birth chart are written about the person, as a verdict: strengths, weaknesses, a future. This page is written for you, about the child in front of you, as she is now. Twenty-four widgets, twenty-two of them with text, each headed by the placement it reads from, in the present tense, about a child.',
        'It does not tell you how to parent. It says who she is, so the decisions you already make every day are made with her in view. The only test that matters happens at your kitchen table: does it sound like her?',
        `${product.name} is the smallest reading Wolf Children makes, and the one to start with. When one page is not enough, North Star is the full reading, written for you from the same chart and your own three answers.`,
      ],
    })],

    ['gallery', gallery({
      label: 'The page',
      items: [
        { media: slot(PHOTOS.page), caption: 'The page, as it opens on a phone. One scroll, top to bottom.' },
        { media: slot(PHOTOS.settles), caption: 'Start with “What settles her”. It is the widget written for the end of a hard day.' },
      ],
    })],

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

    ['how', steps({
      eyebrow: 'How it is made',
      heading: 'Three facts in, one page out.',
      items: [
        { name: 'Date, time, place', key: true, tag: 'The birth time is required', line: 'You enter the three. The time sets the rising sign and the houses, which carry half the page, so it is required. The birth certificate or the hospital record usually has it, to the minute.' },
        { name: 'Positions', line: 'From those three facts the chart is worked out on our own server: where the Sun, the Moon and the planets stood, and the rising sign on the eastern horizon.' },
        { name: 'Words', line: 'Each placement resolves to one short text, written in advance under the same rules as every Wolf Children reading: plain, present tense, about a child, never a verdict.' },
        { name: 'The page', line: 'Twenty-four widgets in one scroll on your phone: badges, a wheel, bars, three lines, a gauge, cards, and one question at the end. Yours to keep.' },
      ],
      after: 'Her name, her date and her place of birth stay on our server. The texts were written in advance, so no writing model ever receives anything about her.',
    })],

    ['inside', peek({
      eyebrow: `Inside ${product.name}`,
      heading: 'What is on the page, in the order you scroll it.',
      media: slot(PHOTOS.how),
      items: [
        { title: 'Who she is', line: 'Her Sun, Moon and rising sign as three badges, the planet that runs her chart, the direction she leans, and a paragraph on who she is becoming, so the rest of the page has a frame.' },
        { title: 'The wheel', line: 'Her birth chart drawn as a wheel, the rising sign on the left where the horizon was. Tap a planet and its connections light up, so the rest of the page has a picture to point at.' },
        { title: 'The chart at a glance', line: 'Four element bars, three pace bars, three lines with a dot on each (dreamer or doer, starter or finisher, settled or adaptable), so you see her shape before you read a word.' },
        { title: 'What settles her', line: 'The Moon, read for the end of a hard day: what brings her back and what makes it worse, so you stop trying the thing that makes it worse.' },
        { title: 'Holding on and being seen', line: 'What she keeps and what she lets go of, how she is in front of others, how she explains herself, how she takes things in, so the school gate and the dinner table make more sense.' },
        { title: 'Keeping, rhythm, being known', line: 'Three cards: what she keeps, her daily rhythm and her body, and what she is known for among her people, so you can plan the day around the child you have.' },
        { title: 'Turned inward, and a cluster', line: 'Any planet turned inward at her birth, and where the chart gathers its weight, if it does, so the quiet strengths get named too.' },
        { title: 'A question to sit with', line: 'One question for you, from the chart’s ruler. A question, never an instruction, so the page ends with you thinking about her.' },
      ],
    })],

    ['compare', comparison({
      eyebrow: 'Compared',
      heading: 'Next to a horoscope, and next to the full reading.',
      columns: ['A horoscope app', product.name, 'North Star'],
      highlight: 1,
      rows: [
        { label: 'About', cells: ['Everyone born in a month', 'Your child, from her date, time and place', 'Your child, in depth, with your three answers'] },
        { label: 'Length', cells: ['A line a day', 'One page you scroll', 'Eight sections, about three thousand words'] },
        { label: 'Language', cells: ['Vague on purpose', 'Plain words under a heading that names the placement', 'Plain words, written for you'] },
        { label: 'Needs from you', cells: ['A sign', 'Date, time and place', 'Date, time, place and three answers'] },
        { label: 'When it arrives', cells: ['Now', 'Once the details are in', 'Within 24 hours'] },
        { label: 'Price', price: true, cells: ['Free', PRICE, NS_PRICE] },
      ],
    })],

    ['faq', faq({
      eyebrow: 'Questions',
      heading: 'Before you decide.',
      items: [
        { q: 'We do not know the exact birth time. Does it still work?',
          a: [`${product.name} needs the time. The rising sign and the houses come from it, and they carry half the widgets on the page, so a page without a time would be a page with holes. The birth certificate, the hospital record or the baby book usually has it, to the minute. If it cannot be found, North Star is the reading that works without it.`] },
        { q: 'I am not sure about astrology.',
          a: ['Fair. Here is how it is held at Wolf Children: a birth chart is a set of positions on a date, a time and a place. From those, a page is written in plain words, and the only test that matters happens at your kitchen table. Does it sound like her? If it does, you have words for something you were already living with. If it does not, reply and say where it missed. Those replies are read.'] },
        { q: 'Will it tell me how to parent her?',
          a: ['No. It says who she is: what settles her, how she takes things in, where her energy goes, what she keeps, how she is with other children, and one question for you. It does not predict events, it does not diagnose, and it gives no instructions. What you do with it is yours. Nothing on the page would not be said to the child’s face.'] },
        { q: 'Which ages is it for?',
          a: ['The chart is the same at three and at thirteen; what changes is how much of it has shown up. The page is written about the child as a child, not as the adult she might become, so it reads at any age from toddler to teenager.'] },
        { q: 'What happens to her details?',
          a: ['Her name, her date of birth and her place of birth are stored on our own server and never leave it. The chart is worked out there. The texts on the page were written in advance, so no model ever receives anything about her. You can delete her from the portal at any time, and everything goes with her.'] },
        { q: 'What if it does not sound like her?',
          a: [h('span', {}, 'Reply and say where it missed; a person reads every reply. If the page has a mistake of ours, it is redone or refunded within 30 days. If the birth details were entered wrong, the page is rewritten once from the corrected details at no cost. The ', REFUNDS, ' has the rules in full.')] },
        { q: 'How is it delivered?',
          a: ['As a page in your private portal, on your phone or a screen. You sign in by email link, with no password to remember. Add the child once; the page is built from the details and appears on your dashboard.'] },
      ],
    })],

    ['offer', offer({
      eyebrow: 'The offer',
      name: product.name,
      price: PRICE,
      tagline: 'One child, one page, yours to keep.',
      media: slot(PHOTOS.offer),
      includes: [
        `The ${product.name} page: twenty-four widgets, twenty-two of them with text about your child`,
        'Sun, Moon and rising; what settles her; how she takes things in; where her energy goes; one question',
        'Her name, date and place of birth kept on our own server',
        'Your private portal, sign-in by email link',
        'Two children? Each child is her own page',
      ],
      cta: theCta({ href: CHECKOUT_URL, size: 'btn-lg' }),
      note: h('span', {}, 'A mistake of ours is redone or refunded within 30 days; a wrong birth entry is rewritten once at no cost. The ', REFUNDS, ' says how. When one page is not enough: North Star, the full reading, ', NS_PRICE, '.'),
    })],

    ['final', finalCta({
      heading: 'See the child in front of you.',
      sub: `${product.name}, ${PRICE}. One page, in plain words, about who she is.`,
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
