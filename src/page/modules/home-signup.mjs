// home-signup — the free moon-calendar signup that was on the homepage already,
// with the Built by Vieren mark under it. Same Loops form, same assets/js/signup.js
// (it finds the form by its data- attributes). Gate: docs/loops-signup-form.md.
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { LOOPS, COPY } from '../../lib/signup.mjs';

export const id = 'home-signup';

const JS = `/assets/js/signup.js?v=${createHash('md5').update(readFileSync(new URL('../../../assets/js/signup.js', import.meta.url))).digest('hex').slice(0, 8)}`;

export const css = `
.home-signup .wrap{display:flex;flex-direction:column;gap:var(--s-space-block);align-items:stretch}
.hsg-media{margin:0;width:100%;max-width:520px}
.hsg-media img{display:block;width:100%;height:auto}
.hsg-form{flex:0 1 46ch}
.hsg-eyebrow{font-family:var(--b-body);font-size:12px;letter-spacing:.09em;text-transform:uppercase;color:var(--g-quiet);margin:0 0 12px}
.hsg-h{font-family:var(--b-display);font-weight:400;font-size:clamp(2rem,3.4vw,2.8rem);line-height:1.04;letter-spacing:-.035em;margin:0 0 12px}
.hsg-sub{font-family:var(--b-body);font-size:var(--s-type-body);line-height:var(--s-type-body-lh);max-width:46ch;margin:0 0 var(--s-space-block)}
.hsg-form form{display:flex;flex-direction:column;align-items:flex-start;gap:12px;max-width:46ch}
.hsg-form label{font-family:var(--b-body);font-size:11.5px;letter-spacing:.09em;text-transform:uppercase}
.hsg-form input[type=email]{width:100%;box-sizing:border-box;font:inherit;font-family:var(--b-body);color:var(--b-green);
  background:var(--b-paper);border:1px solid var(--b-tan);border-radius:3px;padding:12px 14px}
.hsg-form input[type=email]:focus{outline:2px solid var(--b-green);outline-offset:2px}
.hsg-form button.wc-cta{cursor:pointer}
.hsg-status,.hsg-ok{font-family:var(--b-body);font-size:var(--s-type-body);max-width:46ch;margin:12px 0 0}
.hsg-built{margin:calc(var(--s-space-section) * 1.1) 0 0;text-align:center}
.hsg-built img{display:inline-block;width:172px;height:auto;opacity:.75}
.hsg-built a:hover img{opacity:1}
@media (min-width:900px){
  .home-signup .wrap{flex-direction:row;align-items:center;justify-content:space-between;gap:calc(var(--s-space-block) * 1.5)}
  .hsg-media{flex:0 1 520px}
}
`;

export function markup(copy, settings = {}) {
  const g = settings.className ? ` ${settings.className}` : '';
  return `<section class="s home-signup${g}"><div class="wrap">
  <figure class="hsg-media"><img src="/assets/img/home-calendar-cutout.webp" alt="${copy.alt}" width="1400" height="1292" loading="lazy" decoding="async"></figure>
  <div class="hsg-form" id="signup">
    <p class="hsg-eyebrow">${copy.eyebrow}</p>
    <h2 class="hsg-h">${copy.heading}</h2>
    <p class="hsg-sub">${copy.sub}</p>
    <form method="POST" action="${LOOPS.endpoint}" data-signup="">
      <input type="hidden" name="userGroup" value="${LOOPS.userGroup}">
      <input type="hidden" name="source" value="${LOOPS.source}">
      <label for="signup-email">Email address</label>
      <input type="email" id="signup-email" name="email" autocomplete="email" inputmode="email" required>
      <button type="submit" class="wc-cta">${COPY.button}</button>
    </form>
    <p class="hsg-status" data-signup-status="" aria-live="polite"></p>
    <p class="hsg-ok" data-signup-success="" hidden>${COPY.success}</p>
  </div>
</div>
<p class="hsg-built"><a href="https://vieren.studio" rel="noopener"><img src="/assets/img/built-by-vieren.png" alt="Built by Vieren" width="686" height="112" loading="lazy"></a></p>
<script src="${JS}" defer></script></section>`;
}
