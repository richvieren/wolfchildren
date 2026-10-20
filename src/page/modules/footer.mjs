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
.foot-note{margin:26px auto 0;max-width:68ch;font-size:12px;line-height:1.6;
  letter-spacing:.02em;color:var(--g-quiet)}
.foot-copy{margin:22px 0 0;font-size:12px;letter-spacing:.1em;color:var(--g-quiet)}
`;

export function markup(copy, settings = {}) {
  const g = settings.className ? ` ${settings.className}` : '';
  const links = copy.links.map((l) => `<a href="${l.href}">${l.label}</a>`)
    .join('<span class="foot-sep" aria-hidden="true">&middot;</span>');
  return `<footer class="wc-foot${g}"><div class="wrap">
  <img class="foot-mark" src="/assets/img/logo/wolfchildren-logo-cream-1600.webp" width="1600" height="696" alt="Wolf Children" loading="lazy" decoding="async">
  <nav class="foot-links">${links}</nav>
${copy.social ? `  <p class="foot-social" style="margin:22px 0 0;display:flex;gap:18px;justify-content:center">${copy.social.map((x) => `<a href="${x.href}" rel="noopener" aria-label="${x.label}" style="color:var(--g-text);display:inline-flex">${x.label === 'Substack' ? `<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true"><path d="M4 3h16v2.6H4zM4 7.6h16v2.6H4zM4 12.2h16V21l-8-4.5L4 21z"/></svg>` : `<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none"/></svg>`}</a>`).join('')}</p>
` : ''}${copy.disclaimer ? `  <p class="foot-note">${copy.disclaimer}</p>
` : ''}  <p class="foot-copy">${copy.copyright}</p>${copy.builtBy ? `
  <p class="foot-copy" style="margin-top:14px"><a href="https://vieren.studio" rel="noopener"><img src="/assets/img/built-by-vieren.png" alt="${copy.builtBy}" width="686" height="112" loading="lazy" style="display:inline-block;width:172px;height:auto;opacity:.75"></a></p>` : ''}
</div></footer>`;
}
