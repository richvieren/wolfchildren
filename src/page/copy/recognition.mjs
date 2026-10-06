// Copy for the recognition module, by variant.
//
// A is Richard's, written 2026-10-06 and pasted verbatim into this file. Nothing
// is reworded, shortened or re-punctuated on the way through.
// B is the copy this module carried before, from the approved source.
import { C } from '../../lib/compass-copy.mjs';

export const variants = {
  A: {
    eyebrow: 'Your chart, then theirs',
    // the word the drawn ring sits around; the headline itself is untouched
    hook: 'theirs',
    // the word pair whose gap reads wide in Morning Memories at display size
    tighten: 'chart a',
    cta: 'Read theirs',
    h2: "You've read your own chart a hundred times. Never theirs.",
    body: [
      'You know why you need a quiet hour after a crowded day. You know which part of you picks the fight and which part makes up after. You learned it from your own chart, line by line.',
      'Your child has one too. Same sky, a different night. It says what settles them after a hard day, why bedtime goes the way it goes, and why the two of you clash over the same small thing.',
    ],
  },
  B: { eyebrow: 'Your chart, then theirs', cta: 'Read theirs', h2: C.recognition.h2, body: C.recognition.body },
};
