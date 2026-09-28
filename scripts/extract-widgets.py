#!/usr/bin/env python3
"""extract-widgets.py — lift every block the Compass renders into the site build.

Richard, 2026-09-27: the landing page shows the product itself, not a picture of
it. Cato's page does this by re-running the portal's widget JavaScript in the
browser (shared/chart-demo/boot-live.js, "what the page shows is what ships").
Ours needs no JavaScript: a Compass renders server-side to plain HTML, so the
blocks are already finished markup and we copy them in.

2026-09-28: this used to export six hand-picked blocks. It now exports the whole
catalogue, so nothing is chosen inside this script. The page decides.

Following the hard rules in clients/Cato/cosmic-landing/shared/chart-demo/SOURCE.md:
  1. Never a real child. The source is the published sample for Nora, a child who
     does not exist: invented birth data, 2020-01-12 14:30 Ghent.
  2. A snapshot, not a runtime fetch. This writes a committed file. Re-run it
     deliberately when the reader changes, and record the source below.
  3. Nothing is edited on the way through. The markup is copied verbatim.

  python3 scripts/extract-widgets.py
"""
from bs4 import BeautifulSoup
import io, re, hashlib, datetime, sys

SRC = "readings/compass/sample/nora/index.html"
OUT = "src/lib/compass-widgets.mjs"

# Every block the sample renders, in document order.
# (id, css selector, nth match, human label, which part of the reading)
SPEC = [
    ("hero",             ".hero",          0, "Name, age and the headline placements", "Opening"),
    ("big3",             ".big3-grid",     0, "Sun, Moon and Rising",                  "Opening"),
    ("pill-ruler",       ".pill-wrap",     0, "Chart ruler",                           "Opening"),
    ("pill-leans",       ".pill-wrap",     1, "Leans towards",                         "Opening"),
    ("letter-who",       ".letter",        0, "Who they are",                          "Letter"),
    ("wheel",            ".wheel-wrap",    0, "The chart wheel",                       "Opening"),
    ("card-elements",    None,             0, "Elements",                              "01 The chart at a glance"),
    ("card-pace",        None,             0, "Pace",                                  "01 The chart at a glance"),
    ("card-three-lines", None,             0, "Three lines",                           "01 The chart at a glance"),
    ("card-energy",      None,             0, "Where the energy goes",                 "01 The chart at a glance"),
    ("letter-glance",    ".letter",        1, "At a glance",                           "Letter"),
    ("letter-settles",   ".letter",        2, "What settles them",                     "Letter"),
    ("card-holding",     ".card",          7, "Lets go / holds on, careful / bold, shared / their own", "02 Holding on and being seen"),
    ("card-being-seen",  ".card.vis",      0, "Being seen",                            "02 Holding on and being seen"),
    ("badge-explains",   ".card.badge",    0, "How they explain themselves",           "02 Holding on and being seen"),
    ("badge-group",      ".card.badge",    1, "In a group",                            "02 Holding on and being seen"),
    ("texts-holds",      ".grid2.texts",   0, "What they hold on to / how they take things in", "02 Holding on and being seen"),
    ("sub-label",        ".sub",           0, "Sub-section label",                     "02 Holding on and being seen"),
    ("cusp-2",           ".card.cusp",     0, "House 2, what they keep",               "02 Holding on and being seen"),
    ("cusp-6",           ".card.cusp",     1, "House 6, daily rhythm",                 "02 Holding on and being seen"),
    ("cusp-10",          ".card.cusp",     2, "House 10, what they are known for",     "02 Holding on and being seen"),
    ("card-retrogrades", None,             0, "Retrogrades",                           "03 Turned inward"),
    ("stellium",         ".stellium",      0, "A cluster",                             "03 Turned inward"),
    ("letter-question",  ".letter",        3, "A question to sit with",                "Closing"),
    ("sh",               ".sh",            0, "Section heading",                       "Structure"),
    ("divider",          ".divider",       0, "Divider rule",                          "Structure"),
    ("product-open",     ".card.product:not(.locked)", 0, "The next reading, offered", "04 Keep going"),
    ("product-locked",   ".card.product.locked",       0, "A reading not bought yet",  "04 Keep going"),
    ("photo",            ".photo",         0, "Photograph slot",                       "Structure"),
    ("disclaimer",       ".disclaimer",    0, "Disclaimer line",                       "Structure"),
]
# Cards identified by their own label rather than by position.
BY_LABEL = {"card-elements": "Elements", "card-pace": "Pace",
            "card-three-lines": "Three lines", "card-energy": "Where the energy goes",
            "card-retrogrades": "Retrogrades"}

