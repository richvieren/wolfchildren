// components.mjs — the page-building modules for wolfchildren.co.
//
// Every export is a pure function: content in, HTML string out. A page is a
// file in src/pages/ that imports these and lists them in order. A new page
// type (listicle, this-vs-that, long-form) is a new page file that assembles
// the same components, never a copy of another page.
//
// Placeholders: anything that must not ship (an image we do not have, a
// testimonial nobody has given, a number Richard has not confirmed) is
// rendered by placeholder() or ph(), which stamp data-placeholder on the
// element. tests/build.test.js refuses any page that is indexable and still
// carries one. Styling for both lives in assets/css/site.css under
// .placeholder / .ph so they are impossible to miss on screen.

import { h, raw, join, esc } from './lib/html.mjs';

// ---------- primitives --------------------------------------------------

export function placeholder({ what, ratio = '4 / 3', size = '' }) {
  return h('div', { class: `placeholder ${size}`.trim(), style: `aspect-ratio:${ratio}`, 'data-placeholder': what },
    h('span', { class: 'placeholder-label' }, 'PLACEHOLDER'),
    h('span', { class: 'placeholder-what' }, what));
}

// Inline placeholder for a fact Richard has not confirmed (a delivery time,
// a page count, the guarantee terms). Renders visibly bracketed.
export function ph(what) {
  return h('mark', { class: 'ph', 'data-placeholder': what }, `[${what}]`);
}

export function eyebrow(text) {
  return h('p', { class: 'eyebrow' }, text);
}

// The one CTA. Repeated, never varied in label within a page.
export function cta({ label, href, subtext = null, placeholderWhat = null, size = '' }) {
  const a = h('a', {
    class: `btn btn-primary ${size}`.trim(),
    href,
    ...(placeholderWhat ? { 'data-placeholder': placeholderWhat, 'data-checkout': 'lunar-portrait' } : {}),
  }, label);
  return h('div', { class: 'cta' }, a, subtext ? h('p', { class: 'cta-subtext' }, subtext) : null);
}

export function logo({ href = '/', label = 'Wolf Children', variant = 'green', width = 160 }) {
  return h('a', { class: `logo logo-${variant}`, href, 'aria-label': label, style: `width:${width}px` },
    h('span', { class: 'logo-mark', role: 'img', 'aria-hidden': 'true' }));
}

// ---------- page furniture -----------------------------------------------

export function banner(text) {
  return h('div', { class: 'banner', role: 'note' }, h('div', { class: 'container' }, h('p', {}, text)));
}

// Minimal header: logo and the one CTA. No nav by design.
export function header({ ctaLabel, ctaHref }) {
  return h('header', { class: 'site-header' },
    h('div', { class: 'container site-header-row' },
      logo({ width: 150 }),
      h('a', { class: 'btn btn-primary btn-sm', href: ctaHref }, ctaLabel)));
}

export function footer({ legal = [], contact }) {
  return h('footer', { class: 'site-footer' },
    h('div', { class: 'container' },
      h('div', { class: 'footer-row' },
        logo({ width: 180 }),
        h('ul', { class: 'footer-links' },
          ...legal.map((l) => h('li', {},
            h('a', { href: l.href, ...(l.placeholder ? { 'data-placeholder': l.placeholder } : {}) }, l.label))),
          h('li', {}, h('a', { href: `mailto:${contact}` }, contact)))),
      h('p', { class: 'footer-fine' }, `© ${new Date().getFullYear()} Wolf Children. Readings are written for parents and describe how a child is wired; they do not predict events.`)));
}

// ---------- sections ------------------------------------------------------

export function hero({ eyebrow: eb, h1, sub, bullets, cta: c, badges, rating, mockup }) {
  return h('section', { class: 'hero', id: 'top' },
    h('div', { class: 'container hero-grid' },
      h('div', { class: 'hero-media' }, mockup),
      h('div', { class: 'hero-copy' },
        eb ? eyebrow(eb) : null,
        h('h1', { class: 'display display-xl' }, h1),
        h('p', { class: 'lead' }, sub),
        h('ul', { class: 'benefits' }, ...bullets.map((b) => h('li', {}, b))),
        cta(c),
        rating ? h('div', { class: 'rating-anchor' }, rating) : null,
        h('ul', { class: 'badges' }, ...badges.map((b) => h('li', {}, b))))));
}

// Scroll-snap carousel. No JavaScript: it scrolls, snaps, and the dots are
// anchors. Each item is { media, caption }.
export function carousel({ id = 'carousel', items }) {
  return h('section', { class: 'carousel-section', 'aria-label': 'Product images' },
    h('div', { class: 'container' },
      h('div', { class: 'carousel', id },
        ...items.map((it, i) => h('figure', { class: 'carousel-item', id: `${id}-${i + 1}` },
          it.media,
          h('figcaption', {}, it.caption)))),
      h('nav', { class: 'carousel-dots', 'aria-label': 'Slides' },
        ...items.map((_, i) => h('a', { href: `#${id}-${i + 1}`, 'aria-label': `Slide ${i + 1}` }, '')))));
}

