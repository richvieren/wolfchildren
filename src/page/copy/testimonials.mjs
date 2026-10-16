// Copy for the testimonials module. The three reviews are the ones already on
// the page, read from variants2.mjs so a word is never changed in two places.
// They carry data-placeholder="review" wherever they appear.
import { WC_REVIEWS } from '../../../variants2.mjs';

export const variants = {
  A: {
    eyebrow: 'What parents say',
    heading: 'Real readings, real mornings',
    reviews: WC_REVIEWS.map((r) => ({ quote: r.q, name: r.by })),
  },
  // home page, 2026-10-16: lorem ipsum until Richard writes it
  L: {
    eyebrow: 'Lorem ipsum',
    heading: 'Lorem ipsum dolor sit amet',
    reviews: [
      { quote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', name: 'Lorem I.' },
      { quote: 'Sed do eiusmod tempor incididunt ut labore et dolore.', name: 'Ipsum D.' },
      { quote: 'Ut enim ad minim veniam, quis nostrud exercitation.', name: 'Dolor S.' },
    ],
  },
};