SVG_CAMEL = ['viewBox', 'preserveAspectRatio', 'patternUnits', 'gradientUnits',
             'markerWidth', 'markerHeight', 'refX', 'refY', 'textLength',
             'clipPath', 'clipPathUnits', 'maskUnits', 'strokeWidth']

def fix_svg_case(markup):
    for a in SVG_CAMEL:
        markup = re.sub(r'\b' + a.lower() + r'=', a + '=', markup)
    return markup

# Everything is scoped under .wc-live, so nothing can leak into the host page and
# only the two rules that fight a host layout are dropped: the document root and
# the reading's own page column.
DROP = {'html', '.wrap'}

def scope_css(css, ns):
    faces = [m.group(0) for m in re.finditer(r'@font-face\s*\{[^}]*\}', css)
             if 'Wheel Glyphs' in m.group(0)]
    css = re.sub(r'@font-face\s*\{[^}]*\}', '', css)
    css = re.sub(r'@page\s*\{[^}]*\}', '', css)
    out = []
    for m in re.finditer(r'([^{}]+)\{([^}]*)\}', css):
        sel, body = m.group(1).strip(), m.group(2).strip()
        if not sel or not body:
            continue
        sel = sel.split('\n')[-1].strip()
        keep = []
        for p in [p.strip() for p in sel.split(',') if p.strip()]:
            if p == ':root':
                keep.append(ns)
            elif p in DROP:
                continue
            else:
                keep.append(f'{ns} {p}')
        if keep:
            out.append(', '.join(keep) + '{' + body + '}')
    return '\n'.join(faces + out)

GEN = re.compile(r'\b(she|her|hers|he|him|his|Nora|Finn|a girl|a boy)\b', re.I)

def main():
    html = io.open(SRC, encoding='utf-8').read()
    s = BeautifulSoup(html, 'lxml')
    css = re.search(r'<style[^>]*>(.*?)</style>', html, re.S).group(1)

    found, missing = [], []
    for wid, sel, idx, label, section in SPEC:
        el = None
        if wid in BY_LABEL:
            for l in s.select('.wlabel'):
                if l.get_text(strip=True) == BY_LABEL[wid]:
                    el = l.parent
                    break
        else:
            hits = s.select(sel)
            el = hits[idx] if len(hits) > idx else None
        if el is None:
            missing.append(wid)
            continue
        txt = el.get_text(' ', strip=True)
        found.append((wid, label, section,
                      sorted(set(m.group(0).lower() for m in GEN.finditer(txt))),
                      fix_svg_case(str(el))))

    if missing:
        sys.exit(f"MISSING: {', '.join(missing)} — refusing to write a partial catalogue")

    scoped = scope_css(css, '.wc-live')
    digest = hashlib.md5(html.encode()).hexdigest()[:8]

    with io.open(OUT, 'w', encoding='utf-8') as f:
        f.write(f"""// compass-widgets.mjs — GENERATED. Do not hand-edit.
//
// Every block the Compass renders, copied verbatim from the published sample so
// a landing page can show the product rather than a picture of it.
//   python3 scripts/extract-widgets.py
//
// Source:  {SRC}
// Child:   Nora — invented, 2020-01-12 14:30 Ghent. No real child is rendered.
// Source page md5: {digest}
// Extracted: {datetime.date.today().isoformat()}   Blocks: {len(found)}
//
// `gendered` lists the gendered words each block contains. The reader has only
// "she" and "he" pronoun sets (reader/prompt.py PRONOUNS), so a neutral sample
// cannot be rendered without a change there. Nothing here is edited to hide it.

export const WIDGET_CSS = {scoped!r};

/** Every block, in the order the reading renders them. */
export const WIDGETS = {{
""")
        for wid, label, section, gendered, markup in found:
            f.write(f"  {wid!r}: {{ label: {label!r}, section: {section!r}, "
                    f"gendered: {gendered!r}, html: {markup!r} }},\n")
        f.write("};\n")
    print(f"wrote {OUT}")
    print(f"  {len(found)} blocks")
    ng = [w for w, _, _, g, _ in found if not g]
    print(f"  gender-free: {len(ng)} ({', '.join(ng)})")
    print(f"  scoped css: {len(scoped)} bytes")

main()
