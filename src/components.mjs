// components.mjs — the page-building modules for wolfchildren.co.
//
// Every export is a pure function: content in, HTML string out. A page is a
// file in src/pages/ that imports these and lists its sections in order. A
// new page type (listicle, this-vs-that, long-form) is a new page file that
// assembles the same components, never a copy of another page.
//
// Rules (Steppa method, vieren/sops/hyperframes-deck-pipeline):
//   - zero inline styles: nothing here emits style=""; sizes and ratios are classes
//   - four layouts only: l-hero, l-split, l-stack, l-band (assets/css/site.css)
//   - one left axis; alignment is set in CSS on every zone, never by content
//   - every image is a named photo slot (slot()) with ratio, crop and intent, so
//     the shot list falls out of the page; an unfilled slot renders a placeholder
//     stamped data-placeholder, and the build refuses to index a page that has one

import { h, raw, join, esc } from './lib/html.mjs';

// ---------- primitives --------------------------------------------------

const RATIOS = new Set(['3x2', '2x3', '4x5', '1x1', '16x9', '21x9']);

// A photo slot. { id, ratio, crop, intent, min, src?, alt?, bleed? }
// With src: renders the image. Without: renders the placeholder face and the
// shot-list attributes.
export function slot({ id, ratio, crop, intent, min, src = null, alt = '', bleed = false }) {
  if (!RATIOS.has(ratio)) throw new Error(`slot ${id}: unknown ratio ${ratio}`);
  const cls = `slot slot-${ratio}${bleed ? ' slot-bleed' : ''}`;
  if (src) return h('figure', { class: cls, 'data-slot': id }, h('img', { src, alt, loading: 'lazy' }));
  return h('div', {
    class: cls, 'data-slot': id, 'data-placeholder': `photo ${id}`,
    'data-ratio': ratio.replace('x', ':'), 'data-crop': crop, 'data-intent': intent, 'data-min': min,
  },
  h('div', { class: 'placeholder' },
    h('span', { class: 'placeholder-label' }, `PHOTO · ${id}`),
    h('span', { class: 'placeholder-what' }, intent),
    h('span', { class: 'placeholder-meta' }, `${ratio.replace('x', ':')} · ${crop} · min ${min}`)));
}

// Four slots in a 2×2 grid, for a grid-of-children slot.
export function slotGrid(slots) {
  return h('div', { class: 'slot-grid' }, ...slots.map(slot));
}

// Inline placeholder for a fact Richard has not confirmed.
export function ph(what) {
  return h('mark', { class: 'ph', 'data-placeholder': what }, `[${what}]`);
}

export const eyebrow = (text) => h('p', { class: 'eyebrow' }, text);
const heading = (level, size, text) => h(level, { class: `display ${size}` }, text);

// The one CTA. One label per page; the test enforces it.
export function cta({ label, href, subtext = null, size = '', placeholderWhat = null }) {
  return h('div', { class: 'cta' },
    h('a', {
      class: `btn ${size}`.trim(), href,
      ...(placeholderWhat ? { 'data-placeholder': placeholderWhat, 'data-checkout': 'north-star' } : {}),
    }, label),
    subtext ? h('p', { class: 'cta-subtext' }, subtext) : null);
}

export function logo({ href = '/', label = 'Wolf Children', size = 'logo-md' }) {
  return h('a', { class: `logo ${size}`, href, 'aria-label': label },
    h('span', { class: 'logo-mark', role: 'img', 'aria-hidden': 'true' }));
}

// ---------- page furniture -----------------------------------------------

export function banner(text) {
  return h('div', { class: 'banner', role: 'note' }, h('div', { class: 'container' }, h('p', {}, text)));
}

export function header({ ctaLabel, ctaHref }) {
  return h('header', { class: 'site-header' },
    h('div', { class: 'container site-header-row' },
      logo({ size: 'logo-sm' }),
      h('a', { class: 'btn btn-sm', href: ctaHref }, ctaLabel)));
}