export function testimonials({ eyebrow: eb, heading, items }) {
  return h('section', { class: 'section testimonials' },
    h('div', { class: 'container' },
      h('div', { class: 'section-head' }, eb ? eyebrow(eb) : null, h('h2', { class: 'display display-lg' }, heading)),
      h('div', { class: 'grid grid-3' },
        ...items.map((t) => h('blockquote', { class: 'testimonial', ...(t.placeholder ? { 'data-placeholder': t.placeholder } : {}) },
          h('p', { class: 'testimonial-quote' }, t.quote),
          h('footer', {}, h('cite', {}, t.who)))))));
}

// Label + heading + prose, with the heading and prose side by side on
// desktop (the rhythm from the reference: label/heading left, text right).
export function prose({ eyebrow: eb, heading, paragraphs, band = '' }) {
  return h('section', { class: `section prose-section ${band}`.trim() },
    h('div', { class: 'container split' },
      h('div', { class: 'split-head' }, eb ? eyebrow(eb) : null, h('h2', { class: 'display display-lg' }, heading)),
      h('div', { class: 'split-body' }, ...paragraphs.map((p) => h('p', { class: 'body-serif' }, p)))));
}

// Four tiles, one line each. `key: true` marks the tile the section is about.
export function steps({ eyebrow: eb, heading, items, after }) {
  return h('section', { class: 'section steps' },
    h('div', { class: 'container' },
      h('div', { class: 'section-head' }, eb ? eyebrow(eb) : null, h('h2', { class: 'display display-lg' }, heading)),
      h('ol', { class: 'grid grid-4 tiles' },
        ...items.map((s) => h('li', { class: `tile ${s.key ? 'tile-key' : ''}`.trim() },
          h('h3', { class: 'display display-sm' }, s.name),
          s.key ? h('p', { class: 'tile-tag' }, s.tag) : null,
          h('p', {}, s.line)))),
      after ? h('p', { class: 'body-serif section-after' }, after) : null));
}

export function peek({ eyebrow: eb, heading, media, items }) {
  return h('section', { class: 'section peek' },
    h('div', { class: 'container split' },
      h('div', { class: 'split-head' },
        eb ? eyebrow(eb) : null,
        h('h2', { class: 'display display-lg' }, heading),
        h('div', { class: 'peek-media' }, media)),
      h('ol', { class: 'split-body contents' },
        ...items.map((it) => h('li', {},
          h('h3', { class: 'display display-sm' }, it.title),
          h('p', {}, it.line))))));
}

export function comparison({ eyebrow: eb, heading, columns, rows, highlight = columns.length - 1 }) {
  return h('section', { class: 'section comparison' },
    h('div', { class: 'container' },
      h('div', { class: 'section-head' }, eb ? eyebrow(eb) : null, h('h2', { class: 'display display-lg' }, heading)),
      h('div', { class: 'table-wrap' },
        h('table', { class: 'compare' },
          h('thead', {}, h('tr', {},
            h('th', { scope: 'col' }, ''),
            ...columns.map((c, i) => h('th', { scope: 'col', class: i === highlight ? 'col-key' : '' }, c)))),
          h('tbody', {}, ...rows.map((r) => h('tr', {},
            h('th', { scope: 'row' }, r.label),
            ...r.cells.map((c, i) => h('td', { class: i === highlight ? 'col-key' : '' }, c)))))))));
}

export function faq({ eyebrow: eb, heading, items }) {
  return h('section', { class: 'section faq' },
    h('div', { class: 'container split' },
      h('div', { class: 'split-head' }, eb ? eyebrow(eb) : null, h('h2', { class: 'display display-lg' }, heading)),
      h('div', { class: 'split-body' },
        ...items.map((q, i) => h('details', { class: 'faq-item', ...(i === 0 ? { open: true } : {}) },
          h('summary', {}, q.q),
          h('div', { class: 'faq-a' }, ...q.a.map((p) => h('p', {}, p))))))));
}

// The one green band on the page.
export function offer({ id = 'offer', eyebrow: eb, name, price, tagline, includes, cta: c, note }) {
  return h('section', { class: 'section band-green offer', id },
    h('div', { class: 'container offer-grid' },
      h('div', {},
        eb ? eyebrow(eb) : null,
        h('h2', { class: 'display display-xl' }, name),
        h('p', { class: 'offer-price display' }, price),
        h('p', { class: 'lead' }, tagline)),
      h('div', { class: 'offer-card' },
        h('ul', { class: 'includes' }, ...includes.map((i) => h('li', {}, i))),
        cta(c),
        note ? h('p', { class: 'offer-note' }, note) : null)));
}

export function finalCta({ heading, sub, cta: c, guarantee }) {
  return h('section', { class: 'section final-cta' },
    h('div', { class: 'container narrow center' },
      h('h2', { class: 'display display-lg' }, heading),
      sub ? h('p', { class: 'lead' }, sub) : null,
      cta(c),
      guarantee ? h('p', { class: 'guarantee' }, guarantee) : null));
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
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@900&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=IBM+Plex+Mono:wght@300;400;700&display=swap">
<link rel="stylesheet" href="/assets/css/site.css?v=${cssHash}">
</head>
<body>
${body}
</body>
</html>
`;
}

export { h, raw, join };
