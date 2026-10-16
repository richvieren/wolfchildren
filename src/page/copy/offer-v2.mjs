// Copy for the offer-v2 module. A is Richard's, 2026-10-07, verbatim. The
// included lines, the button label and the FAQ are the same
// words offer-card carries, read from its copy file rather than retyped.
import { variants as card } from './offer-card.mjs';

export const variants = {
  A: {
    title: 'Compass',
    rating: '4.8/5 Based on dozens of users',
    line: 'One page per child &middot; Ready in minutes &middot; Yours to keep',
    includes: card.A.includes,
    cta: card.A.cta,
    secure: 'Secure checkout with Stripe.',
    faq: card.A.faq,
  },
  // home page, 2026-10-16: lorem ipsum until Richard writes it
  L: {
    title: 'Lorem',
    rating: 'Lorem ipsum dolor sit amet',
    line: 'Lorem ipsum &middot; Dolor sit amet &middot; Consectetur',
    includes: ['Lorem ipsum dolor sit amet', 'Consectetur adipiscing elit', 'Sed do eiusmod tempor incididunt'],
    cta: 'Lorem ipsum',
    secure: 'Lorem ipsum dolor sit amet.',
    faq: [
      ['Lorem ipsum dolor sit amet?', 'Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.'],
      ['Ut enim ad minim veniam?', 'Quis nostrud exercitation ullamco laboris nisi ut aliquip.'],
      ['Duis aute irure dolor?', 'In reprehenderit in voluptate velit esse cillum dolore.'],
    ],
  },
};