export function footer({ legal = [], contact, fine }) {
  return h('footer', { class: 'site-footer' },
    h('div', { class: 'container' },
      h('div', { class: 'footer-row' },
        logo({ size: 'logo-lg' }),
        h('ul', { class: 'footer-links' },
          ...legal.map((l) => h('li', {}, h('a', { href: l.href, ...(l.placeholder ? { 'data-placeholder': l.placeholder } : {}) }, l.label))),
          h('li', {}, h('a', { href: `mailto:${contact}` }, contact)))),
      h('p', { class: 'footer-fine' }, fine)));
}

// ---------- sections ------------------------------------------------------

// Layout 1: hero. media | copy.
export function hero({ eyebrow: eb, h1, sub, bullets, cta: c, badges, rating, media }) {
  return h('section', { class: 'hero', id: 'top' },
    h('div', { class: 'container l-hero' },
      h('div', { class: 'hero-media' }, ...(Array.isArray(media) ? media : [media])),
      h('div', { class: 'hero-copy' },
        h('span', { class: 'rule-em' }),
        eb ? eyebrow(eb) : null,
        heading('h1', 't-title', h1),
        h('p', { class: 'lead' }, sub),
        h('ul', { class: 'benefits' }, ...bullets.map((b) => h('li', {}, b))),
        cta(c),
        rating ? h('p', { class: 'rating-anchor' }, rating) : null,
        h('ul', { class: 'badges' }, ...badges.map((b) => h('li', {}, b))))));
}

// Full-bleed photo between sections. Not a content section.
export function photoBand(s) {
  return h('section', { class: 'section photo-band' }, h('div', { class: 'bleed' }, slot({ ...s, bleed: true })));
}

// Gallery: scroll-snap row of photo slots with captions. No JS.
export function gallery({ id = 'gallery', label, items }) {
  return h('section', { class: 'section gallery-section', 'aria-label': label },
    h('div', { class: 'container l-stack' },
      h('div', { class: 'stack-body' },
        h('div', { class: 'gallery', id },
          ...items.map((it, i) => h('figure', { class: 'gallery-item', id: `${id}-${i + 1}` }, it.media, h('figcaption', {}, it.caption)))),
        h('nav', { class: 'gallery-dots', 'aria-label': 'Slides' },
          ...items.map((_, i) => h('a', { href: `#${id}-${i + 1}`, 'aria-label': `Slide ${i + 1}` }, ''))))));
}

// Layout 3: stack. head then a grid of testimonials.
export function testimonials({ eyebrow: eb, heading: hd, items }) {
  return h('section', { class: 'section testimonials' },
    h('div', { class: 'container l-stack' },
      h('div', { class: 'stack-head' }, eb ? eyebrow(eb) : null, heading('h2', 't-head', hd)),
      h('div', { class: 'stack-body grid grid-3' },
        ...items.map((t) => h('blockquote', { class: 'testimonial', ...(t.placeholder ? { 'data-placeholder': t.placeholder } : {}) },
          h('p', { class: 'testimonial-quote' }, t.quote),
          h('footer', {}, h('cite', {}, t.who)))))));
}

// Layout 2: split. label + heading | prose. Optional photo above the prose.
export function prose({ eyebrow: eb, heading: hd, paragraphs, media = null }) {
  return h('section', { class: 'section prose-section' },
    h('div', { class: 'container l-split' },
      h('div', { class: 'split-head' }, eb ? eyebrow(eb) : null, heading('h2', 't-head', hd)),
      h('div', { class: 'split-body prose-body' },
        media,
        ...paragraphs.map((p) => h('p', { class: 'serif' }, p)))));
}

// Layout 3: stack. head, then four tiles. `key` marks the tile the section is about.
export function steps({ eyebrow: eb, heading: hd, items, after }) {
  return h('section', { class: 'section steps' },
    h('div', { class: 'container l-stack' },
      h('div', { class: 'stack-head' }, eb ? eyebrow(eb) : null, heading('h2', 't-head', hd)),
      h('ol', { class: 'stack-body grid grid-4' },
        ...items.map((s) => h('li', { class: `tile${s.key ? ' tile-key' : ''}` },
          heading('h3', 't-sub', s.name),
          s.key ? h('p', { class: 'label em' }, s.tag) : null,
          h('p', {}, s.line)))),
      after ? h('p', { class: 'serif section-after' }, after) : null));
}

