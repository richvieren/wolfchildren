// signup.mjs — the moon-calendar signup form for the homepage (Richard,
// 2026-09-13; facts in docs/loops-signup-form.md). Not the Loops embed: that
// carries a Google Fonts import, and the site self-hosts every font. The form
// posts to Loops from assets/js/signup.js and shows Richard's two messages.
//
// GATE: the transactional email and the calendar PDF do not exist yet. The
// homepage must not render this until docs/loops-signup-form.md says both are
// live, or a signup collects an address and delivers nothing.

import { h } from './html.mjs';

export const LOOPS = {
  endpoint: 'https://app.loops.so/api/newsletter-form/cmtvjqaud00wt0jyxzp5aaehs',
  formId: 'cmtvjqaud00wt0jyxzp5aaehs',
  userGroup: 'moon-calendar-en',
  source: 'wolfchildren.co homepage',
};

export const COPY = {
  button: 'Send me the calendar',
  success: 'Check your inbox. The calendar is on its way.',
  tooMany: 'Too many signups from here just now. Try again in a few minutes.',
  failed: 'That did not go through. Check the address and try again.',
};

export function signup({ eyebrow: eb = null, heading: hd, sub = null } = {}) {
  return h('section', { class: 'signup', id: 'signup' },
    eb ? h('p', { class: 'eyebrow' }, eb) : null,
    hd ? h('h2', {}, hd) : null,
    sub ? h('p', { class: 'signup-sub' }, sub) : null,
    h('form', { class: 'signup-form', method: 'POST', action: LOOPS.endpoint, 'data-signup': '' },
      h('input', { type: 'hidden', name: 'userGroup', value: LOOPS.userGroup }),
      h('input', { type: 'hidden', name: 'source', value: LOOPS.source }),
      h('label', { for: 'signup-email' }, 'Email address'),
      h('input', { type: 'email', id: 'signup-email', name: 'email', autocomplete: 'email', inputmode: 'email', required: true }),
      h('button', { type: 'submit', class: 'btn' }, COPY.button)),
    h('p', { class: 'signup-status', 'data-signup-status': '', 'aria-live': 'polite' }),
    h('p', { class: 'signup-success', 'data-signup-success': '', hidden: true }, COPY.success));
}
