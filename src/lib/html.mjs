// html.mjs — the two primitives every component is built from.
//
// esc()  escapes text for HTML. Every string that came from content goes
//        through it. Components never interpolate raw content.
// raw()  marks a string as already-HTML so a component can nest another
//        component's output without double-escaping.
// h()    a tiny tag builder: h('p', {class: 'lead'}, 'text') → '<p class="lead">text</p>'.
//        Children that are Raw are inserted as-is; everything else is escaped.

export class Raw {
  constructor(s) { this.s = s; }
  toString() { return this.s; }
}

export const raw = (s) => new Raw(String(s));

export function esc(v) {
  return String(v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const VOID = new Set(['img', 'br', 'hr', 'meta', 'link', 'input', 'source']);

function attrs(a = {}) {
  return Object.entries(a)
    .filter(([, v]) => v !== false && v !== null && v !== undefined)
    .map(([k, v]) => (v === true ? ` ${k}` : ` ${k}="${esc(v)}"`))
    .join('');
}

export function h(tag, a = {}, ...children) {
  const open = `<${tag}${attrs(a)}>`;
  if (VOID.has(tag)) return raw(open);
  const inner = children.flat(Infinity)
    .filter((c) => c !== null && c !== undefined && c !== false)
    .map((c) => (c instanceof Raw ? c.s : esc(c)))
    .join('');
  return raw(`${open}${inner}</${tag}>`);
}

export const join = (parts) => raw(parts.map(String).join('\n'));
