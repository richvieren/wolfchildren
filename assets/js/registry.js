// GENERATED from catalog.json by scripts/gen_registry.py — do not edit by hand.
// registry.js — every product, described once.
// Prices decided 2026-09-08, USD. The registry price is a label; the charged
// amount is always read back from Stripe (spec §12). A bundle is a checkout
// product, never a grant (spec §3.1a).

export const PRODUCTS = {
  'lunar-portrait': {
    slug: 'lunar-portrait',
    line: 'readings',
    name: 'Lunar Portrait',
    fulfilment: 'generated',
    requiresIntake: true,
    subject: 'child',
    priceCents: 19900,
    currency: 'usd',
    active: true,
    assetPath: null,
    includes: [],
  },
  'transits': {
    slug: 'transits',
    line: 'readings',
    name: 'Transits',
    fulfilment: 'generated',
    requiresIntake: true,
    subject: 'child',
    priceCents: 9900,
    currency: 'usd',
    active: true,
    assetPath: null,
    includes: [],
  },
  'astrocartography': {
    slug: 'astrocartography',
    line: 'readings',
    name: 'Astrocartography',
    fulfilment: 'generated',
    requiresIntake: true,
    subject: 'child',
    priceCents: 19900,
    currency: 'usd',
    active: true,
    assetPath: null,
    includes: [],
  },
  'solar-return': {
    slug: 'solar-return',
    line: 'readings',
    name: 'Solar Return',
    fulfilment: 'generated',
    requiresIntake: true,
    subject: 'child',
    priceCents: 9900,
    currency: 'usd',
    active: true,
    assetPath: null,
    includes: [],
  },
  'numerology': {
    slug: 'numerology',
    line: 'readings',
    name: 'Numerology',
    fulfilment: 'generated',
    requiresIntake: true,
    subject: 'child',
    priceCents: 9900,
    currency: 'usd',
    active: true,
    assetPath: null,
    includes: [],
  },
  'bundle-readings': {
    slug: 'bundle-readings',
    line: 'readings',
    name: 'All Readings',
    fulfilment: 'bundle',
    requiresIntake: false,
    subject: null,
    priceCents: 49900,
    currency: 'usd',
    active: true,
    assetPath: null,
    includes: ['lunar-portrait', 'transits', 'astrocartography', 'solar-return', 'numerology'],
  },
  'parent-child': {
    slug: 'parent-child',
    line: 'readings',
    name: 'Parent and Child',
    fulfilment: 'generated',
    requiresIntake: true,
    subject: 'child',
    priceCents: null,
    currency: 'usd',
    active: false,
    assetPath: null,
    includes: [],
  },
  'presets': {
    slug: 'presets',
    line: 'photography',
    name: 'Lightroom Presets',
    fulfilment: 'instant',
    requiresIntake: false,
    subject: null,
    priceCents: 4900,
    currency: 'usd',
    active: true,
    assetPath: 'presets',
    includes: [],
  },
  'photo-course': {
    slug: 'photo-course',
    line: 'photography',
    name: 'How to Photograph Children Outdoors',
    fulfilment: 'instant',
    requiresIntake: false,
    subject: null,
    priceCents: null,
    currency: 'usd',
    active: false,
    assetPath: 'photo-course',
    includes: [],
  },
  'retreat': {
    slug: 'retreat',
    line: 'retreats',
    name: 'Retreat',
    fulfilment: 'manual',
    requiresIntake: false,
    subject: null,
    priceCents: null,
    currency: 'usd',
    active: false,
    assetPath: null,
    includes: [],
  },
};

export const getProduct = (slug) => PRODUCTS[slug];

export const grantableProducts = () =>
  Object.values(PRODUCTS).filter((p) => p.fulfilment !== 'bundle');

export function productsByLine() {
  const g = { readings: [], photography: [], retreats: [] };
  for (const p of Object.values(PRODUCTS)) g[p.line].push(p);
  return g;
}
