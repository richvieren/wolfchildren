// render.mjs — assembles one page from its config. The config is the page:
// an ordered list of module ids with the copy variant each one uses, the ATF's
// A/B cell, and the skin. Nothing here knows what a module contains.
//
// Richard, 2026-10-06: "pages can be assembled and A/B-tested from parts."
import { readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  FONTS_V2, TOKENS_WC, BASE, PHOTO_CSS_V2, V2_SHARED, ATF_RESET, ATF_GUARD, PIXEL, DATASET,
} from '../../variants.mjs';
import { THEMES } from '../../variants2.mjs';
import * as grounds from './grounds.mjs';
import * as edges from './edges.mjs';
import { atfMarkup, ATF_JS, scopedAtfCss, atfDesktopCss } from '../lib/atf-section.mjs';
import { resolve as resolveAtf } from '../lib/atf-copy.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));

/** Every module on disk, by id. An id is permanent: a retired module keeps its
 *  file and simply stops being named in any config. */
export async function loadModules() {
  const out = {};
  for (const f of readdirSync(join(HERE, 'modules')).sort()) {
    if (!f.endsWith('.mjs')) continue;
    const m = await import(join(HERE, 'modules', f));
    const copy = await import(join(HERE, 'copy', f));
    if (out[m.id]) throw new Error(`duplicate module id: ${m.id}`);
    out[m.id] = { ...m, copy: copy.variants };
  }
  return out;
}

/** The page, as a string. */
/** The five layers, loaded by name: brand, skin, ground, module, copy. */
async function layers(config) {
  const brand = await import(`./brands/${config.brand}.mjs`);
  const names = new Set([config.skin, ...config.modules.map((m) => m.skin).filter(Boolean)]);
  const skins = {};
  for (const n of names) skins[n] = await import(`./skins/${n}.mjs`);
  return { brand, skins };
}

export async function render(config) {
  const mods = await loadModules();
  const { brand, skins } = await layers(config);
  const skin = skins[config.skin];
  if (!skin) throw new Error(`no such skin: ${config.skin}`);
  const theme = THEMES[config.atfMarkupFrom];   // the ATF's markup transform only

  // Grounds alternate by position, starting dark because the ATF above is light.
  // A photograph is neutral: it takes no ground and does not flip the alternation.
  // A config may override a module with ground: 'light' | 'dark'; two non-neutral
  // modules that end up sharing a ground side by side are named in a warning.
  let next = 'dark';
  let lastId = null;
  let lastGround = null;
  const groundOf = config.modules.map((m) => {
    const mod = mods[m.id];
    if (!mod) throw new Error(`${config.id}: no module with id ${m.id}`);
    if (mod.ground === 'neutral') return null;
    const ground = m.ground ?? next;
    if (ground !== 'light' && ground !== 'dark') throw new Error(`${config.id}: ${m.id} wants ground ${ground}`);
    if (ground === lastGround) {
      console.warn(`${config.id}: ${lastId} and ${m.id} are both on the ${ground} ground, side by side`);
    }
    next = ground === 'dark' ? 'light' : 'dark';
    lastId = m.id; lastGround = ground;
    return ground;
  });

  const body = config.modules.map((m, i) => {
    const mod = mods[m.id];
    const copy = mod.copy[m.copy ?? 'A'];
    if (!copy) throw new Error(`${config.id}: module ${m.id} has no copy variant ${m.copy}`);
    // edge and parallax are settings of the page, not code inside a module.
    if (m.edge && !['wave', 'wave-2'].includes(m.edge)) throw new Error(`${config.id}: ${m.id} wants edge ${m.edge}`);
    const cls = [groundOf[i] ? `wc-ground-${groundOf[i]}` : '', m.skin ? `wc-skin-${m.skin}` : '',
      m.edge ? `wc-edge-${m.edge}` : '', m.parallax ? 'wc-parallax' : '']
      .filter(Boolean).join(' ');
    const html = mod.markup(copy, { ...(m.settings ?? {}), ground: groundOf[i], className: cls });
    // the section's own tag carries the speed, so the shared script reads it there
    const withSpeed = m.parallax
      ? html.replace(/^<section([^>]*)>/, `<section$1 data-parallax="${m.parallax}">`)
      : html;
    // the wave is a layer of its own, put in by the page, never a mask on a module
    return m.edge
      ? withSpeed.replace(/^(<section[^>]*>)/, '$1\n  <div class="wc-wave" data-cover aria-hidden="true"></div>')
      : withSpeed;
  }).join('\n\n');

  // a module used twice brings its CSS once
  const moduleCss = [...new Set(config.modules.map((m) => mods[m.id].css))].filter(Boolean).join('');

  // each half of the edge layer ships only to a page that asks for it
  const edgeCss = (config.modules.some((m) => m.edge) ? edges.css : '')
    + (config.modules.some((m) => m.parallax) ? edges.motionCss : '');
  const edgeJs = (config.modules.some((m) => m.edge) ? edges.edgeScript : '')
    + (config.modules.some((m) => m.parallax) ? edges.script : '');
  const atf = resolveAtf(config.atf?.cell ?? 'control');
  const section = theme.atfV2 ? theme.atfV2(atfMarkup(atf)) : atfMarkup(atf);

  // The skin layer: the page's skin on :root, and one class per other skin a
  // module asks for, so a module can wear a different look in the same page.
  const skinCss = `:root{${skin.tokens}}`
    + Object.values(skins).filter((s2) => s2.id !== skin.id)
        .map((s2) => `.wc-skin-${s2.id}{${s2.tokens}}`).join('');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<meta name="wc-variant" content="${config.id}">
<title>${config.title} | Compass</title>
<script src="/assets/js/pixel.js?v=${PIXEL}"></script>
<script>window.WC_VARIANT=${JSON.stringify(config.id)};fbq('trackCustom','VariantView',{variant:window.WC_VARIANT});</script>
<style>${FONTS_V2}${TOKENS_WC}${BASE}${brand.css}${grounds.css}${edgeCss}${skinCss}${skin.css}${PHOTO_CSS_V2}${V2_SHARED}${ATF_RESET}${scopedAtfCss('#atf')}${ATF_GUARD}${atfDesktopCss('#atf')}${skin.atfCss}${moduleCss}</style>
</head>
<body data-variant="${config.id}">
<noscript><img hidden height="1" width="1" src="https://www.facebook.com/tr?id=${DATASET}&amp;ev=PageView&amp;noscript=1" alt=""></noscript>
<div id="atf">${section}</div>

${body}

${ATF_JS}${edgeJs ? `\n${edgeJs}` : ''}
</body>
</html>
`;
}
