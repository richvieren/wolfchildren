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
};
