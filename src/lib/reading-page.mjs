// reading-page.mjs — one short product page for a written reading (2026-09-15 audit: six live
// Payment Links had no page, their URLs 404'd, and the portal's locked cards had nowhere to go).
//
// Every fact on these pages is read off the product itself: the catalog's reading contract
// (what it covers, whether it needs a birth time, the questions it asks, its length), the
// registry price, the live Payment Link, and the terms already on the refund page. No proof
// that does not exist, no numbers beyond the product's own. Photo slots are marked
// placeholders, so every page stays noindex until Richard's photographs are in. Voice:
// brand-bible §7. Richard approves the copy.

import {
  banner, header, hero, photoBand, steps, peek, offer, finalCta, footer, slot, h,
} from '../components.mjs';
import { PRODUCTS } from '../../assets/js/registry.js';

export const DELIVERY = 'Written after you give the details, read by us before it is released, and on your portal within 24 hours.';
// Richard, 2026-09-24: no money-back framing in marketing copy on any product page. These are
// digital products and the buyer has the value once it is delivered. What every page states is
// the policy, in the one sentence the Compass page and the ten design variants also use. The
// legal terms are untouched and still linked from every footer.
export const POLICY_NOTE = 'A wrong birth entry is rewritten once at no cost. A mistake in the reading is redone.';

export function price(slug) {
  const p = PRODUCTS[slug];
  if (!p || p.priceCents == null) throw new Error(`${slug} missing from registry`);
  return `$${p.priceCents / 100}`;
}

export const FOOTER = footer({
  contact: 'hello@wolfchildren.co',
  legal: [
    { label: 'Privacy', href: '/legal/privacy/' },
    { label: 'Terms', href: '/legal/terms/' },
    { label: 'Refunds', href: '/legal/refunds/' },
  ],
  fine: `© ${new Date().getFullYear()} Wolf Children. Readings are written for parents and describe how a child is wired; they do not predict events.`,
});

/**
 * slug, checkoutUrl (the live Payment Link), description, hero {h1, sub, bullets},
 * needs [{name, line, key?, tag?}] (four tiles), inside [{title, line}], includes [strings],
 * tagline, photos {hero, heroDetail, band, inside, offer} (each {intent, crop?}), final {heading, sub}
 */
export function readingPage(spec) {
  const product = PRODUCTS[spec.slug];
  if (!product) throw new Error(`${spec.slug} missing from registry`);
  const PRICE = price(spec.slug);
  const CTA_LABEL = `Get ${product.name}`;
  const toOffer = { label: CTA_LABEL, href: '#offer' };
  const photo = (id, ratio, min, p) => slot({ id, ratio, crop: p.crop || 'natural light, outdoors', intent: p.intent, min });

  return {
    path: `/readings/${spec.slug}/`,
    title: `${product.name} | Wolf Children`,
    description: spec.description,
    indexable: false,
    sections: () => [
      ['banner', banner(`${product.name}: ${spec.bannerLine}, ${PRICE}.`)],
      ['header', header({ ctaLabel: CTA_LABEL, ctaHref: '#offer' })],
      ['hero', hero({
        eyebrow: `${product.name} · ${spec.eyebrowLine} · ${PRICE}`,
        h1: spec.hero.h1,
        sub: spec.hero.sub,
        bullets: spec.hero.bullets,
        cta: { ...toOffer, subtext: h('span', {}, DELIVERY) },
        badges: ['Secure checkout by Stripe', 'Your child’s name is replaced before anything is written', 'Other readings on the readings page'],
        media: [photo('hero', '4x5', '1600×2000', spec.photos.hero), photo('hero-detail', '2x3', '2400×1600', spec.photos.heroDetail)],
      })],
      ['photo-band', photoBand({ id: 'band', ratio: '21x9', crop: 'wide, horizon low, a child small in the frame', intent: spec.photos.band.intent, min: '2400×1030' })],
      ['needs', steps({ eyebrow: 'What it needs from you', heading: spec.needsHeading, items: spec.needs, after: DELIVERY })],
      ['inside', peek({ eyebrow: `Inside ${product.name}`, heading: spec.insideHeading, media: photo('inside', '3x2', '2400×1600', spec.photos.inside), items: spec.inside })],
      ['offer', offer({
        eyebrow: 'The offer',
        name: product.name,
        price: PRICE,
        tagline: spec.tagline,
        media: photo('offer', '3x2', '2400×1600', spec.photos.offer),
        includes: spec.includes,
        cta: { label: CTA_LABEL, href: spec.checkoutUrl, size: 'btn-lg' },
        note: h('span', {}, POLICY_NOTE, ' ', h('a', { href: '/readings/' }, 'Every reading'), ' is on the readings page.'),
      })],
      ['final', finalCta({ heading: spec.final.heading, sub: `${product.name}, ${PRICE}. ${spec.final.sub}`, cta: { ...toOffer, size: 'btn-lg' }, guarantee: POLICY_NOTE })],
      ['footer', FOOTER],
    ],
  };
}
