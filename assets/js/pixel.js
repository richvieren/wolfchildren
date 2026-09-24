// pixel.js — Meta pixel, dataset 1622703732974632 (Richard, 2026-09-24).
//
// One copy for the whole site. The built pages get it from src/components.mjs::document();
// the four hand-written portal pages carry the same tag. Never paste the snippet into a page
// again: a page that is missed cannot be seen missing, and tests/pixel.test.js fails if one is.
//
// The browser half only. The Conversions API half fires from the API webhook and is not built
// yet: it waits on the access token (LAUNCH.md phase 10).
!function (f, b, e, v, n, t, s) {
  if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments) };
  if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
  n.queue = []; t = b.createElement(e); t.async = !0;
  t.src = v; s = b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t, s)
}(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

fbq('init', '1622703732974632');
fbq('track', 'PageView');
