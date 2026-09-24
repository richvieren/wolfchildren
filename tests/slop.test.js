// The anti-slop audit, run over the copy of every page, as a gate rather than a habit.
//
// Richard, 2026-09-24: "there is a copywriting skill with an anti-slop audit in it. You know it
// exists. You did not run it. That audit runs on every piece of copy before it publishes, every
// time, without me asking."
//
// It had been prose in a skill file, so running it depended on someone remembering, and the
// Compass page shipped with 24 hits across seven patterns. Everything in this project that must
// not regress is a gate that fails a build, and now this is too: the pre-push hook runs the suite,
// so copy cannot leave the machine unaudited.
//
// Three of the audit's patterns still need a human read and are listed by BY_HAND rather than
// quietly passing: a metaphor family leaking across a document, an opening and closing built on
// one skeleton, and whether a three-item list is padding or three real things.

import test from 'node:test';
import assert from 'node:assert/strict';
import { renderAll } from '../build.mjs';
import { audit, report, BY_HAND, sentencesOf } from '../src/lib/slop.mjs';

const pages = await renderAll();

/** The visible copy of a page: no markup, no scripts, no photo-slot direction. */
function copyOf(html) {
  let body = html.split('<body>')[1] || html;
  body = body.replace(/<(script|style|noscript)[^>]*>[\s\S]*?<\/\1>/g, ' ');
  body = body.replace(/<div class="placeholder">[\s\S]*?<\/div>/g, ' ');
  return body
    .replace(/<[^>]+>/g, '\n')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&#39;|&rsquo;/g, "'").replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ');
}

for (const p of pages) {
  test(`${p.path} passes the anti-slop audit`, () => {
    const hits = audit(copyOf(p.html));
    assert.deepEqual(hits, [], `\n${report(hits)}\n`);
  });
}

test('the audit is actually capable of failing', () => {
  // A gate nobody has seen fail is a gate nobody knows works. This is the shape the Compass page
  // shipped in on 2026-09-24, in miniature.
  const slop = [
    'No labels. No verdicts.',
    'It will not tell you who they become. It tells you what they are working with.',
    'That is what wears you down.',
    'This gives you something to think with.',
    'Those are the things you can act on.',
    'It is the part written for the end of a hard day.',
    'The chart knows what they need at seven in the evening.',
  ].join('\n');
  const hits = audit(slop);
  const names = hits.map((h) => h.pattern).sort();
  assert.ok(names.includes('staccatoNo'), 'staccato listing');
  assert.ok(names.includes('demonstrativeCloser'), 'demonstrative closers');
  assert.ok(names.includes('partPointer'), 'the word part as a pointer');
  assert.ok(names.includes('falseAgency'), 'an abstract subject doing a human verb');
});

test('clean copy passes', () => {
  assert.deepEqual(audit('We write about the ground your child is standing on now. You already know them.'), []);
});

test('the patterns a machine cannot judge are named, not assumed passed', () => {
  assert.ok(BY_HAND.length >= 3);
  for (const line of BY_HAND) assert.match(line, /^[A-Z]: /);
});

test('sentence splitting survives real page copy', () => {
  const sents = sentencesOf(copyOf(pages[0].html));
  assert.ok(sents.length > 5);
  assert.ok(sents.every((s) => s === s.trim() && s.length > 0));
});
