// compass-copy.mjs — the approved Compass copy, one source for every variant.
//
// 2026-09-24: replaced with the copywriter's blueprint, after the anti-slop audit and Richard's
// four named fixes (negation-affirmation headline, brand voice, method lines, guarantee claim),
// and after his later rule that no money-back framing appears anywhere.
//
// PROVENANCE RULE. Where the blueprint gives words for a slot, the blueprint's words are used
// verbatim. Where the blueprint gives nothing, the previously approved copy stays and is marked
// KEPT. Nothing here is invented to fill a gap, and nothing approved is deleted to make room.
// If a skill cannot fit the copy, the variant says so. Copy is never reworded to suit a layout.

export const C = {
  // KEPT. The blueprint has no announce bar.
  announce: 'A whole Compass is free to read before you buy one.',

  // Blueprint section 1, above the fold.
  hero: {
    eyebrow: 'Compass · one child · one page · $27',                    // KEPT, a label not copy
    h1: 'Stop Guessing What Your Child Needs Right Now.',
    sub: 'A plain, warm, 24-section guide to your child’s natural temperament, without personality labels, developmental assessments, predictions, or parenting advice.',
    cta: 'Get Your Child’s Compass Reading, $27',
    ctaSub: 'Birth date, time and place. Ready in minutes, in your private web portal.',
  },
  support: {
    // Blueprint section 1, the three core benefit bullets.
    bullets: ['What settles them: how to help them return to calm when overwhelmed.',
      'How they take things in: their natural sensory and learning pace.',
      'Energy and pressure: where their energy goes, and how they meet stress.'],
    // KEPT. Trust badges are factual and the blueprint does not carry them. The third is a
    // spec section 10 statement and may not be dropped.
    badges: ['Secure checkout by Stripe', 'It needs their birth time',
      'Your child’s name, date and place never leave our own server'],
  },

  // Blueprint section 2, recognition. NEW MODULE: the variant skeleton had no slot for this.
  recognition: {
    h2: 'Guessing Is Not The Same As Failing.',
    body: ['Every parent hits a season where the old routines stop working. You try a new approach, guess at what’s wrong, and lie awake replaying the same conflict.',
      'You don’t need a 300-page manual, a rigid 10-step routine to start on Monday, or a diagnostic score. Direction on the specific decision you’re sitting with right now is enough.',
      'Compass is about understanding who they already are underneath the noise.'],
  },

  // KEPT. The blueprint's free-sample callout sits inside its ordering section; this module is
  // richer and already approved, so it stands.
  sample: {
    h2: 'Read one before you buy one.',
    body: 'Two complete Compass pages, start to finish, for children who do not exist. One for a boy and one for a girl. Nothing is held back and nothing is blurred.',
    links: [['Read the one written for a girl', '/readings/compass/sample/nora/'],
      ['Read the one written for a boy', '/readings/compass/sample/finn/']],
  },

  // KEPT. The blueprint has no stat band.
  stats: {
    h2: 'What one page holds.',
    items: [['24', 'sections', 'Every one about your child, in the order you scroll.'],
      ['3', 'facts in', 'The date, the time and the place, and nothing else is asked of you.'],
      ['$27', 'once', 'No subscription, and no second page to buy before this one makes sense.']],
  },

  // Blueprint section 3. Heading and all six items are the blueprint's.
  reasons: {
    eyebrow: 'What is on it',                                           // KEPT, a label
    h2: 'One Page. 24 Clear Insights Into Your Child’s World.',
    items: [
      ['What Settles Them', 'Learn what restores their calm when emotions run high.'],
      ['How They Take Things In', 'See how their mind processes information and environments.'],
      ['Where Their Energy Goes', 'What naturally drives them, against what drains them.'],
      ['Under Pressure', 'Understand their default reaction to stress and expectations.'],
      ['The Chart Wheel', 'A visual breakdown of their exact astronomical placements.'],
      ['The Closing Question', 'A reflective question written for you, the parent.'],
    ],
  },

  // KEPT. The blueprint has no outcomes module.
  outcomes: {
    h2: 'The guessing stops being the whole job.',
    items: ['A name for the thing that keeps happening, which is most of the relief',
      'A reason to stop trying the approach that has never once worked',
      'Something to hand the other adult in the house, so you are arguing about less',
      'One page you will read again in a year and find true'],
  },

  // Blueprint section 4, the anti-guarantee. NEW MODULE: the variant skeleton had no slot for
  // the refusal, which Richard calls the centre of the page.
  refusal: {
    h2: 'What Compass Will Never Do To Your Child.',
    items: [
      ['NO Labels or Scores', 'No percentiles, no types, and no words your child has to carry.'],
      ['NO Predictions', 'Nothing about hard years, future careers, or who they will become.'],
      ['NO Medical Diagnoses', 'No developmental assessments or clinical judgments.'],
      ['NO Parenting Plans', 'No forced routines, rules, or homework for you.'],
    ],
  },

  offer: {
    eyebrow: 'The offer',                                               // KEPT, a label
    h2: 'Compass',                                                      // KEPT
    price: '$27',
    tagline: 'One child, one page, yours to keep.',                     // KEPT
    // Blueprint section 5, the three ordering steps.
    how: [['Enter Birth Details', 'Your child’s birth date, exact birth time, and birth location.'],
      ['Ready In Minutes', 'The reading is there when you finish entering the details.'],
      ['Access Anywhere', 'Read it on your phone or computer, in a private portal.']],
    // KEPT. The blueprint's offer box lists two lines; these four are approved and the third is
    // a spec section 10 statement, so none is dropped to match a shorter summary.
    includes: ['The full page for one child, on your phone or printed',
      'A page of questions, so you can keep reading it with Claude or ChatGPT',
      'Your child’s name, date and place of birth kept on our own server',
      'Two children? Each child gets their own page'],
    cta: 'Get Your Child’s Compass Reading ($27)',
    // Blueprint section 6, carried as the offer note. No refund framing anywhere.
    note: 'A wrong birth entry is rewritten once at no cost. A mistake in the reading is redone.',
  },

  // KEPT. Mid-page CTA banners come from the teardown, not the blueprint.
  banner1: ['You have read five of them. The page has twenty-four.', 'All of it about your child, in plain words.'],
  banner2: ['Six months of guessing, or twenty-seven dollars.', 'Read a whole one free first, then decide.'],

  // KEPT. The blueprint has no comparison table.
  compare: {
    h2: 'Next to a horoscope, and next to the full reading.',
    cols: ['A horoscope app', 'Compass', 'North Star'],
    rows: [['About', 'Everyone born in a month', 'Your child, from their date, time and place', 'Your child in depth, with your own answers read in'],
      ['Length', 'A line a day', 'One page you scroll', 'Nine to fifteen pages'],
      ['Needs from you', 'A sign', 'Date, time and place', 'Date, time, place and three answers'],
      ['When it arrives', 'Now', 'Minutes after the details are in', 'Within 24 hours'],
      ['Price', 'Free', '$27', '$199']],
  },

  faq: {
    eyebrow: 'Questions',                                               // KEPT, a label
    h2: 'Before you decide.',                                           // KEPT
    // The first four are the blueprint's section 7. The last two are KEPT: the blueprint does
    // not cover the policy or the privacy answer, and neither may be lost.
    items: [
      ['What if I do not know my child’s exact birth time?', 'Compass needs the exact birth time. The birth certificate usually has it, and the hospital will have it on file. Without the time we would be guessing, and guessing is what you came here to stop.'],
      ['Is this traditional purple-and-stars astrology?', 'No. Wolf Children uses photography and plain language about child nature, outdoor living and temperament, rather than horoscopes or mystical jargon.'],
      ['How is the reading delivered?', 'As a web page inside your private portal, minutes after the details are in.'],
      ['Is there an option for a longer reading?', 'Yes. Inside your portal you can upgrade to North Star ($199), a written deep-dive reading of nine to fifteen pages.'],
      ['What if it does not sound like them?', 'Say so, and it is looked at. A page that does not sound like your child is no use to anyone, and a person reads every reply.'],
      ['What happens to their details?', 'Your child’s name, date of birth and place of birth are stored on our own server and never leave it. You can delete a child from the portal at any time.'],
    ],
  },

  // KEPT. Richard's own line, asked for by name.
  close: ['The same night, one layer deeper.', 'You already know this child. We read the same one from the night they arrived.', 'Get Compass'],

  notes: {
    proof: 'Slot 2, proof line above the headline. Every brand in the teardown puts a review count or a star rating here. We have neither, so the line is empty.',
    press: 'Slot 3, press marquee. A row of press logos belongs here. Wolf Children has never been written about, so the row is empty.',
    ugc: 'Slot 9, customer images. Photographs taken by parents belong here. Nobody has sent one, so the grid is empty.',
    endorse: 'Slot 11, endorsement. A named person vouching for the product belongs here. Wolf Children speaks as a brand and has no founder and no spokesperson, so the block is empty.',
    reviews: 'Slot 14, reviews. A wall of ratings belongs here, and on the reference page it fills a fifth of the scroll. We have no reviews yet, so the wall is empty.',
    unrecorded: 'Slots 6 and 8. Two modules of the reference page were never recorded during the teardown. Nothing is placed here.',
  },
};
