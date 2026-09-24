// slop.mjs — the anti-slop audit from the copywriting skill, as code.
//
// Richard, 2026-09-24: the audit runs on every piece of copy before it publishes, every time,
// without being asked. It had been prose in a skill file, so running it depended on someone
// remembering, and on 2026-09-24 the rebuilt Compass page shipped with 25 hits in it. Everything
// else in this project that must not regress is a gate that fails a build. Now this is too.
//
// What it cannot do: patterns U (a metaphor family leaking across a document), V (the opening and
// closing built on one skeleton) and the judgement call in T (is this three-item list padding, or
// three real things?) need a human read. The audit names them at the end rather than pretending
// they passed.

const RE = {
  // M: negation then affirmation across a sentence break, in any skin.
  // Narrowed 2026-09-24: the shape is a punchy rhetorical contrast, so the negation has to be at
  // the END of the first sentence and the affirming one has to be short. Two long factual
  // sentences that happen to contain "not" are legal or explanatory prose, not this pattern, and
  // the privacy page was full of them.
  negationAffirmation: (sents) => {
    const out = [];
    for (let i = 0; i < sents.length - 1; i += 1) {
      const a = sents[i];
      const b = sents[i + 1];
      const negatesLate = /\b(not|never|no)\b[^.]{0,40}[.!?]?$/i.test(a);
      const affirmsShort = b.split(/\s+/).length <= 14
        && /^(It|This|That|You|She|He|They|The|We)\b.{0,60}\b(is|are|was|were|tells|says|gives|keeps|describes|writes|need|needs)\b/.test(b);
      if (negatesLate && affirmsShort) out.push(`${a} || ${b}`);
    }
    return out;
  },
  // O: staccato "No X. No Y." fragment listing.
  staccatoNo: (sents) => {
    const out = [];
    for (let i = 0; i < sents.length - 1; i += 1) {
      if (/^No\b/.test(sents[i]) && /^No\b/.test(sents[i + 1])) out.push(`${sents[i]} ${sents[i + 1]}`);
    }
    return out;
  },
  // S: demonstrative paragraph closers.
  demonstrativeCloser: (sents) => sents.filter((s) => /^(That|This|These|Those)\s+(is|are|was|gives|keeps|makes|does)\b/.test(s)),
  // R: aphoristic sentence tails.
  aphoristicTail: (sents) => sents.filter((s) => /,\s*(which is [^.]{0,60}|and (that|this) [^.]{0,50})\.$/.test(s)
    || /\band (this|that) (page|one|thing) is not it\b/i.test(s)),
  // Y: colon-title constructions used as drama ("The result: ...", "The problem: ...").
  // Narrowed 2026-09-24 to a determiner plus one noun, which is the dramatic shape. A label
  // introducing a list or an address ("Questions: hello@", "Two sections: ...", a product banner)
  // is ordinary typography and was being flagged across every page.
  colonTitle: (sents) => sents.filter((s) => /^(The|Our|Your|My|A|An) \w+: [a-z]/.test(s)),
  // PART: the word "part" as a narrative pointer, banned outright in this voice.
  partPointer: (sents) => sents.filter((s) => /\bpart\b/i.test(s) && !/\b(party|participant|apart|partner|particular)\b/i.test(s)),
  // AGENCY: an abstract subject performing a human verb.
  // Narrowed 2026-09-24: a document saying or describing something is ordinary English ("this page
  // says what we collect"). The pattern is a thing given a mind or a gaze.
  falseAgency: (sents) => sents.filter((s) => /\b(the|this|a) (page|chart|reading|label|report|note)\b\s+(knows|decides|wants|thinks|sees|feels|believes|understands)\b/i.test(s)
    || /\b(the|this) (page|chart|reading)\b\s+reads\s+(you|them|her|him|your|their)\b/i.test(s)),
  // Z: the epiphany-question formula.
  epiphanyQuestion: (sents) => sents.filter((s) => /question (to sit with|worth sitting with)/i.test(s)),
  // N: "This is not X. This is Y." inside one sentence.
  isNotReframe: (sents) => sents.filter((s) => /\b(is|are) not\b.*\.\s*(It|This|That)\b/i.test(s)),
};

const CAPS = { negationAffirmation: 2, demonstrativeCloser: 2, epiphanyQuestion: 1 };

const HARD_BAN = ['delve', 'realm', 'harness', 'unlock', 'tapestry', 'paradigm', 'cutting-edge', 'revolutionize',
  'landscape', 'intricate', 'showcasing', 'crucial', 'pivotal', 'surpass', 'meticulously', 'vibrant',
  'unparalleled', 'underscore', 'leverage', 'synergy', 'innovative', 'game-changer', 'testament',
  'commendable', 'meticulous', 'groundbreaking', 'foster', 'showcase', 'garner', 'accentuate',
  'pioneering', 'trailblazing', 'unleash', 'versatile', 'transformative', 'redefine', 'seamless',
  'scalable', 'robust', 'breakthrough', 'empower', 'streamline', 'frictionless', 'elevate',
  'effortless', 'data-driven', 'insightful', 'proactive', 'visionary', 'disruptive', 'reimagine',
  'agile', 'unprecedented', 'democratize', 'immersive', 'holistic', 'hold space'];

const INTENSIFIERS = ['genuinely', 'truly', 'deeply', 'actually', 'precisely', 'really'];

export function sentencesOf(copy) {
  return copy
    .split('\n')
    .map((l) => l.replace(/\s+/g, ' ').trim())
    .filter((l) => l.length > 3)
    .flatMap((l) => l.split(/(?<=[.!?])\s+/))
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Every hit, as {pattern, cap, found, examples}. An empty array means the copy passes. */
export function audit(copy) {
  const sents = sentencesOf(copy);
  const hits = [];
  for (const [name, fn] of Object.entries(RE)) {
    const found = fn(sents);
    const cap = CAPS[name] ?? 0;
    if (found.length > cap) hits.push({ pattern: name, cap, found: found.length, examples: found.slice(0, 4) });
  }
  const banned = HARD_BAN.filter((w) => new RegExp(`\\b${w}\\b`, 'i').test(copy));
  if (banned.length) hits.push({ pattern: 'hardBanWords', cap: 0, found: banned.length, examples: banned });
  if (copy.includes('—') || copy.includes('--')) hits.push({ pattern: 'emDash', cap: 0, found: 1, examples: ['—'] });
  const intens = INTENSIFIERS.reduce((n, w) => n + (copy.match(new RegExp(`\\b${w}\\b`, 'gi')) || []).length, 0);
  if (intens > 6) hits.push({ pattern: 'intensifiers', cap: 6, found: intens, examples: [] });
  const notJust = (copy.match(/not just/gi) || []).length;
  if (notJust > 3) hits.push({ pattern: 'notJust', cap: 3, found: notJust, examples: [] });
  return hits;
}

/** Patterns this file cannot judge. Named so they are not mistaken for passing. */
export const BY_HAND = [
  'U: one metaphor family appearing three or more times',
  'V: the opening and closing built on the same sentence skeleton',
  'W: three or more consecutive paragraphs ending on the same rhetorical beat',
  'T: whether a three-item list is padding or three real things',
];

export function report(hits) {
  if (!hits.length) return 'anti-slop audit: clean';
  return hits.map((h) => `[${h.pattern}] ${h.found} found, cap ${h.cap}\n` + h.examples.map((e) => `    ${e}`).join('\n')).join('\n');
}
