#!/usr/bin/env python3
"""extract-widgets.py — lift the real Compass widget markup into the site build.

Richard, 2026-09-27: the landing page shows the product itself, not a picture of
it. Cato's page does this by re-running the portal's widget JavaScript in the
browser (shared/chart-demo/boot-live.js, "what the page shows is what ships").
Ours needs no JavaScript at all: a Compass renders server-side to plain HTML plus
one stylesheet, so the widgets are already finished markup and we copy them in.

Following the hard rules in clients/Cato/cosmic-landing/shared/chart-demo/SOURCE.md:
  1. Never a real child. The source is the published sample for Nora, a child who
     does not exist: invented birth data, 2020-01-12 14:30 Ghent.
  2. A snapshot, not a runtime fetch. This writes a committed file. Re-run it
     deliberately when the reader changes, and record the source below.
  3. Nothing is edited on the way through. The markup is copied verbatim.

  python3 scripts/extract-widgets.py
"""
from bs4 import BeautifulSoup
import io, re, hashlib, datetime, sys, os

SRC = "readings/compass/sample/nora/index.html"
OUT = "src/lib/compass-widgets.mjs"

# The six blocks, in the order the six approved reasons name them.
BLOCKS = [
    ("big3",    lambda s: s.select_one('.big3-grid'),                     "Sun, Moon and Rising"),
    ("spectra", lambda s: card(s, 'Three lines'),                          "Three lines"),
    ("energy",  lambda s: card(s, 'Where the energy goes'),                "Where the energy goes"),
    ("seen",    lambda s: card(s, 'Being seen'),                           "Being seen"),
    ("wheel",   lambda s: s.select_one('.wheel-wrap'),                     "The chart wheel"),
    ("question",lambda s: letter(s, 'A question to sit with'),             "A question to sit with"),
]

def card(s, label):
    for l in s.select('.wlabel'):
        if l.get_text(strip=True) == label:
            return l.parent
    return None

def letter(s, label):
    for l in s.select('.letter'):
        lab = l.select_one('.letter-label')
        if lab and lab.get_text(strip=True) == label:
            return l
    return None

# Page chrome we do not want following the widgets onto a landing page.
DROP = {'html', '.wrap', 'h1', '.hero', '.photo', '.disclaimer', '.product',
        '.product-price', '.cta', '.fine', '.section', '.sh', '.grid2', '.grid2.texts'}

def scope_css(css, ns):
    """Prefix every rule with the namespace so nothing leaks into the host page."""
    css = re.sub(r'@font-face\s*\{[^}]*\}', '', css)      # the site already serves these faces
    css = re.sub(r'@page\s*\{[^}]*\}', '', css)
    out = []
    for m in re.finditer(r'([^{}]+)\{([^}]*)\}', css):
        sel, body = m.group(1).strip(), m.group(2).strip()
        if not sel or not body:
            continue
        sel = sel.split('\n')[-1].strip()
        parts = [p.strip() for p in sel.split(',') if p.strip()]
        keep = []
        for p in parts:
            if p == ':root':
                keep.append(ns)            # the custom properties live on the namespace
            elif p in DROP:
                continue
            else:
                keep.append(f'{ns} {p}')
        if keep:
            out.append(', '.join(keep) + '{' + body + '}')
    return '\n'.join(out)

def main():
    html = io.open(SRC, encoding='utf-8').read()
    s = BeautifulSoup(html, 'lxml')
    css = re.search(r'<style[^>]*>(.*?)</style>', html, re.S).group(1)

    blocks = {}
    for key, fn, label in BLOCKS:
        el = fn(s)
        if el is None:
            sys.exit(f"MISSING BLOCK: {key} ({label}) — refusing to write a partial file")
        blocks[key] = (str(el), label)

    scoped = scope_css(css, '.wc-live')
    digest = hashlib.md5(html.encode()).hexdigest()[:8]

    with io.open(OUT, 'w', encoding='utf-8') as f:
        f.write(f"""// compass-widgets.mjs — GENERATED. Do not hand-edit.
//
// The real Compass widgets, copied verbatim from the published sample so the
// landing page shows the product rather than a picture of it. Regenerate with
//   python3 scripts/extract-widgets.py
//
// Source:  {SRC}
// Child:   Nora — invented, 2020-01-12 14:30 Ghent. No real child is rendered.
// Source page md5: {digest}
// Extracted: {datetime.date.today().isoformat()}
//
// KNOWN AND UNRESOLVED: the sample is written to a girl, so this markup says
// "she" and "her" and names Nora. The reader has only "she" and "he" pronoun
// sets (reader/prompt.py PRONOUNS), so a neutral sample cannot be rendered
// without a change there. Nothing here is edited to hide that.

export const WIDGET_CSS = {scoped!r};

export const WIDGETS = {{
""")
        for key, (markup, label) in blocks.items():
            f.write(f"  {key}: {{ label: {label!r}, html: {markup!r} }},\n")
        f.write("};\n")
    print(f"wrote {OUT}")
    print(f"  blocks: {', '.join(k for k,_,_ in BLOCKS)}")
    print(f"  scoped css: {len(scoped)} bytes (from {len(css)})")

main()