// Layout 2: split. head + photo | numbered contents.
export function peek({ eyebrow: eb, heading: hd, media, items }) {
  return h('section', { class: 'section peek' },
    h('div', { class: 'container l-split' },
      h('div', { class: 'split-head' }, eb ? eyebrow(eb) : null, heading('h2', 't-head', hd), h('div', { class: 'peek-media' }, media)),
      h('ol', { class: 'split-body contents' },
        ...items.map((it) => h('li', {}, heading('h3', 't-sub', it.title), h('p', {}, it.line))))));
}

// Layout 3: stack. head, then the table.
export function comparison({ eyebrow: eb, heading: hd, columns, rows, highlight = columns.length - 1 }) {
  return h('section', { class: 'section comparison' },
    h('div', { class: 'container l-stack' },
      h('div', { class: 'stack-head' }, eb ? eyebrow(eb) : null, heading('h2', 't-head', hd)),
      h('div', { class: 'stack-body table-wrap' },
        h('table', { class: 'compare' },
          h('thead', {}, h('tr', {}, h('th', { scope: 'col' }, ''), ...columns.map((c, i) => h('th', { scope: 'col', class: i === highlight ? 'col-key' : '' }, c)))),
          h('tbody', {}, ...rows.map((r) => h('tr', {},
            h('th', { scope: 'row' }, r.label),
            ...r.cells.map((c, i) => h('td', { class: `${i === highlight ? 'col-key' : ''}${r.price && i === highlight ? ' price-cell' : ''}`.trim() }, c)))))))));
}

// Layout 2: split. head | accordion.
export function faq({ eyebrow: eb, heading: hd, items }) {
  return h('section', { class: 'section faq' },
    h('div', { class: 'container l-split' },
      h('div', { class: 'split-head' }, eb ? eyebrow(eb) : null, heading('h2', 't-head', hd)),
      h('div', { class: 'split-body faq-list' },
        ...items.map((q, i) => h('details', { class: 'faq-item', ...(i === 0 ? { open: true } : {}) },
          h('summary', {}, q.q),
          h('div', { class: 'faq-a' }, ...q.a.map((p) => h('p', {}, p))))))));
}

// Layout 4: band. copy | card, on green. The one green band on the page.
export function offer({ id = 'offer', eyebrow: eb, name, price, tagline, media, includes, cta: c, note }) {
  return h('section', { class: 'section band-green offer', id },
    h('div', { class: 'container l-band' },
      h('div', { class: 'offer-copy' },
        eb ? eyebrow(eb) : null,
        heading('h2', 't-head', name),
        h('p', { class: 'display t-price' }, price),
        h('p', { class: 'lead' }, tagline),
        media),
      h('div', { class: 'offer-card' },
        h('ul', { class: 'includes' }, ...includes.map((i) => h('li', {}, i))),
        cta(c),
        note ? h('p', { class: 'offer-note' }, note) : null)));
}

// Layout 3: stack, single block.
export function finalCta({ heading: hd, sub, cta: c, guarantee }) {
  return h('section', { class: 'section final-cta' },
    h('div', { class: 'container l-stack' },
      h('div', { class: 'final-copy' },
        heading('h2', 't-head', hd),
        sub ? h('p', { class: 'lead' }, sub) : null,
        cta(c),
        guarantee ? h('p', { class: 'guarantee' }, guarantee) : null)));
}

// ---------- document -----------------------------------------------------

export function document({ title, description, path, body, indexable = false, cssHash = 'dev' }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${indexable ? '' : '<meta name="robots" content="noindex, nofollow">\n'}<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="https://wolfchildren.co${esc(path)}">
<meta name="theme-color" content="#DFD7C3">
<link rel="preload" href="/assets/fonts/montserrat-900.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/ibm-plex-mono-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/site.css?v=${cssHash}">
</head>
<body>
${body}
</body>
</html>
`;
}

export { h, raw, join };
