// footer — one module of the Compass page. Taken from the approved body in
// variants.mjs on 2026-10-06 and owned here from now on. Self-contained: it
// reads its own copy and its own settings and knows nothing about its
// neighbours or its position. The id is permanent and is never reused.
export const id = 'footer';

// 2026-10-08, Richard: full width, no side strips, and the three lines below.
// The skin's own footer rule gives it a 16px margin and a rounded, bordered
// shell; these rules take that off for this module only.
export const css = `
footer.wc-foot{margin:0;border:0;border-radius:0;box-shadow:none;text-align:center}
.foot-mark{display:block;margin:0 auto;height:28px;width:auto}
.foot-links{margin:22px 0 0;font-size:12.5px;letter-spacing:.1em;
  display:flex;flex-wrap:wrap;gap:8px 18px;justify-content:center}
.foot-links a{color:var(--g-text);text-decoration:none;border-bottom:1px solid var(--g-rule)}
.foot-links a:hover{color:var(--g-text);border-bottom-color:var(--g-text)}
.foot-sep{opacity:.5}
.foot-copy{margin:22px 0 0;font-size:12px;letter-spacing:.1em;color:var(--g-quiet)}
`;

export function markup(copy, settings = {}) {
  const g = settings.className ? ` ${settings.className}` : '';
  const links = copy.links.map((l) => `<a href="${l.href}">${l.label}</a>`)
    .join('<span class="foot-sep" aria-hidden="true">&middot;</span>');
  return `<footer class="wc-foot${g}"><div class="wrap">
  <img class="foot-mark" src="/assets/img/logo/wolfchildren-logo-cream-1600.webp" width="1600" height="696" alt="Wolf Children" loading="lazy" decoding="async">
  <nav class="foot-links">${links}</nav>
  <p class="foot-copy">${copy.copyright}</p>
</div></footer>`;
}
